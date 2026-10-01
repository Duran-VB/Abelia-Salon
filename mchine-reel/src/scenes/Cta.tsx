import { lightLeak } from "@remotion/effects/light-leak";
import { AbsoluteFill, Interactive, Solid, useCurrentFrame, useVideoConfig, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { C, displayStyle, EXPO_OUT, monoStyle, tween } from "../theme";

const SHINE_AT = 34;
const STINGER_AT = 75;

type CtaProps = {
  readonly brand: string;
  readonly line1: string;
  readonly line2: string;
  readonly button: string;
  readonly footer: string;
  readonly style?: React.CSSProperties;
};

/** 21-25s: end card - wordmark, line, call to action. */
const CtaInner: React.FC<CtaProps> = ({ brand, line1, line2, button, footer, style }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const slam = tween(frame, [2, 10], [0, 1], EXPO_OUT);
  const stinger = tween(frame, [STINGER_AT, STINGER_AT + 10], [1.06, 1], EXPO_OUT);
  const shine = tween(frame, [SHINE_AT, SHINE_AT + 16], [130, -30], (t) => t);
  const btn = tween(frame, [48, 58], [0, 1], EXPO_OUT);
  const pulse = 1 + Math.max(0, Math.sin((frame - 60) / 6)) * 0.03 * (frame > 60 ? 1 : 0);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
      <Grid opacity={0.9} size={120} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,90,31,0.22), transparent 55%)` }} />

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          textAlign: "center",
          scale: String((2 - slam) * (frame >= STINGER_AT ? stinger : 1)),
          opacity: slam,
          filter: slam < 1 ? `blur(${(1 - slam) * 20}px)` : undefined,
        }}
      >
        <div
          style={{
            ...displayStyle(190),
            letterSpacing: "0em",
            lineHeight: 1,
            color: "transparent",
            backgroundImage: `linear-gradient(100deg, ${C.bone} 0%, ${C.bone} ${shine - 12}%, #FFFFFF ${shine - 4}%, ${C.signal} ${shine}%, #FFFFFF ${shine + 4}%, ${C.bone} ${shine + 12}%, ${C.bone} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {brand}
        </div>
        <div
          style={{
            margin: "26px auto 0",
            width: 880,
            height: 12,
            backgroundColor: C.signal,
            scale: `${tween(frame, [10, 24], [0, 1])} 1`,
            boxShadow: frame >= STINGER_AT ? `0 0 ${tween(frame, [STINGER_AT, STINGER_AT + 20], [60, 0])}px ${C.signal}` : undefined,
          }}
        />
      </div>

      <div style={{ position: "absolute", top: 930, left: 60, right: 60, textAlign: "center" }}>
        <MaskLine enter={7} style={{ ...displayStyle(104), color: C.bone }}>
          {line1}
        </MaskLine>
        <MaskLine enter={27} style={{ ...displayStyle(104), color: C.signal }}>
          {line2}
        </MaskLine>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1240,
          left: "50%",
          translate: `-50% ${(1 - btn) * 60}px`,
          opacity: btn,
          scale: String(pulse),
          padding: "30px 64px",
          borderRadius: 80,
          backgroundColor: C.signal,
          color: C.ink,
          display: "flex",
          alignItems: "center",
          gap: 22,
          whiteSpace: "nowrap",
          ...displayStyle(46),
          fontStretch: "112%",
          lineHeight: 1,
          boxShadow: "0 20px 60px rgba(255,90,31,0.35)",
        }}
      >
        {button}
        <span style={{ translate: `${Math.sin(frame / 5) * 8}px 0px` }}>→</span>
      </div>
      <div
        style={{
          ...monoStyle(26),
          position: "absolute",
          top: 1420,
          width: "100%",
          textAlign: "center",
          color: C.mute,
          opacity: tween(frame, [58, 68], [0, 1]),
        }}
      >
        {footer}
      </div>

      <Solid
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: tween(frame, [0, 20, 30], [0.75, 0.6, 0], (t) => t) }}
        effects={[lightLeak({ seed: 8, hueShift: 12, progress: tween(frame, [0, 30], [0.15, 1], (t) => t) })]}
      />
    </AbsoluteFill>
  );
};

const ctaSchema = {
  brand: { type: "text-content", default: "MCHINE", description: "Wordmark" },
  line1: { type: "text-content", default: "Let's build", description: "Line 1" },
  line2: { type: "text-content", default: "yours.", description: "Line 2" },
  button: { type: "text-content", default: "Link in bio", description: "Call to action button" },
  footer: { type: "text-content", default: "Web design & development", description: "Footer line" },
} as const satisfies InteractivitySchema;

export const Cta = Interactive.withSchema({
  Component: CtaInner,
  componentName: "<Cta>",
  schema: ctaSchema,
  wrapInSequence: true,
});
