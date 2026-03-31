# Data Model: Dialogue Looping Tracker Sequence

**Branch**: `layer-1-dialogue-loop-tracker` | **Date**: 2026-03-30

## Entity Definitions

### Scene ($SCENE)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique scene identifier |
| title | String | NOT NULL, 1-255 chars | Scene title |
| raw_text | Text | NOT NULL | Original pasted dialogue text |
| created_at | DateTime | NOT NULL | Creation timestamp |
| updated_at | DateTime | NOT NULL | Last modification timestamp |

### Speaker ($SPEAKER)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique speaker identifier |
| scene_id | UUID | FK → Scene.id | Parent scene |
| display_name | String | NOT NULL, 1-100 chars | Display name (e.g., "Martha") |
| voice_profile_id | UUID | FK → VoiceProfile.id, NULLABLE | Assigned voice |
| speech_rate | Float | DEFAULT 1.0, 0.5-2.0 | Playback speed multiplier |
| pitch_offset | Integer | DEFAULT 0, -12 to +12 | Pitch adjustment in semitones |
| sort_order | Integer | NOT NULL | Display order in UI |

### PhraseEvent ($PHRASE_EVENT)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique phrase identifier |
| scene_id | UUID | FK → Scene.id | Parent scene |
| speaker_id | UUID | FK → Speaker.id, NULLABLE | Speaker (nullable = unassigned) |
| text | Text | NOT NULL | Phrase text content |
| index | Integer | NOT NULL | Position in sequence |
| repeat_count | Integer | DEFAULT 1, 0-100 | Number of repetitions |
| stagger_ms | Integer | DEFAULT 0, 0-10000 | Delay between repeats |
| loop_mode | Enum | DEFAULT FIXED | FIXED, ESCALATING |
| duration_mode | Enum | DEFAULT AUTO | AUTO, FIXED_MS |
| fixed_duration_ms | Integer | NULLABLE | Manual duration when FIXED_MS |
| start_trigger | Enum | DEFAULT IMMEDIATE | IMMEDIATE, AFTER_PREVIOUS, ON_CONDUCTOR_MARK |
| estimated_duration_ms | Integer | NOT NULL | TTS-estimated duration |
| is_empty | Boolean | DEFAULT false | Empty text flag |

### VoiceProfile ($VOICE_PROFILE)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique voice profile identifier |
| name | String | NOT NULL, 1-100 chars | Profile display name |
| provider | Enum | NOT NULL | COQUI, VALLE, ELEVENLABS |
| model | String | NOT NULL | Provider-specific model ID |
| is_default | Boolean | DEFAULT false | System default voice |
| clone_sample_url | String | NULLABLE | Voice cloning sample URL |
| settings | JSON | DEFAULT {} | Provider-specific settings |

### Version ($VERSION)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique version identifier |
| scene_id | UUID | FK → Scene.id | Parent scene |
| label | String | NOT NULL, 1-100 chars | Version label (e.g., "v1") |
| snapshot | JSON | NOT NULL | Full scene snapshot |
| created_at | DateTime | NOT NULL | Creation timestamp |

## Enums

```typescript
enum LoopMode {
  FIXED = 'FIXED'         // Exact repeats
  ESCALATING = 'ESCALATING' // Faster/slower each iteration
}

enum DurationMode {
  AUTO = 'AUTO'           // Use TTS estimate
  FIXED_MS = 'FIXED_MS'   // Manual override
}

enum StartTrigger {
  IMMEDIATE = 'IMMEDIATE'
  AFTER_PREVIOUS = 'AFTER_PREVIOUS'
  ON_CONDUCTOR_MARK = 'ON_CONDUCTOR_MARK'
}

enum TTSProvider {
  COQUI = 'COQUI'
  VALLE = 'VALLE'
  ELEVENLABS = 'ELEVENLABS'
}
```

## Prisma Schema

```prisma
model Scene {
  id          String    @id @default(uuid())
  title       String
  rawText     String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  speakers    Speaker[]
  phrases     PhraseEvent[]
  versions    Version[]
}

model Speaker {
  id            String    @id @default(uuid())
  sceneId       String
  scene         Scene     @relation(fields: [sceneId], references: [id])
  displayName   String
  voiceProfileId String?
  voiceProfile  VoiceProfile? @relation(fields: [voiceProfileId], references: [id])
  speechRate    Float     @default(1.0)
  pitchOffset   Int       @default(0)
  sortOrder     Int
  phrases       PhraseEvent[]
}

model PhraseEvent {
  id                   String        @id @default(uuid())
  sceneId              String
  scene                Scene         @relation(fields: [sceneId], references: [id])
  speakerId            String?
  speaker              Speaker?      @relation(fields: [speakerId], references: [id])
  text                 String
  index                Int
  repeatCount          Int           @default(1)
  staggerMs            Int           @default(0)
  loopMode             LoopMode      @default(FIXED)
  durationMode         DurationMode  @default(AUTO)
  fixedDurationMs      Int?
  startTrigger         StartTrigger  @default(IMMEDIATE)
  estimatedDurationMs  Int
  isEmpty              Boolean        @default(false)
}

model VoiceProfile {
  id             String    @id @default(uuid())
  name           String
  provider       TTSProvider
  model          String
  isDefault      Boolean   @default(false)
  cloneSampleUrl String?
  settings       Json      @default("{}")
  speakers       Speaker[]
}

model Version {
  id        String    @id @default(uuid())
  sceneId   String
  scene     Scene     @relation(fields: [sceneId], references: [id])
  label     String
  snapshot  Json
  createdAt DateTime  @default(now())
}

enum LoopMode {
  FIXED
  ESCALATING
}

enum DurationMode {
  AUTO
  FIXED_MS
}

enum StartTrigger {
  IMMEDIATE
  AFTER_PREVIOUS
  ON_CONDUCTOR_MARK
}

enum TTSProvider {
  COQUI
  VALLE
  ELEVENLABS
}
```

## API Payload Shapes

### CreateSceneRequest
```typescript
{
  title: string;
  rawText: string;
}
```

### SceneResponse (with relations)
```typescript
{
  id: string;
  title: string;
  rawText: string;
  createdAt: string;
  updatedAt: string;
  speakers: SpeakerResponse[];
  phrases: PhraseEventResponse[];
  stats: {
    phraseCount: number;
    speakerCount: number;
    estimatedDurationMs: number;
  };
}
```

### UpdatePhraseRequest
```typescript
{
  text?: string;
  speakerId?: string;
  repeatCount?: number;
  staggerMs?: number;
  loopMode?: 'FIXED' | 'ESCALATING';
  durationMode?: 'AUTO' | 'FIXED_MS';
  fixedDurationMs?: number;
  startTrigger?: 'IMMEDIATE' | 'AFTER_PREVIOUS' | 'ON_CONDUCTOR_MARK';
}
```

### VersionComparisonResponse
```typescript
{
  version1: VersionResponse;
  version2: VersionResponse;
  textDiff: {
    added: PhraseEventResponse[];
    removed: PhraseEventResponse[];
    modified: { before: PhraseEventResponse; after: PhraseEventResponse }[];
  };
  durationDelta: number;
}
```