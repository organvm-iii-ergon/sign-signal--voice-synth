# API Contracts: Dialogue Looping Tracker Sequence

**Branch**: `layer-1-dialogue-loop-tracker` | **Date**: 2026-03-30

## API Endpoints Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/scenes | Create new scene |
| GET | /api/scenes/{id} | Get scene by ID |
| GET | /api/scenes | List all scenes |
| PUT | /api/scenes/{id} | Update scene metadata |
| DELETE | /api/scenes/{id} | Delete scene |
| POST | /api/scenes/{id}/parse | Re-parse raw text |
| POST | /api/scenes/{id}/phrases | Add phrase to scene |
| PUT | /api/scenes/{id}/phrases/{phraseId} | Update phrase |
| DELETE | /api/scenes/{id}/phrases/{phraseId} | Delete phrase |
| PUT | /api/scenes/{id}/phrases/reorder | Reorder phrases |
| POST | /api/scenes/{id}/phrases/{phraseId}/split | Split phrase |
| POST | /api/scenes/{id}/phrases/merge | Merge phrases |
| POST | /api/scenes/{id}/speakers | Add speaker |
| PUT | /api/scenes/{id}/speakers/{speakerId} | Update speaker |
| DELETE | /api/scenes/{id}/speakers/{speakerId} | Delete speaker |
| POST | /api/scenes/{id}/play | Generate and start playback |
| POST | /api/scenes/{id}/play/phrase/{phraseId} | Play single phrase |
| POST | /api/scenes/{id}/play/range | Play phrase range |
| GET | /api/scenes/{id}/play/status | Get playback status |
| POST | /api/scenes/{id}/play/stop | Stop playback |
| GET | /api/scenes/{id}/versions | Get version history |
| POST | /api/scenes/{id}/versions | Save version |
| POST | /api/scenes/{id}/versions/{versionId}/restore | Restore version |
| GET | /api/scenes/{id}/versions/compare | Compare two versions |
| GET | /api/voices | List voice profiles |
| POST | /api/voices | Create voice profile |
| POST | /api/voices/{id}/preview | Preview voice |
| POST | /api/voices/{id}/clone | Clone voice from sample |

## Core Schemas

### Scene Schemas

```yaml
components:
  schemas:
    Scene:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        rawText:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    SceneWithRelations:
      allOf:
        - $ref: '#/components/schemas/Scene'
        - type: object
          properties:
            speakers:
              type: array
              items:
                $ref: '#/components/schemas/Speaker'
            phrases:
              type: array
              items:
                $ref: '#/components/schemas/PhraseEvent'
            stats:
              $ref: '#/components/schemas/SceneStats'
    
    SceneStats:
      type: object
      properties:
        phraseCount:
          type: integer
        speakerCount:
          type: integer
        estimatedDurationMs:
          type: integer
```

### Speaker Schemas

```yaml
    Speaker:
      type: object
      properties:
        id:
          type: string
          format: uuid
        displayName:
          type: string
        voiceProfileId:
          type: string
          format: uuid
          nullable: true
        speechRate:
          type: number
          format: float
        pitchOffset:
          type: integer
        sortOrder:
          type: integer
```

### PhraseEvent Schemas

```yaml
    PhraseEvent:
      type: object
      properties:
        id:
          type: string
          format: uuid
        sceneId:
          type: string
          format: uuid
        speakerId:
          type: string
          format: uuid
          nullable: true
        text:
          type: string
        index:
          type: integer
        repeatCount:
          type: integer
        staggerMs:
          type: integer
        loopMode:
          type: string
          enum: [FIXED, ESCALATING]
        durationMode:
          type: string
          enum: [AUTO, FIXED_MS]
        fixedDurationMs:
          type: integer
          nullable: true
        startTrigger:
          type: string
          enum: [IMMEDIATE, AFTER_PREVIOUS, ON_CONDUCTOR_MARK]
        estimatedDurationMs:
          type: integer
        isEmpty:
          type: boolean
```

### VoiceProfile Schemas

```yaml
    VoiceProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        provider:
          type: string
          enum: [COQUI, VALLE, ELEVENLABS]
        model:
          type: string
        isDefault:
          type: boolean
        cloneSampleUrl:
          type: string
          nullable: true
        settings:
          type: object
```

### Version Schemas

```yaml
    Version:
      type: object
      properties:
        id:
          type: string
          format: uuid
        sceneId:
          type: string
          format: uuid
        label:
          type: string
        snapshot:
          type: object
        createdAt:
          type: string
          format: date-time
    
    VersionComparison:
      type: object
      properties:
        version1:
          $ref: '#/components/schemas/Version'
        version2:
          $ref: '#/components/schemas/Version'
        textDiff:
          type: object
        durationDelta:
          type: integer
```

### Playback Schemas

```yaml
    PlaybackStatus:
      type: object
      properties:
        isPlaying:
          type: boolean
        currentPhraseIndex:
          type: integer
        elapsedMs:
          type: integer
        totalDurationMs:
          type: integer
    
    PlaybackRequest:
      type: object
      properties:
        startPhraseIndex:
          type: integer
          default: 0
        endPhraseIndex:
          type: integer
          nullable: true
    
    PhraseSplitRequest:
      type: object
      required:
        - splitPoints
      properties:
        splitPoints:
          type: array
          items:
            type: integer
          description: Character indices to split at
    
    PhraseMergeRequest:
      type: object
      required:
        - phraseIds
      properties:
        phraseIds:
          type: array
          items:
            type: string
            format: uuid
    
    PhraseReorderRequest:
      type: object
      required:
        - orderedIds
      properties:
        orderedIds:
          type: array
          items:
            type: string
            format: uuid
    
    VoiceCloneRequest:
      type: object
      required:
        - sampleUrl
      properties:
        sampleUrl:
          type: string
          format: uri
        name:
          type: string
```

## Endpoint Details

### POST /api/scenes
Create new scene with raw dialogue text.

**Request**:
```json
{
  "title": "Scene 1",
  "rawText": "A: Hello there.\nB: Hi yourself!"
}
```

**Response** (201):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Scene 1",
  "rawText": "A: Hello there.\nB: Hi yourself!",
  "createdAt": "2026-03-30T12:00:00Z",
  "updatedAt": "2026-03-30T12:00:00Z",
  "speakers": [
    { "id": "...", "displayName": "A", "sortOrder": 0 }
  ],
  "phrases": [
    { "id": "...", "text": "Hello there.", "speakerId": "...", "index": 0 }
  ],
  "stats": { "phraseCount": 2, "speakerCount": 2 }
}
```

### POST /api/scenes/{id}/play
Generate audio for full sequence and start playback.

**Response** (200):
```json
{
  "audioUrl": "/api/audio/scene-550e8400-playback.wav",
  "status": {
    "isPlaying": true,
    "currentPhraseIndex": 0,
    "elapsedMs": 0,
    "totalDurationMs": 5000
  }
}
```

### WebSocket: /ws/playback/{sceneId}
Real-time playback progress events.

**Server → Client**:
```json
{
  "type": "phrase_start",
  "phraseIndex": 2,
  "phraseId": "550e8400-e29b-41d4-a716-446655440002"
}
```

```json
{
  "type": "phrase_end",
  "phraseIndex": 2,
  "elapsedMs": 1200
}
```

```json
{
  "type": "playback_complete"
}
```