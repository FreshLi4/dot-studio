# dot-studio Design Notes

## Product Direction

dot-studio is an editor-first creative tool, not a landing page. The first screen should be the actual workbench: tools, canvas, layers, palette, inspector/export controls, and command log.

The core idea is that pixel and voxel assets are not only painted results; they are command-generated, replayable project state. The UI should therefore expose both direct manipulation and the command trail.

## Current Implementation

- Framework: React + Vite.
- Language: TypeScript.
- Core data and algorithms: native TypeScript data structures plus browser Canvas/ImageData APIs.
- Visual style: dark neutral creative-tool shell with teal and amber accents, compact panels, small radii, no marketing hero.
- Icons: lucide-react for toolbar and panel controls.
- Animation: none yet. GSAP is allowed later for purposeful editor motion, but is not part of the P1 build.

## Data Rules

- 2D PixelAsset coordinates use `x` from left to right and `y` from top to bottom, with origin at the top-left canvas pixel.
- Transparent pixels are represented as `null` in project state and as alpha `0` when exported to PNG.
- Voxel coordinates are reserved as `x` left/right, `y` depth, and `z` height.
- Projection views are reserved as Front `x/z`, Side `y/z`, and Top `x/y`.
- MagicaVoxel coordinate conversion is a Phase 2 implementation requirement; the current docs reserve the conversion boundary but do not implement `.vox` IO yet.

## Layout

- Top bar: project/file actions, import/export, undo/redo, grid and zoom controls.
- Left rail: drawing tools.
- Center stage: pixel canvas, checkerboard transparency, optional grid, status readout.
- Right panel: layers, palette, export controls, command log.
- Responsive behavior: side panel collapses on narrow screens so the canvas remains usable.

## Reference Influence

- Pixelorama: project/layer/tool separation and pixel-focused workflow.
- LibreSprite: command-style editing model and undo-oriented architecture.
- Blockbench: dense desktop-like workbench, panel organization, and direct asset focus.
- Goxel/vengi: reserved influence for upcoming voxel asset, VOX import/export, and projection work.

## Design Constraints

- Do not add a marketing homepage before the editor.
- Do not use placeholder panels that look functional but cannot affect state.
- Keep text compact and readable in tool chrome.
- Keep canvas dimensions stable; zoom changes pixel size, not app layout semantics.
- Requirements traceability is part of the UX because AI agents are expected to continue the project.
