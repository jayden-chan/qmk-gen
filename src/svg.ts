import { Config, Key, LabelClass } from "./types";

export function renderSVG(config: Config): string {
  const numLayers = Object.keys(config.layers).length * 2;
  const { wids } = config;

  const width = wids[0].reduce((acc, curr) => acc + curr, 0) * 150 + 50;
  const singleLayerHeight = 150 * (wids.length + 1) + 50;
  const height = singleLayerHeight * numLayers;

  let svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <style>
    .label { font: bold 40px Nimbus Sans; fill: black; }
    .label-lg { font: bold 60px Nimbus Sans; fill: black; }
    .layer { font: bold 100px Nimbus Sans; fill: black; }
  </style>
  `;

  Object.entries(config.layers).forEach(([name, layer], i) => {
    svg += renderLayer(layer.typing, wids, name, i * 2 * singleLayerHeight);
    svg += renderLayer(
      layer.fn,
      wids,
      `${name} (Fn)`,
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
    heightOffset + 120
  }" class="layer">${layerName}</text>`;

  layer.forEach((row, i) => {
    let nextX = 0;
    row.forEach((key, j) => {
      ret += getKey(
        wids[i][j],
        getLabel(key),
        [nextX, i * 150 + 150 + heightOffset],
        key.cn
      );

      nextX += wids[i][j] * 150;
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
  size: number,
  label: string[],
  [x, y]: [number, number],
  className?: LabelClass
): string {
  const bStyle = "stroke:black;stroke-width:5";
  const bSize = 150 * size;
  // prettier-ignore
  const innerSVG = `<rect x="${x + 17.5}" y="${y + 12.5}" rx="10" ry="10" width="${bSize - 35}" height="115" style="fill:#FFF;" />`
  const outerSVG = `<rect x="${x}" y="${y}" rx="20" ry="20" width="${bSize}" height="150" style="fill:#CCC;${bStyle}" />`;

  label = label.map(htmlEscape);

  const label1SVG =
    className === "lg"
      ? `<text x="${x + 25}" y="${y + 75}" class="label-lg">${label[0]}</text>`
      : `<text x="${x + 25}" y="${y + 55}" class="label">${label[0]}</text>`;

  const label2SVG =
    label.length === 2
      ? className === "lg"
        ? `<text x="${x + 25}" y="${y + 110}" class="label-lg">${
            label[1]
          }</text>`
        : `<text x="${x + 25}" y="${y + 110}" class="label">${label[1]}</text>`
      : "";

  return [outerSVG, innerSVG, label1SVG, label2SVG, ""].join("\n");
}

export function htmlEscape(text: string): string {
  return text
    .replace(/&$/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
