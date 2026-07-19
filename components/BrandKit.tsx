import type { LogoConfig } from "@/lib/generator";

export default function BrandKit({ logo }: { logo: LogoConfig }) {
  // ✅ تغییر: font → fontFamily
  const { palette, fontFamily, fontWeight, name } = logo;
  
  const fontName = fontFamily.replace(/['"]/g, "").split(",")[0].trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>Color Palette</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <div style={{ borderRadius: 8, padding: 12, background: logo.palette.bg, textAlign: "center", color: "white", fontSize: 10 }}>Primary</div>
          <div style={{ borderRadius: 8, padding: 12, background: logo.textColor, textAlign: "center", color: logo.palette.bg, fontSize: 10, fontWeight: 700 }}>Text</div>
          <div style={{ borderRadius: 8, padding: 12, background: "#f0f0f0", textAlign: "center", color: "#666", fontSize: 10 }}>Accent</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>Typography</h3>
        <div style={{ fontFamily, fontWeight: fontWeight as any, fontSize: 18, color: "#111", marginBottom: 4 }}>{name}</div>
        <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{fontName} • {fontWeight}wt</p>
      </div>
    </div>
  );
}