# Feature Specification: Dialogue Looping Tracker Sequence (Layer 1)

**Feature Branch**: `layer-1-dialogue-loop-tracker`  
**Created**: 2026-03-30  
**Status**: Draft  
**Input**: Build a dialogue looping tracker sequence as the foundational layer of the Speech Score Engine — write dialogue, segment into phrase-events, assign speakers/voices, create loop/pattern sequences, hear timed playback

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Paste or Write Dialogue and Hear It Performed (Priority: P1)

As a playwright or writer, I paste or type dialogue text so I can immediately hear it performed with distinct voices.

**Why this priority**: This is the core value proposition — hearing written dialogue as performance. Without this, nothing else matters.

**Independent Test**: Can be fully tested by pasting a 10-line dialogue, assigning 2 speakers, and pressing play. Delivers immediate auditory feedback on dialogue.

**Acceptance Scenarios**:

1. **Given** user has no scene, **When** user creates new scene and pastes "A: Hello\nB: Hi there", **Then** system parses into 2 lines with speakers A and B
2. **Given** user has parsed dialogue, **When** user presses play, **Then** system renders audio for all lines in sequence with correct speaker voices
3. **Given** user has played scene, **When** user pauses and seeks to line 3, **Then** playback resumes from line 3

---

### User Story 2 - Assign and Manage Speakers (Priority: P1)

As a user, I assign speakers to lines and manage speaker identities so the system knows who says what and renders with distinct voices.

**Why this priority**: Speaker assignment is required for the system to render dialogue with different voices. Without this, playback is meaningless.

**Independent Test**: Can be tested by creating a scene with 3 speakers, renaming them, and verifying each line maps to the correct speaker.

**Acceptance Scenarios**:

1. **Given** system has parsed speakers A, B, C, **When** user renames speaker A to "Martha", **Then** all lines previously by A now show Martha
2. **Given** scene has 2 speakers, **When** user adds a third speaker "Narrator", **Then** Narrator appears in speaker list and can be assigned to lines
3. **Given** a line has wrong speaker, **When** user reassigns to correct speaker, **Then** playback renders with the correct voice

---

### User Story 3 - Segment Lines into Loopable Phrase-Events (Priority: P1)

As a user, I segment dialogue lines into phrase-events so I can treat them as individual loopable units with their own timing behavior.

**Why this priority**: The speech-score engine treats each utterance as a manipulable event. Line-level is the minimum for loop/sequence functionality.

**Independent Test**: Can be tested by splitting a long line into 3 phrases, setting different repeat counts on each, and verifying playback respects each configuration.

**Acceptance Scenarios**:

1. **Given** a line with 50 words, **When** user splits into 3 phrase-events, **Then** each phrase can be independently configured
2. **Given** 3 phrase-events, **When** user reorders via drag-drop, **Then** playback order reflects new sequence
3. **Given** 2 phrase-events, **When** user merges into one, **Then** merged phrase contains combined text

---

### User Story 4 - Configure Loop and Sequence Patterns (Priority: P1)

As a user, I set repeat count, stagger timing, and duration mode on phrases so I can create loop sequences and hear patterns emerge.

**Why this priority**: This is the distinctive Layer 1 feature — not just playback, but configurable looping and timing. The core of "looping tracker."

**Independent Test**: Can be tested by setting phrase 1 to repeat 3x with 500ms stagger, phrase 2 to repeat 2x with no stagger, and verifying audio output reflects both patterns.

**Acceptance Scenarios**:

1. **Given** phrase with repeat count 4, **When** playback runs, **Then** phrase audio plays 4 times consecutively
2. **Given** phrase with repeat count 3 and stagger 500ms, **Then** each repeat starts 500ms after previous completes
3. **Given** phrase with duration mode FIXED_2000, **Then** phrase plays for exactly 2 seconds regardless of TTS length
4. **Given** phrase with start trigger AFTER_PREVIOUS, **Then** phrase plays only after previous phrase completes

---

### User Story 5 - Play, Pause, Seek, and Track Playback (Priority: P1)

As a user, I control playback with play/pause/stop/seek so I can inspect timing behavior and navigate the sequence.

**Why this priority**: Without playback controls, users cannot inspect their work. This is the basic inspection layer.

**Independent Test**: Can be tested by playing a 10-phrase sequence, pausing at phrase 5, seeking to phrase 8, and verifying visual tracker shows correct position.

**Acceptance Scenarios**:

1. **Given** sequence is playing, **When** user clicks pause, **Then** audio stops and current phrase remains highlighted
2. **Given** sequence is paused at phrase 5, **When** user clicks play, **Then** playback resumes from phrase 5
3. **Given** sequence has 10 phrases, **When** user clicks phrase 7, **Then** playback jumps to phrase 7
4. **Given** playback is running, **Then** visual tracker highlights current phrase in real-time

---

### User Story 6 - Revise Text and Replay (Priority: P2)

As a user, I edit dialogue text and replay so I can revise against sound rather than silent reading.

**Why this priority**: The revision loop is the core product value — write, hear, revise, hear again. Tying this to versioning makes it trustable.

**Independent Test**: Can be tested by changing a line's text, saving version, playing, then restoring prior version and playing to hear the difference.

**Acceptance Scenarios**:

1. **Given** scene has been played, **When** user edits line 3 text, **Then** system highlights changed line
2. **Given** user has edited text, **When** user saves version with label "Before rhythm change", **Then** version appears in history
3. **Given** two versions exist, **When** user compares them, **Then** text diff and duration diff are visible

---

### User Story 7 - Assign Voices to Speakers (Priority: P2)

As a user, I assign a voice profile to each speaker so the rendered audio sounds distinct and appropriate for each character.

**Why this priority**: Voice assignment is required for meaningful audio output. Different voices make the dialogue intelligible.

**Independent Test**: Can be tested by assigning "Female-A" voice to speaker A, "Male-B" to speaker B, and verifying playback uses different voices.

**Acceptance Scenarios**:

1. **Given** speaker list, **When** user selects voice profile for "Martha", **Then** all Martha lines render with that voice
2. **Given** speaker has assigned voice, **When** user previews voice, **Then** audio sample plays for confirmation
3. **Given** scene with 3 speakers, **When** user changes speaker A's voice mid-scene, **Then** subsequent plays use new voice

---

### User Story 8 - Save and Restore Versions (Priority: P2)

As a user, I save named versions and restore prior versions so I can compare edits and roll back changes.

**Why this priority**: Versioning provides trust in the revision loop. Users need to know their work is safe and comparable.

**Independent Test**: Can be tested by saving 3 versions, restoring version 1, and verifying scene matches that version's text.

**Acceptance Scenarios**:

1. **Given** scene has unsaved changes, **When** user saves version with label "v1", **Then** version appears in history list
2. **Given** version history has 3 versions, **When** user clicks restore on version 2, **Then** scene text reverts to version 2 state
3. **Given** two versions exist, **When** user compares them, **Then** system shows which lines changed

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow user to create a new scene with a title
- **FR-002**: System MUST accept multi-line dialogue text input via paste or typing
- **FR-003**: System MUST auto-parse speaker labels from common patterns (NAME:, NAME:, "NAME", NAME.)
- **FR-004**: System MUST preserve raw text exactly as entered without modification
- **FR-005**: User MUST be able to manually rename any detected speaker
- **FR-006**: User MUST be able to add new speakers and remove unused speakers
- **FR-007**: Each spoken line MUST map to exactly one speaker
- **FR-008**: User MUST be able to view parsed lines as individual phrase-events
- **FR-009**: User MUST be able to split a line into multiple phrase-events
- **FR-010**: User MUST be able to merge phrase-events into a single unit
- **FR-011**: User MUST be able to reorder phrase-events via drag-and-drop
- **FR-012**: Each phrase-event MUST have: text, speaker_id, index, estimated_duration_ms
- **FR-013**: User MUST be able to set repeat count (0 = play once, N = play N times)
- **FR-014**: User MUST be able to set stagger delay between repeats (in milliseconds)
- **FR-015**: User MUST be able to set loop mode: FIXED (exact repeats) or ESCALATING (faster/slower each iteration)
- **FR-016**: User MUST be able to set phrase duration: AUTO (TTS estimate) or FIXED_MS (manual override)
- **FR-017**: User MUST be able to set start trigger: IMMEDIATE, AFTER_PREVIOUS, ON_CONDUCTOR_MARK
- **FR-018**: System MUST generate audio playback for the full sequence
- **FR-019**: User MUST be able to play, pause, and stop the sequence
- **FR-020**: User MUST be able to seek to any phrase in the sequence
- **FR-021**: Visual playback tracker MUST show current phrase in real-time during playback
- **FR-022**: User MUST be able to play a single phrase in isolation
- **FR-023**: User MUST be able to play a selected range of phrases
- **FR-024**: System MUST support multiple TTS providers (Coqui, VALL-E, ElevenLabs) as configurable options
- **FR-025**: System MUST support voice cloning from user-provided audio sample
- **FR-026**: User MUST be able to preview a voice before assigning to a speaker
- **FR-027**: User MUST be able to adjust per-speaker: speech rate, pitch offset
- **FR-028**: User MUST be able to save a named version of the scene
- **FR-029**: User MUST be able to view version history with timestamps
- **FR-030**: User MUST be able to restore a prior version
- **FR-031**: User MUST be able to compare two versions (text diff + duration delta)
- **FR-032**: System MUST show estimated total scene duration
- **FR-033**: System MUST show phrase count and speaker count
- **FR-034**: System MUST flag phrases with no speaker assignment

### Key Entities

- **$SCENE**: Container for a dialogue work with title, raw text, timestamps
- **$SPEAKER**: A speaking entity in the scene with display name and assigned voice
- **$PHRASE_EVENT**: A single utterance with text, speaker, timing, loop configuration
- **$VOICE_PROFILE**: Voice characteristics including provider, model, rate, pitch, clone sample
- **$VERSION**: A saved snapshot of scene state with label and timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can create scene and hear first playback in under 60 seconds
- **SC-002**: Playback accurately reflects configured repeat count and stagger timing
- **SC-003**: All configured TTS providers render audio successfully (when API keys provided)
- **SC-004**: Version restore produces identical scene state to saved version
- **SC-005**: Playback seeking responds within 200ms
- **SC-006**: Scene with 100 phrases loads and plays without performance degradation

### User Satisfaction Criteria

- **USC-001**: 90% of users successfully complete first playback on first attempt
- **USC-002**: Users report the revision loop (edit → play → revise) feels tight and fast
- **USC-003**: Users understand how to configure loops without reading documentation

## Edge Cases

- What happens when scene has no speakers? → Display prompt to add or parse speakers
- What happens when TTS provider fails? → Show error, allow retry, fallback to next provider
- What happens when phrase text is empty? → Skip in playback, mark in UI as empty
- What happens when repeat count set to 0? → Treat as play-once (same as 1)
- What happens when stagger set but repeat count is 1? → Ignore stagger, no effect
- What happens when voice not assigned to speaker? → Use default system voice
- What happens when restoring version with different phrase count? → Replace entire phrase list