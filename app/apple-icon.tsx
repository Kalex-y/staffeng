import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B2D4F",
          fontSize: 86,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -2,
        }}
      >
        <span style={{ color: "#FFFFFF" }}>S</span>
        <span style={{ color: "#60A5FA" }}>E</span>
      </div>
    ),
    { ...size }
  );
}
