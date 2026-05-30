# Requirements Template

Copy this file to the target repository as `REQUIREMENTS.md`.

Use stable IDs. Do not renumber existing IDs when sorting or inserting new tasks.

## Status Rules

- [ ] [RULE-001] Every executable requirement has a stable ID.
- [ ] [RULE-002] Task state uses native Markdown checkbox syntax.
- [ ] [RULE-003] Task hierarchy is expressed with indentation.
- [ ] [RULE-004] Tags are used only for filtering.

## Phase 0: Foundation

- [ ] [P0-A-000] Define project foundation #epic #phase-0 #P0
  - [ ] [P0-A-001] Define project format.
  - [ ] [P0-A-002] Define core asset types.
  - [ ] [P0-A-003] Define persistence and validation.

## Phase 1: First Usable Feature

- [ ] [P1-A-000] Implement first usable workflow #feature #phase-1 #P0
  - [ ] [P1-A-001] Create the primary data model.
  - [ ] [P1-A-002] Build the primary UI.
  - [ ] [P1-A-003] Add save/load or equivalent persistence.
  - [ ] [P1-A-004] Add import/export if applicable.
  - [ ] [P1-A-005] Add tests and manual verification steps.

## Cross-Cutting

- [ ] [X-A-000] Maintain AI traceability #qa #P0
  - [ ] [X-A-001] Update requirements after every completed task.
  - [ ] [X-A-002] Create one agent log per conversation.

- [ ] [X-B-000] Definition of Done #qa #P0
  - [ ] [X-B-001] Feature is implemented.
  - [ ] [X-B-002] UI or interface is usable.
  - [ ] [X-B-003] Tests/build pass or known failures are documented.
  - [ ] [X-B-004] Requirements and log are updated.
