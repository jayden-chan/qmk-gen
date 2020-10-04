import { Config, Key, LabelClass } from "./types";

const BASE_KEY_SIZE = 150;
const MARGIN = 3;

export function renderSVG(config: Config): string {
  const numLayers = Object.keys(config.layers).length * 2;
  const { wids } = config;

  const width =
    wids[0].reduce((acc, curr) => acc + curr, 0) * BASE_KEY_SIZE + 2 * MARGIN;
  const singleLayerHeight = BASE_KEY_SIZE * (wids.length + 1) + 2 * MARGIN;
  const height = singleLayerHeight * numLayers;

  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<style>
  .label { font: bold 40px Nimbus Sans; fill: white; }
  .label-lg { font: bold 60px Nimbus Sans; fill: white; }
  .layer { font: bold 100px Nimbus Sans; fill: black; }
  .outer-key { fill: #000; stroke: white; stroke-width: 3 }
  .inner-key { fill: #333; }
</style>
`;

  Object.entries(config.layers).forEach(([name, layer], i) => {
    svg += renderLayer(layer.typing, wids, name, i * 2 * singleLayerHeight);
    svg += renderLayer(
      layer.fn,
      wids,
      `${name} (Fn Layer)`,
      (i * 2 + 1) * singleLayerHeight
    );
  });

  svg += "</svg>";

  return svg;
}

export function renderLayer(
  layer: Key[][],
  wids: number[][],
  layerName: string,
  heightOffset: number
): string {
  let ret = `<text x="10" y="${
    heightOffset + 110
  }" class="layer">${layerName}</text>\n`;

  layer.forEach((row, i) => {
    let nextX = MARGIN;
    row.forEach((key, j) => {
      ret += getKey(
        wids[i][j],
        getLabel(key),
        [nextX, i * BASE_KEY_SIZE + BASE_KEY_SIZE + heightOffset],
        key.cn
      );

      nextX += wids[i][j] * BASE_KEY_SIZE;
    });
  });

  return ret;
}

function getLabel(key: Key): string[] {
  return (
    key.label ?? [
      key.code.replace("KC_", "").charAt(0).toUpperCase() +
        key.code.replace("KC_", "").slice(1).toLowerCase(),
    ]
  );
}

function getKey(
  units: number,
  label: string[],
  [x, y]: [number, number],
  className?: LabelClass
): string {
  const width = BASE_KEY_SIZE * units;
  // prettier-ignore
  const innerSVG = `<rect x="${x + 20}" y="${y + 12.5}" rx="10" ry="10" width="${width - 40}" height="110" class="inner-key" />`
  const outerSVG = `<rect x="${x}" y="${y}" rx="20" ry="20" width="${width}" height="${BASE_KEY_SIZE}" class="outer-key" />`;

  label = label.map(htmlEscape);

  const label1SVG =
    label.length > 0 && label[0].length > 0
      ? className === "lg"
        ? `<text x="${x + 25}" y="${y + 75}" class="label-lg">${
            label[0]
          }</text>`
        : `<text x="${x + 25}" y="${y + 55}" class="label">${label[0]}</text>`
      : "";

  const label2SVG =
    label.length > 1 && label[1].length > 0
      ? className === "lg"
        ? `<text x="${x + 25}" y="${y + 110}" class="label-lg">${
            label[1]
          }</text>`
        : `<text x="${x + 25}" y="${y + 110}" class="label">${label[1]}</text>`
      : "";

  return [outerSVG, innerSVG, label1SVG, label2SVG]
    .filter((l) => l.length > 0)
    .map((l) => l + "\n")
    .join("");
}

export function htmlEscape(text: string): string {
  return text
    .replace(/&$/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
