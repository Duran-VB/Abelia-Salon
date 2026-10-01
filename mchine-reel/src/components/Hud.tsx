import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, monoStyle } from "../theme";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

/** Machine-precision overlay: corner registration marks + running timecode. */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const secs = frame / fps;
  const corner = (rot: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 34,
        height: 34,
        borderTop: `3px solid ${C.bone}`,
        borderLeft: `3px solid ${C.bone}`,
        rotate: `${rot}deg`,
        opacity: 0.55,
        ...pos,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "difference" }}>
      {corner(0, { left: 48, top: 220 })}
      {corner(90, { right: 48, top: 220 })}
      {corner(270, { left: 48, bottom: 300 })}
      {corner(180, { right: 48, bottom: 300 })}
      <div
        style={{
          ...monoStyle(22),
          position: "absolute",
          top: 170,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
          color: C.bone,
          opacity: 0.6,
        }}
      >
        <span>
          <span style={{ color: C.signal }}>■</span> MCHINE / REEL 01
        </span>
        <span>
          00:{pad(secs)}:{pad((frame % fps) * (100 / fps))}
        </span>
      </div>
    </AbsoluteFill>
  );
};
