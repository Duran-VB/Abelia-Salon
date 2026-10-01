import { lightLeak } from "@remotion/effects/light-leak";
import {
  AbsoluteFill,
  Interactive,
  random,
  Solid,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Grid } from "../components/Atmosphere";
import { C, displayStyle, EXPO_IN, EXPO_OUT, monoStyle, SNAP, tween } from "../theme";

const LETTERS = ["M", "A", "C", "H", "I", "N", "E"];
const STAMP_AT = [1, 4, 7, 10, 13, 16, 19];
const A_HIGHLIGHT = 34;
const A_EJECT = 42;
const SNAP_AT = 51;
const TYPE_FROM = 58;

type LogoProps = {
  readonly label: string;
  readonly tagline: string;
  readonly style?: React.CSSProperties;
};

/**
 * 6-9s: "MACHINE" is stamped letter by letter, then the A is punched out
 * and the letters snap together into MCHINE.
 */
const LogoInner: React.FC<LogoProps> = ({ label, tagline, style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const lastStamp = Math.max(...STAMP_AT.filter((s) => frame >= s), -99);
  const stampShake = Math.max(0, 1 - (frame - lastStamp) / 5) * 14 + Math.max(0, 1 - Math.abs(frame - SNAP_AT) / 5) * 18;
  const grow = tween(frame, [SNAP_AT, SNAP_AT + 12], [1, 1.14], EXPO_OUT);
  const exitScale = tween(frame, [78, 90], [1, 7], EXPO_IN);
  const exitBlur = tween(frame, [80, 90], [0, 24], EXPO_IN);
  const typed = Math.floor(tween(frame, [TYPE_FROM, TYPE_FROM + 20], [0, tagline.length], (t) => t));

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
      <Grid opacity={tween(frame, [0, 20], [0, 1])} size={120} />
      {/* scanning guide lines */}
      <AbsoluteFill>
        {[820, 1100].map((y, i) => (
          <div
            key={y}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              height: 2,
              width: "100%",
              backgroundColor: C.signal,
              opacity: 0.35,
              scale: `${tween(frame, [2 + i * 3, 22 + i * 3], [0, 1])} 1`,
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: String(exitScale),
          filter: exitBlur > 0.5 ? `blur(${exitBlur}px)` : undefined,
          opacity: tween(frame, [84, 90], [1, 0]),
          translate: `${(random(`lx${frame}`) - 0.5) * stampShake}px ${(random(`ly${frame}`) - 0.5) * stampShake}px`,
        }}
      >
        <div
          style={{
            ...monoStyle(30),
            position: "absolute",
            top: 770,
            width: "100%",
            textAlign: "center",
            color: C.mute,
            opacity: tween(frame, [22, 32], [0, 1]),
            translate: `0px ${tween(frame, [22, 32], [20, 0])}px`,
          }}
        >
          {label}
        </div>
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            translate: "0px -50%",
            scale: String(grow),
          }}
        >
          {LETTERS.map((l, i) => {
            const s = STAMP_AT[i];
            const p = tween(frame, [s, s + 6], [0, 1]);
            const isA = l === "A";
            const ejectT = tween(frame, [A_EJECT, A_EJECT + 16], [0, 1], EXPO_IN);
            const collapse = isA ? tween(frame, [A_EJECT + 4, SNAP_AT], [1, 0], SNAP) : 1;
            return (
              <div
                key={i}
                style={{
                  display: "inline-block",
                  maxWidth: isA ? `${1.05 * collapse}em` : undefined,
                  ...displayStyle(150),
                  letterSpacing: "0em",
                  margin: "0 0.01em",
                  lineHeight: 1,
                  overflow: "visible",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    color: isA && frame >= A_HIGHLIGHT ? C.signal : C.bone,
                    opacity: frame >= s ? 1 : 0,
                    scale: String(2.2 - 1.2 * p),
                    filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined,
                    translate: isA ? `${ejectT * 420}px ${-ejectT * 1100 + (frame >= A_HIGHLIGHT && frame < A_EJECT ? Math.sin(frame * 2.2) * 6 : 0)}px` : undefined,
                    rotate: isA ? `${ejectT * 220}deg` : undefined,
                  }}
                >
                  {l}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...monoStyle(38),
            position: "absolute",
            top: 1130,
            width: "100%",
            textAlign: "center",
            color: C.bone,
            letterSpacing: "0.18em",
          }}
        >
          {tagline.slice(0, typed)}
          <span style={{ color: C.signal, opacity: frame >= TYPE_FROM && Math.floor(frame / 4) % 2 === 0 ? 1 : 0 }}>▌</span>
        </div>
      </AbsoluteFill>
      <Solid
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: tween(frame, [0, 24, 34], [0.8, 0.7, 0], (t) => t) }}
        effects={[
          lightLeak({
            seed: 3,
            hueShift: 12,
            progress: tween(frame, [0, 34], [0, 1], (t) => t),
          }),
        ]}
      />
    </AbsoluteFill>
  );
};

const logoSchema = {
  label: { type: "text-content", default: "Web design & development", description: "Label above the wordmark" },
  tagline: { type: "text-content", default: "Websites, engineered.", description: "Typed tagline" },
} as const satisfies InteractivitySchema;

export const Logo = Interactive.withSchema({
  Component: LogoInner,
  componentName: "<Logo>",
  schema: logoSchema,
  wrapInSequence: true,
});
