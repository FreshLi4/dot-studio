# dot-studio

dot-studio is a browser-based pixel and voxel asset sketcher. The first milestone is a 2D pixel editor that stores edits as commands, saves project JSON, imports PNG as layers, and exports transparent PNG at 1x/2x/4x.

## Current Features

- TypeScript + React + Vite web app.
- PixelAsset project model with palette, layer, command history, asset registry, and export presets.
- Pixel canvas with zoom, grid, checkerboard transparency, coordinate readout, and palette swatches.
- Pencil, eraser, color picker, rectangle fill, flood fill, rectangle selection, and move selection.
- Layer creation, visibility, lock state, deletion, renaming, ordering, and active layer switching.
- Project save/load as JSON.
- PNG import as a new layer or new PixelAsset, optional palette mapping, composite PNG export, layer PNG export, and nearest-neighbor scaling.
- Undo/redo through editor snapshots, while command history remains the durable operation log.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

The dev server defaults to `http://127.0.0.1:5173`.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml`.

- Pushes to `main` run tests, build the Vite app, upload `dist/`, and deploy through GitHub Pages.
- The Vite base path is `/dot-studio/`, matching the default project Pages URL: `https://freshli4.github.io/dot-studio/`.
- Repository Settings -> Pages should use GitHub Actions as the source.

## Reference Projects

Reference projects live under `reference/project/` and are used for architecture study:

- Pixelorama: pixel editor project/layer/tool organization.
- LibreSprite: command-oriented editing and layer/cel concepts.
- Goxel: voxel data, layers, and VOX/glTF export concepts.
- vengi: voxel editor and conversion pipeline ideas.
- Blockbench: compact editor shell, panels, project organization, and Web/Electron product shape.

See `reference/*.md` for current study notes and licensing boundaries.
