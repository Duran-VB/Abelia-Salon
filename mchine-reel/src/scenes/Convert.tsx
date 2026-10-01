import { AbsoluteFill, Interactive, useCurrentFrame, type InteractivitySchema } from "remotion";
import { Grid } from "../components/Atmosphere";
import { MaskLine } from "../components/MaskLine";
import { Phone } from "../components/Phone";
import { SiteMock } from "../components/SiteMock";
import { C, DISPLAY, displayStyle, EXPO_OUT, MONO, tween } from "../theme";

const PHONE_LEFT = 260;
const PHONE_TOP = 720;
const SCROLL_TO = 1560;
const BUTTON_Y = 2146; // centre of the lower CTA inside the site
const TAP_AT = 32;
const TOASTS_AT = [38, 48, 58];

type ConvertProps = {
  readonly lead: string;
  readonly before: string;
  readonly after: string;
  readonly toasts: string;
  readonly style?: React.CSSProperties;
};

/** 15.5-18s: fast scroll, a tap on "Book now", notifications roll in. */
const ConvertInner: React.FC<ConvertProps> = ({ lead, before, after, toasts, style }) => {
  const frame = useCurrentFrame();
  const scroll = tween(frame, [0, 30], [0, SCROLL_TO], EXPO_OUT);
  const velocity = scroll - tween(frame - 1, [0, 30], [0, SCROLL_TO], EXPO_OUT);
  const press = tween(frame, [TAP_AT, TAP_AT + 3], [0, 1]) - tween(frame, [TAP_AT + 4, TAP_AT + 10], [0, 1]);
  const tapX = PHONE_LEFT + 18 + 262;
  const tapY = PHONE_TOP + 18 + (BUTTON_Y - SCROLL_TO);
  const ripple = tween(frame, [TAP_AT, TAP_AT + 14], [0, 1]);
  const strike = tween(frame, [44, 50], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
      <Grid opacity={0.8} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 80%, rgba(255,90,31,0.25), transparent 50%)` }} />

      <div style={{ position: "absolute", top: 250, left: 60, right: 60, textAlign: "center" }}>
        <MaskLine enter={3} style={{ ...displayStyle(56), color: C.mute, fontStretch: "110%" }}>
          {lead}
        </MaskLine>
        <div style={{ position: "relative", display: "inline-block" }}>
          <MaskLine enter={24} style={{ ...displayStyle(108), color: frame > 46 ? C.mute : C.bone }}>
            {before}
          </MaskLine>
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "50%",
              height: 12,
              backgroundColor: C.signal,
              scale: `${strike} 1`,
              transformOrigin: "left center",
            }}
          />
        </div>
        <MaskLine enter={48} style={{ ...displayStyle(100), color: C.signal }}>
          {after}
        </MaskLine>
      </div>

      <Phone style={{ left: PHONE_LEFT, top: PHONE_TOP + tween(frame, [0, 12], [200, 0], EXPO_OUT) }}>
        <SiteMock reveal={() => 1} scroll={scroll} scrollBlur={Math.min(18, velocity * 0.12)} press={press} />
      </Phone>

      {/* touch ripple */}
      <div
        style={{
          position: "absolute",
          left: tapX - 60,
          top: tapY - 60,
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `6px solid ${C.bone}`,
          backgroundColor: "rgba(237,235,230,0.25)",
          scale: String(0.4 + ripple * 1.4),
          opacity: frame >= TAP_AT ? 1 - ripple : 0,
        }}
      />

      {/* notifications */}
      {toasts.split("|").map((t, i) => {
        const at = TOASTS_AT[i] ?? 60;
        const p = tween(frame, [at, at + 9], [0, 1], EXPO_OUT);
        if (frame < at) {
          return null;
        }
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: 150,
              right: 150,
              top: 760 + i * 128,
              height: 108,
              borderRadius: 30,
              backgroundColor: "rgba(246,244,239,0.97)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 26px",
              opacity: p,
              translate: `0px ${(1 - p) * -90}px`,
              scale: String(0.9 + 0.1 * p),
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.signal, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>
              ✓
            </div>
            <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: C.ink }}>{t}</div>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.mute }}>now</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const convertSchema = {
  lead: { type: "text-content", default: "Made to turn", description: "Lead-in line" },
  before: { type: "text-content", default: "scrollers", description: "Struck-through word" },
  after: { type: "text-content", default: "customers.", description: "Payoff word" },
  toasts: { type: "text-content", default: "New booking|New enquiry|New order", description: "Notifications (| separated)" },
} as const satisfies InteractivitySchema;

export const Convert = Interactive.withSchema({
  Component: ConvertInner,
  componentName: "<Convert>",
  schema: convertSchema,
  wrapInSequence: true,
});
