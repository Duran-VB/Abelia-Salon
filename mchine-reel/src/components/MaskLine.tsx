import { useCurrentFrame } from "remotion";
import { EXPO_IN, tween } from "../theme";

/** A line of text that rises into a mask on `enter` and leaves upward on `exit`. */
export const MaskLine: React.FC<{
  readonly children: React.ReactNode;
  readonly enter: number;
  readonly exit?: number;
  readonly style?: React.CSSProperties;
  readonly absolute?: boolean;
}> = ({ children, enter, exit, style, absolute }) => {
  const frame = useCurrentFrame();
  const inP = tween(frame, [enter, enter + 11], [1.05, 0]);
  const outP = exit === undefined ? 0 : tween(frame, [exit, exit + 8], [0, -1.05], EXPO_IN);
  const offset = inP + outP;
  const blur = Math.abs(offset) * 10;
  const hidden = Math.abs(offset) > 0.97;
  return (
    <div
      style={{
        overflow: "hidden",
        padding: "0.04em 0.02em 0.08em",
        ...(absolute ? { position: "absolute", left: 0, right: 0 } : {}),
      }}
    >
      <div
        style={{
          ...style,
          translate: `0px ${offset * 100}%`,
          opacity: hidden ? 0 : 1,
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};
