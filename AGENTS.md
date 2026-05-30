# dot-studio Agent Guide

dot-studio is a TypeScript-first web application for parametric pixel and voxel asset sketching. The current app is a React + Vite workspace with native Canvas/ImageData-based pixel data handling, command logging, project serialization, and PNG import/export.

## Working Rules

- Read `REQUIREMENTS.md`, `DESIGN.md`, `README.md`, and the latest file in `agent-log/` before changing code.
- Strictly update `REQUIREMENTS.md` whenever a task changes state, scope, status, or acceptance detail. Keep stable requirement IDs intact.
- Create one new task-execution log for every agent task execution in `agent-log/`. Name it with the existing convention: `YYYYMMDDHHMM-shortslug-model.md`, for example `202605300137-p1-webapp-gpt5.md`.
- A task execution starts when the agent begins acting on a user request and ends when the work is handed off, committed, blocked, or explicitly paused. If the user adds or corrects requirements during the same ongoing execution, append those raw prompts to the same log. If the previous execution was already handed off and the user gives a new task, create a new log.
- Every task log must include the user's original raw prompt text, task execution start time, task execution end time, context read, work performed, requirement IDs updated, verification, and notes.
- Keep implementation in TypeScript. Prefer native browser APIs for core editing logic. React may organize UI and state; GSAP may be used for purposeful UI motion when needed.
- Keep reusable domain logic in `src/core/`; UI components should call commands rather than mutating project data directly where practical.
- Do not copy source code from GPL or source-available reference projects into this repository. Use them for architecture study unless licensing is explicitly reviewed.

## Quality Bar

- Run `npm test` and `npm run build` before handing off code changes.
- For UI work, start a local dev server and verify the app in the browser.
- Save/load, command history, and requirements traceability are part of the feature surface, not optional documentation.
