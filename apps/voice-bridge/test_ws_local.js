const WebSocket = require('ws');

const log = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Test Client] ${message}`, ...args);
};

const error = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [Test Client] ERROR: ${message}`, ...args);
};

log('Connecting to ws://localhost:9999...');
const ws = new WebSocket('ws://localhost:9999');

ws.on('open', () => {
  log('Connected to bridge');
  
  const payload = {
    name: 'setCommands',
    commands: [
      { command: 'Do undo', action: 'undo' }
    ]
  };
  
  ws.send(JSON.stringify(payload));
  log('Sent setCommands:', JSON.stringify(payload));

  // Heartbeat simulation
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      log('Heartbeat: Connection is alive');
    }
  }, 5000);

  ws.on('close', () => {
    clearInterval(heartbeat);
  });
});

ws.on('message', (data) => {
  log('Received message:', data.toString());
});

ws.on('error', (err) => {
  error('WebSocket error:', err.message);
});

ws.on('close', (code, reason) => {
  log(`Connection closed (code: ${code}, reason: ${reason || 'no reason'})`);
});

const TIMEOUT = 20000;
log(`Test will run for ${TIMEOUT / 1000} seconds...`);

setTimeout(() => {
  log('Test timeout reached. Closing connection...');
  ws.close();
  setTimeout(() => process.exit(0), 1000);
}, TIMEOUT);
