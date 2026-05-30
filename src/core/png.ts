import type { Pixel, PixelAsset } from "./types";
import { compositePixels } from "./pixel";

function hexToRgba(pixel: Pixel): [number, number, number, number] {
  if (!pixel) return [0, 0, 0, 0];
  const normalized = pixel.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized.padEnd(6, "0").slice(0, 6);
  const int = Number.parseInt(value, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255, 255];
}

function rgbaToHex(r: number, g: number, b: number, a: number): Pixel {
  if (a === 0) return null;
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function pixelsToImageData(width: number, height: number, pixels: Pixel[], scale = 1): ImageData {
  const output = new ImageData(width * scale, height * scale);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const rgba = hexToRgba(pixels[y * width + x]);
      for (let sy = 0; sy < scale; sy += 1) {
        for (let sx = 0; sx < scale; sx += 1) {
          const outX = x * scale + sx;
          const outY = y * scale + sy;
          const index = (outY * width * scale + outX) * 4;
          output.data[index] = rgba[0];
          output.data[index + 1] = rgba[1];
          output.data[index + 2] = rgba[2];
          output.data[index + 3] = rgba[3];
        }
      }
    }
  }
  return output;
}

export function imageDataToPixels(imageData: ImageData): Pixel[] {
  const pixels: Pixel[] = [];
  for (let index = 0; index < imageData.data.length; index += 4) {
    pixels.push(rgbaToHex(imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]));
  }
  return pixels;
}

function colorDistance(a: string, b: string): number {
  const ar = Number.parseInt(a.slice(1, 3), 16);
  const ag = Number.parseInt(a.slice(3, 5), 16);
  const ab = Number.parseInt(a.slice(5, 7), 16);
  const br = Number.parseInt(b.slice(1, 3), 16);
  const bg = Number.parseInt(b.slice(3, 5), 16);
  const bb = Number.parseInt(b.slice(5, 7), 16);
  return (ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2;
}

export function mapPixelsToPalette(pixels: Pixel[], paletteColors: string[]): Pixel[] {
  return pixels.map((pixel) => {
    if (!pixel) return null;
    return paletteColors.reduce((best, color) => (colorDistance(pixel, color) < colorDistance(pixel, best) ? color : best), paletteColors[0]);
  });
}

export async function exportPixelAssetToPng(asset: PixelAsset, params: { scale: 1 | 2 | 4; layerId?: string }): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = asset.width * params.scale;
  canvas.height = asset.height * params.scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is unavailable");
  context.imageSmoothingEnabled = false;
  context.putImageData(pixelsToImageData(asset.width, asset.height, compositePixels(asset, params.layerId), params.scale), 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))), "image/png");
  });
}

export async function importPngFile(file: File): Promise<{ width: number; height: number; pixels: Pixel[]; sourcePath: string }> {
  const image = new Image();
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("PNG import failed"));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable");
    context.drawImage(image, 0, 0);
    return {
      width: image.width,
      height: image.height,
      pixels: imageDataToPixels(context.getImageData(0, 0, image.width, image.height)),
      sourcePath: file.name,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
