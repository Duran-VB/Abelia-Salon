import { AbsoluteFill, Interactive, random, useCurrentFrame, type InteractivitySchema } from "remotion";
import { MaskLine } from "../components/MaskLine";
import { C, displayStyle, EXPO_IN, EXPO_OUT, monoStyle, tween } from "../theme";

const ASSEMBLE_AT = 24;
const BLINDS_AT = 78;

type RebuiltProps = {
  readonly line1: string;
  readonly line2: string;
  readonly payoff: string;
  readonly services: string;
  readonly style?: React.CSSProperties;
};

/** 18-21s: palette flips to bone; "REBUILT." is machine-assembled from parts. */
const RebuiltInner: React.FC<RebuiltProps> = ({ line1, line2, payoff, services, style }) => {
  const frame = useCurrentFrame();
  const push = tween(frame, [0, 90], [1, 1.07], (t) => t);
  const guide = (y: number, delay: number) => (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        height: 2,
        backgroundColor: C.ink,
        opacity: 0.14,
        scale: `${tween(frame, [delay, delay + 16], [0, 1])} 1`,
        transformOrigin: "left center",
      }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bone, overflow: "hidden", ...style }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(11,11,12,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,11,12,0.06) 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
        }}
      />
      <AbsoluteFill style={{ scale: String(push) }}>
        {guide(520, 2)}
        {guide(800, 6)}
        {guide(1150, 10)}
        {[80, 1000].map((x, i) => (
          <div
            key={x}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 2,
              height: "100%",
              backgroundColor: C.signal,
              opacity: 0.5,
              scale: `1 ${tween(frame, [4 + i * 3, 24 + i * 3], [0, 1])}`,
              transformOrigin: "center top",
            }}
          />
        ))}
        <div style={{ ...monoStyle(22), position: "absolute", top: 488, left: 92, color: C.signal, opacity: tween(frame, [10, 18], [0, 1]) }}>
          ↔ 920 px
        </div>

        <div style={{ position: "absolute", top: 540, left: 60, right: 60, textAlign: "center" }}>
          <MaskLine enter={8} style={{ ...displayStyle(218), color: C.ink, lineHeight: 0.95 }}>
            {line1}
          </MaskLine>
          <MaskLine enter={15} style={{ ...displayStyle(116), color: C.ink }}>
            {line2}
          </MaskLine>
        </div>

        {/* REBUILT. assembled from scattered parts */}
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {payoff.split("").map((ch, i) => {
            const s = ASSEMBLE_AT + i * 1.5;
            const p = tween(frame, [s, s + 14], [0, 1], EXPO_OUT);
            const dx = (random(`rx${i}`) - 0.5) * 900;
            const dy = (random(`ry${i}`) - 0.5) * 1200;
            const r = (random(`rr${i}`) - 0.5) * 300;
            return (
              <div
                key={i}
                style={{
                  ...displayStyle(140),
                  color: C.signal,
                  opacity: frame >= s ? 1 : 0,
                  translate: `${dx * (1 - p)}px ${dy * (1 - p)}px`,
                  rotate: `${r * (1 - p)}deg`,
                  scale: String(0.4 + 0.6 * p),
                  whiteSpace: "pre",
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
        <div
          style={{
            ...monoStyle(30),
            position: "absolute",
            top: 1200,
            width: "100%",
            textAlign: "center",
            color: C.ink,
            opacity: tween(frame, [46, 56], [0, 1]),
            translate: `0px ${tween(frame, [46, 56], [16, 0])}px`,
          }}
        >
          {services}
        </div>
      </AbsoluteFill>

      {/* venetian blinds close into the CTA */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * 160,
            height: 161,
            backgroundColor: C.ink,
            scale: `1 ${tween(frame, [BLINDS_AT + i * 0.7, BLINDS_AT + 6 + i * 0.7], [0, 1], EXPO_IN)}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const rebuiltSchema = {
  line1: { type: "text-content", default: "Your", description: "Line 1" },
  line2: { type: "text-content", default: "business,", description: "Line 2" },
  payoff: { type: "text-content", default: "REBUILT.", description: "Assembled payoff word" },
  services: { type: "text-content", default: "Design — Build — Launch", description: "Services line" },
} as const satisfies InteractivitySchema;

export const Rebuilt = Interactive.withSchema({
  Component: RebuiltInner,
  componentName: "<Rebuilt>",
  schema: rebuiltSchema,
  wrapInSequence: true,
});
