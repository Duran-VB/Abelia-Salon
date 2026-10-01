import { AbsoluteFill, Interactive, random, useCurrentFrame, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { C, displayStyle, monoStyle, SNAP, tween } from "../theme";

const DIGITS = ["3", "2", "1", "0"];
const STEP = 30;
const R = 360;
const CIRC = 2 * Math.PI * R;

type HookProps = {
  readonly topA: string;
  readonly bottomA: string;
  readonly topB1: string;
  readonly topB2: string;
  readonly bottomB1: string;
  readonly bottomB2: string;
  readonly style?: React.CSSProperties;
};

/** 0-4s: a stopwatch counts down the three seconds a visitor gives you. */
const HookInner: React.FC<HookProps> = ({ topA, bottomA, topB1, topB2, bottomB1, bottomB2, style }) => {
  const frame = useCurrentFrame();
  const timeUp = frame >= 90;
  const remaining = tween(frame, [0, 90], [1, 0], (t) => t);
  // glitch-out before the cut to "Waste"
  const glitch = frame > 104 ? random(`hook-${frame}`) : 0;
  const shake = timeUp ? tween(frame, [90, 102], [18, 0]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, ...style }}>
      <Grid opacity={0.8} />
      <AbsoluteFill
        style={{
          translate: `${(random(`sx-${frame}`) - 0.5) * shake + (glitch - 0.5) * 40}px ${(random(`sy-${frame}`) - 0.5) * shake}px`,
        }}
      >
        {/* stopwatch ring */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(540 960)">
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
              const major = i % 5 === 0;
              const lit = i / 60 < remaining;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * (R + 34)}
                  y1={Math.sin(a) * (R + 34)}
                  x2={Math.cos(a) * (R + (major ? 70 : 52))}
                  y2={Math.sin(a) * (R + (major ? 70 : 52))}
                  stroke={lit ? C.bone : C.ink3}
                  strokeWidth={major ? 6 : 3}
                  opacity={tween(frame, [i * 0.25, i * 0.25 + 6], [0, 1])}
                />
              );
            })}
            <circle r={R} fill="none" stroke={C.ink3} strokeWidth={14} />
            <circle
              r={R}
              fill="none"
              stroke={C.signal}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - remaining * tween(frame, [0, 10], [0, 1]))}
              transform="rotate(-90)"
            />
          </g>
        </svg>

        {/* rolling digits */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 960 - 330,
            height: 660,
            overflow: "hidden",
          }}
        >
          {DIGITS.map((d, i) => {
            const start = i * STEP;
            // the first digit is on screen from frame 0 (cover frame) and punches in with scale
            const enter = i === 0 ? 0 : tween(frame, [start, start + 8], [1, 0], SNAP);
            const punch = i === 0 ? tween(frame, [0, 10], [0.3, 0]) : 0;
            const exit = i < DIGITS.length - 1 ? tween(frame, [start + STEP, start + STEP + 8], [0, -1], SNAP) : 0;
            if (frame < start || (i < DIGITS.length - 1 && frame > start + STEP + 8)) {
              return null;
            }
            const y = enter + exit;
            return (
              <div
                key={d}
                style={{
                  ...displayStyle(640),
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  color: d === "0" ? C.signal : C.bone,
                  translate: `0px ${y * 640}px`,
                  scale: String(1 + punch),
                  filter: `blur(${Math.abs(y) * 30 + punch * 12}px)`,
                  opacity: d === "0" && frame > 104 ? (glitch > 0.5 ? 1 : 0.2) : 1,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>

        {/* kinetic copy above and below the stopwatch, synced to the narration */}
        <div style={{ position: "absolute", top: 300, left: 60, right: 60, height: 200, textAlign: "center" }}>
          <MaskLine absolute enter={0} exit={44} style={{ ...displayStyle(124), color: C.bone, paddingTop: 30 }}>
            {topA}
          </MaskLine>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <MaskLine enter={47} exit={106} style={{ ...displayStyle(88), color: C.bone }}>
              {topB1}
            </MaskLine>
            <MaskLine enter={60} exit={107} style={{ ...displayStyle(88), color: C.bone }}>
              {topB2}
            </MaskLine>
          </div>
        </div>
        <div style={{ position: "absolute", top: 1420, left: 60, right: 60, height: 200, textAlign: "center" }}>
          <MaskLine absolute enter={4} exit={44} style={{ ...displayStyle(124), color: C.bone }}>
            {bottomA}
          </MaskLine>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <MaskLine enter={74} exit={106} style={{ ...displayStyle(88), color: C.bone }}>
              {bottomB1}
            </MaskLine>
            <MaskLine enter={86} exit={107} style={{ ...displayStyle(88), color: C.signal }}>
              {bottomB2}
            </MaskLine>
          </div>
        </div>
        <div
          style={{
            ...monoStyle(24),
            position: "absolute",
            top: 1236,
            width: "100%",
            textAlign: "center",
            color: timeUp ? C.signal : C.mute,
            opacity: tween(frame, [10, 20], [0, 1]),
          }}
        >
          {timeUp ? "● Visitor lost" : `● 00:0${Math.max(0, Math.ceil(3 - frame / 30))} left`}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const hookSchema = {
  topA: { type: "text-content", default: "You have", description: "Top line, first half" },
  bottomA: { type: "text-content", default: "Seconds.", description: "Bottom line, first half" },
  topB1: { type: "text-content", default: "That's all", description: "Top line 1, second half" },
  topB2: { type: "text-content", default: "a visitor", description: "Top line 2, second half" },
  bottomB1: { type: "text-content", default: "gives your", description: "Bottom line 1, second half" },
  bottomB2: { type: "text-content", default: "website.", description: "Bottom line 2, second half" },
} as const satisfies InteractivitySchema;

export const Hook = Interactive.withSchema({
  Component: HookInner,
  componentName: "<Hook>",
  schema: hookSchema,
  wrapInSequence: true,
});
