import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";

export const alt = "Serkan Korkut — project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#ff6600";
const BG = "#0c0d0f";
const FG = "#f0eee9";
const MUTED = "#9a9a93";
const BORDER = "#27272a";
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BG,
            color: FG,
            fontFamily: MONO,
            fontSize: 48,
          }}
        >
          serkankorkut.dev
        </div>
      ),
      { ...size }
    );
  }

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
          padding: 72,
        }}
      >
        {/* Top: number · year · kind */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <span style={{ color: ACCENT, fontWeight: 700 }}>{project.n}</span>
          <span>·</span>
          <span>{project.year}</span>
          <span>·</span>
          <span>{project.kind.en}</span>
        </div>

        {/* Title + stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {project.title.en}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {project.stack.slice(0, 6).map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: MUTED,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  padding: "6px 14px",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
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
          <span style={{ color: FG, fontWeight: 600 }}>serkankorkut</span>
          <span>.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
