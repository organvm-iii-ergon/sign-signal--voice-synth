const http = require('http');
const { spawn: spawnProcess } = require('child_process');
const os = require('os');

const {
  addRegisteredCommands,
  buildWhisperArgs,
  loadConfig,
  normalizeCommand,
  parseWhisperRecognitions
} = require('./bridge-core');

const log = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, ...args);
};

const error = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${message}`, ...args);
};

const createVoiceBridge = (options = {}) => {
  const config = options.config || loadConfig(options.env || process.env, __dirname);
  const logger = options.log || log;
  const errorLogger = options.error || error;
  const spawn = options.spawn || spawnProcess;
  const WebSocketServer = options.WebSocketServer || require('ws').WebSocketServer;
  const restartDelayMs = options.restartDelayMs ?? 1000;
  const registeredCommands = options.registeredCommands || new Set();

  let whisperProcess = null;
  let shuttingDown = false;
  let wss;

  const broadcastCommand = (command) => {
    const message = JSON.stringify({
      name: 'commandRecognized',
      command
    });

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  };

  const server = http.createServer((req, res) => {
    logger(`[Voice Bridge] ${req.method} ${req.url}`);
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', component: 'voice-bridge' }));
    } else if (req.url.startsWith('/test')) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const rawCommand = url.searchParams.get('command');
      if (rawCommand) {
        const command = normalizeCommand(rawCommand, registeredCommands);
        logger(`[Voice Bridge] Simulating command: "${command}" (input: "${rawCommand}")`);
        broadcastCommand(command);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'simulated', command, input: rawCommand }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing command parameter' }));
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  wss = new WebSocketServer({ server });

  const startWhisper = () => {
    if (whisperProcess) return;

    logger('[Voice Bridge] Starting global whisper-stream...');

    whisperProcess = spawn('whisper-stream', buildWhisperArgs(config));

    whisperProcess.stdout.on('data', (data) => {
      const recognitions = parseWhisperRecognitions(data, registeredCommands);

      recognitions.forEach(({ rawPhrase, command }) => {
        logger(`[Voice Bridge] Recognized: "${command}" (raw: "${rawPhrase}")`);
        broadcastCommand(command);
      });
    });

    whisperProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('error')) {
        errorLogger(`[Whisper Error] ${msg.trim()}`);
      }
    });

    whisperProcess.on('close', (code) => {
      logger(`[Voice Bridge] Whisper process exited with code ${code}`);
      whisperProcess = null;
      if (!shuttingDown) {
        setTimeout(startWhisper, restartDelayMs);
      }
    });
  };

  wss.on('connection', (ws) => {
    logger('[Voice Bridge] Client connected');

    startWhisper();

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.name === 'activate') {
          logger('[Voice Bridge] Activation requested');
        } else if (data.name === 'setCommands') {
          addRegisteredCommands(registeredCommands, data.commands);
          logger(`[Voice Bridge] Commands updated. Total registered: ${registeredCommands.size}`);
        }
      } catch (err) {
        errorLogger('[Voice Bridge] Error parsing message:', err);
      }
    });

    ws.on('close', () => {
      logger('[Voice Bridge] Client disconnected');
    });

    ws.on('error', (err) => {
      errorLogger('[Voice Bridge] WebSocket error:', err);
    });
  });

  const logSystemAudit = () => {
    logger('[Voice Bridge] System Audit:');
    logger(`  Time: ${new Date().toString()}`);
    logger(`  Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    logger(`  Platform: ${os.platform()} (${os.release()})`);
    logger(`[Voice Bridge] Listening on http://localhost:${config.port}`);
    logger(`[Voice Bridge] Health check: http://localhost:${config.port}/health`);
    logger(`[Voice Bridge] Using model: ${config.modelPath}`);
  };

  const listen = (port = config.port, callback = logSystemAudit) => {
    server.listen(port, callback);
  };

  const close = (callback) => {
    shuttingDown = true;
    if (whisperProcess) {
      whisperProcess.kill();
    }

    const finish = () => {
      if (server.listening) {
        server.close(callback);
      } else if (callback) {
        callback();
      }
    };

    wss.close(finish);
  };

  return {
    close,
    config,
    listen,
    registeredCommands,
    server,
    startWhisper,
    wss
  };
};

const startBridge = (options = {}) => {
  const bridge = createVoiceBridge(options);
  bridge.listen();
  return bridge;
};

if (require.main === module) {
  const bridge = startBridge();

  process.on('SIGINT', () => {
    log('[Voice Bridge] Shutting down...');
    bridge.close(() => {
      process.exit(0);
    });
  });
}

module.exports = {
  createVoiceBridge,
  startBridge,
  addRegisteredCommands,
  buildWhisperArgs,
  loadConfig,
  normalizeCommand,
  parseWhisperRecognitions
};
