# Terminology Charter

> **Artifact ID:** `audio-dramaturgical-studio_terminology-charter_20260327`
> **Status:** Approved / Active Governance
> **Scope:** Repository-wide (Schema, API Contracts, UI Labels, Docs, Architecture)

---

## Document Purpose

This charter governs language across product copy, specifications, schema, API contracts, UI labels, repository structure, and implementation handoff. Its job is to prevent ontological drift. The system must remain legible as a speech-score composition system rather than collapsing into the weaker categories of script reader, voice utility, or generic TTS wrapper.

## Governing Sentence

**The system treats language as a dual-aspect object: semantic content and timed performance.**
Every naming decision must preserve both sides of that claim. If a term hides either meaning or temporal behavior, reject it.

## Canonical Identity

| Layer | Canonical term | Status | Usage rule |
| --- | --- | --- | --- |
| Master system name | Speech-Score Composition System | Approved | Use in external prose, formal category language, deck copy, and high-level documentation |
| Internal system identifier | `$SPEECH_SCORE_ENGINE` | Approved | Use in specifications, architecture docs, schemas, and repo-level ontology |
| Product-surface descriptor | Dramaturgical-Audio Workbench | Approved | Use for adoptable commercial surface and user-facing product explanation |
| Deep-system descriptor | Polyvocal Speech-Composition Engine | Approved | Use when distinguishing deeper compositional layer from the initial product wedge |
| Secondary designation | Post-Script Theatrical Composition Environment | Permitted | Use selectively in theoretical or manifesto-style contexts |
| Category shorthand | Speech-score system | Approved | Use when compactness is needed without loss of ontology |

These expressions are the stable vocabulary core and should remain fixed unless the ontology itself changes.

## Approved Terms

| Canonical term | Definition | Preferred scope |
| --- | --- | --- |
| `$PHRASE_EVENT` | Primary compositional unit; a bounded utterance or fragment with semantic, temporal, and relational properties | Data model, theory, architecture, score logic |
| `$VOICE_CHANNEL` | Speaking carrier independent from literary character identity | Data model, rendering, analysis, live execution |
| `$TEMPORAL_RELATION` | Primary organizing principle governing cue order, overlap, delay, recurrence, silence, and entry logic | Theory, architecture, diagnostics |
| `$TIMING_SUBSTRATE` | Temporal kernel supporting clock, beat, cue-relative, and elastic time | Architecture, implementation, timing services |
| `$NOTATION_RENDERER` | Service producing readable script, rhythmic score, spatial matrix, and performer part views | Output layer, rendering subsystem |
| `$REHEARSAL_KERNEL` | Bridge translating composition objects into cue sheets, drills, stems, and count structures | Rehearsal tooling, exports |
| `$LIVE_EXECUTION_LAYER` | Real-time coordination layer for performance control and override | Performance infrastructure |
| `$ANALYSIS_ENGINE` | Dramaturgical diagnostic layer for timing, pacing, speaker differentiation, repetition, and interruption logic | Product diagnostics, analysis subsystem |
| `$COMPOSITION_LAYER` | Authoring environment for phrase-events, recurrence rules, and structural transformations | Product architecture |
| `$PHRASE_EVENT_MODEL` | Canonical structured representation of utterance-level objects | Data modeling, persistence |
| `$READABLE_SCRIPT` | Literary-readable output view | Output naming |
| `$RHYTHMIC_SCORE` | Beat- or measure-oriented output view | Output naming |
| `$SPATIAL_TEXT_SCORE` | Layout-driven score view where typography carries instruction | Output naming |
| `$TABLE_READ_AUDIO` | Rapid auditory draft for dramaturgical listening | Product surface, MVP |
| `$REHEARSAL_PACK` | Export bundle for performers and directors | Output naming |
| `$CONDUCTOR_VIEW` | Control-oriented live view for timing and branching | Later-stage execution layer |
| `$LIVE_PROMPT_VIEW` | Monitor-safe live text display | Later-stage execution layer |
| `$MACHINE_SCORE_OBJECT` | Structured machine-readable score artifact | Export, API, storage |
| `$KINETIC_TEXT_RENDER` | Projection or motion-based visual text output | Advanced output layer |

These terms follow directly from the current conceptual system and output model.

## Forbidden Terms

| Forbidden term | Why it is rejected | Replacement |
| --- | --- | --- |
| text-to-speech software | Reduces the system to commodity voice infrastructure | Speech-Score Composition System |
| TTS tool | Flattens ontology and moat | Dramaturgical-Audio Workbench |
| voice generator | Centers the wrong substrate | Table-read audio renderer, voice layer, or render service |
| script reader | Treats the work as inert text | Listening-first revision environment for performative text |
| podcast engine | Misclassifies the medium and excludes live/rehearsal/score dimensions | Speech-score system |
| playwriting app | Too narrow and literature-bound | Dramaturgical-Audio Workbench |
| screenplay reader | Misframes the use case and omits compositional depth | Dialogue revision environment |
| theatre chatbot | Category error | Analysis engine or dramaturgical diagnostic layer |
| audio toy | Trivializing language that weakens institutional seriousness | Product or system term appropriate to layer |
| playback settings | Too vague for the temporal kernel | `$TIMING_SUBSTRATE` |
| formatted script | Too weak for the output model | `$NOTATION_RENDERER` output |
| practice mode | Understates formal rehearsal function | `$REHEARSAL_KERNEL` |
| presentation mode | Understates real-time coordination and override | `$LIVE_EXECUTION_LAYER` |
| AI critique | Overclaims and weakens diagnostic seriousness | `$ANALYSIS_ENGINE` |
| dialogue chunk | Loose and under-specified | `$PHRASE_EVENT` |
| clip | Imports DAW/video baggage and obscures semantic status | `$PHRASE_EVENT` |
| thing / piece / block / snippet | Ontologically weak | Use the precise canonical object term |

These exclusions are not stylistic niceties; they protect the system from being reclassified into commodity categories.

## Alias Mappings

| User-surface term | Internal canonical term | Rule |
| --- | --- | --- |
| scene | `$SCENE` as container, but conceptually subordinate to `$PHRASE_EVENT` and `$TEMPORAL_RELATION` | Allowed in UI; do not treat as deepest unit in specs |
| speaker | `$VOICE_CHANNEL` | Allowed in UI and onboarding; map back internally |
| character | `$VOICE_CHANNEL` or character-to-channel mapping | Allowed only when referring to literary source identity |
| line | `$PHRASE_EVENT` | Allowed for imported scripts and simple editing views; avoid in core ontology |
| readback | `$TABLE_READ_AUDIO` or render playback | Allowed in product copy; avoid in architectural docs |
| dialogue playback | `$TABLE_READ_AUDIO` on the surface, `$TIMING_SUBSTRATE` + render flow underneath | Allowed in product copy |
| script view | `$READABLE_SCRIPT` | Prefer canonical output name in docs |
| score view | `$RHYTHMIC_SCORE` or `$SPATIAL_TEXT_SCORE` | Use precise output name when known |
| voice | voice profile or `$VOICE_CHANNEL`, depending context | Distinguish synthetic voice profile from compositional carrier |
| rehearsal export | `$REHEARSAL_PACK` | Prefer canonical form in docs |
| live mode | `$LIVE_EXECUTION_LAYER` | UI shorthand only |
| diagnostics | `$ANALYSIS_ENGINE` output | Use “diagnostics” in UI; use engine name in architecture |

This preserves adoption-friendly language at the interface while keeping the deeper ontology intact in code and specification.

## Approved Pattern Families

| Pattern family | Status | Notes |
| --- | --- | --- |
| speech-score | Approved | Best high-level hybrid descriptor |
| polyvocal | Approved | Best descriptor for distributed voice architecture |
| post-script | Approved | Strong theoretical framing |
| dramaturgical-audio | Approved | Best product-surface framing |
| performance-writing | Approved | Good bridge term for general audiences |
| temporal writing intelligence | Approved | Strong positioning term for moat language |

## Dispreferred Pattern Families

| Pattern family | Status | Notes |
| --- | --- | --- |
| AI voice | Rejected | Centers commodity infrastructure |
| script reader | Rejected | Literature-bound reduction |
| podcast engine | Rejected | Category narrowing |
| theatre chatbot | Rejected | Nonsensical framing |
| audio toy | Rejected | Trivializing and unserious |

These pattern families were already implicit in the prior naming rules and product-surface strategy.
