# Lexicon and Style Guide

> **Artifact ID:** `audio-dramaturgical-studio_lexicon-and-style-guide_20260327`
> **Status:** Approved / Active Governance
> **Scope:** Repository-wide Code & Document Naming Conventions, Semantic Boundaries, and Naming Tests

---

## Repo-Wide Naming Conventions

### $CONVENTION_01: System And Ontology Names

External category names use **Title Case**. Internal ontological entities use **`$UPPER_SNAKE_CASE`**. This rule is already established and should be universal across specifications, ADRs, architecture notes, and formal schemas.

Examples:

```
Speech-Score Composition System
Dramaturgical-Audio Workbench
Polyvocal Speech-Composition Engine

$SPEECH_SCORE_ENGINE
$PHRASE_EVENT
$VOICE_CHANNEL
$TIMING_SUBSTRATE
$ANALYSIS_ENGINE
```

### $CONVENTION_02: Database Identifiers

Database tables, columns, and SQL artifacts use **lowercase snake_case** without `$` prefixes. This follows the existing repository blueprint and migration stubs.

Examples:

```
app_user
scene
scene_version
version_line
playback_render
diagnostic_report
share_link
created_at
estimated_duration_ms
```

### $CONVENTION_03: Typescript Exported Types

Exported interfaces, types, classes, React components, and service contracts use **PascalCase**. Internal field names use **camelCase**. This follows the implementation handoff package and interface contracts.

Examples:

```
ParseSceneResult
CreateSceneVersionInput
RenderDispatchService
VoiceProviderAdapter

sceneId
versionId
renderScope
estimatedDurationMs
```

### $CONVENTION_04: File And Directory Names

Files and directories use **kebab-case** for human-legible artifact names and workflow modules, except where framework conventions require otherwise. Domain module directories should reflect ontology, not generic utilities. This follows the repo blueprint’s modular structure.

Examples:

```
docs/architecture/002-domain-model.md
apps/api/src/services/render-dispatch.service.ts
packages/domain/src/parsing/parse-scene-input.ts
packages/database/migrations/0003_add_scene_versions_version_lines.sql
```

### $CONVENTION_05: Api Paths

HTTP routes use **lowercase plural resource nouns** and stable version prefixes. Do not place theoretical vocabulary directly into public API paths unless the concept is truly public-facing. API surface should remain operationally legible.

Examples:

```
/api/v1/projects
/api/v1/scenes/{scene_id}
/api/v1/versions/{version_id}/renders
/api/v1/versions/{version_id}/diagnostics/latest
```

### $CONVENTION_06: Event Names

Domain events use **noun.action.state** in lowercase dot notation. This convention is already proposed for render, parse, playback, version, and share flows and should be enforced universally.

Examples:

```
scene.parse.requested
scene.parse.committed
version.created
render.completed
playback.started
diagnostic.viewed
share.revoked
```

### $CONVENTION_07: Environment Variables

Environment variables remain **`$UPPER_SNAKE_CASE`** and environment-first configuration remains mandatory. This is already aligned with the implementation package.

Examples:

```
$DATABASE_URL
$REDIS_URL
$VOICE_PROVIDER_API_KEY
$APP_BASE_URL
$PUBLIC_SHARE_BASE_URL
$LOG_LEVEL
```

### $CONVENTION_08: Doc Artifact Ids

Formal documents should continue using stable IDs in the form:

```
<domain-subject>_<artifact-class>_<YYYYMMDD>
```

Examples:

```
audio-dramaturgical-studio_mvp-system-design-package_20260327
audio-dramaturgical-studio_repository-blueprint-and-handoff_20260327
```

This matches the current document style and preserves machine-sortable continuity.

## Semantic Boundary Rules

The system must always be named from the inside out.

When referring to the ontology, use composition language.
When referring to the product wedge, use listening-and-revision language.
When referring to infrastructure, use render, provider, storage, queue, and contract language.
Do not let infrastructure names overwrite ontology names.

That means the following distinction must remain permanent:

The system is a **speech-score composition system**.
The product surface is a **dramaturgical-audio workbench**.
The voice layer is only infrastructure.

## Naming Tests

A proposed term is acceptable only if it passes all four tests.

| Test | Question | Pass condition |
| --- | --- | --- |
| Dual-aspect test | Does the term preserve both meaning and timed performance? | Must preserve both |
| Depth test | Does the term fit the deeper system, not only the MVP surface? | Must scale upward |
| Non-commodification test | Does the term avoid collapsing the product into commodity voice tooling? | Must avoid TTS-first framing |
| Translation test | Does the term remain valid across page, audio, rehearsal, and live execution? | Must remain cross-medium valid |

These tests follow directly from the project’s canonical definition and invariants.

## Enforcement Rule

In cases of conflict, the order of authority is:

| Priority | Source of truth |
| --- | --- |
| 1 | `$GOVERNING_SENTENCE` |
| 2 | `$CANONICAL_IDENTITY` |
| 3 | `$APPROVED_TERMS` |
| 4 | `$ALIAS_MAPPINGS` |
| 5 | product-surface simplifications |

If a UI term conflicts with ontology, the UI term stays local to UI only. It must not leak into schema, API contracts, or architectural language.

## Final Charter Statement

**All repository, product, and documentation language must preserve the system’s identity as a speech-score composition system whose fundamental object is not inert text but structured temporal language. Use adoption-friendly aliases at the surface where useful, but preserve canonical internal terms in schema, contracts, architecture, and code. Do not name the system as a TTS tool, script reader, or voice generator.**
