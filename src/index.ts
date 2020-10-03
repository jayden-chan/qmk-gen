import { Config, Key, KeyFunc } from "./types";
import { verifyConfig } from "./verify";
import { genCCode } from "./C_gen";

const DZ60_lens = [14, 14, 13, 12, 8];
const JPS: string = process.env.JPS as string;
const SPS: string = process.env.SPS as string;
const LPS: string = process.env.LPS as string;

function main() {
  const dz60Conf: Config = {
    layers: {
      Default: {
        typing: [
          /* prettier-ignore */ [Tilde, K_1, K_2, K_3, K_4, K_5, K_6, K_7, K_8, K_9, K_0, Minus, Equals, Backspace],
          /* prettier-ignore */ [Tab, Q, W, E, R, T, Y, U, I, O, P, LBracket, RBracket, Backslash],
          /* prettier-ignore */ [Esc, A, S, D, F, G, H, J, K, L, Semicolon, Quote, Enter],
          /* prettier-ignore */ [LShift, Z, X, C, V, B, N, M, Comma, Period, Slash, Up],
          /* prettier-ignore */ [LCtrl, Super, Alt, Space, Fn("Default"), Left, Down, Right],
        ],
        fn: [
          /* prettier-ignore */ [F13, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, Delete],
          /* prettier-ignore */ [Str("JPS", JPS), Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Str("SPS", SPS), MPP, MPrev, MNext, Reset],
          /* prettier-ignore */ [Caps, Tns, Tns, Tns, Tns, Tns, Tns, BrUp, VolUp, PgUp, Home, End, Layer("CSGO")],
          /* prettier-ignore */ [Layer("Default"), Tns, Tns, Tns, Tns, Tns, Tns, BrDn, VolDn, PgDn, Print, RShift],
          /* prettier-ignore */ [Tns, Tns, Str("LPS", LPS), MPP, Tns, F14, F15, RCtrl],
        ],
      },
      CSGO: {
        typing: [
          /* prettier-ignore */ [Tilde, K_1, K_2, K_3, K_4, K_5, K_6, K_7, K_8, K_9, K_0, Minus, Equals, Backspace],
          /* prettier-ignore */ [Tab, Custom("QQ"), W, E, R, T, Y, U, I, O, P, LBracket, RBracket, Backslash],
          /* prettier-ignore */ [Esc, A, S, D, F, G, H, J, K, L, Semicolon, Quote, Enter],
          /* prettier-ignore */ [LShift, Z, X, C, V, B, N, M, Comma, Period, Slash, Up],
          /* prettier-ignore */ [LCtrl, Super, Alt, Space, Fn("CSGO"), Left, Down, Right],
        ],
        fn: [
          /* prettier-ignore */ [F13, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, Delete],
          /* prettier-ignore */ [Tns, Q, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Ins, P7, P8, P9, Tns],
          /* prettier-ignore */ [Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, P4, P5, P6, Layer("Default")],
          /* prettier-ignore */ [Layer("Default"), Tns, Tns, Tns, Tns, Tns, Tns, Tns, P1, P2, P3, P0],
          /* prettier-ignore */ [Tns, Tns, Tns, Tns, Tns, PSlash, PAsterisk, PMinus],
        ],
      },
    },
    lens: DZ60_lens,
  };

  const errors = verifyConfig(dz60Conf);
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

  console.log(genCCode(dz60Conf));
}

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
const P0 = { code: "KC_P0" };
const P1 = { code: "KC_P1" };
const P2 = { code: "KC_P2" };
const P3 = { code: "KC_P3" };
const P4 = { code: "KC_P4" };
const P5 = { code: "KC_P5" };
const P6 = { code: "KC_P6" };
const P7 = { code: "KC_P7" };
const P8 = { code: "KC_P8" };
const P9 = { code: "KC_P9" };
const Tab = { code: "KC_TAB" };
const Tilde = { code: "KC_GRV", label: ["`", "~"] };
const LShift = { code: "KC_LSFT" };
const RShift = { code: "KC_RSFT" };
const LCtrl = { code: "KC_LCTL" };
const RCtrl = { code: "KC_RCTL" };
const Super = { code: "KC_LGUI" };
const Alt = { code: "KC_LALT" };
const Space = { code: "KC_SPC" };
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
const Ins = { code: "KC_INS" };
const End = { code: "KC_END" };
const PgUp = { code: "KC_PGUP" };
const PgDn = { code: "KC_PGDN" };
const VolUp = { code: "KC_VOLU" };
const VolDn = { code: "KC_VOLD" };
const BrUp = { code: "KC_BRIU" };
const BrDn = { code: "KC_BRID" };
const PSlash = { code: "KC_PSLS" };
const PAsterisk = { code: "KC_PAST" };
const PMinus = { code: "KC_PMNS" };

const Custom: KeyFunc = (c) => ({ code: `CU_${c}`, label: [c] });
const Str: KeyFunc = (c, l) => ({ code: `CU_${c}`, label: [c], str: l });
const Fn: KeyFunc = (l) => ({
  code: `MO(LYR_${l.toUpperCase()}_FN)`,
  label: [`Fn (${l})`],
});
const Layer: KeyFunc = (l) => ({
  code: `DF(LYR_${l.toUpperCase()})`,
  label: [`${l} layer`],
});

main();
