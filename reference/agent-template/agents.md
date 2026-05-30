# Agent Guide Template

Copy this file to the target repository as `AGENTS.md`.

## Required Startup

- Read `REQUIREMENTS.md`, `DESIGN.md`, `README.md`, and the latest file in `agent-log/` before changing code.
- Create one new log for every conversation in `agent-log/`.
- Use the log naming convention `YYYYMMDDHHMM-shortslug-model.md`, for example `202605300137-p1-webapp-gpt5.md`.

## Required Requirements Discipline

- Strictly update `REQUIREMENTS.md` whenever a task changes state, scope, status, or acceptance detail.
- Keep all stable requirement IDs intact.
- Use native Markdown checkboxes:
  - `- [ ]` means incomplete.
  - `- [x]` means complete.
  - Add `#blocked`, `#deferred`, or `#cut` after the task when needed.
- Do not silently delete requirements. Mark cancelled work with `#cut`.

## Engineering Defaults

- Prefer the repository's existing stack and conventions.
- Keep changes scoped to the requested task.
- Add tests when behavior or shared logic changes.
- Run the relevant test/build commands before handoff.

## Project-Specific Notes

Fill this section after copying the template:

- Stack:
- Dev command:
- Test command:
- Build command:
- Key directories:
- External references:
