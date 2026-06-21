import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = "Serkan Korkut — Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff6600";
const BG = "#0c0d0f";
const FG = "#f0eee9";
const MUTED = "#9a9a93";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: FG,
          fontFamily: MONO,
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: ACCENT,
            }}
          />
          <span>@ MapaGlobal · İstanbul</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", fontSize: 40, color: ACCENT }}>
            {SITE_TAGLINE}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
          spring boot · mssql · oracle · nodejs · .net —{" "}
          <span style={{ color: FG, marginLeft: 8 }}>serkankorkut.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
