import { AbsoluteFill, Interactive, random, useCurrentFrame, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { C, DISPLAY, displayStyle, EXPO_IN, EXPO_OUT, MONO, monoStyle, tween } from "../theme";

const PANEL = 30;

/** Pen tool drawing a curve + palette swatches. */
const DesignVisual: React.FC<{ readonly f: number }> = ({ f }) => {
  const draw = tween(f, [2, 22], [0, 1]);
  const path = "M 120 560 C 260 120, 520 120, 540 360 S 820 640, 960 220";
  const anchors = [
    [120, 560],
    [540, 360],
    [960, 220],
  ];
  const swatches = [C.ink, C.bone, C.signal, "#FF8A5C", C.mute];
  return (
    <div style={{ position: "absolute", top: 760, left: 0, width: 1080, height: 760 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -40,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontStretch: "125%",
          fontSize: 520,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `3px ${C.ink3}`,
        }}
      >
        Aa
      </div>
      <svg width={1080} height={700} style={{ position: "absolute", inset: 0 }}>
        <line x1={540} y1={360} x2={360} y2={150} stroke={C.mute} strokeWidth={2} opacity={draw > 0.5 ? 1 : 0} />
        <line x1={540} y1={360} x2={720} y2={570} stroke={C.mute} strokeWidth={2} opacity={draw > 0.5 ? 1 : 0} />
        <path d={path} fill="none" stroke={C.signal} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {anchors.map(([x, y], i) => (
          <rect
            key={i}
            x={x - 14}
            y={y - 14}
            width={28}
            height={28}
            fill={C.ink}
            stroke={C.bone}
            strokeWidth={4}
            opacity={draw >= i / 2 ? 1 : 0}
          />
        ))}
        {[
          [360, 150],
          [720, 570],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={11} fill={C.bone} opacity={draw > 0.5 ? 1 : 0} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 22 }}>
        {swatches.map((s, i) => (
          <div
            key={s}
            style={{
              width: 92,
              height: 92,
              borderRadius: 46,
              backgroundColor: s,
              border: `3px solid ${C.ink3}`,
              scale: String(tween(f, [8 + i * 2, 16 + i * 2], [0, 1])),
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CODE: { t: string; c: string }[][] = [
  [{ t: "<Hero", c: C.signal }],
  [{ t: "  title=", c: C.bone }, { t: '"Your brand"', c: "#FFB08F" }],
  [{ t: "  cta=", c: C.bone }, { t: '"Book now"', c: "#FFB08F" }],
  [{ t: "  mobileFirst", c: C.bone }],
  [{ t: "/>", c: C.signal }],
  [{ t: "// lean, semantic, accessible", c: C.mute }],
];

/** Editor with code typing in. */
const CodeVisual: React.FC<{ readonly f: number }> = ({ f }) => {
  const lineLengths = CODE.map((line) => line.reduce((a, s) => a + s.t.length, 0));
  const total = lineLengths.reduce((a, b) => a + b, 0);
  const typed = Math.floor(tween(f, [2, 24], [0, total], (t) => t));
  let cum = 0;
  const caretLine = lineLengths.findIndex((len) => (cum += len) >= typed);
  let budget = typed;
  return (
    <div
      style={{
        position: "absolute",
        top: 800,
        left: 90,
        width: 900,
        height: 600,
        borderRadius: 28,
        backgroundColor: C.ink2,
        border: `2px solid ${C.ink3}`,
        boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 64, borderBottom: `2px solid ${C.ink3}`, display: "flex", alignItems: "center", gap: 12, padding: "0 26px" }}>
        {[C.signal, C.ink3, C.ink3].map((c, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }} />
        ))}
        <div style={{ ...monoStyle(20), color: C.mute, marginLeft: 16, textTransform: "none", letterSpacing: "0.04em" }}>Hero.tsx</div>
      </div>
      <div style={{ padding: "28px 30px", fontFamily: MONO, fontWeight: 500, fontSize: 40, lineHeight: 1.6 }}>
        {CODE.map((line, li) => (
          <div key={li} style={{ display: "flex", whiteSpace: "pre" }}>
            <span style={{ color: C.ink3, width: 60 }}>{li + 1}</span>
            {line.map((seg, si) => {
              const shown = seg.t.slice(0, Math.max(0, budget));
              budget -= seg.t.length;
              return (
                <span key={si} style={{ color: seg.c }}>
                  {shown}
                </span>
              );
            })}
            {li === caretLine && Math.floor(f / 4) % 2 === 0 ? <span style={{ color: C.signal }}>▌</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Speed lines, gauge and an instant progress bar. */
const SpeedVisual: React.FC<{ readonly f: number }> = ({ f }) => {
  const fill = tween(f, [3, 12], [0, 1], EXPO_OUT);
  const needle = tween(f, [3, 12], [-120, 105], EXPO_OUT) + Math.sin(f * 1.7) * (f > 12 ? 2 : 0);
  return (
    <div style={{ position: "absolute", top: 740, left: 0, width: 1080, height: 800 }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const y = random(`sy${i}`) * 780;
        const len = 160 + random(`sl${i}`) * 420;
        const speed = 70 + random(`ss${i}`) * 90;
        const x = 1200 - ((f * speed + random(`sx${i}`) * 1600) % 1800);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: x,
              width: len,
              height: i % 5 === 0 ? 6 : 3,
              borderRadius: 3,
              background: `linear-gradient(90deg, transparent, ${i % 4 === 0 ? C.signal : "rgba(237,235,230,0.35)"})`,
            }}
          />
        );
      })}
      <svg width={1080} height={520} style={{ position: "absolute", top: 0 }}>
        <g transform="translate(540 400)">
          <path d="M -300 0 A 300 300 0 0 1 300 0" fill="none" stroke={C.ink3} strokeWidth={26} strokeLinecap="round" />
          <path d="M -300 0 A 300 300 0 0 1 300 0" fill="none" stroke={C.signal} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fill} />
          <line x1={0} y1={0} x2={0} y2={-250} stroke={C.bone} strokeWidth={10} strokeLinecap="round" transform={`rotate(${needle / 1.17})`} />
          <circle r={26} fill={C.bone} />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 560, left: 140, right: 140 }}>
        <div style={{ ...monoStyle(24), color: C.mute, display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span>Page load</span>
          <span style={{ color: fill > 0.98 ? C.signal : C.mute }}>{fill > 0.98 ? "Ready ✓" : `${Math.round(fill * 100)}%`}</span>
        </div>
        <div style={{ height: 22, borderRadius: 11, backgroundColor: C.ink3, overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", backgroundColor: C.signal }} />
        </div>
      </div>
    </div>
  );
};

type PillarsProps = {
  readonly designTitle: string;
  readonly codeTitle: string;
  readonly speedTitle: string;
  readonly style?: React.CSSProperties;
};

/** 12.5-15.5s: three one-second beats - design, code, speed. */
const PillarsInner: React.FC<PillarsProps> = ({ designTitle, codeTitle, speedTitle, style }) => {
  const frame = useCurrentFrame();
  const panels = [
    { idx: "01", tag: "Design", title: designTitle, visual: (f: number) => <DesignVisual f={f} /> },
    { idx: "02", tag: "Code", title: codeTitle, visual: (f: number) => <CodeVisual f={f} /> },
    { idx: "03", tag: "Speed", title: speedTitle, visual: (f: number) => <SpeedVisual f={f} /> },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
      <Grid opacity={0.7} />
      {panels.map((p, i) => {
        const start = i * PANEL;
        const f = frame - start;
        if (f < -1 || f > PANEL + 9) {
          return null;
        }
        const enterY = i === 0 ? 0 : tween(f, [0, 9], [1920, 0], EXPO_OUT);
        const exitY = i < panels.length - 1 ? tween(f, [PANEL, PANEL + 9], [0, -700], EXPO_IN) : 0;
        const exitO = i < panels.length - 1 ? tween(f, [PANEL, PANEL + 8], [1, 0]) : 1;
        const speed = Math.abs(i === 0 ? 0 : tween(f, [0, 9], [1, 0], EXPO_OUT)) + (i < 2 ? tween(f, [PANEL, PANEL + 9], [0, 1], EXPO_IN) : 0);
        const [l1, l2] = p.title.split("|");
        return (
          <AbsoluteFill
            key={p.idx}
            style={{
              translate: `0px ${enterY + exitY}px`,
              opacity: exitO,
              filter: speed > 0.05 ? `blur(${speed * 14}px)` : undefined,
            }}
          >
            <div style={{ ...monoStyle(28), position: "absolute", top: 300, width: "100%", textAlign: "center", color: C.mute }}>
              <span style={{ color: C.signal }}>{p.idx}</span> / {p.tag}
            </div>
            <div style={{ position: "absolute", top: 360, left: 50, right: 50, textAlign: "center" }}>
              <MaskLine enter={start + 1} style={{ ...displayStyle(i === 2 ? 118 : 150), color: C.bone, fontStretch: i === 2 ? "112%" : "125%" }}>
                {l1}
              </MaskLine>
              <MaskLine enter={start + 6} style={{ ...displayStyle(150), color: C.signal }}>
                {l2}
              </MaskLine>
            </div>
            {p.visual(f)}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const pillarsSchema = {
  designTitle: { type: "text-content", default: "Sharp|design.", description: "Panel 1 title (| = line break)" },
  codeTitle: { type: "text-content", default: "Clean|code.", description: "Panel 2 title (| = line break)" },
  speedTitle: { type: "text-content", default: "Built for|speed.", description: "Panel 3 title (| = line break)" },
} as const satisfies InteractivitySchema;

export const Pillars = Interactive.withSchema({
  Component: PillarsInner,
  componentName: "<Pillars>",
  schema: pillarsSchema,
  wrapInSequence: true,
});
