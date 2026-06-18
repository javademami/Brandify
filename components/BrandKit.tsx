"use client";

import type { LogoConfig } from "@/lib/generator";

export default function BrandKit({ logo }: { logo: LogoConfig }) {
  const { palette, font, fontWeight, name } = logo;

  const fontName = font.replace(/['"]/g, "").split(",")[0].trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Colors */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Brand Colors</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { color: palette.bg, label: "Primary" },
            { color: palette.primary, label: "Secondary" },
            { color: palette.accent, label: "Accent" },
          ].map((c, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 56, borderRadius: 8, background: c.color,
                border: "1px solid rgba(0,0,0,0.08)",
                marginBottom: 6,
                cursor: "pointer",
              }}
                onClick={() => navigator.clipboard.writeText(c.color)}
                title="Click to copy"
              />
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{c.label}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>{c.color.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Typography</p>
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: "1rem", border: "1px solid #f0f0f0" }}>
          <div style={{ fontFamily: font, fontWeight, fontSize: 24, color: "#111", marginBottom: 4 }}>{name}</div>
          <div style={{ fontFamily: font, fontWeight: "400", fontSize: 14, color: "#6b7280", marginBottom: 8 }}>The quick brown fox jumps over the lazy dog</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{fontName} · {fontWeight}</div>
        </div>
      </div>

      {/* Logo variations */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Logo Variations</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Dark bg */}
          <div style={{ background: palette.bg, borderRadius: 8, padding: "1rem", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo.iconPath} width={28} height={28}
              style={{ filter: logo.iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)" }} alt="" />
            <span style={{ fontFamily: font, fontWeight, fontSize: 16, color: logo.textColor }}>{name}</span>
          </div>
          {/* Light bg */}
          <div style={{ background: "#ffffff", borderRadius: 8, padding: "1rem", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo.iconPath} width={28} height={28} style={{ filter: "brightness(0)" }} alt="" />
            <span style={{ fontFamily: font, fontWeight, fontSize: 16, color: "#111111" }}>{name}</span>
          </div>
          {/* Icon only */}
          <div style={{ background: palette.bg, borderRadius: 8, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={logo.iconPath} width={40} height={40}
              style={{ filter: logo.iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)" }} alt="" />
          </div>
        </div>
      </div>

    </div>
  );
}