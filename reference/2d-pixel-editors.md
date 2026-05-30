# 2D Pixel Editors

## Pixelorama

- Location: `reference/project/Pixelorama`
- License: MIT
- Stack: Godot
- Useful areas: `src/Classes/Project.gd`, layer classes, tool base classes, import/export autoloads, palette UI.
- Takeaway: keep project, frame/layer, tool, import/export, and UI concerns separated.

## LibreSprite

- Location: `reference/project/LibreSprite`
- License: GPL-family, architecture reference only unless project licensing changes.
- Stack: C++
- Useful areas: `src/app/cmd`, `src/app/tools`, document/layer/cel concepts.
- Takeaway: command objects and document mutation boundaries are useful for undo/redo and replayable editing.

## Piskel / Krita

Not downloaded in this repository. Keep as conceptual references for lightweight browser workflow and mature painting/animation UX.

## Phase Decisions

- Phase 1: PixelAsset, canvas, basic tools, layers, PNG import/export, 2D commands.
- Phase 5: animation timeline, onion skin, sprite sheet export.
- Phase 9: emissive/glow pixel data and export variants.
- Not early scope: full brush engine, advanced filters, and full animation suite.
