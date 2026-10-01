import { C, MONO } from "../theme";

export const PHONE_W = 560;
export const PHONE_H = 1140;
export const SCREEN_W = PHONE_W - 36;
export const SCREEN_H = PHONE_H - 36;

/** Minimal phone bezel. Children render inside the screen. */
export const Phone: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 86,
        background: "linear-gradient(145deg, #2a2a2f, #070708 40%)",
        padding: 18,
        boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 0 3px #303036, 0 0 80px rgba(255,90,31,0.12)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 68,
          overflow: "hidden",
          backgroundColor: "#F6F4EF",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            translate: "-50% 0px",
            width: 150,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#050505",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 48,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            color: C.ink,
          }}
        >
          9:41
        </div>
      </div>
    </div>
  );
};
