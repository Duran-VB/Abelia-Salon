import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EXPO_IN, EXPO_OUT, tween } from "../theme";

/** Full-frame flash that peaks on the cut. */
export const Flash: React.FC<{ readonly color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity: frame < mid ? tween(frame, [mid - 2, mid], [0, 1], (t) => t) : tween(frame, [mid, durationInFrames], [1, 0]),
      }}
    />
  );
};

/** A panel whips up through the frame, hiding the cut at its midpoint. */
export const Whip: React.FC<{ readonly color: string; readonly accent?: string }> = ({ color, accent = C.signal }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  const y = frame < mid ? tween(frame, [0, mid], [1, 0], EXPO_IN) : tween(frame, [mid, durationInFrames], [0, -1], EXPO_OUT);
  return (
    <AbsoluteFill style={{ translate: `0px ${y * 2100}px` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -40, height: 40, backgroundColor: accent }} />
      <AbsoluteFill style={{ backgroundColor: color }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -40, height: 40, backgroundColor: accent }} />
    </AbsoluteFill>
  );
};

/** Digital tear: random bars flicker across the frame. */
export const GlitchBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const strength = 1 - Math.abs(frame / (durationInFrames - 1) - 0.5) * 2;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const on = random(`g${i}-${frame}`) < strength * 0.8;
        if (!on) {
          return null;
        }
        const colors = [C.signal, C.bone, "#00F0FF", "#FF0046"];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${random(`gl${i}-${frame}`) * 40 - 10}%`,
              width: `${30 + random(`gw${i}-${frame}`) * 90}%`,
              top: `${random(`gt${i}-${frame}`) * 100}%`,
              height: 4 + random(`gh${i}-${frame}`) * 60,
              backgroundColor: colors[i % colors.length],
              opacity: 0.85,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
