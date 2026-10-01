import { C, DISPLAY, MONO } from "../theme";
import { SCREEN_W } from "./Phone";

/**
 * An illustrative website ("Your Brand") that MCHINE assembles in the ad.
 * Elements are placed absolutely so scenes can reveal, scroll and tap them
 * with predictable coordinates.
 */
export const CTA_BOTTOM_Y = 2128; // centre of the lower "Book now" button

type Block = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly radius?: number;
  readonly step: number; // which reveal step shows it
  readonly children?: React.ReactNode;
  readonly fill?: string;
};

const M = 26;
const W = SCREEN_W - M * 2;

const Bars: React.FC<{ readonly widths: number[]; readonly color?: string; readonly h?: number }> = ({
  widths,
  color = "#CFCBC2",
  h = 16,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {widths.map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height: h, borderRadius: h / 2, backgroundColor: color }} />
    ))}
  </div>
);

const Hero: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 30, background: `linear-gradient(160deg, #FF7A45, ${C.signal} 45%, #8F2A06)` }}>
    <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", border: "28px solid rgba(255,255,255,0.18)", right: -90, top: -80 }} />
    <div style={{ position: "absolute", width: 210, height: 210, borderRadius: "50%", backgroundColor: "rgba(11,11,12,0.85)", left: 40, bottom: 40 }} />
    <div style={{ position: "absolute", width: 140, height: 140, backgroundColor: "#F6F4EF", right: 70, bottom: 70, rotate: "18deg", borderRadius: 18 }} />
  </div>
);

const blocks: Block[] = [
  // 0: nav
  {
    x: M, y: 86, w: W, h: 56, step: 0,
    children: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontStretch: "125%", fontSize: 26, color: C.ink }}>YOUR BRAND</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 34, height: 4, borderRadius: 2, backgroundColor: C.ink }} />
          ))}
        </div>
      </div>
    ),
  },
  // 1: hero art
  { x: M, y: 160, w: W, h: 400, radius: 30, step: 1, children: <Hero /> },
  // 2: headline
  {
    x: M, y: 588, w: W, h: 120, step: 2,
    children: (
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontStretch: "100%", fontSize: 50, lineHeight: 1.02, color: C.ink, letterSpacing: "-0.02em" }}>
        Your brand, front and centre.
      </div>
    ),
  },
  // 3: body copy
  { x: M, y: 728, w: W, h: 70, step: 3, children: <Bars widths={[92, 78, 54]} /> },
  // 4: CTA
  {
    x: M, y: 822, w: W, h: 78, step: 4,
    children: (
      <div style={{ display: "flex", gap: 14, height: "100%" }}>
        <div style={{ flex: 1.3, borderRadius: 39, backgroundColor: C.signal, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 28 }}>
          Book now →
        </div>
        <div style={{ flex: 1, borderRadius: 39, border: `3px solid ${C.ink}`, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 26 }}>
          Explore
        </div>
      </div>
    ),
  },
  // 5-7: cards
  ...[0, 1, 2].map(
    (i): Block => ({
      x: M + i * ((W + 16) / 3), y: 932, w: (W - 32) / 3, h: 176, radius: 22, step: 5 + i, fill: i === 1 ? C.ink : "#E9E5DD",
      children: (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
          <div style={{ width: 44, height: 44, borderRadius: i === 0 ? "50%" : 10, backgroundColor: C.signal, rotate: i === 2 ? "45deg" : "0deg" }} />
          <Bars widths={[90, 60]} h={12} color={i === 1 ? "#4A4A50" : "#CFCBC2"} />
        </div>
      ),
    }),
  ),
  // 8: chips
  {
    x: M, y: 1134, w: W, h: 52, step: 8,
    children: (
      <div style={{ display: "flex", gap: 10 }}>
        {["Fast", "Secure", "Mobile-first"].map((t) => (
          <div key={t} style={{ padding: "10px 18px", borderRadius: 26, backgroundColor: "#E9E5DD", fontFamily: MONO, fontWeight: 700, fontSize: 19, color: C.ink }}>
            ✓ {t}
          </div>
        ))}
      </div>
    ),
  },
  // Below the fold (always visible once revealed, used when scrolling)
  ...[0, 1, 2, 3].map(
    (i): Block => ({
      x: M + (i % 2) * ((W + 16) / 2), y: 1220 + Math.floor(i / 2) * 226, w: (W - 16) / 2, h: 210, radius: 24, step: 8,
      fill: ["#2B2B30", "#FF8A5C", "#E9E5DD", C.signal][i],
    }),
  ),
  {
    x: M, y: 1690, w: W, h: 300, step: 8,
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: C.ink }}>What we offer</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #DDD8CE", paddingBottom: 16 }}>
            <div style={{ width: `${[52, 38, 46, 30][i]}%`, height: 16, borderRadius: 8, backgroundColor: "#BDB8AE" }} />
            <div style={{ width: 30, height: 16, borderRadius: 8, backgroundColor: C.signal }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    x: M, y: 2010, w: W, h: 236, radius: 30, step: 8, fill: C.ink,
    children: (
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: C.bone }}>Ready when you are.</div>
        <div style={{ height: 80, borderRadius: 40, backgroundColor: C.signal, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 30 }}>
          Book now →
        </div>
      </div>
    ),
  },
];

export const SiteMock: React.FC<{
  /** Reveal progress (0..1) for a build step. */
  readonly reveal: (step: number) => number;
  readonly scroll?: number;
  readonly scrollBlur?: number;
  /** 0..1 press amount applied to the lower CTA */
  readonly press?: number;
}> = ({ reveal, scroll = 0, scrollBlur = 0, press = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        translate: `0px ${-scroll}px`,
        filter: scrollBlur > 0.3 ? `blur(${scrollBlur}px)` : undefined,
      }}
    >
      {blocks.map((b, i) => {
        const r = reveal(b.step);
        if (r <= 0) {
          return null;
        }
        const wire = Math.min(1, r * 2); // outline phase
        const fill = Math.max(0, r * 2 - 1); // content phase
        const isLowerCta = i === blocks.length - 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderRadius: b.radius ?? 12,
              outline: fill < 1 ? `3px dashed rgba(255,90,31,${1 - fill})` : undefined,
              outlineOffset: 4,
              scale: String((0.9 + 0.1 * wire) * (isLowerCta ? 1 - press * 0.05 : 1)),
              opacity: wire,
            }}
          >
            <div style={{ opacity: fill, width: "100%", height: "100%", position: "relative", borderRadius: b.radius ?? 12, backgroundColor: b.fill }}>
              {b.children}
            </div>
          </div>
        );
      })}
    </div>
  );
};
