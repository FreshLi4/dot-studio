# YYYYMMDDHHMM-shortslug-model

Copy this file into `agent-log/` and rename it for each task execution.

Naming convention:

```text
YYYYMMDDHHMM-shortslug-model.md
```

Example:

```text
202605300137-p1-webapp-gpt5.md
```

## Original Prompt

Paste the user's raw prompt text here. If the user adds scope during the same task execution, append each additional prompt with its timestamp.

```text
<raw user prompt>
```

## Task Execution Time

- Start: `YYYY-MM-DD HH:MM:SS <timezone>`
- End: `YYYY-MM-DD HH:MM:SS <timezone>`

## User Request Summary

Summarize the user's request in plain language.

## Context Read

List the files, logs, requirements, designs, and references read before making changes.

## Work Performed

List the meaningful changes made during the task execution.

## Requirements Updated

List requirement IDs that changed state or scope.

## Verification

List commands run, manual checks, browser checks, screenshots, or known blockers.

## Notes

Record follow-up ideas, constraints, or decisions that future agents need.
