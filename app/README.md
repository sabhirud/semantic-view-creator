# Semantic View Studio

A working, dependency-free browser application for turning SME knowledge into a structured Snowflake semantic specification and a self-contained Cortex Code prompt.

## Run locally

Requires Node.js 20 or later. No install step or API key is needed.

```sh
cd app
npm start
```

Open http://127.0.0.1:4173. Use `npm test` for domain logic tests and `npm run check` for syntax checks.

## Included

- Multiple local projects, autosave, project JSON export/import, and a clearly labeled sales example.
- Editable business brief, Snowflake destination, execution role/warehouse, and update policy.
- Plain-text context library and conservative CREATE TABLE extraction (including quoted identifiers, numeric type parameters, inline and composite primary keys).
- Rule-based adaptive interview that skips completed topics and tracks deferred answers.
- CRUD editors for entities, relationships, dimensions/time dimensions/facts, metrics, evaluations, and decisions.
- Configurable naming style and prefix; checks for identifier validity, a common reserved-word set, scoped duplicates, cross-kind collisions, and ambiguous synonyms.
- Readiness checks for missing definitions, invalid mappings, disconnected entities, risky cardinality, unanswered business questions, and unresolved decisions.
- SME business approval, automatically revoked on specification edits. Imported projects require fresh approval.
- Discovery prompt until all business checks and approval pass; creation prompt afterward. Both include complete context and explicit runtime validation requirements.
- Markdown download, clipboard export, and read-only WebMCP specification/prompt tools where supported.
- Responsive UI, keyboard-accessible native forms/dialogs, status announcements, and escaped user content.

## Scope and limits

This is the first functional MVP, not a connected Snowflake client or an LLM service. The interview is deterministic. Prose is saved as evidence, not automatically converted into metrics. The schema parser supports ordinary CREATE TABLE DDL, not the full Snowflake SQL grammar; extracted definitions must be reviewed. PDF/DOCX ingestion is not included; paste their relevant text.

Projects live in this browser's local storage and are **not synchronized** to a server or other devices. Download JSON backups. The hosted and localhost origins have separate storage. Static hosting contains only application source and the synthetic example, never a user's local project data. Fonts are requested from Google Fonts with system-font fallbacks.

Readiness measures specification completeness, not analytical accuracy. It does not parse or compile SQL expressions, discover live metadata, test data, or grant permissions. Source key/cardinality claims require profiling in Snowflake. Additional naming conventions and abbreviations are passed through for review, not semantically enforced. Approval is an offline review record, not authenticated identity or a compliance signature.

The prompt requires Cortex Code to inspect the specified source objects, verify joins/grains, preserve access policies, resolve conflicts, avoid silent replacement, and compare query results against references before claiming success. Actual creation/testing requires a Snowflake-connected Cortex Code session with appropriate access.

## Architecture

- `dist/model.js`: versioned specification, interview routing, validation, DDL extraction, prompt generation, import validation, synthetic example.
- `dist/app.js`: browser UI, local persistence, review workflow, import/export, optional WebMCP.
- `dist/style.css`: responsive theme and components.
- `server.mjs`: loopback-only local static server.
- `tests/model.test.mjs`: business-critical regression tests.
- `.openai/hosting.json`: owner-private Sites static deployment identity.

## Next integration increments

1. Add a server-side LLM adapter with structured outputs, evidence citations, explicit proposed/confirmed states, and conflict detection. Keep credentials server-side and obtain consent before sending project evidence to a provider.
2. Add a read-only Snowflake metadata/profile adapter. Promote definitions to metadata-checked/data-tested only on actual observed results.
3. Add authenticated durable project storage, collaborative review, version diffs, and import of Cortex Code validation results.

## Reference documentation

- https://docs.snowflake.com/en/sql-reference/sql/create-semantic-view
- https://docs.snowflake.com/en/user-guide/views-semantic/semantic-view-yaml-spec
- https://docs.snowflake.com/en/user-guide/views-semantic/best-practices-modeling
