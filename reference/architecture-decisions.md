# Architecture Decisions

## ADR-001: TypeScript-first web app

Use React + Vite for the editor shell and TypeScript for domain logic.

Reason: fast iteration, browser-native canvas/PNG support, and a clear path to future Three.js voxel preview.

## ADR-002: Native data model before libraries

Use plain arrays, records, and Canvas/ImageData for P1 pixel operations.

Reason: pixel editing requirements are simple enough that native APIs keep the core transparent and easy for AI agents to modify.

## ADR-003: Commands are durable editing events

Every editing operation should produce a `StudioCommand`.

Reason: commands support replay, project diffing, AI-generated edits, future DSL, and predictable undo/redo.

## ADR-004: Internal project format differs from exports

The saved project JSON is the editable source. PNG/VOX/GLB are generated outputs.

Reason: this preserves command history, asset registry, palettes, presets, and future projection/voxel metadata.

## ADR-005: Face-colored voxels are reserved

Voxel cells reserve per-face colors in the type model.

Reason: PixZels-like projection creates color conflicts that ordinary single-color voxels cannot represent cleanly.
