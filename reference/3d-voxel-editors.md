# 3D Voxel Editors

## Goxel

- Location: `reference/project/goxel`
- License: GPL-family, architecture reference only unless project licensing changes.
- Stack: C/C++
- Useful areas: voxel volume, layers, tools, MagicaVoxel/OBJ/glTF export paths.
- Takeaway: separate volume data from tools and exporters.

## vengi

- Location: `reference/project/vengi`
- License: MIT
- Stack: C++
- Useful areas: voxel utilities, format conversion, CLI tooling.
- Takeaway: format conversion should be testable outside the UI.

## Blockbench

- Location: `reference/project/blockbench`
- License: GPL-family/source tree license requires review before reuse.
- Stack: TypeScript/JavaScript, Web/Electron
- Useful areas: editor shell, outliner, texture editing, undo, exporters.
- Takeaway: dense panel-based editor UX works well for asset production.

## Phase Decisions

- Phase 2: single VoxelAsset, 3D view, basic voxel tools, VOX import/export.
- Phase 3: scene/instance asset organization.
- Phase 4: PixZels-like projection and pixel-mask extrusion.
- Phase 6-8: texture binding, GLB/OBJ export, renderer and sprite renders.
