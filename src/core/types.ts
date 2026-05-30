export type AssetType =
  | "PixelAsset"
  | "VoxelAsset"
  | "SceneAsset"
  | "Animation2D"
  | "Animation3D"
  | "RenderScene"
  | "MaterialAsset"
  | "ExportPreset";

export type Pixel = string | null;

export type ToolId =
  | "pencil"
  | "eraser"
  | "picker"
  | "rect-fill"
  | "flood-fill"
  | "rect-select"
  | "move-selection";

export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  materialId?: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: PaletteColor[];
}

export interface PixelLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  pixels: Pixel[];
}

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AssetBase {
  id: string;
  type: AssetType;
  name: string;
  sourcePath?: string;
  missingResourceWarning?: string;
}

export interface PixelAsset extends AssetBase {
  type: "PixelAsset";
  width: number;
  height: number;
  paletteId: string;
  layers: PixelLayer[];
  activeLayerId: string;
}

export interface VoxelCell {
  occupied: boolean;
  color?: string;
  faces?: Partial<Record<"px" | "nx" | "py" | "ny" | "pz" | "nz", string>>;
}

export interface VoxelAsset extends AssetBase {
  type: "VoxelAsset";
  width: number;
  depth: number;
  height: number;
  paletteId: string;
  voxels: Record<string, VoxelCell>;
}

export interface SceneAsset extends AssetBase {
  type: "SceneAsset";
  instances: Array<{
    id: string;
    assetId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    pivot: [number, number, number];
  }>;
}

export interface ExportPreset extends AssetBase {
  type: "ExportPreset";
  targetAssetId: string;
  format: "png" | "vox" | "glb" | "sprite";
  outputPath: string;
  scale: 1 | 2 | 4;
  transparent: boolean;
  padding: number;
}

export type StudioAsset = PixelAsset | VoxelAsset | SceneAsset | ExportPreset;

export interface AssetRegistry {
  assets: Record<string, StudioAsset>;
}

export interface StudioProject {
  version: 1;
  id: string;
  name: string;
  palettes: Record<string, Palette>;
  registry: AssetRegistry;
  commandHistory: StudioCommand[];
  redoStack: StudioCommand[];
  exportPresets: Record<string, ExportPreset>;
  warnings: string[];
}

export type StudioCommand =
  | {
      id: string;
      op: "create_pixel_asset";
      target: "project";
      version: 1;
      params: {
        assetId: string;
        name: string;
        width: number;
        height: number;
        paletteId: string;
      };
    }
  | {
      id: string;
      op: "paint_pixel" | "erase_pixel";
      target: string;
      version: 1;
      params: { layerId: string; x: number; y: number; color?: string };
    }
  | {
      id: string;
      op: "fill_rect";
      target: string;
      version: 1;
      params: { layerId: string; x: number; y: number; width: number; height: number; color: string };
    }
  | {
      id: string;
      op: "move_selection";
      target: string;
      version: 1;
      params: { layerId: string; x: number; y: number; width: number; height: number; dx: number; dy: number };
    }
  | {
      id: string;
      op: "flood_fill";
      target: string;
      version: 1;
      params: { layerId: string; x: number; y: number; color: string };
    }
  | {
      id: string;
      op:
        | "create_pixel_layer"
        | "delete_pixel_layer"
        | "move_pixel_layer"
        | "rename_pixel_layer"
        | "set_pixel_layer_visibility"
        | "set_pixel_layer_lock";
      target: string;
      version: 1;
      params: Record<string, unknown>;
    }
  | {
      id: string;
      op: "import_png";
      target: string;
      version: 1;
      params: {
        layerId?: string;
        assetId?: string;
        paletteId?: string;
        name?: string;
        width: number;
        height: number;
        pixels: Pixel[];
        mode: "new_asset" | "new_layer";
        sourcePath?: string;
      };
    }
  | {
      id: string;
      op: "export_png";
      target: string;
      version: 1;
      params: { layerId?: string; scale: 1 | 2 | 4; transparent: boolean };
    };
