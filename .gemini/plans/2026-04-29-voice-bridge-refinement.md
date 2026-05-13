# Antigravity Voice Bridge Refinement

Refine the existing Voice Bridge implementation to improve robustness, configuration, and developer experience.

## User Review Required

> [!IMPORTANT]
> The bridge is currently running in the background. These changes will require a restart of the bridge process.
> Do you have a preference for which Whisper model to use? (Current: `base.en`)

## Proposed Changes

### [MODIFY] [bridge.js](file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/bridge.js)

1.  **Configuration**: Load port, model path, and whisper parameters from environment variables.
2.  **Robust Process Management**: Ensure `whisper-stream` is restarted if it crashes and killed when the bridge exits.
3.  **Enhanced Parsing**: Improve the stdout parsing to handle edge cases and potentially filter "hallucinations" (common in Whisper when silent).
4.  **Health Check**: Add a basic HTTP health check endpoint or simple status logging.

### [NEW] [.env](file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/.env)

Provide a default configuration for the bridge.

### [MODIFY] [package.json](file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/package.json)

Add `dotenv` dependency.

## Verification Plan

### Automated Tests
- [ ] Add a mock WebSocket client to test message flow.
- [ ] Test parsing logic with sample `whisper-stream` output.

### Manual Verification
1. Restart the bridge: `npm run dev:voice-bridge`.
2. Verify it picks up settings from `.env`.
3. Check logs for stable recognition.
