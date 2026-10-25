# Semantic View Creator

Semantic View Studio is a browser application that captures subject matter expertise and produces a self-contained prompt for Snowflake Cortex Code to build a native semantic view.

## Try it

Download `Semantic-View-Studio.html` and open it in a modern browser, or run the local app with Node.js 20 or later:

```sh
cd app
npm start
```

Open http://127.0.0.1:4173/ and choose **Explore the sales example** to try the workflow. No dependency installation or API key is required.

## Workflow

1. Define the business purpose, scope, and Snowflake destination.
2. Add plain-text context or extract proposed mappings from CREATE TABLE DDL.
3. Complete a guided interview covering time, units, historical attribution, exceptions, terminology, and access.
4. Review entities, relationships, dimensions, facts, metrics, and evaluation cases.
5. Resolve readiness checks and record SME approval.
6. Copy or download the Cortex Code prompt. Incomplete specifications produce a discovery prompt; approved specifications produce a creation prompt that requires live validation in Snowflake.

## Current scope

This MVP uses rule-based interviewing and browser-local storage. It does not connect to Snowflake, execute SQL, or use an LLM to infer business rules. Readiness checks measure specification completeness, not analytical correctness. Existing source permissions, mappings, joins, and query results must be verified by Cortex Code in a Snowflake-connected session.

Projects are saved on the current browser/device. Use JSON backups to transfer them. No project data is included in this repository; the bundled example is synthetic.

## Development

```sh
cd app
npm test
npm run check
node standalone.mjs
```

The final command regenerates the standalone HTML at the repository root.

- [Application documentation](app/README.md)
- [Verification record](app/VERIFICATION.md)
- `app/dist/`: browser source and styles
- `app/tests/`: domain logic regression tests
- `app/server.mjs`: loopback-only local server

The application does not require Sites hosting. Environment-specific hosting configuration is excluded from this repository.
