const http = require('http');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const log = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, ...args);
};

const error = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${message}`, ...args);
};


// Load configuration from environment variables
const PORT = process.env.PORT || 9999;
const MODEL_PATH = process.env.WHISPER_MODEL_PATH 
  ? path.resolve(__dirname, process.env.WHISPER_MODEL_PATH)
  : path.join(__dirname, 'models', 'ggml-base.en.bin');
const THREADS = process.env.WHISPER_THREADS || '4';
const STEP_MS = process.env.WHISPER_STEP_MS || '500';
const LENGTH_MS = process.env.WHISPER_LENGTH_MS || '3000';
const VAD_THOLD = process.env.WHISPER_VAD_THOLD || '0.6';

const normalizeCommand = (phrase) => {
  const cleanPhrase = phrase.toLowerCase().replace(/[.,!?]/g, '').trim();
  for (let cmd of registeredCommands) {
    if (cmd.toLowerCase().replace(/[.,!?]/g, '').trim() === cleanPhrase) {
      return cmd;
    }
  }
  return phrase;
};

const server = http.createServer((req, res) => {
  log(`[Voice Bridge] ${req.method} ${req.url}`);
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', component: 'voice-bridge' }));
  } else if (req.url.startsWith('/test')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const rawCommand = url.searchParams.get('command');
    if (rawCommand) {
      const command = normalizeCommand(rawCommand);
      log(`[Voice Bridge] Simulating command: "${command}" (input: "${rawCommand}")`);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({
            name: 'commandRecognized',
            command: command
          }));
        }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'simulated', command, input: rawCommand }));
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Missing command parameter' }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  log('[Voice Bridge] System Audit:');
  log(`  Time: ${new Date().toString()}`);
  log(`  Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  log(`  Platform: ${os.platform()} (${os.release()})`);
  log(`[Voice Bridge] Listening on http://localhost:${PORT}`);
  log(`[Voice Bridge] Health check: http://localhost:${PORT}/health`);
  log(`[Voice Bridge] Using model: ${MODEL_PATH}`);
});

let whisperProcess = null;
let registeredCommands = new Set();

const startWhisper = () => {
  if (whisperProcess) return;
  
  log('[Voice Bridge] Starting global whisper-stream...');
  
  whisperProcess = spawn('whisper-stream', [
    '-m', MODEL_PATH,
    '-t', THREADS,
    '--step', STEP_MS,
    '--length', LENGTH_MS,
    '-vth', VAD_THOLD
  ]);

  whisperProcess.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (!text) return;

    const lines = text.split('\n');
    for (let line of lines) {
      // Strip ANSI escape codes and timestamps
      let rawPhrase = line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').replace(/^\[.*?\]/, '').trim();
      if (!rawPhrase) continue;

      const phrase = rawPhrase.toLowerCase();
      
      // Hallucination/Music filter
      if (phrase.startsWith('[') || phrase.endsWith(']') || 
          phrase.startsWith('(') || phrase.endsWith(')')) continue;
      
      const noise = [
        'thank you.', 'thank you for watching.', 'you', 'please subscribe', 
        'english subtitles', 'subscribe', 'watching', 'thanks for watching'
      ];
        if (noise.some(n => phrase.includes(n))) continue;
        if (phrase.length < 2) continue;

        // Command normalization
        const finalCommand = normalizeCommand(rawPhrase);

        log(`[Voice Bridge] Recognized: "${finalCommand}" (raw: "${rawPhrase}")`);
        
        const message = JSON.stringify({
          name: 'commandRecognized',
          command: finalCommand
        });

        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(message);
          }
        });
    }
  });

  whisperProcess.stderr.on('data', (data) => {
    const msg = data.toString();
    if (msg.includes('error')) {
      error(`[Whisper Error] ${msg.trim()}`);
    }
  });

  whisperProcess.on('close', (code) => {
    log(`[Voice Bridge] Whisper process exited with code ${code}`);
    whisperProcess = null;
    // Auto-restart if not shutting down
    if (!shuttingDown) {
      setTimeout(startWhisper, 1000);
    }
  });
};

let shuttingDown = false;

wss.on('connection', (ws) => {
  log('[Voice Bridge] Client connected');
  
  // Ensure whisper is running
  startWhisper();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.name === 'activate') {
        log('[Voice Bridge] Activation requested');
      } else if (data.name === 'setCommands') {
        if (data.commands) {
          data.commands.forEach(cmd => registeredCommands.add(cmd.command));
          log(`[Voice Bridge] Commands updated. Total registered: ${registeredCommands.size}`);
        }
      }
    } catch (err) {
      error('[Voice Bridge] Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    log('[Voice Bridge] Client disconnected');
  });

  ws.on('error', (err) => {
    error('[Voice Bridge] WebSocket error:', err);
  });
});

process.on('SIGINT', () => {
  log('[Voice Bridge] Shutting down...');
  shuttingDown = true;
  if (whisperProcess) {
    whisperProcess.kill();
  }
  wss.close(() => {
    process.exit(0);
  });
});
