// prettier-ignore
import {Esc,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,K_0,K_1,K_2,K_3,K_4,K_5,K_6,K_7,K_8,K_9,F1,F2,F3,F4,F5,F6,F7,F8,F9,F10,F11,F12,F13,F14,F15,P0,P1,P2,P3,P4,P5,P6,P7,P8,P9,Tab,Tilde,LShift,RShift,LCtrl,RCtrl,Super,Alt,Space,Up,Down,Left,Right,Enter,Backslash,Backspace,Minus,Equals,LBracket,RBracket,Semicolon,Quote,Comma,Period,Slash,Delete,Tns,Reset,MNext,MPrev,MPP,Caps,Print,Home,Ins,End,PgUp,PgDn,VolUp,VolDn,BrUp,BrDn,PSlash,PAsterisk,PMinus,Fn,Str,Custom,Layer,PPlus} from "./keycodes";

import { Config } from "./types";
import { printErrors, verifyConfig } from "./verify";
import { genCCode } from "./C_gen";
import { renderSVG } from "./svg";

const DZ60_lens = [14, 14, 13, 12, 8];
const DZ60_wids_ANSI = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
];
const JPS: string = process.env.JPS as string;
const SPS: string = process.env.SPS as string;
const LPS: string = process.env.LPS as string;
const PPS: string = process.env.PPS as string;

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
          /* prettier-ignore */ [Str("JPS", JPS), Tns, Tns, Tns, Tns, Tns, Tns, Layer("GTAV"), Tns, Str("SPS", SPS), MPP, MPrev, MNext, Reset],
          /* prettier-ignore */ [Caps, Tns, Tns, Tns, Tns, Tns, Tns, BrUp, VolUp, PgUp, Home, End, Layer("CSGO")],
          /* prettier-ignore */ [Layer("Default"), Tns, Tns, Tns, Tns, Tns, Tns, BrDn, VolDn, PgDn, Print, RShift],
          /* prettier-ignore */ [Str("PPS", PPS), Tns, Str("LPS", LPS), MPP, Tns, F14, F15, RCtrl],
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
      GTAV: {
        typing: [
          /* prettier-ignore */ [Tilde, K_1, K_2, K_3, K_4, K_5, K_6, K_7, K_8, K_9, K_0, Minus, Equals, Backspace],
          /* prettier-ignore */ [Tab, Q, W, E, R, T, Y, U, I, O, P8, P7, P9, PPlus],
          /* prettier-ignore */ [Esc, A, S, D, F, G, H, J, K, P4, P5, P6, Enter],
          /* prettier-ignore */ [LShift, Z, X, C, V, B, N, M, P1, P2, P3, P0],
          /* prettier-ignore */ [LCtrl, Super, Alt, Space, Fn("GTAV"), Left, Down, Right],
        ],
        fn: [
          /* prettier-ignore */ [F13, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, Delete],
          /* prettier-ignore */ [Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, P, LBracket, RBracket, Backslash],
          /* prettier-ignore */ [Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, Tns, L, Semicolon, Quote, Layer("Default")],
          /* prettier-ignore */ [Layer("Default"), Tns, Tns, Tns, Tns, Tns, Tns, Tns, Comma, Period, Slash, Up],
          /* prettier-ignore */ [Tns, Tns, Tns, Tns, Tns, PSlash, PAsterisk, PMinus],
        ],
      },
    },
    lens: DZ60_lens,
    wids: DZ60_wids_ANSI,
  };

  const errors = verifyConfig(dz60Conf);
  if (errors) {
    printErrors(errors);
    return;
  }

  if (process.argv[2] === "--svg") {
    console.log(renderSVG(dz60Conf));
  } else {
    console.log(genCCode(dz60Conf));
  }
}

main();
