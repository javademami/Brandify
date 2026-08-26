"use client";

import { useEffect, useState } from "react";
import type { LogoConfig } from "@/lib/generator";

function isLightColor(bgColor: string): boolean {
  if (bgColor.includes("linear-gradient") || bgColor.includes("radial-gradient")) return false;
  let r = 0, g = 0, b = 0;
  if (bgColor.startsWith("#")) {
    const hex = bgColor.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16); g = parseInt(hex.slice(2, 4), 16); b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (bgColor.startsWith("rgb")) {
    const match = bgColor.match(/\d+/g); if (match) [r, g, b] = match.map(Number);
  }
  return (r + g + b) / 3 > 128;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function fillTemplate(svg: string, logo: LogoConfig): string {
  const replaceText = (source: string, key: string, value: string) =>
    source.replace(new RegExp(`(<(?:text|textPath)[^>]*data-logo=["']${key}["'][^>]*>)[\\s\\S]*?(</(?:text|textPath)>)`, "i"), `$1${escapeXml(value)}$2`);

  let out = svg;
  out = replaceText(out, "name", logo.name || "BRAND NAME");
  out = replaceText(out, "slogan", logo.slogan || "YOUR SLOGAN HERE");
  out = replaceText(out, "year", "2026");
  out = replaceText(out, "category", "PREMIUM COFFEE");

  // Keep the template's authored palette intact by default. This avoids
  // accidentally recoloring detailed artwork; V2 color controls can be added
  // later with explicit data-logo-color attributes.
  return out;
}

export default function LogoView({ logo, selected, onClick }: { logo: LogoConfig; selected?: boolean; onClick?: () => void }) {
  const [v2Svg, setV2Svg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!logo.isV2) { setV2Svg(null); return; }
    fetch(logo.iconPath)
      .then((r) => { if (!r.ok) throw new Error(`V2 template HTTP ${r.status}`); return r.text(); })
      .then((svg) => { if (!cancelled) setV2Svg(fillTemplate(svg, logo)); })
      .catch((err) => { console.error("[LogoEngine V2] template load failed", err); if (!cancelled) setV2Svg(null); });
    return () => { cancelled = true; };
  }, [logo.isV2, logo.iconPath, logo.name, logo.slogan]);

  const bgColor = logo.background?.includes("linear") ? logo.background : logo.background || logo.palette.bg;
  const isFramed = logo.frameStyle !== "none";
  const bgIsLight = isLightColor(bgColor);
  const effectBoxShadow = ({ none: "0 2px 8px rgba(0,0,0,0.1)", glow: `0 0 20px ${logo.textColor}40`, metallic: "0 4px 12px rgba(212, 175, 55, 0.2)", shadow: "0 8px 16px rgba(0,0,0,0.2)", neon: `0 0 15px ${logo.textColor}50` } as Record<string,string>)[logo.effect] || "0 2px 8px rgba(0,0,0,0.1)";

  const v2Content = logo.isV2 ? (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {v2Svg ? <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: v2Svg }} /> : <div style={{ fontSize: 12, opacity: .65 }}>Loading V2…</div>}
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, padding: 8 }}>
      {logo.iconPath && <img src={logo.iconPath} alt="icon" style={{ width: "35%", maxWidth: 98, height: "auto", aspectRatio: "1 / 1", flexShrink: 0, marginBottom: 10 }} />}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, gap: 6 }}>
        <div style={{ fontFamily: logo.fontFamily, fontWeight: logo.fontWeight, color: isFramed && !bgIsLight ? "#d4af37" : isFramed ? "#1a1a1a" : logo.textColor, fontSize: isFramed ? 18 : logo.fontSize, lineHeight: 1.1, textAlign: "center", wordBreak: "break-word", maxWidth: "100%" }}>{logo.name}</div>
        {logo.slogan && <div style={{ fontFamily: logo.sloganFont || logo.fontFamily, color: isFramed && !bgIsLight ? "#d4af37" : isFramed ? "#1a1a1a" : logo.textColor, fontSize: Math.max(10, Math.floor((isFramed ? 18 : logo.fontSize) * .35)), textAlign: "center", wordBreak: "break-word", maxWidth: "100%", opacity: .85 }}>{logo.slogan}</div>}
      </div>
    </div>
  );

  return (
    <div onClick={onClick} style={{ position: "relative", background: bgColor, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: selected ? "2.5px solid #6366f1" : "1px solid rgba(255,255,255,0.1)", padding: 8, boxSizing: "border-box", boxShadow: effectBoxShadow, overflow: "hidden" }}>
      {logo.isV2 && <div data-testid="logo-engine-v2-marker" style={{ position: "absolute", top: 6, right: 6, zIndex: 20, padding: "2px 7px", borderRadius: 999, background: "#6366f1", color: "#fff", fontSize: 10, lineHeight: "14px", fontWeight: 800, fontFamily: "Arial, sans-serif", pointerEvents: "none" }}>V2</div>}
      {v2Content}
    </div>
  );
}
