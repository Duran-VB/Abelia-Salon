import { AbsoluteFill, Interactive, random, useCurrentFrame, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { C, displayStyle, EXPO_IN, SNAP, tween } from "../theme";

const GLITCH_AT = [0, 13, 27, 38];
const FALL_FROM = 22;
const SERIF = "'Times New Roman', 'Liberation Serif', 'DejaVu Serif', serif";

const fall = (frame: number, i: number) => {
  const t = Math.max(0, frame - (FALL_FROM + i * 2));
  return {
    translate: `${(random(`fx${i}`) - 0.5) * t * 6}px ${0.5 * 2.6 * t * t}px`,
    rotate: `${(random(`fr${i}`) - 0.5) * t * 4}deg`,
  };
};

/** The tired website most businesses still have. */
const BadSite: React.FC<{ readonly frame: number }> = ({ frame }) => {
  const spin = frame * 14;
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF", fontFamily: SERIF, color: "#222" }}>
      <div style={{ height: 64, backgroundColor: "#D7D7D7", display: "flex", alignItems: "center", gap: 12, padding: "0 22px", ...fall(frame, 9) }}>
        {["#E0443E", "#DEA123", "#1AAB29"].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c }} />
        ))}
        <div style={{ marginLeft: 16, flex: 1, height: 38, borderRadius: 8, backgroundColor: "white", fontFamily: "monospace", fontSize: 22, display: "flex", alignItems: "center", padding: "0 14px", color: "#666" }}>
          http://www.your-business.com/index.html
        </div>
      </div>
      <div style={{ backgroundColor: "#FFE600", fontWeight: 700, fontSize: 30, padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap", ...fall(frame, 0) }}>
        <div style={{ translate: `${-((frame * 9) % 330)}px 0px` }}>
          *** UNDER CONSTRUCTION *** UNDER CONSTRUCTION *** UNDER CONSTRUCTION ***
        </div>
      </div>
      <div style={{ fontSize: 62, fontWeight: 700, color: "#1A0DAB", textAlign: "center", marginTop: 26, textDecoration: "underline", ...fall(frame, 1) }}>
        Welcome to Our Website!!!
      </div>
      <div style={{ display: "flex", gap: 26, padding: "26px 36px" }}>
        <div style={{ width: 330, height: 280, border: "3px solid #999", backgroundColor: "#EEE", position: "relative", ...fall(frame, 2) }}>
          <div style={{ position: "absolute", left: 18, top: 14, fontSize: 24, color: "#888" }}>image_final_v2.jpg</div>
          <div style={{ position: "absolute", left: "50%", top: "55%", width: 110, height: 8, backgroundColor: "#C33", rotate: "45deg", translate: "-50% -50%" }} />
          <div style={{ position: "absolute", left: "50%", top: "55%", width: 110, height: 8, backgroundColor: "#C33", rotate: "-45deg", translate: "-50% -50%" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, ...fall(frame, 3) }}>
          {[100, 92, 97, 60, 88, 95, 40].map((w, i) => (
            <div key={i} style={{ width: `${w}%`, height: 16, backgroundColor: "#B9B9B9" }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontSize: 34, color: "#555", ...fall(frame, 4) }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, border: "8px solid #DDD", borderTopColor: "#555", rotate: `${spin}deg` }} />
        Loading, please wait...
      </div>
      <div style={{ textAlign: "center", marginTop: 26, fontSize: 26, color: "#777", ...fall(frame, 5) }}>
        Visitors: <span style={{ fontFamily: "monospace", backgroundColor: "#111", color: "#3F3", padding: "2px 10px" }}>000127</span>
      </div>
      {/* newsletter popup */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 300,
          padding: "34px 30px",
          backgroundColor: "#FFFFFF",
          border: "4px solid #222",
          boxShadow: "12px 12px 0 rgba(0,0,0,0.35)",
          textAlign: "center",
          fontSize: 40,
          fontWeight: 700,
          color: "#D00",
          scale: String(tween(frame, [6, 12], [0, 1])),
          ...fall(frame, 6),
        }}
      >
        SUBSCRIBE TO OUR NEWSLETTER!!
        <div style={{ fontSize: 26, color: "#444", fontWeight: 400, marginTop: 14 }}>[ No thanks ] [ Maybe later ]</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 26px", backgroundColor: "#333", color: "#EEE", fontSize: 24, fontFamily: "sans-serif", ...fall(frame, 7) }}>
        This site uses cookies. By continuing you agree to everything. [OK]
      </div>
    </div>
  );
};

type WasteProps = {
  readonly line1: string;
  readonly line2: string;
  readonly style?: React.CSSProperties;
};

/** 4-6s: the typical website glitches, falls apart and switches off. */
const WasteInner: React.FC<WasteProps> = ({ line1, line2, style }) => {
  const frame = useCurrentFrame();
  const spike = Math.max(...GLITCH_AT.map((g) => (frame >= g ? Math.max(0, 1 - (frame - g) / 6) : 0)));
  const intensity = Math.min(1, spike + tween(frame, [10, 44], [0.1, 0.5], (t) => t));
  const rgb = intensity * 16;
  // CRT power-off
  const crtY = tween(frame, [44, 50], [1, 0.006], EXPO_IN);
  const crtX = tween(frame, [50, 56], [1, 0], SNAP);
  const crtGlow = tween(frame, [44, 50], [0, 1]);

  const browser = (key: string, clip?: string, dx = 0) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: 100,
        top: 610,
        width: 880,
        height: 980,
        overflow: "hidden",
        borderRadius: 14,
        clipPath: clip,
        translate: `${dx}px 0px`,
      }}
    >
      <BadSite frame={frame} />
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", ...style }}>
      <AbsoluteFill
        style={{
          backgroundColor: C.ink,
          scale: `${crtX} ${crtY}`,
          filter: `brightness(${1 + crtGlow * 3})`,
        }}
      >
        <Grid opacity={0.5} />
        <AbsoluteFill
          style={{
            filter: `drop-shadow(${rgb}px 0 0 rgba(255,0,70,0.75)) drop-shadow(${-rgb}px 0 0 rgba(0,240,255,0.75))`,
            translate: `${(random(`wx${frame}`) - 0.5) * intensity * 50}px ${(random(`wy${frame}`) - 0.5) * intensity * 20}px`,
          }}
        >
          {browser("main")}
          {[0, 1, 2, 3].map((i) => {
            const top = random(`st${i}-${Math.floor(frame / 2)}`) * 90;
            const h = 3 + random(`sh${i}-${frame}`) * 9;
            const dx = (random(`sd${i}-${frame}`) - 0.5) * 160 * intensity;
            return intensity > 0.25 ? browser(`slice${i}`, `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`, dx) : null;
          })}
        </AbsoluteFill>
        <div style={{ position: "absolute", top: 270, left: 60, right: 60, textAlign: "center" }}>
          <MaskLine enter={2} style={{ ...displayStyle(104), color: C.bone }}>
            {line1}
          </MaskLine>
          <MaskLine enter={20} style={{ ...displayStyle(104), color: C.signal, translate: `${(random(`hx${frame}`) - 0.5) * intensity * 24}px 0px` }}>
            {line2}
          </MaskLine>
        </div>
        {/* scanlines */}
        <AbsoluteFill
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)",
            opacity: 0.4 + intensity * 0.6,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const wasteSchema = {
  line1: { type: "text-content", default: "Most websites", description: "Headline line 1" },
  line2: { type: "text-content", default: "waste them.", description: "Headline line 2" },
} as const satisfies InteractivitySchema;

export const Waste = Interactive.withSchema({
  Component: WasteInner,
  componentName: "<Waste>",
  schema: wasteSchema,
  wrapInSequence: true,
});
