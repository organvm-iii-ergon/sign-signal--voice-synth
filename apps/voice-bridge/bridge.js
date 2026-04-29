const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const PORT = 9999;
const MODEL_PATH = path.join(__dirname, 'models', 'ggml-base.en.bin');

const wss = new WebSocketServer({ port: PORT });

console.log(`[Voice Bridge] Listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('[Voice Bridge] Client connected');

  // Start whisper-stream
  // -m: model path
  // -t: threads
  // --step: audio step size in ms
  // --length: audio length in ms
  // -vth: VAD threshold
  const whisper = spawn('whisper-stream', [
    '-m', MODEL_PATH,
    '-t', '4',
    '--step', '500',
    '--length', '3000',
    '-vth', '0.6'
  ]);

  whisper.stdout.on('data', (data) => {
    const text = data.toString().trim();
    if (text) {
      // whisper-stream often outputs status messages or [clean] tags.
      // We want to filter those and send only recognized text.
      // Typical output: "  [00:00:00.000 --> 00:00:01.000]   Hello world"
      const lines = text.split('\n');
      for (let line of lines) {
        const match = line.match(/\]\s+(.+)$/);
        if (match) {
          const phrase = match[1].trim().toLowerCase();
          if (phrase && !phrase.startsWith('[') && !phrase.endsWith(']')) {
            console.log(`[Voice Bridge] Recognized: "${phrase}"`);
            ws.send(JSON.stringify({
              name: 'commandRecognized',
              command: phrase
            }));
          }
        }
      }
    }
  });

  whisper.stderr.on('data', (data) => {
    // Whisper-stream prints status info to stderr
    const msg = data.toString();
    if (msg.includes('error')) {
      console.error(`[Whisper Error] ${msg}`);
    }
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`[Voice Bridge] Received: ${data.name}`);
      if (data.name === 'activate') {
        console.log('[Voice Bridge] Activation requested');
      } else if (data.name === 'setCommands') {
        console.log(`[Voice Bridge] Commands registered: ${data.commands.length}`);
        // We could use this to tune the recognizer, but Whisper is general-purpose.
      }
    } catch (err) {
      console.error('[Voice Bridge] Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('[Voice Bridge] Client disconnected');
    whisper.kill();
  });

  whisper.on('close', (code) => {
    console.log(`[Voice Bridge] Whisper process exited with code ${code}`);
  });
});
