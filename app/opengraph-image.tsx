import { ImageResponse } from "next/og";

export const alt = "staffeng.co — Senior Staff Engineers for Hire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#1B2D4F",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            SE
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 36, fontWeight: 600 }}>
            <span>Staff</span>
            <span style={{ color: "#60A5FA" }}>Eng</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            color: "white",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Senior staff engineers who build with AI
        </div>

        <div
          style={{
            marginTop: 28,
            color: "rgba(255,255,255,0.6)",
            fontSize: 30,
            maxWidth: 820,
          }}
        >
          Hire Staff &amp; Principal engineers directly. No recruiters, no
          agencies.
        </div>
      </div>
    ),
    { ...size }
  );
}
