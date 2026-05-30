import {
  Download,
  Eraser,
  Eye,
  EyeOff,
  FileDown,
  FileUp,
  FolderOpen,
  Grid2X2,
  Hand,
  Layers,
  Lock,
  MousePointer2,
  PaintBucket,
  Pencil,
  Pipette,
  Plus,
  Redo2,
  Save,
  Square,
  Trash2,
  Undo2,
  Unlock,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Pixel, PixelAsset, PixelLayer, StudioCommand, StudioProject, ToolId } from "./core/types";
import { createCommandId, createId } from "./core/id";
import { executeCommand } from "./core/command";
import { createProject, getPixelAsset, listAssetsByType, parseProject, serializeProject } from "./core/project";
import { compositePixels, getPixel } from "./core/pixel";
import { exportPixelAssetToPng, importPngFile, mapPixelsToPalette } from "./core/png";
import "./styles.css";

const tools: Array<{ id: ToolId; label: string; icon: typeof Pencil }> = [
  { id: "pencil", label: "Pencil", icon: Pencil },
  { id: "eraser", label: "Eraser", icon: Eraser },
  { id: "picker", label: "Picker", icon: Pipette },
  { id: "rect-fill", label: "Rect Fill", icon: Square },
  { id: "flood-fill", label: "Flood Fill", icon: PaintBucket },
  { id: "rect-select", label: "Rect Select", icon: MousePointer2 },
  { id: "move-selection", label: "Move Selection", icon: Hand },
];

const zooms = [8, 12, 16, 20, 24, 32];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadText(text: string, filename: string) {
  downloadBlob(new Blob([text], { type: "application/json" }), filename);
}

function makeCommand(base: Omit<StudioCommand, "id" | "version">): StudioCommand {
  return { ...base, id: createCommandId(), version: 1 } as StudioCommand;
}

export default function App() {
  const [project, setProject] = useState<StudioProject>(() => createProject("dot-studio draft"));
  const [activeAssetId, setActiveAssetId] = useState(() => listAssetsByType(project, "PixelAsset")[0].id);
  const [undoStack, setUndoStack] = useState<StudioProject[]>([]);
  const [redoStack, setRedoStack] = useState<StudioProject[]>([]);
  const [tool, setTool] = useState<ToolId>("pencil");
  const [activeColor, setActiveColor] = useState("#1cc7b8");
  const [zoom, setZoom] = useState(16);
  const [showGrid, setShowGrid] = useState(true);
  const [status, setStatus] = useState("Ready");
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [pngImportMode, setPngImportMode] = useState<"new_layer" | "new_asset">("new_layer");
  const [mapImportToPalette, setMapImportToPalette] = useState(false);
  const projectFileRef = useRef<HTMLInputElement>(null);
  const pngFileRef = useRef<HTMLInputElement>(null);

  const asset = getPixelAsset(project, activeAssetId);
  const activeLayer = asset.layers.find((layer) => layer.id === asset.activeLayerId) ?? asset.layers[0];
  const palette = project.palettes[asset.paletteId];
  const pixelAssets = listAssetsByType(project, "PixelAsset") as PixelAsset[];
  const composed = useMemo(() => compositePixels(asset), [asset]);

  function run(command: StudioCommand) {
    try {
      setProject((current) => {
        const next = executeCommand(current, command);
        if (command.op !== "export_png") {
          setUndoStack((items) => [...items.slice(-49), current]);
          setRedoStack([]);
        }
        return next;
      });
      setStatus(`${command.op} recorded`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Command failed");
    }
  }

  function replaceProject(next: StudioProject) {
    const pixelAsset = listAssetsByType(next, "PixelAsset")[0] as PixelAsset | undefined;
    setProject(next);
    setUndoStack([]);
    setRedoStack([]);
    if (pixelAsset) setActiveAssetId(pixelAsset.id);
  }

  function createNewPixelAsset() {
    const assetId = createId("asset");
    run(
      makeCommand({
        op: "create_pixel_asset",
        target: "project",
        params: { assetId, name: `Sprite ${pixelAssets.length + 1}`, width: 32, height: 32, paletteId: asset.paletteId },
      }),
    );
    setActiveAssetId(assetId);
    setSelection(null);
  }

  function undo() {
    setUndoStack((items) => {
      const previous = items.at(-1);
      if (!previous) {
        setStatus("Nothing to undo");
        return items;
      }
      setRedoStack((redoItems) => [...redoItems, project]);
      setProject(previous);
      const pixelAsset = listAssetsByType(previous, "PixelAsset")[0] as PixelAsset | undefined;
      if (pixelAsset) setActiveAssetId(pixelAsset.id);
      setStatus("Undo");
      return items.slice(0, -1);
    });
  }

  function redo() {
    setRedoStack((items) => {
      const next = items.at(-1);
      if (!next) {
        setStatus("Nothing to redo");
        return items;
      }
      setUndoStack((undoItems) => [...undoItems, project]);
      setProject(next);
      const pixelAsset = listAssetsByType(next, "PixelAsset")[0] as PixelAsset | undefined;
      if (pixelAsset) setActiveAssetId(pixelAsset.id);
      setStatus("Redo");
      return items.slice(0, -1);
    });
  }

  function handleCell(x: number, y: number) {
    if (tool === "picker") {
      const sampled = getPixel(asset, activeLayer.id, x, y);
      if (sampled) setActiveColor(sampled);
      setStatus(sampled ? `Picked ${sampled}` : "Transparent pixel");
      return;
    }
    if (tool === "flood-fill") {
      run(makeCommand({ op: "flood_fill", target: asset.id, params: { layerId: activeLayer.id, x, y, color: activeColor } }));
      return;
    }
    if (tool === "pencil" || tool === "eraser") {
      run(
        makeCommand({
          op: tool === "pencil" ? "paint_pixel" : "erase_pixel",
          target: asset.id,
          params: { layerId: activeLayer.id, x, y, color: activeColor },
        }),
      );
    }
  }

  function handleCellPointerUp(x: number, y: number) {
    if (!dragStart) return;
    const rect = {
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(dragStart.x - x) + 1,
      height: Math.abs(dragStart.y - y) + 1,
    };
    if (tool === "rect-fill") {
      run(makeCommand({ op: "fill_rect", target: asset.id, params: { layerId: activeLayer.id, ...rect, color: activeColor } }));
    }
    if (tool === "rect-select") {
      setSelection(rect);
      setStatus(`Selected ${rect.width} x ${rect.height}`);
    }
    if (tool === "move-selection" && selection) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      run(makeCommand({ op: "move_selection", target: asset.id, params: { layerId: activeLayer.id, ...selection, dx, dy } }));
      setSelection({ ...selection, x: selection.x + dx, y: selection.y + dy });
    }
    setDragStart(null);
  }

  function setLayerPatch(layer: PixelLayer, patch: { visible?: boolean; locked?: boolean }) {
    const op = patch.visible === undefined ? "set_pixel_layer_lock" : "set_pixel_layer_visibility";
    run(
      makeCommand({
        op,
        target: asset.id,
        params: { layerId: layer.id, ...patch },
      }),
    );
  }

  async function exportPng(scale: 1 | 2 | 4) {
    const blob = await exportPixelAssetToPng(asset, { scale });
    downloadBlob(blob, `${asset.name.replace(/\s+/g, "-").toLowerCase()}-${scale}x.png`);
    run(makeCommand({ op: "export_png", target: asset.id, params: { scale, transparent: true } }));
  }

  async function exportLayerPng(scale: 1 | 2 | 4) {
    const blob = await exportPixelAssetToPng(asset, { scale, layerId: activeLayer.id });
    downloadBlob(blob, `${asset.name.replace(/\s+/g, "-").toLowerCase()}-${activeLayer.name.toLowerCase()}-${scale}x.png`);
    run(makeCommand({ op: "export_png", target: asset.id, params: { layerId: activeLayer.id, scale, transparent: true } }));
  }

  async function importPng(file: File) {
    const data = await importPngFile(file);
    const pixels = mapImportToPalette ? mapPixelsToPalette(data.pixels, palette.colors.map((color) => color.value)) : data.pixels;
    const importedAssetId = pngImportMode === "new_asset" ? createId("asset") : undefined;
    run(
      makeCommand({
        op: "import_png",
        target: pngImportMode === "new_asset" ? "project" : asset.id,
        params: {
          mode: pngImportMode,
          assetId: importedAssetId,
          paletteId: asset.paletteId,
          layerId: createId("layer"),
          name: file.name.replace(/\.png$/i, ""),
          width: data.width,
          height: data.height,
          pixels,
          sourcePath: data.sourcePath,
        },
      }),
    );
    if (importedAssetId) setActiveAssetId(importedAssetId);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Grid2X2 size={18} />
          <span>dot-studio</span>
        </div>
        <div className="toolbar">
          <select value={activeAssetId} onChange={(event) => { setActiveAssetId(event.target.value); setSelection(null); }}>
            {pixelAssets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <button title="New PixelAsset" onClick={createNewPixelAsset}><Plus size={16} /></button>
          <button title="New Project" onClick={() => replaceProject(createProject("dot-studio draft"))}><FileDown size={16} /></button>
          <button title="Save Project" onClick={() => downloadText(serializeProject(project), "dot-studio.project.json")}><Save size={16} /></button>
          <button title="Load Project" onClick={() => projectFileRef.current?.click()}><FolderOpen size={16} /></button>
          <button title="Import PNG as Layer" onClick={() => { setPngImportMode("new_layer"); pngFileRef.current?.click(); }}><FileUp size={16} /></button>
          <button title="Import PNG as Asset" onClick={() => { setPngImportMode("new_asset"); pngFileRef.current?.click(); }}><Plus size={16} /></button>
          <button title="Export PNG 1x" onClick={() => void exportPng(1)}><FileDown size={16} /></button>
          <button title="Undo" onClick={undo}><Undo2 size={16} /></button>
          <button title="Redo" onClick={redo}><Redo2 size={16} /></button>
        </div>
        <div className="zoom-strip">
          <button title="Toggle Grid" className={showGrid ? "is-active" : ""} onClick={() => setShowGrid((value) => !value)}><Grid2X2 size={16} /></button>
          <select value={zoom} onChange={(event) => setZoom(Number(event.target.value))}>
            {zooms.map((value) => <option key={value} value={value}>{value}x</option>)}
          </select>
        </div>
        <input
          ref={projectFileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            replaceProject(parseProject(await file.text()));
          }}
        />
        <input
          ref={pngFileRef}
          type="file"
          accept="image/png"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void importPng(file);
          }}
        />
      </header>

      <section className="workspace">
        <aside className="tool-rail">
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} title={item.label} className={tool === item.id ? "is-active" : ""} onClick={() => setTool(item.id)}>
                <Icon size={18} />
              </button>
            );
          })}
        </aside>

        <section className="stage">
          <div className="stage-header">
            <strong>{asset.name}</strong>
            <span>{asset.width} x {asset.height}</span>
            <span>{hover ? `x:${hover.x} y:${hover.y}` : "x:- y:-"}</span>
          </div>
          <div className="canvas-wrap">
            <div
              className={`pixel-canvas ${showGrid ? "with-grid" : ""}`}
              style={{
                gridTemplateColumns: `repeat(${asset.width}, ${zoom}px)`,
                gridTemplateRows: `repeat(${asset.height}, ${zoom}px)`,
              }}
            >
              {composed.map((pixel: Pixel, index: number) => {
                const x = index % asset.width;
                const y = Math.floor(index / asset.width);
                return (
                  <button
                    key={index}
                    className="pixel"
                    style={{ width: zoom, height: zoom, backgroundColor: pixel ?? "transparent" }}
                    onMouseEnter={() => setHover({ x, y })}
                    onPointerDown={() => {
                      if (tool === "rect-fill" || tool === "rect-select" || tool === "move-selection") setDragStart({ x, y });
                      else handleCell(x, y);
                    }}
                    onPointerUp={() => handleCellPointerUp(x, y)}
                    aria-label={`Pixel ${x}, ${y}`}
                    data-selected={selection && x >= selection.x && y >= selection.y && x < selection.x + selection.width && y < selection.y + selection.height ? "true" : undefined}
                  />
                );
              })}
            </div>
          </div>
          <div className="statusbar">
            <span>{status}</span>
            <span>{activeLayer.name} / {tool}</span>
          </div>
        </section>

        <aside className="side-panel">
          <section className="panel-block">
            <h2><Layers size={16} /> Layers</h2>
            <button className="wide-action" onClick={() => run(makeCommand({ op: "create_pixel_layer", target: asset.id, params: { layerId: createId("layer"), name: `Layer ${asset.layers.length + 1}` } }))}>
              <Plus size={15} /> Add Layer
            </button>
            <div className="layer-list">
              {[...asset.layers].reverse().map((layer) => (
                <button key={layer.id} className={`layer-row ${asset.activeLayerId === layer.id ? "is-active" : ""}`} onClick={() => {
                  const next = structuredClone(project) as StudioProject;
                  getPixelAsset(next, asset.id).activeLayerId = layer.id;
                  setProject(next);
                }}>
                  <span>{layer.name}</span>
                  <span className="layer-actions">
                    <i onClick={(event) => { event.stopPropagation(); setLayerPatch(layer, { visible: !layer.visible }); }}>{layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}</i>
                    <i onClick={(event) => { event.stopPropagation(); setLayerPatch(layer, { locked: !layer.locked }); }}>{layer.locked ? <Lock size={14} /> : <Unlock size={14} />}</i>
                  </span>
                </button>
              ))}
            </div>
            <div className="segmented">
              <button onClick={() => {
                const index = asset.layers.findIndex((layer) => layer.id === activeLayer.id);
                if (index > 0) run(makeCommand({ op: "move_pixel_layer", target: asset.id, params: { layerId: activeLayer.id, index: index - 1 } }));
              }}>Up</button>
              <button onClick={() => {
                const index = asset.layers.findIndex((layer) => layer.id === activeLayer.id);
                if (index < asset.layers.length - 1) run(makeCommand({ op: "move_pixel_layer", target: asset.id, params: { layerId: activeLayer.id, index: index + 1 } }));
              }}>Down</button>
              <button onClick={() => {
                const name = window.prompt("Layer name", activeLayer.name);
                if (name) run(makeCommand({ op: "rename_pixel_layer", target: asset.id, params: { layerId: activeLayer.id, name } }));
              }}>Rename</button>
            </div>
          </section>

          <section className="panel-block">
            <h2>Palette</h2>
            <div className="palette-grid">
              {palette.colors.map((color) => (
                <button
                  key={color.id}
                  title={color.name}
                  className={activeColor === color.value ? "is-active" : ""}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setActiveColor(color.value)}
                />
              ))}
              <input value={activeColor} type="color" onChange={(event) => setActiveColor(event.target.value)} />
            </div>
          </section>

          <section className="panel-block">
            <h2><Download size={16} /> Export</h2>
            <label className="check-row">
              <input type="checkbox" checked={mapImportToPalette} onChange={(event) => setMapImportToPalette(event.target.checked)} />
              Map imports to palette
            </label>
            <div className="segmented">
              <button onClick={() => void exportPng(1)}>1x</button>
              <button onClick={() => void exportPng(2)}>2x</button>
              <button onClick={() => void exportPng(4)}>4x</button>
            </div>
            <div className="segmented">
              <button onClick={() => void exportLayerPng(1)}>Layer 1x</button>
              <button onClick={() => void exportLayerPng(2)}>Layer 2x</button>
              <button onClick={() => void exportLayerPng(4)}>Layer 4x</button>
            </div>
            <button className="wide-action danger" onClick={() => run(makeCommand({ op: "delete_pixel_layer", target: asset.id, params: { layerId: activeLayer.id } }))}>
              <Trash2 size={15} /> Delete Layer
            </button>
          </section>

          <section className="panel-block command-log">
            <h2>Command Log</h2>
            <pre>{project.commandHistory.slice(-8).map((command) => JSON.stringify({ op: command.op, target: command.target, params: command.params })).join("\n")}</pre>
          </section>
        </aside>
      </section>
    </main>
  );
}
