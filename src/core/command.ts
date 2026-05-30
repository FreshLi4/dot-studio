import type { PixelLayer, StudioCommand, StudioProject } from "./types";
import { createId } from "./id";
import { createPixelAsset, fillRect, floodFill, moveSelection, setPixel } from "./pixel";
import { getPixelAsset as findPixelAsset } from "./project";

export const REGISTERED_OPS = new Set<StudioCommand["op"]>([
  "create_pixel_asset",
  "paint_pixel",
  "erase_pixel",
  "fill_rect",
  "move_selection",
  "flood_fill",
  "create_pixel_layer",
  "delete_pixel_layer",
  "move_pixel_layer",
  "rename_pixel_layer",
  "set_pixel_layer_visibility",
  "set_pixel_layer_lock",
  "import_png",
  "export_png",
]);

export function validateCommand(command: StudioCommand): void {
  if (!REGISTERED_OPS.has(command.op)) {
    throw new Error(`Unsupported op: ${(command as StudioCommand).op}`);
  }
  if (!command.id || !command.target || command.version !== 1) {
    throw new Error("Command must include id, target, and version 1");
  }
}

export function executeCommand(project: StudioProject, command: StudioCommand, record = true): StudioProject {
  validateCommand(command);
  const next = structuredClone(project) as StudioProject;

  switch (command.op) {
    case "create_pixel_asset": {
      const asset = createPixelAsset({
        id: command.params.assetId,
        name: command.params.name,
        width: command.params.width,
        height: command.params.height,
        paletteId: command.params.paletteId,
      });
      next.registry.assets[asset.id] = asset;
      break;
    }
    case "paint_pixel":
      setPixel(findPixelAsset(next, command.target), command.params.layerId, command.params.x, command.params.y, command.params.color ?? "#000000");
      break;
    case "erase_pixel":
      setPixel(findPixelAsset(next, command.target), command.params.layerId, command.params.x, command.params.y, null);
      break;
    case "fill_rect":
      fillRect(findPixelAsset(next, command.target), command.params.layerId, command.params, command.params.color);
      break;
    case "move_selection":
      moveSelection(findPixelAsset(next, command.target), command.params.layerId, command.params, command.params);
      break;
    case "flood_fill":
      floodFill(findPixelAsset(next, command.target), command.params.layerId, command.params.x, command.params.y, command.params.color);
      break;
    case "create_pixel_layer": {
      const asset = findPixelAsset(next, command.target);
      const layer: PixelLayer = {
        id: String(command.params.layerId ?? createId("layer")),
        name: String(command.params.name ?? "Layer"),
        visible: true,
        locked: false,
        pixels: Array.from({ length: asset.width * asset.height }, () => null),
      };
      asset.layers.push(layer);
      asset.activeLayerId = layer.id;
      break;
    }
    case "delete_pixel_layer": {
      const asset = findPixelAsset(next, command.target);
      if (asset.layers.length <= 1) throw new Error("Cannot delete the last layer");
      asset.layers = asset.layers.filter((layer) => layer.id !== command.params.layerId);
      asset.activeLayerId = asset.layers.at(-1)!.id;
      break;
    }
    case "move_pixel_layer": {
      const asset = findPixelAsset(next, command.target);
      const from = asset.layers.findIndex((layer) => layer.id === command.params.layerId);
      const to = Number(command.params.index);
      if (from < 0 || to < 0 || to >= asset.layers.length) throw new Error("Invalid layer move");
      const [layer] = asset.layers.splice(from, 1);
      asset.layers.splice(to, 0, layer);
      break;
    }
    case "rename_pixel_layer": {
      const asset = findPixelAsset(next, command.target);
      const layer = asset.layers.find((item) => item.id === command.params.layerId);
      if (!layer) throw new Error("Unknown layer");
      layer.name = String(command.params.name);
      break;
    }
    case "set_pixel_layer_visibility":
    case "set_pixel_layer_lock": {
      const asset = findPixelAsset(next, command.target);
      const layer = asset.layers.find((item) => item.id === command.params.layerId);
      if (!layer) throw new Error("Unknown layer");
      if (command.op === "set_pixel_layer_visibility") layer.visible = Boolean(command.params.visible);
      if (command.op === "set_pixel_layer_lock") layer.locked = Boolean(command.params.locked);
      break;
    }
    case "import_png": {
      if (command.params.mode === "new_asset") {
        const asset = createPixelAsset({
          id: command.params.assetId ?? createId("asset"),
          name: command.params.name ?? "Imported PNG",
          width: command.params.width,
          height: command.params.height,
          paletteId: command.params.paletteId ?? Object.keys(next.palettes)[0],
        });
        asset.layers[0].name = "Imported PNG";
        asset.layers[0].pixels = command.params.pixels.slice(0, asset.width * asset.height);
        asset.sourcePath = command.params.sourcePath;
        next.registry.assets[asset.id] = asset;
        break;
      }
      const asset = findPixelAsset(next, command.target);
      if (command.params.width !== asset.width || command.params.height !== asset.height) {
        next.warnings.push(`Imported PNG ${command.params.width}x${command.params.height} differs from active asset ${asset.width}x${asset.height}`);
      }
      const pixels = command.params.pixels.slice(0, asset.width * asset.height);
      while (pixels.length < asset.width * asset.height) pixels.push(null);
      const layer: PixelLayer = {
        id: command.params.layerId ?? createId("layer"),
        name: command.params.name ?? "Imported PNG",
        visible: true,
        locked: false,
        pixels,
      };
      asset.layers.push(layer);
      asset.activeLayerId = layer.id;
      asset.sourcePath = command.params.sourcePath;
      break;
    }
    case "export_png":
      break;
  }

  if (record) {
    next.commandHistory.push(command);
    next.redoStack = [];
  }
  return next;
}

export function replayCommands(seed: StudioProject, commands: StudioCommand[]): StudioProject {
  return commands.reduce((project, command) => executeCommand(project, command, false), seed);
}

export function snapshotCommand(project: StudioProject): StudioCommand {
  return {
    id: createId("cmd_snapshot"),
    op: "export_png",
    target: project.id,
    version: 1,
    params: { scale: 1, transparent: true },
  };
}
