# Implementation Plan - Timezone & WebSocket Debugging

## Goal
Resolve inconsistencies in system time reporting and debug the WebSocket-based voice bridge communication. This involves improving log visibility, ensuring temporal synchronization, and verifying reliable message exchange.

## User Review Required
> [!IMPORTANT]
> The current system timezone is **America/New_York (EDT)**. If the desired timezone is different, please specify.

## Proposed Changes

### Voice Bridge Application

#### [MODIFY] [bridge.js](file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/bridge.js)
- Implement a `log` helper that prepends an ISO timestamp to all console outputs.
- Log system timezone and current time on startup.
- Add more granular logging for Whisper process lifecycle (spawn, data, error, exit).

#### [MODIFY] [test_ws_local.js](file:///Users/4jp/Workspace/organvm/sign-signal--voice-synth/apps/voice-bridge/test_ws_local.js)
- Add timestamps to test logs.
- Include a "ping" or heartbeat simulation to verify sustained connectivity.
- Log connection state changes explicitly.

## Verification Plan

### Automated Tests
- **Startup Audit**: Run `npm run dev` and verify that the first log line accurately reports the system time and matches `date` command output.
- **WebSocket Loopback**: Run `node test_ws_local.js` against the running bridge and verify:
  1. Connection established.
  2. `setCommands` received and acknowledged by bridge.
  3. Messages received by client within expected timeout.

### Manual Verification
- Visual inspection of logs in the Antigravity terminal to ensure timestamps match the IDE's log prefix.
