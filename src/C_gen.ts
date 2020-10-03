import { Config, Key } from "./types";

export function genCCode(config: Config): string {
  return `/* clang-format off */
#include QMK_KEYBOARD_H

${genLayerNumDefines(config)}
${genCustomKeyCodes(config)}

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

\t/* Typing Layers */
\t${Object.entries(config.layers)
    .map(([name, l]) => genLayerCode(l.typing, name))
    .join(",\n\n\t")},

\t/* Function Layers */
\t${Object.entries(config.layers)
    .map(([name, l]) => genLayerCode(l.fn, `${name}_FN`))
    .join(",\n\n\t")}
};

#define QQ_DELAY 6
uint16_t q_timer;
bool q_triggered = false;

bool process_record_user(uint16_t keycode, keyrecord_t *record) {
\tswitch (keycode) {
${genStringKeys(config).trimEnd()}
\tcase CU_QQ:
\t\tif (record->event.pressed) {
\t\t\tq_timer = timer_read();
\t\t\tq_triggered = true;
\t\t\tSEND_STRING("3");
\t\t} else if (q_triggered) {
\t\t\twhile (timer_elapsed(q_timer) < QQ_DELAY);
\t\t\tq_triggered = false;
\t\t\tSEND_STRING("q");
\t\t}
\t\tbreak;
\t}
\treturn true;
}`;
}

function genLayerNumDefines(conf: Config): string {
  const numLayers = Object.keys(conf.layers).length;
  return Object.keys(conf.layers).reduce(
    (prev: string, curr: string, idx: number) => {
      const layerUppercase = curr.toUpperCase();
      return `${prev}#define LYR_${layerUppercase} ${idx}\n#define LYR_${layerUppercase}_FN ${
        idx + numLayers
      }\n`;
    },
    ""
  );
}

function genCustomKeyCodes(conf: Config): string {
  const customCodes = [
    ...Object.values(conf.layers).reduce((acc, curr) => {
      const checkRow = (row: Key[]) =>
        row
          .filter((key) => key.code.startsWith("CU"))
          .map((key) => key.code)
          .forEach((code) => acc.add(code));
      curr.typing.forEach(checkRow);
      curr.fn.forEach(checkRow);
      return acc;
    }, new Set()),
  ];

  return `enum custom_keycodes {\n\t${
    customCodes[0]
  } = SAFE_RANGE,\n${customCodes
    .slice(1)
    .map((c) => `\t${c}`)
    .join(",\n")}\n};`;
}

function genStringKeys(conf: Config): string {
  let ret = "";
  const checkRow = (row: Key[]) =>
    row.forEach((key) => {
      if (key.str) {
        ret += `\tcase ${key.code}:\n\t\tif (record->event.pressed) {\n\t\t\tSEND_STRING("${key.str}");\n\t\t}\n\t\tbreak;\n`;
      }
    });
  Object.values(conf.layers).forEach((layer) => {
    layer.typing.forEach(checkRow);
    layer.fn.forEach(checkRow);
  });

  return ret;
}

function genRowCode(row: Key[]): string {
  return row.map((key) => key.code).join(", ");
}

function genLayerCode(layer: Key[][], layerName: string): string {
  return `[LYR_${layerName.toUpperCase()}] = LAYOUT_60_ansi(\n\t\t${layer
    .map(genRowCode)
    .join(", \\\n\t\t")})`;
}
