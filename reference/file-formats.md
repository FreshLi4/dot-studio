# File Formats

## Project JSON

The P1 project file stores:

- version number
- palettes
- asset registry
- command history
- redo stack placeholder
- export presets
- warnings

This keeps the editable source separate from binary exports.

## PNG

P1 uses browser-native Image and Canvas/ImageData APIs:

- import PNG into RGBA pixels, mapping transparent pixels to `null`
- import as a new PixelAsset layer
- export visible composite or selected layer as PNG
- export 1x/2x/4x with nearest-neighbor scaling

`pngjs` and `UPNG.js` remain candidates for Node-side or APNG workflows later, but are not required for the current browser MVP.

## VOX

Upcoming Phase 2 should support a minimal MagicaVoxel `.vox` set:

- MAIN
- SIZE
- XYZI
- RGBA

Coordinate conversion must be documented before implementation.

## GLB

Upcoming GLB export should start with static mesh/material/texture output before animation.
