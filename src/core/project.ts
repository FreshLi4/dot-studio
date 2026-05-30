import type { ExportPreset, Palette, PixelAsset, StudioAsset, StudioProject } from "./types";
import { createId } from "./id";
import { createPixelAsset } from "./pixel";

export const PROJECT_FILE_VERSION = 1;

export function createDefaultPalette(): Palette {
  return {
    id: "pal_default",
    name: "Workbench Palette",
    colors: [
      { id: "ink", name: "Ink", value: "#101820" },
      { id: "paper", name: "Paper", value: "#f6f0dc" },
      { id: "teal", name: "Signal Teal", value: "#1cc7b8" },
      { id: "amber", name: "Amber", value: "#f5a524" },
      { id: "rose", name: "Rose", value: "#d94b66" },
      { id: "violet", name: "Violet", value: "#7b61ff" },
      { id: "sky", name: "Sky", value: "#4aa3ff" },
      { id: "shadow", name: "Shadow", value: "#334155" },
    ],
  };
}

export function createExportPreset(targetAssetId: string): ExportPreset {
  return {
    id: createId("preset"),
    type: "ExportPreset",
    name: "PNG 1x transparent",
    targetAssetId,
    format: "png",
    outputPath: "exports/pixel.png",
    scale: 1,
    transparent: true,
    padding: 0,
  };
}

export function createProject(name = "Untitled Project"): StudioProject {
  const palette = createDefaultPalette();
  const asset = createPixelAsset({
    id: createId("asset"),
    name: "Sprite Draft",
    width: 32,
    height: 32,
    paletteId: palette.id,
  });
  const preset = createExportPreset(asset.id);

  return {
    version: PROJECT_FILE_VERSION,
    id: createId("project"),
    name,
    palettes: { [palette.id]: palette },
    registry: { assets: { [asset.id]: asset, [preset.id]: preset } },
    commandHistory: [],
    redoStack: [],
    exportPresets: { [preset.id]: preset },
    warnings: [],
  };
}

export function getAsset(project: StudioProject, assetId: string): StudioAsset {
  const asset = project.registry.assets[assetId];
  if (!asset) {
    throw new Error(`Unknown asset: ${assetId}`);
  }
  return asset;
}

export function getPixelAsset(project: StudioProject, assetId: string): PixelAsset {
  const asset = getAsset(project, assetId);
  if (asset.type !== "PixelAsset") {
    throw new Error(`Expected PixelAsset, got ${asset.type}`);
  }
  return asset;
}

export function listAssetsByType(project: StudioProject, type?: StudioAsset["type"]): StudioAsset[] {
  return Object.values(project.registry.assets).filter((asset) => !type || asset.type === type);
}

export function findAssetReferences(project: StudioProject, assetId: string): string[] {
  const references: string[] = [];
  for (const asset of Object.values(project.registry.assets)) {
    if (asset.type === "ExportPreset" && asset.targetAssetId === assetId) {
      references.push(asset.id);
    }
    if (asset.type === "SceneAsset") {
      for (const instance of asset.instances) {
        if (instance.assetId === assetId) references.push(asset.id);
      }
    }
  }
  return references;
}

export function serializeProject(project: StudioProject): string {
  return JSON.stringify(project, null, 2);
}

export function parseProject(source: string): StudioProject {
  const parsed = JSON.parse(source) as Partial<StudioProject>;
  if (parsed.version !== PROJECT_FILE_VERSION) {
    throw new Error(`Unsupported project version: ${String(parsed.version)}`);
  }
  if (!parsed.registry || !parsed.palettes || !parsed.commandHistory) {
    throw new Error("Project file is missing required sections");
  }
  return parsed as StudioProject;
}
