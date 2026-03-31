# Tasks: Dialogue Looping Tracker Sequence (Layer 1)

**Generated**: 2026-03-30 | **Spec**: `spec.md`

## Phase 1: Setup (Shared Infrastructure)

| ID | Task | Dependencies |
|----|------|--------------|
| T001 | Initialize Next.js 14 project with TypeScript + Tailwind CSS | - |
| T002 | Set up FastAPI backend with Python 3.11 | - |
| T003 | Configure PostgreSQL + Redis via Docker Compose | - |
| T004 | Configure development environment variables (.env.example) | T003 |

## Phase 2: Foundational (Blocking Prerequisites)

| ID | Task | Dependencies |
|----|------|--------------|
| T005 | Set up Prisma schema (Scene, Speaker, PhraseEvent, VoiceProfile, Version) | T003 |
| T006 | Run Prisma migrations and generate client | T005 |
| T007 | Implement speaker parsing algorithm from raw text | T005 |
| T008 | Create backend API route structure and error handlers | T002, T006 |
| T009 | Create frontend API client service | T001 |

## Phase 3: Core CRUD Operations (User Stories 2, 3)

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T010 [P] | Implement Scene CRUD API endpoints | T007 | P1 |
| T011 [P] | Implement Speaker CRUD API endpoints | T010 | P1 |
| T012 [P] | Implement PhraseEvent CRUD API endpoints | T011 | P1 |
| T013 | Build scene creation UI (title + raw text input) | T009, T010 | P1 |
| T014 | Build speaker management UI (list, add, rename, delete) | T009, T011 | P1 |
| T015 | Build phrase list UI with inline editing | T009, T012 | P1 |
| T016 | Implement drag-drop phrase reordering | T015, T012 | P1 |
| T017 | Implement phrase split functionality | T012 | P1 |
| T018 | Implement phrase merge functionality | T012 | P1 |

## Phase 4: Loop & Sequence Configuration (User Story 4)

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T019 | Add repeat_count field to phrase config UI | T015 | P1 |
| T020 | Add stagger_ms field to phrase config UI | T015 | P1 |
| T021 | Add loop_mode selector (FIXED/ESCALATING) to phrase config | T015 | P1 |
| T022 | Add duration_mode and fixed_duration_ms to phrase config | T015 | P1 |
| T023 | Add start_trigger selector to phrase config | T015 | P1 |
| T024 | Calculate and display estimated_duration_ms per phrase | T007 | P1 |
| T025 | Display total scene duration in UI | T024 | P1 |

## Phase 5: TTS Integration

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T026 | Create TTS provider abstraction (interface pattern) | T002 | P1 |
| T027 | Implement ElevenLabs TTS provider | T026 | P1 |
| T028 | Implement Coqui TTS provider | T026 | P2 |
| T029 | Implement VALL-E TTS provider | T026 | P2 |
| T030 | Set up Redis audio caching (24h TTL) | T003, T027 | P1 |
| T031 | Create /api/voices endpoints (list, create, preview) | T026 | P2 |
| T032 | Build voice selection UI for speakers | T031, T014 | P2 |

## Phase 6: Playback Engine (User Stories 1, 5)

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T033 | Generate full sequence audio (WAV) on backend | T027, T030 | P1 |
| T034 | Set up WebSocket for real-time playback progress | T002 | P1 |
| T035 | Implement play/pause/stop controls | T033 | P1 |
| T036 | Implement seek to specific phrase | T035 | P1 |
| T037 | Build visual playback tracker (current phrase highlight) | T034 | P1 |
| T038 | Implement single phrase playback | T033 | P1 |
| T039 | Implement phrase range playback | T033 | P1 |
| T040 | Build playback timeline UI with phrase indicators | T037 | P1 |

## Phase 7: Versioning (User Stories 6, 8)

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T041 | Implement version save API endpoint | T010 | P2 |
| T042 | Implement version restore API endpoint | T041 | P2 |
| T043 | Implement version history view | T041 | P2 |
| T044 | Implement version comparison (text diff + duration delta) | T043 | P2 |
| T045 | Build version save UI with label input | T041 | P2 |
| T046 | Build version restore UI | T042 | P2 |
| T047 | Build version comparison UI | T044 | P2 |
| T048 | Highlight changed phrases in editor | T044 | P2 |

## Phase 8: Voice & Speech Controls

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T049 | Implement voice cloning from sample URL | T026 | P2 |
| T050 | Add per-speaker speech rate adjustment (0.5-2.0) | T014 | P2 |
| T051 | Add per-speaker pitch offset (-12 to +12 semitones) | T014 | P2 |
| T052 | Build voice preview playback | T031 | P2 |
| T053 | Build speech rate/pitch controls in speaker UI | T050, T051 | P2 |

## Phase 9: Polish & Cross-Cutting

| ID | Task | Dependencies | Priority |
|----|------|--------------|----------|
| T054 | Performance optimization for 100+ phrase scenes | T016 | P2 |
| T055 | Add loading states and error handling for all API calls | T009 | P2 |
| T056 | Add empty state UI for scenes without phrases | T015 | P2 |
| T057 | Validate phrase text changes trigger audio cache invalidation | T030 | P2 |
| T058 | Handle TTS provider failures with fallback | T027 | P2 |
| T059 | Display speaker count and phrase count stats | T010 | P2 |
| T060 | Mark unassigned speaker phrases in UI | T012 | P2 |

---

## Task Dependencies Summary

```
T001 ─┬─ T010 ─┬─ T033 ─┬─ T040
T002 ─┤        │        │
T003 ─┼─ T004 ─┼─ T005 ─┼─ T026 ─┬─ T027 ─┬─ T030 ─┬─ T054
T004 ─┘        │        │        │        │        │
               │        │        │        │        └─ T058
               │        │        │        │
               │        │        │        └─ T028 ─┐
               │        │        │                 ├─ T033
               │        │        │        T029 ────┘
               │        │        │
T006 ──────────┼────────┼────────┼─────────────── T035 ── T036
               │        │        │        │
               │        │        │        └─ T037 ── T040
               │        │        │
               │        │        └─ T041 ── T042 ── T043 ── T047
               │        │                 │        │
               │        │                 │        └─ T044 ── T048
               │        │                 │
               │        │                 └─ T045
               │        │
T007 ──────────┼────────┼─────────────── T024 ── T025
               │        │
               │        └─ T011 ── T014 ──┬─ T016 ─┐
               │        │                 │        │
               │        │                 ├─ T019 ─┤
               │        │                 ├─ T020 ─┤
               │        │                 ├─ T021 ─┤
               │        │                 ├─ T022 ─┼─ T025
               │        │                 ├─ T023 ─┤
               │        │                 │        │
               │        │                 │        └─ T057
               │        │                 │
               │        │                 └─ T050 ── T051 ── T053
               │        │
               │        └─ T012 ── T015 ──┬─ T017
               │        │                 │
               │        │                 ├─ T018
               │        │                 │
               │        │                 └─ T032
               │        │
T009 ──────────┴────────┼─────────────── T013
                         │
                         ├─ T038
                         ├─ T039
                         ├─ T046
                         └─ T052
```

## Parallelization Opportunities

- **T010, T011, T012**: Can be parallelized after T007 (Scene, Speaker, PhraseEvent endpoints independent)
- **T019-T023**: Can be parallelized (all phrase config fields)
- **T027, T028, T029**: Can be parallelized (TTS provider implementations independent)
- **T041, T042**: Can be parallelized (version operations independent after T041)
- **T050, T051**: Can be parallelized (speaker speech controls independent)
