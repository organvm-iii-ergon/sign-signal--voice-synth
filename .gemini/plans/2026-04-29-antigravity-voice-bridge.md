# Antigravity Voice Assistant Bridge (macOS) — 2026-04-29

Repair the Antigravity voice assistant by implementing a macOS-native WebSocket bridge that speaks the `b4rtaz.voice-assistant` protocol.

## User Review Required

> [!IMPORTANT]
> This requires `whisper-cpp` and `sox` to be installed via Homebrew. The installation may take a few minutes.
> The bridge will run as a local process. You will need to start it when you want to use voice features.

## Proposed Changes

### [NEW] `organvm/sign-signal--voice-synth/apps/voice-bridge/`
#### [NEW] `package.json`(file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/package.json)
Initialize a new Node.js app with `ws` and `node-record-lpcm16` dependencies.

#### [NEW] `bridge.js`(file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/bridge.js)
The core bridge logic:
1. Start a WebSocket server on `localhost:9999`.
2. On connection, start recording audio via `sox`.
3. Pipe audio to `whisper-cpp` server (running in background or via CLI).
4. When text is recognized, send `{ name: "commandRecognized", command: text }` to the client.
5. Handle `setCommands` messages to potentially filter or optimize recognition.

### [MODIFY] `sign-signal--voice-synth/package.json`(file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/package.json)
Add a new script `dev:voice-bridge` to start the bridge.

## Verification Plan

### Automated Tests
- None planned for the initial prototype.

### Manual Verification
1. Install dependencies: `brew install whisper-cpp sox`.
2. Start the bridge: `npm run dev:voice-bridge`.
3. Open Antigravity with the `b4rtaz.voice-assistant` extension enabled.
4. Verify the "Voice Assistant" view status flips to `Connected`.
5. Speak a command defined in a local `voice-assistant.json` and verify the action is triggered.
