import type { Pixel, PixelAsset, PixelLayer, SelectionRect } from "./types";
import { createId } from "./id";

export function createPixelLayer(name: string, width: number, height: number): PixelLayer {
  return {
    id: createId("layer"),
    name,
    visible: true,
    locked: false,
    pixels: Array.from({ length: width * height }, () => null),
  };
}

export function createPixelAsset(params: {
  id: string;
  name: string;
  width: number;
  height: number;
  paletteId: string;
}): PixelAsset {
  const mainLayer = createPixelLayer("Main Layer", params.width, params.height);
  return {
    id: params.id,
    type: "PixelAsset",
    name: params.name,
    width: params.width,
    height: params.height,
    paletteId: params.paletteId,
    layers: [mainLayer],
    activeLayerId: mainLayer.id,
  };
}

export function pixelIndex(width: number, x: number, y: number): number {
  return y * width + x;
}

export function isInside(asset: Pick<PixelAsset, "width" | "height">, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < asset.width && y < asset.height;
}

export function getLayer(asset: PixelAsset, layerId: string): PixelLayer {
  const layer = asset.layers.find((item) => item.id === layerId);
  if (!layer) {
    throw new Error(`Unknown layer: ${layerId}`);
  }
  return layer;
}

export function setPixel(asset: PixelAsset, layerId: string, x: number, y: number, color: Pixel): void {
  if (!isInside(asset, x, y)) {
    throw new Error(`Pixel ${x},${y} is outside ${asset.width}x${asset.height}`);
  }
  const layer = getLayer(asset, layerId);
  if (layer.locked) {
    throw new Error(`Layer ${layer.name} is locked`);
  }
  layer.pixels[pixelIndex(asset.width, x, y)] = color;
}

export function getPixel(asset: PixelAsset, layerId: string, x: number, y: number): Pixel {
  if (!isInside(asset, x, y)) return null;
  return getLayer(asset, layerId).pixels[pixelIndex(asset.width, x, y)];
}

export function fillRect(asset: PixelAsset, layerId: string, rect: SelectionRect, color: Pixel): void {
  const startX = Math.max(0, rect.x);
  const startY = Math.max(0, rect.y);
  const endX = Math.min(asset.width, rect.x + rect.width);
  const endY = Math.min(asset.height, rect.y + rect.height);

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      setPixel(asset, layerId, x, y, color);
    }
  }
}

export function floodFill(asset: PixelAsset, layerId: string, x: number, y: number, color: Pixel): void {
  if (!isInside(asset, x, y)) return;
  const layer = getLayer(asset, layerId);
  if (layer.locked) {
    throw new Error(`Layer ${layer.name} is locked`);
  }
  const target = getPixel(asset, layerId, x, y);
  if (target === color) return;

  const stack: Array<[number, number]> = [[x, y]];
  const visited = new Set<string>();
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    const key = `${cx},${cy}`;
    if (visited.has(key) || !isInside(asset, cx, cy)) continue;
    visited.add(key);
    if (getPixel(asset, layerId, cx, cy) !== target) continue;
    layer.pixels[pixelIndex(asset.width, cx, cy)] = color;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

export function moveSelection(
  asset: PixelAsset,
  layerId: string,
  rect: SelectionRect,
  delta: { dx: number; dy: number },
): void {
  const layer = getLayer(asset, layerId);
  if (layer.locked) {
    throw new Error(`Layer ${layer.name} is locked`);
  }

  const source: Array<{ x: number; y: number; pixel: Pixel }> = [];
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      if (isInside(asset, x, y)) {
        source.push({ x, y, pixel: layer.pixels[pixelIndex(asset.width, x, y)] });
        layer.pixels[pixelIndex(asset.width, x, y)] = null;
      }
    }
  }

  for (const item of source) {
    const targetX = item.x + delta.dx;
    const targetY = item.y + delta.dy;
    if (isInside(asset, targetX, targetY)) {
      layer.pixels[pixelIndex(asset.width, targetX, targetY)] = item.pixel;
    }
  }
}

export function compositePixels(asset: PixelAsset, layerId?: string): Pixel[] {
  const output: Pixel[] = Array.from({ length: asset.width * asset.height }, () => null);
  const layers = layerId ? asset.layers.filter((layer) => layer.id === layerId) : asset.layers;
  for (const layer of layers) {
    if (!layer.visible) continue;
    layer.pixels.forEach((pixel, index) => {
      if (pixel) output[index] = pixel;
    });
  }
  return output;
}

export function cloneAsset(asset: PixelAsset): PixelAsset {
  return {
    ...asset,
    layers: asset.layers.map((layer) => ({ ...layer, pixels: [...layer.pixels] })),
  };
}
