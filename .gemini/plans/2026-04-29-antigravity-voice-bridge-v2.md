# Antigravity Voice Assistant Bridge (macOS) — 2026-04-29

Repair the Antigravity voice assistant by implementing a macOS-native WebSocket bridge that speaks the `b4rtaz.voice-assistant` protocol.

## Diagnosis evidence

### Install layout (Antigravity is a VSCode fork)
- App bundle: `/Applications/Antigravity.app/` (build date 2026-04-16, signed `com.google.antigravity`)
- User data: `/Users/4jp/Library/Application Support/Antigravity/`
- VSCode-fork `~/.vscode`-equivalent: `/Users/4jp/.antigravity/` with `extensions/` and `argv.json`
- Logs: `/Users/4jp/Library/Application Support/Antigravity/logs/<timestamp>/window1/{renderer,exthost,network}.log`

### b4rtaz plugin manifest (`package.json`)
- `"main": "dist/extension.js"`, activates on `onView:dashboard`
- Configuration keys: `voiceSnippets.serverHost` (default `localhost`), `voiceSnippets.serverPort` (default `9999`)
- README §"Available speech recognition servers": **only Windows .NET 5 server**. No macOS/Linux server exists upstream.

## Proposed Changes

### [NEW] `organvm/sign-signal--voice-synth/apps/voice-bridge/`
#### [NEW] `package.json`
Initialize a new Node.js app with `ws` and `node-record-lpcm16` dependencies.

#### [NEW] `bridge.js`
The core bridge logic:
1. Start a WebSocket server on `localhost:9999`.
2. On connection, start capture via `whisper-stream`.
3. Parse stdout and emit `commandRecognized` messages.

### [MODIFY] `sign-signal--voice-synth/package.json`
Add a new script `dev:voice-bridge` to start the bridge.

## Verification Plan

### Manual Verification
1. Install dependencies: `brew install whisper-cpp sox`.
2. Start the bridge: `npm run dev:voice-bridge`.
3. Verify connection in Antigravity.
4. Speak a command and verify action.

## Open Questions
1. Which use case do you actually want — **per-project voice commands** or **in-chat dictation**?
2. Are you OK running a foreground bridge process, or do you want a LaunchAgent/Persistence?
3. Have you previously placed a `voice-assistant.json` in any project root?
4. Is there an existing repo in `~/Workspace/organvm/sign-signal--voice-synth/` that already does ASR work we can reuse?
