import { describe, expect, it } from "vitest";
import { executeCommand, replayCommands } from "../src/core/command";
import { createProject, getPixelAsset } from "../src/core/project";
import type { StudioCommand } from "../src/core/types";

function command(command: Omit<StudioCommand, "id" | "version">): StudioCommand {
  return { ...command, id: `cmd_${Math.random()}`, version: 1 } as StudioCommand;
}

describe("pixel commands", () => {
  it("paints and erases pixels through commands", () => {
    const project = createProject();
    const asset = getPixelAsset(project, Object.values(project.registry.assets).find((item) => item.type === "PixelAsset")!.id);
    const layerId = asset.activeLayerId;

    const painted = executeCommand(
      project,
      command({ op: "paint_pixel", target: asset.id, params: { layerId, x: 2, y: 3, color: "#1cc7b8" } }),
    );
    expect(getPixelAsset(painted, asset.id).layers[0].pixels[3 * 32 + 2]).toBe("#1cc7b8");

    const erased = executeCommand(
      painted,
      command({ op: "erase_pixel", target: asset.id, params: { layerId, x: 2, y: 3 } }),
    );
    expect(getPixelAsset(erased, asset.id).layers[0].pixels[3 * 32 + 2]).toBeNull();
  });

  it("replays command lists into the same state", () => {
    const seed = createProject();
    const asset = getPixelAsset(seed, Object.values(seed.registry.assets).find((item) => item.type === "PixelAsset")!.id);
    const layerId = asset.activeLayerId;
    const commands = [
      command({ op: "fill_rect", target: asset.id, params: { layerId, x: 0, y: 0, width: 2, height: 2, color: "#f5a524" } }),
      command({ op: "paint_pixel", target: asset.id, params: { layerId, x: 3, y: 3, color: "#d94b66" } }),
    ];

    const direct = commands.reduce((project, item) => executeCommand(project, item), seed);
    const replayed = replayCommands(seed, commands);
    expect(getPixelAsset(replayed, asset.id).layers[0].pixels).toEqual(getPixelAsset(direct, asset.id).layers[0].pixels);
  });

  it("moves a selected pixel region through a command", () => {
    const project = createProject();
    const asset = getPixelAsset(project, Object.values(project.registry.assets).find((item) => item.type === "PixelAsset")!.id);
    const layerId = asset.activeLayerId;
    const painted = executeCommand(
      project,
      command({ op: "paint_pixel", target: asset.id, params: { layerId, x: 1, y: 1, color: "#1cc7b8" } }),
    );
    const moved = executeCommand(
      painted,
      command({ op: "move_selection", target: asset.id, params: { layerId, x: 1, y: 1, width: 1, height: 1, dx: 2, dy: 3 } }),
    );

    expect(getPixelAsset(moved, asset.id).layers[0].pixels[1 * 32 + 1]).toBeNull();
    expect(getPixelAsset(moved, asset.id).layers[0].pixels[4 * 32 + 3]).toBe("#1cc7b8");
  });

  it("imports PNG pixel data as a new PixelAsset command", () => {
    const project = createProject();
    const imported = executeCommand(
      project,
      command({
        op: "import_png",
        target: "project",
        params: {
          mode: "new_asset",
          assetId: "asset_imported",
          paletteId: "pal_default",
          name: "Imported",
          width: 2,
          height: 2,
          pixels: ["#000000", null, "#ffffff", "#1cc7b8"],
        },
      }),
    );

    expect(getPixelAsset(imported, "asset_imported").width).toBe(2);
    expect(getPixelAsset(imported, "asset_imported").layers[0].pixels).toEqual(["#000000", null, "#ffffff", "#1cc7b8"]);
  });
});
