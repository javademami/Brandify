"use client";

import type { LogoConfig } from "@/lib/generator";
import { useRef, useState } from "react";

interface DownloadTabProps {
  logo: LogoConfig;
  previewRef: React.RefObject<HTMLDivElement | null>;
  paid: boolean;
  onUnlock: () => void;
}

async function downloadPNG(logo: LogoConfig, previewRef: React.RefObject<HTMLDivElement | null>, size: number, label: string) {
  if (!previewRef.current) return;
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(previewRef.current, { pixelRatio: size / 480, backgroundColor: logo.palette.bg });
  const a = document.createElement("a");
  a.download = `${logo.name.toLowerCase().replace(/\s/g, "-")}-${label}.png`;
  a.href = dataUrl;
  a.click();
}

async function downloadSVG(logo: LogoConfig) {
  const { name, slogan, fontFamily, fontWeight, textColor } = logo;
  const iconFilter = logo.iconColor === "#ffffff" ? "filter: brightness(0) invert(1)" : "filter: brightness(0)";

  let inner = "";
  if (logo.layout === "textOnly") {
    inner = `<text x="160" y="80" font-family="${fontFamily}" font-weight="${fontWeight}" font-size="48" fill="${textColor}" text-anchor="middle">${name}</text>`;
  } else if (logo.layout === "iconLeft" || logo.layout === "badge") {
    inner = `
      <image href="${logo.iconPath}" x="30" y="36" width="56" height="56" style="${iconFilter}"/>
      <text x="100" y="72" font-family="${fontFamily}" font-weight="${fontWeight}" font-size="40" fill="${textColor}">${name}</text>`;
  } else {
    inner = `
      <image href="${logo.iconPath}" x="120" y="16" width="64" height="64" style="${iconFilter}"/>
      <text x="160" y="108" font-family="${fontFamily}" font-weight="${fontWeight}" font-size="36" fill="${textColor}" text-anchor="middle">${name}</text>`;
  }

  const svg = `<svg width="320" height="120" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="120" rx="12" fill="${logo.palette.bg}"/>
  ${inner}
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = `${logo.name.toLowerCase().replace(/\s/g, "-")}-logo.svg`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadFavicon(logo: LogoConfig, previewRef: React.RefObject<HTMLDivElement | null>) {
  if (!previewRef.current) return;
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(previewRef.current, { pixelRatio: 32 / 480, backgroundColor: logo.palette.bg });

  const img = new Image();
  img.src = dataUrl;
  await new Promise(r => { img.onload = r; });
  const canvas = document.createElement("canvas");
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 32, 32);

  const a = document.createElement("a");
  a.download = `${logo.name.toLowerCase().replace(/\s/g, "-")}-favicon.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

const FILES = [
  { label: "Logo PNG (High Res)", desc: "2000×800px for print & social", icon: "🖼", action: "png-large" },
  { label: "Logo PNG (Web)", desc: "600×240px for websites", icon: "📄", action: "png-small" },
  { label: "Logo SVG", desc: "Vector format - scales infinitely", icon: "✦", action: "svg" },
  { label: "Favicon PNG", desc: "32×32px for browser tab", icon: "⭐", action: "favicon" },
];

export default function DownloadTab({ logo, previewRef, paid, onUnlock }: DownloadTabProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload(action: string) {
    if (!paid) { onUnlock(); return; }
    setDownloading(true);
    try {
      if (action === "png-large") await downloadPNG(logo, previewRef, 2000, "2000px");
      if (action === "png-small") await downloadPNG(logo, previewRef, 600, "600px");
      if (action === "svg") await downloadSVG(logo);
      if (action === "favicon") await downloadFavicon(logo, previewRef);
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {!paid && (
        <div style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          borderRadius: 12,
          padding: "1rem",
          color: "white",
          textAlign: "center",
          marginBottom: 4,
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🔒</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Unlock all files</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>PNG, SVG, Favicon for $5</div>
          <button onClick={onUnlock} style={{
            background: "white", color: "#4f46e5", border: "none", borderRadius: 8,
            padding: "8px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            Unlock Download
          </button>
        </div>
      )}

      {FILES.map(f => (
        <div key={f.action} onClick={() => handleDownload(f.action)} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px", borderRadius: 10,
          border: "1.5px solid #f0f0f0",
          cursor: "pointer", background: "white",
          opacity: paid ? 1 : 0.5,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { if(paid) (e.currentTarget as HTMLDivElement).style.borderColor = "#4f46e5"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#f0f0f0"; }}
        >
          <span style={{ fontSize: 22 }}>{f.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{f.label}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{f.desc}</div>
          </div>
          <span style={{ fontSize: 12, color: paid ? "#4f46e5" : "#d1d5db" }}>
            {downloading ? "⏳" : paid ? "⬇" : "🔒"}
          </span>
        </div>
      ))}
    </div>
  );
}