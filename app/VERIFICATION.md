# Verification

Completed on October 4, 2026 (America/Chicago).

## Automated

`npm test`: 14 domain regression tests passed. Covers discovery gating, approval invalidation, interview routing, quoted DDL and composite keys, naming and duplicate checks, disconnected/fanout relationships, unresolved decisions, import validation, and prompt completeness.

`npm run check`: both browser JavaScript modules passed syntax checks.

## Browser

- Loaded the app in the Codex in-app browser without console errors.
- Loaded the synthetic sales example, approved it as a test reviewer, and confirmed a creation prompt became available.
- Edited the business domain, confirmed approval was cleared and the prompt reverted to discovery, then reloaded to confirm the edit persisted.
- Pasted CREATE TABLE DDL, extracted a proposed customer mapping, saved it to the model, and edited its grain and meaning.
- Confirmed that the disconnected customer entity blocked approval.
- Started a separate project, answered an interview question, deferred another, and confirmed the unresolved status and discovery prompt.
- Validated both read-only WebMCP tools with valid input; unexpected input was rejected.
- At 390px and 1440px viewport settings, document scroll width matched document client width (no page-level horizontal overflow).
- Captured the review/readiness screen in `../app-preview.jpg`.

The automated browser attempt to verify clipboard/download completion timed out; export content generation is covered by unit tests and prompt rendering was verified. No successful Snowflake metadata check, SQL execution, or semantic view creation is claimed.

## Hosting

Sites registration exists, but publication was blocked by automatic approval review because external source-code transfer/private hosting was not explicitly authorized. No hosted deployment was completed. The application remains available locally through `npm start`.
