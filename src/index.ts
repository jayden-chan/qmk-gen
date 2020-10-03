export type Key = {
  code: string;
  label?: string[];
};

type KeyFunc = (l: string) => Key;

type DZ60 = {
  layers: {
    [key: string]: {
      typing: Key[][];
      fn: Key[][];
    };
  };
  lens: number[];
};

const DZ60_lens = [14, 14, 13, 12, 8];

function main() {
  const myConfig: DZ60 = {
    layers: {
      Default: {
        typing: [
          // prettier-ignore
          [Tilde, K_1, K_2, K_3, K_4, K_5, K_6, K_7, K_8, K_9, K_0, Minus, Equals, Backspace],
          // prettier-ignore
          [Tab, Q, W, E, R, T, Y, U, I, O, P, LBracket, RBracket, Backslash],
          // prettier-ignore
          [Esc, A, S, D, F, G, H, J, K, L, Semicolon, Quote, Enter],
          // prettier-ignore
          [LShift, Z, X, C, V, B, N, M, Comma, Period, Slash, Up],
          // prettier-ignore
          [LCtrl, Super, Alt, Space, Fn("Default"), Left, Down, Right],
        ],
        fn: [
          [F13, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, Delete],
          // prettier-ignore
          [Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, MPP, MPrev, MNext, Reset],
          // prettier-ignore
          [Caps, Tns, Tns, Tns, Tns, Tns, Tns, BrUp, VolUp, PgUp, Home, End, Layer("CSGO")],
          // prettier-ignore
          [LShift, Tns, Tns, Tns, Tns, Tns, Tns, BrDn, VolDn, PgDn, Print, RShift],
          // prettier-ignore
          [Tns, Tns, Tns, MPP, Tns, F14, F15, RCtrl],
        ],
      },
      CSGO: {
        typing: [
          // prettier-ignore
          [Tilde, K_1, K_2, K_3, K_4, K_5, K_6, K_7, K_8, K_9, K_0, Minus, Equals, Backspace],
          // prettier-ignore
          [Tab, Q, W, E, R, T, Y, U, I, O, P, LBracket, RBracket, Backslash],
          // prettier-ignore
          [Esc, A, S, D, F, G, H, J, K, L, Semicolon, Quote, Enter],
          // prettier-ignore
          [LShift, Z, X, C, V, B, N, M, Comma, Period, Slash, Up],
          // prettier-ignore
          [LCtrl, Super, Alt, Space, Fn("Default"), Left, Down, Right],
        ],
        fn: [
          [F13, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, Delete],
          // prettier-ignore
          [Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, MPP, MPrev, MNext, Reset],
          // prettier-ignore
          [Caps, Tns, Tns, Tns, Tns, Tns, Tns, BrUp, VolUp, PgUp, Home, End, Layer("CSGO")],
          // prettier-ignore
          [LShift, Tns, Tns, Tns, Tns, Tns, Tns, BrDn, VolDn, PgDn, Print, RShift],
          // prettier-ignore
          [Tns, Tns, Tns, MPP, Tns, F14, F15, RCtrl],
        ],
      },
    },
    lens: DZ60_lens,
  };

  const errors = verifyConfig(myConfig);
  if (errors.length !== 0) {
    console.error("ERROR: Failed to verify config");
    console.error(
      `\nFound ${errors.length} error${errors.length === 1 ? "" : "s"}:`
    );
    errors.forEach((error, idx) => {
      console.error(`\t${idx + 1}: ${error}`);
    });
    return;
  }

  const code = `#include QMK_KEYBOARD_H

${genLayerNumDefines(myConfig)}
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

\t/* Typing Layers */
\t${Object.values(myConfig.layers)
    .map((l) => genLayerCode(l.typing))
    .join(",\n\n\t")},

\t/* Function Layers */
\t${Object.values(myConfig.layers)
    .map((l) => genLayerCode(l.fn))
    .join(",\n\n\t")}
};`;

  console.log(code);
}

function genLayerNumDefines(conf: DZ60): string {
  const numLayers = Object.keys(conf.layers).length;
  return Object.keys(conf.layers).reduce(
    (prev: string, curr: string, idx: number) => {
      const layerUppercase = curr.toUpperCase();
      return `${prev}#define ${layerUppercase} ${idx}\n#define ${layerUppercase}_FN ${
        idx + numLayers
      }\n`;
    },
    ""
  );
}

function genRowCode(row: Key[]): string {
  return row.map((key) => key.code).join(", ");
}

function genLayerCode(layer: Key[][]): string {
  return `LAYOUT_60_ansi(\n\t\t${layer.map(genRowCode).join(",\n\t\t")})`;
}

function verifyConfig(conf: DZ60): string[] {
  const errors: string[] = [];
  Object.entries(conf.layers).forEach(([key, layer], idx) => {
    if (layer.typing.length !== conf.lens.length) {
      errors.push(
        `Layer ${idx + 1} doesn't have the correct number of rows (${
          layer.typing.length
        } actual, ${conf.lens.length} expected)`
      );
    }

    if (layer.fn.length !== conf.lens.length) {
      errors.push(
        `Layer ${idx + 1} doesn't have the correct number of rows (${
          layer.fn.length
        } actual, ${conf.lens.length} expected)`
      );
    }

    for (let i = 0; i < Math.min(layer.typing.length, conf.lens.length); i++) {
      if (layer.typing[i].length !== conf.lens[i]) {
        errors.push(
          `Row ${
            i + 1
          } of layer "${key}/typing" doesn't have the right number of keys (${
            layer.typing[i].length
          } actual, ${conf.lens[i]} expected)`
        );
      }
    }

    for (let i = 0; i < Math.min(layer.fn.length, conf.lens.length); i++) {
      if (layer.fn[i].length !== conf.lens[i]) {
        errors.push(
          `Row ${
            i + 1
          } of layer "${key}/fn" doesn't have the right number of keys (${
            layer.fn[i].length
          } actual, ${conf.lens[i]} expected)`
        );
      }
    }
  });

  return errors;
}

/*
#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

LAYOUT_60_ansi(
KC_GESC, KC_1,    KC_2,    KC_3,    KC_4,    KC_5,    KC_6,    KC_7,    KC_8,    KC_9,    KC_0,    KC_MINS, KC_EQL,           KC_BSPC,
KC_TAB,           KC_Q,    KC_W,    KC_E,    KC_R,    KC_T,    KC_Y,    KC_U,    KC_I,    KC_O,    KC_P,    KC_LBRC, KC_RBRC, KC_BSLS,
KC_CAPS,          KC_A,    KC_S,    KC_D,    KC_F,    KC_G,    KC_H,    KC_J,    KC_K,    KC_L,    KC_SCLN, KC_QUOT, KC_ENT,
KC_LSFT,          KC_Z,    KC_X,    KC_C,    KC_V,    KC_B,    KC_N,    KC_M,    KC_COMM, KC_DOT,  KC_SLSH,          KC_RSFT,
KC_LCTL, KC_LGUI,          KC_LALT,                   KC_SPC,                             KC_RALT, KC_RGUI,          MO(1),   KC_RCTL),

LAYOUT_60_ansi(
KC_GRV,  KC_F1,   KC_F2,   KC_F3,   KC_F4,   KC_F5,   KC_F6,   KC_F7,   KC_F8,   KC_F9,   KC_F10,  KC_F11,  KC_F12,           KC_DEL,
KC_TRNS,          RGB_TOG, RGB_MOD, RGB_HUI, RGB_HUD, RGB_SAI, RGB_SAD, RGB_VAI, RGB_VAD, KC_TRNS, KC_PSCR, KC_SLCK, KC_PAUS, RESET,
KC_TRNS,          KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS, KC_INS,  KC_HOME, KC_PGUP, KC_TRNS,
KC_TRNS,          KC_TRNS, KC_TRNS, BL_DEC,  BL_TOGG, BL_INC,  BL_STEP, KC_TRNS, KC_DEL,  KC_END,  KC_PGDN,          KC_TRNS,
KC_TRNS, KC_TRNS,          KC_TRNS,                   KC_TRNS,                            KC_TRNS, KC_TRNS,          KC_TRNS, KC_TRNS)
};

 */

const Esc = { code: "KC_ESC" };
const A = { code: "KC_A" };
const B = { code: "KC_B" };
const C = { code: "KC_C" };
const D = { code: "KC_D" };
const E = { code: "KC_E" };
const F = { code: "KC_F" };
const G = { code: "KC_G" };
const H = { code: "KC_H" };
const I = { code: "KC_I" };
const J = { code: "KC_J" };
const K = { code: "KC_K" };
const L = { code: "KC_L" };
const M = { code: "KC_M" };
const N = { code: "KC_N" };
const O = { code: "KC_O" };
const P = { code: "KC_P" };
const Q = { code: "KC_Q" };
const R = { code: "KC_R" };
const S = { code: "KC_S" };
const T = { code: "KC_T" };
const U = { code: "KC_U" };
const V = { code: "KC_V" };
const W = { code: "KC_W" };
const X = { code: "KC_X" };
const Y = { code: "KC_Y" };
const Z = { code: "KC_Z" };
const K_0 = { code: "KC_0", label: ["0", ")"] };
const K_1 = { code: "KC_1", label: ["1", "!"] };
const K_2 = { code: "KC_2", label: ["2", "@"] };
const K_3 = { code: "KC_3", label: ["3", "#"] };
const K_4 = { code: "KC_4", label: ["4", "$"] };
const K_5 = { code: "KC_5", label: ["5", "%"] };
const K_6 = { code: "KC_6", label: ["6", "^"] };
const K_7 = { code: "KC_7", label: ["7", "&"] };
const K_8 = { code: "KC_8", label: ["8", "*"] };
const K_9 = { code: "KC_9", label: ["9", "("] };
const F1 = { code: "KC_F1" };
const F2 = { code: "KC_F2" };
const F3 = { code: "KC_F3" };
const F4 = { code: "KC_F4" };
const F5 = { code: "KC_F5" };
const F6 = { code: "KC_F6" };
const F7 = { code: "KC_F7" };
const F8 = { code: "KC_F8" };
const F9 = { code: "KC_F9" };
const F10 = { code: "KC_F10" };
const F11 = { code: "KC_F11" };
const F12 = { code: "KC_F12" };
const F13 = { code: "KC_F13" };
const F14 = { code: "KC_F14" };
const F15 = { code: "KC_F15" };
const F16 = { code: "KC_F16" };
const F17 = { code: "KC_F17" };
const F18 = { code: "KC_F18" };
const F19 = { code: "KC_F19" };
const F20 = { code: "KC_F20" };
const F21 = { code: "KC_F21" };
const F22 = { code: "KC_F22" };
const F23 = { code: "KC_F23" };
const F24 = { code: "KC_F24" };
const Tab = { code: "KC_TAB" };
const Tilde = { code: "KC_GRV", label: ["`", "~"] };
const LShift = { code: "KC_LSFT" };
const RShift = { code: "KC_RSFT" };
const LCtrl = { code: "KC_LCTL" };
const RCtrl = { code: "KC_RCTL" };
const Super = { code: "KC_LGUI" };
const Alt = { code: "KC_LALT" };
const Space = { code: "KC_SPC" };
// prettier-ignore
const Fn: KeyFunc = (l) => ({ code: `MO(${l.toUpperCase()}_FN)`, label: [`Fn (${l})`] });
// prettier-ignore
const Layer: KeyFunc = (l) => ({ code: `DF(${l.toUpperCase()})`, label: [`${l} layer`] });
const Up = { code: "KC_UP" };
const Down = { code: "KC_DOWN" };
const Left = { code: "KC_LEFT" };
const Right = { code: "KC_RIGHT" };
const Enter = { code: "KC_ENT" };
const Backslash = { code: "KC_BSLS" };
const Backspace = { code: "KC_BSPC" };
const Minus = { code: "KC_MINS" };
const Equals = { code: "KC_EQL" };
const LBracket = { code: "KC_LBRC" };
const RBracket = { code: "KC_RBRC" };
const Semicolon = { code: "KC_SCLN" };
const Quote = { code: "KC_QUOT" };
const Comma = { code: "KC_COMM" };
const Period = { code: "KC_DOT" };
const Slash = { code: "KC_SLSH" };
const Delete = { code: "KC_DEL" };
const Tns = { code: "KC_TRNS" };
const Reset = { code: "RESET" };
const MNext = { code: "KC_MNXT" };
const MPrev = { code: "KC_MPRV" };
const MPP = { code: "KC_MPLY" };
const Caps = { code: "KC_CAPS" };
const Print = { code: "KC_PSCR" };
const Home = { code: "KC_HOME" };
const End = { code: "KC_END" };
const PgUp = { code: "KC_PGUP" };
const PgDn = { code: "KC_PGDN" };
const VolUp = { code: "KC_VOLU" };
const VolDn = { code: "KC_VOLD" };
const BrUp = { code: "KC_BRIU" };
const BrDn = { code: "KC_BRID" };

main();
