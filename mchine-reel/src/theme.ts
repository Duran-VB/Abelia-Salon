import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";
import timeline from "./timeline.json";

export const TIMELINE = timeline;
export const FPS = timeline.fps;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  ink: "#0B0B0C",
  ink2: "#141417",
  ink3: "#1E1E22",
  bone: "#EDEBE6",
  mute: "#8A8780",
  signal: "#FF5A1F",
  signalDeep: "#C9400F",
  line: "rgba(237,235,230,0.08)",
} as const;

export const DISPLAY = "Archivo";
export const MONO = "JetBrains Mono";

loadFont({
  family: DISPLAY,
  url: staticFile("fonts/Archivo-Variable.woff2"),
  weight: "100 900",
  stretch: "62% 125%",
});
loadFont({
  family: MONO,
  url: staticFile("fonts/JetBrainsMono-Variable.woff2"),
  weight: "100 800",
});

/** Expanded, heavy display type: the MCHINE voice. */
export const displayStyle = (size: number): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: 900,
  fontStretch: "125%",
  fontSize: size,
  lineHeight: 0.92,
  letterSpacing: "-0.02em",
  textTransform: "uppercase",
});

export const monoStyle = (size: number): React.CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const SNAP = Easing.bezier(0.85, 0, 0.15, 1);

/** interpolate() with clamping on both sides. */
export const tween = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EXPO_OUT,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Voice line lookup so on-screen text stays in sync with the narration. */
export const voice = (id: string) => {
  const v = timeline.voice.find((x) => x.id === id);
  if (!v) {
    throw new Error(`Unknown voice line ${id}`);
  }
  return v;
};
