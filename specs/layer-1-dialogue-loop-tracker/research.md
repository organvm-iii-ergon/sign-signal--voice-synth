# Research: Dialogue Looping Tracker Sequence (Layer 1)

**Branch**: `layer-1-dialogue-loop-tracker` | **Date**: 2026-03-30

## Tech Stack Research

### TTS Providers

| Provider | Open/Proprietary | Voice Cloning | API Type | Notes |
|----------|-----------------|---------------|----------|-------|
| **Coqui TTS** | Open Source | Yes (self-hosted) | Local HTTP | Requires GPU for best performance, excellent quality |
| **VALL-E** | Open Source | Yes (zero-shot) | Local HTTP | Neural codec-based, needs fine-tuning for voice cloning |
| **ElevenLabs** | Proprietary | Yes | REST API | Best quality, pay-per-use, requires API key |

### Voice Cloning Approaches

1. **Coqui XTTS v2**: Upload 30s+ audio sample, generates embedding, multi-language
2. **VALL-E**: Few-shot voice cloning from short audio, neural codec synthesis
3. **ElevenLabs**: Upload sample, proprietary embedding, instant clone

### Backend Framework: FastAPI

- FastAPI + uvicorn for async TTS requests
- Pydantic for request/response validation
- Background tasks for audio generation
- WebSocket support for real-time playback progress

### Database: PostgreSQL + Prisma

- Prisma ORM for type-safe queries
- Schema supports: scenes, speakers, phrases, voices, versions
- Redis for caching generated audio and playback state

### Frontend: Next.js 14 (App Router)

- React Server Components for initial load
- Client components for interactive playback
- WebSocket client for real-time playback tracking
- Tailwind for styling

## Technical Decisions

### TTS Provider Abstraction

- Implement provider interface pattern
- Factory pattern for provider instantiation
- Configurable per-speaker provider selection
- Fallback chain: Coqui → VALL-E → ElevenLabs

### Audio Caching Strategy

- Cache generated audio in Redis (TTL-based)
- Store audio files on disk with scene/phrase ID naming
- Invalidate cache on phrase text/voice config change

### Playback Architecture

- Backend generates full sequence audio as WAV/MP3
- Frontend WebSocket receives playback progress
- Seek functionality via range requests
- Real-time tracker via server-sent events or WebSocket

### Versioning Approach

- Store full scene snapshot per version (not deltas)
- Prisma transaction for atomic version save
- Diff generation on frontend using text diff library

## Unknowns & Risks

1. **Coqui TTS performance**: Need to benchmark CPU vs GPU rendering times
2. **VALL-E deployment**: May require specific environment setup
3. **ElevenLabs costs**: Need usage tracking and rate limiting
4. **Audio format**: Need to determine optimal format for playback (WAV vs MP3)
5. **Playback latency**: WebSocket vs SSE for real-time progress

## Recommended Approach

1. Start with ElevenLabs for fastest implementation (API-ready)
2. Add Coqui TTS as open-source alternative
3. VALL-E as stretch goal for true voice cloning
4. Use WebSocket for playback progress
5. Redis for audio cache + playback state