import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Engineering grid that slowly drifts: the "machine" backdrop. */
export const Grid: React.FC<{ readonly opacity?: number; readonly size?: number }> = ({
  opacity = 1,
  size = 90,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${(frame * 0.6) % size}px ${(frame * 1.2) % size}px`,
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
};

/** Animated film grain + vignette, rendered over every frame. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.11, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
