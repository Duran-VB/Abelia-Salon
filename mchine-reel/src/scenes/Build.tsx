import { AbsoluteFill, Interactive, useCurrentFrame, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { Phone } from "../components/Phone";
import { SiteMock } from "../components/SiteMock";
import { C, displayStyle, EXPO_OUT, monoStyle, tween } from "../theme";

const STEP_AT = [12, 20, 28, 36, 44, 52, 60, 68, 76];
const PHONE_LEFT = 260;
const PHONE_TOP = 640;

const ANNOTATIONS: { step: number; side: "left" | "right"; y: number; title: string; sub: string }[] = [
  { step: 1, side: "left", y: 830, title: "Art", sub: "direction" },
  { step: 2, side: "right", y: 1250, title: "Type", sub: "scale" },
  { step: 4, side: "left", y: 1500, title: "Call to", sub: "action" },
  { step: 6, side: "right", y: 1610, title: "Grid", sub: "12 col" },
];

type BuildProps = {
  readonly a1: string;
  readonly a2: string;
  readonly a3: string;
  readonly b1: string;
  readonly b2: string;
  readonly b3: string;
  readonly style?: React.CSSProperties;
};

/** 9-12.5s: a website assembles itself inside a phone, wireframe first. */
const BuildInner: React.FC<BuildProps> = ({ a1, a2, a3, b1, b2, b3, style }) => {
  const frame = useCurrentFrame();
  const reveal = (step: number) => tween(frame, [STEP_AT[step], STEP_AT[step] + 10], [0, 1], (t) => t);
  const rotY = tween(frame, [0, 105], [-16, 8], (t) => t);
  const rotX = tween(frame, [0, 105], [10, 3], (t) => t);
  const enter = tween(frame, [0, 14], [380, 0], EXPO_OUT);
  const head = { ...displayStyle(104), color: C.bone };

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
      <Grid opacity={0.9} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 70%, rgba(255,90,31,0.28), transparent 45%)`,
          opacity: tween(frame, [0, 30], [0, 1]),
        }}
      />
      {/* headline in two phases, synced to the narration */}
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0 }}>
          <MaskLine enter={4} exit={47} style={head}>
            {a1}
          </MaskLine>
          <MaskLine enter={19} exit={48} style={head}>
            {a2}
          </MaskLine>
          <MaskLine enter={33} exit={49} style={{ ...head, color: C.signal }}>
            {a3}
          </MaskLine>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0 }}>
          <MaskLine enter={50} style={head}>
            {b1}
          </MaskLine>
          <MaskLine enter={67} style={{ ...head, color: C.signal }}>
            {b2}
          </MaskLine>
          <MaskLine enter={82} style={head}>
            {b3}
          </MaskLine>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `0px ${enter + Math.sin(frame / 14) * 8}px`,
        }}
      >
        <Phone
          style={{
            left: PHONE_LEFT,
            top: PHONE_TOP,
            transform: `perspective(2400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          }}
        >
          <SiteMock reveal={reveal} />
          {/* blueprint grid inside the screen during the wireframe phase */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(255,90,31,0.25) 1px, transparent 1px)`,
              backgroundSize: `${524 / 12}px 100%`,
              opacity: tween(frame, [4, 12, 60, 80], [0, 1, 1, 0], (t) => t),
            }}
          />
        </Phone>

        {ANNOTATIONS.map((a) => {
          const p = tween(frame, [STEP_AT[a.step] + 2, STEP_AT[a.step] + 12], [0, 1]);
          const left = a.side === "left";
          return (
            <div
              key={a.title}
              style={{
                position: "absolute",
                top: a.y,
                ...(left ? { left: 40 } : { right: 40 }),
                display: "flex",
                flexDirection: left ? "row" : "row-reverse",
                alignItems: "center",
                gap: 12,
                opacity: p,
              }}
            >
              <div style={{ ...monoStyle(21), color: C.bone, textAlign: left ? "left" : "right", lineHeight: 1.3 }}>
                <div style={{ color: C.signal }}>■ {a.title}</div>
                <div style={{ color: C.mute }}>{a.sub}</div>
              </div>
              <div style={{ width: 90 * p, height: 2, backgroundColor: C.signal }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, border: `3px solid ${C.signal}`, scale: String(p) }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const buildSchema = {
  a1: { type: "text-content", default: "We design", description: "Phase 1, line 1" },
  a2: { type: "text-content", default: "& build", description: "Phase 1, line 2" },
  a3: { type: "text-content", default: "websites", description: "Phase 1, line 3" },
  b1: { type: "text-content", default: "that work", description: "Phase 2, line 1" },
  b2: { type: "text-content", default: "as hard", description: "Phase 2, line 2" },
  b3: { type: "text-content", default: "as you do.", description: "Phase 2, line 3" },
} as const satisfies InteractivitySchema;

export const Build = Interactive.withSchema({
  Component: BuildInner,
  componentName: "<Build>",
  schema: buildSchema,
  wrapInSequence: true,
});
