const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const test = require('node:test');

const {
  addRegisteredCommands,
  buildWhisperArgs,
  createVoiceBridge,
  loadConfig,
  normalizeCommand,
  parseWhisperRecognitions
} = require('./bridge');

class FakeWebSocketServer extends EventEmitter {
  constructor({ server }) {
    super();
    this.server = server;
    this.clients = new Set();
    this.closed = false;
  }

  close(callback) {
    this.closed = true;
    if (callback) callback();
  }
}

const requestServer = (server, url) => new Promise((resolve) => {
  const req = new EventEmitter();
  req.method = 'GET';
  req.url = url;
  req.headers = { host: 'voice-bridge.test' };

  const res = {
    headers: {},
    statusCode: 200,
    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body = '') {
      resolve({
        body: body.toString(),
        headers: this.headers,
        json: body ? JSON.parse(body.toString()) : null,
        status: this.statusCode
      });
    }
  };

  server.emit('request', req, res);
});

test('normalizes recognized phrases to registered commands', () => {
  const commands = new Set(['Do undo', 'Open Menu!']);

  assert.equal(normalizeCommand('do UNDO.', commands), 'Do undo');
  assert.equal(normalizeCommand('open menu', commands), 'Open Menu!');
  assert.equal(normalizeCommand('unknown command', commands), 'unknown command');
});

test('filters whisper output noise and keeps usable command recognitions', () => {
  const commands = new Set(['Do undo', 'Open Menu']);
  const output = [
    '\u001b[32m[00:00:01.000] do undo.\u001b[0m',
    '[00:00:02.000] Please subscribe',
    '(Music)',
    '[00:00:03.000] A',
    '',
    '[00:00:04.000] open menu!'
  ].join('\n');

  assert.deepEqual(parseWhisperRecognitions(output, commands), [
    { rawPhrase: 'do undo.', command: 'Do undo' },
    { rawPhrase: 'open menu!', command: 'Open Menu' }
  ]);
});

test('loads whisper config and builds whisper-stream arguments', () => {
  const baseDir = path.join('/', 'tmp', 'voice-bridge');
  const config = loadConfig({
    PORT: '4555',
    WHISPER_MODEL_PATH: 'models/custom.bin',
    WHISPER_THREADS: '8',
    WHISPER_STEP_MS: '250',
    WHISPER_LENGTH_MS: '1500',
    WHISPER_VAD_THOLD: '0.4'
  }, baseDir);

  assert.deepEqual(config, {
    port: '4555',
    modelPath: path.join(baseDir, 'models', 'custom.bin'),
    threads: '8',
    stepMs: '250',
    lengthMs: '1500',
    vadThreshold: '0.4'
  });

  assert.deepEqual(buildWhisperArgs(config), [
    '-m',
    path.join(baseDir, 'models', 'custom.bin'),
    '-t',
    '8',
    '--step',
    '250',
    '--length',
    '1500',
    '-vth',
    '0.4'
  ]);
});

test('adds valid setCommands entries to the command registry', () => {
  const registry = new Set(['Existing']);

  addRegisteredCommands(registry, [
    { command: 'Do undo' },
    { command: 'Open Menu' },
    { label: 'ignored' },
    null
  ]);

  assert.deepEqual([...registry], ['Existing', 'Do undo', 'Open Menu']);
  assert.equal(addRegisteredCommands(registry, 'not-an-array'), registry);
});

test('handles health and broadcasts normalized simulated commands', async (t) => {
  const bridge = createVoiceBridge({
    WebSocketServer: FakeWebSocketServer,
    env: { PORT: '0' },
    error: () => {},
    log: () => {},
    spawn: () => {
      throw new Error('whisper-stream should not be spawned by HTTP tests');
    }
  });

  t.after(() => new Promise((resolve) => bridge.close(resolve)));

  const sent = [];
  bridge.registeredCommands.add('Do undo');
  bridge.wss.clients.add({
    readyState: 1,
    send: (message) => {
      sent.push(JSON.parse(message));
    }
  });
  bridge.wss.clients.add({
    readyState: 0,
    send: () => {
      throw new Error('closed clients must not receive broadcasts');
    }
  });

  const health = await requestServer(bridge.server, '/health');
  assert.equal(health.status, 200);
  assert.deepEqual(health.json, { status: 'ok', component: 'voice-bridge' });

  const simulated = await requestServer(bridge.server, '/test?command=do%20UNDO!');
  assert.equal(simulated.status, 200);
  assert.deepEqual(simulated.json, {
    status: 'simulated',
    command: 'Do undo',
    input: 'do UNDO!'
  });
  assert.deepEqual(sent, [{ name: 'commandRecognized', command: 'Do undo' }]);

  const missingCommand = await requestServer(bridge.server, '/test');
  assert.equal(missingCommand.status, 400);
  assert.deepEqual(missingCommand.json, { error: 'Missing command parameter' });

  const missingRoute = await requestServer(bridge.server, '/unknown');
  assert.equal(missingRoute.status, 404);
});
