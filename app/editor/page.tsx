"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import type { LogoConfig } from "@/lib/generator";
import DownloadTab from "@/components/Downloadtab";

function LogoPreview({ logo, scale = 1 }: { logo: LogoConfig; scale?: number }) {
  const { name, slogan, iconPath, palette, layout, font, fontWeight, textColor, iconColor } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  const iconSize = layout === "iconBig" ? 64 : layout === "badge" ? 32 : 48;

  const inner = () => {
    if (layout === "textOnly") return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: font, fontWeight, fontSize: 32 * scale, color: textColor, letterSpacing: "0.04em" }}>{name}</span>
        {slogan && <span style={{ fontFamily: font, fontSize: 13 * scale, color: textColor, opacity: 0.7, letterSpacing: "0.12em" }}>{slogan.toUpperCase()}</span>}
      </div>
    );
    if (layout === "iconLeft" || layout === "badge") return (
      <div style={{ display: "flex", alignItems: "center", gap: 18 * scale }}>
        <img src={iconPath} width={iconSize * scale} height={iconSize * scale} style={{ filter: iconFilter }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: font, fontWeight, fontSize: (layout === "badge" ? 20 : 26) * scale, color: textColor }}>{name}</span>
          {slogan && layout !== "badge" && <span style={{ fontFamily: font, fontSize: 12 * scale, color: textColor, opacity: 0.65, letterSpacing: "0.1em" }}>{slogan.toUpperCase()}</span>}
        </div>
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * scale }}>
        <img src={iconPath} width={iconSize * scale} height={iconSize * scale} style={{ filter: iconFilter }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: font, fontWeight, fontSize: (layout === "iconBig" ? 26 : 22) * scale, color: textColor, letterSpacing: "0.04em" }}>{name}</span>
          {slogan && <span style={{ fontFamily: font, fontSize: 12 * scale, color: textColor, opacity: 0.65, letterSpacing: "0.12em" }}>{slogan.toUpperCase()}</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: palette.bg, borderRadius: "12px", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      {inner()}
    </div>
  );
}

const FONTS = [
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
];

const LAYOUTS = [
  { label: "Icon Top", value: "iconTop" },
  { label: "Icon Left", value: "iconLeft" },
  { label: "Icon Big", value: "iconBig" },
  { label: "Badge", value: "badge" },
  { label: "Text Only", value: "textOnly" },
];

const RADII = [
  { label: "Sharp", value: "0px" },
  { label: "Small", value: "8px" },
  { label: "Medium", value: "16px" },
  { label: "Large", value: "24px" },
  { label: "Pill", value: "999px" },
];

function EditorInner() {
  const params = useSearchParams();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<LogoConfig | null>(null);
  const [paid, setPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "layout" | "brand" | "downloads">("colors");

  useEffect(() => {
    const data = params.get("data");
    if (data) {
      try {
        setLogo(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Invalid logo data");
      }
    }
  }, [params]);

  if (!logo) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16 }}>
      <p style={{ color: "#6b7280", fontSize: 15 }}>No logo selected.</p>
      <button onClick={() => router.push("/generate")} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 14 }}>
        ← Go back
      </button>
    </div>
  );


  const update = (patch: Partial<LogoConfig>) => setLogo(prev => prev ? { ...prev, ...patch } : prev);
  const updatePalette = (patch: Partial<LogoConfig["palette"]>) =>
    setLogo(prev => prev ? { ...prev, palette: { ...prev.palette, ...patch } } : prev);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f8f8" }}>

      <div style={{ height: 56, background: "white", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}>
            ← Back
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>Brandify</span>
        </div>
        <div>
          <button onClick={() => setActiveTab("downloads")} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ⬇ Downloads
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", gap: 24 }}>
          <div ref={previewRef} style={{ width: 480, height: 240, borderRadius: logo.borderRadius, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <LogoPreview logo={logo} />
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {[0.4, 0.25, 0.15].map((s, i) => (
              <div key={i} style={{ borderRadius: logo.borderRadius, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0, width: 480 * s, height: 240 * s }}>
                <LogoPreview logo={logo} scale={s} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>Preview at different sizes</p>
        </div>

        <div style={{ width: 320, background: "white", borderLeft: "1px solid #f0f0f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
            {(["colors", "typography", "layout", "brand", "downloads"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "12px 0", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize",
                background: activeTab === tab ? "white" : "#f9fafb",
                color: activeTab === tab ? "#4f46e5" : "#6b7280",
                borderBottom: activeTab === tab ? "2px solid #4f46e5" : "2px solid transparent",
              }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>

            {activeTab === "colors" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Background</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={logo.palette.bg} onChange={e => updatePalette({ bg: e.target.value })}
                      style={{ width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                    <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>{logo.palette.bg}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Text Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={logo.textColor} onChange={e => update({ textColor: e.target.value })}
                      style={{ width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                    <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>{logo.textColor}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Icon Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="color" value={logo.iconColor === "#ffffff" ? "#ffffff" : logo.iconColor}
                      onChange={e => update({ iconColor: e.target.value })}
                      style={{ width: 40, height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                    <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>{logo.iconColor}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Quick Palettes</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                    {[
                      { bg: "#000000", text: "#D4AF37", icon: "#D4AF37" },
                      { bg: "#0f172a", text: "#3b82f6", icon: "#ffffff" },
                      { bg: "#ffffff", text: "#111111", icon: "#111111" },
                      { bg: "#1e3a8a", text: "#ffffff", icon: "#ffffff" },
                      { bg: "#dc2626", text: "#ffffff", icon: "#ffffff" },
                      { bg: "#065f46", text: "#6ee7b7", icon: "#ffffff" },
                      { bg: "#4f46e5", text: "#ffffff", icon: "#ffffff" },
                      { bg: "#7c3aed", text: "#f9a8d4", icon: "#ffffff" },
                    ].map((p, i) => (
                      <div key={i} onClick={() => { updatePalette({ bg: p.bg }); update({ textColor: p.text, iconColor: p.icon }); }}
                        style={{ height: 32, borderRadius: 6, background: p.bg, border: "2px solid #e5e7eb", cursor: "pointer" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Font</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {FONTS.map(f => (
                      <button key={f.value} onClick={() => update({ font: f.value })} style={{
                        padding: "8px 12px", borderRadius: 6, border: logo.font === f.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.font === f.value ? "#eef2ff" : "white", cursor: "pointer", textAlign: "left",
                        fontFamily: f.value, fontSize: 13, color: logo.font === f.value ? "#4338ca" : "#374151", fontWeight: 500,
                      }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Font Weight</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["400", "500", "600", "700", "800"].map(w => (
                      <button key={w} onClick={() => update({ fontWeight: w })} style={{
                        padding: "6px 10px", borderRadius: 6, border: logo.fontWeight === w ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.fontWeight === w ? "#eef2ff" : "white", cursor: "pointer", fontSize: 12,
                        fontWeight: w as any, color: logo.fontWeight === w ? "#4338ca" : "#6b7280",
                      }}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Layout</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {LAYOUTS.map(l => (
                      <button key={l.value} onClick={() => update({ layout: l.value as any })} style={{
                        padding: "8px 12px", borderRadius: 6, border: logo.layout === l.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.layout === l.value ? "#eef2ff" : "white", cursor: "pointer", textAlign: "left",
                        fontSize: 13, color: logo.layout === l.value ? "#4338ca" : "#374151", fontWeight: logo.layout === l.value ? 600 : 500,
                      }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Border Radius</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {RADII.map(r => (
                      <button key={r.value} onClick={() => update({ borderRadius: r.value })} style={{
                        padding: "6px 10px", borderRadius: 6, border: logo.borderRadius === r.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.borderRadius === r.value ? "#eef2ff" : "white", cursor: "pointer",
                        fontSize: 12, color: logo.borderRadius === r.value ? "#4338ca" : "#6b7280",
                      }}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "brand" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Brand Colors</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { color: logo.palette.bg, label: "Primary" },
                      { color: logo.textColor, label: "Text" },
                      { color: logo.iconColor, label: "Icon" },
                    ].map((c, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ height: 48, borderRadius: 6, background: c.color, border: "1px solid #e5e7eb", marginBottom: 6, cursor: "pointer" }}
                          onClick={() => navigator.clipboard.writeText(c.color)} />
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{c.label}</div>
                        <div style={{ fontSize: 9, color: "#9ca3af", fontFamily: "monospace" }}>{c.color}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Typography</p>
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: "0.75rem", border: "1px solid #f0f0f0" }}>
                    <div style={{ fontFamily: logo.font, fontWeight: logo.fontWeight as any, fontSize: 18, color: "#111", marginBottom: 3 }}>{logo.name}</div>
                    <div style={{ fontFamily: logo.font, fontWeight: "400", fontSize: 12, color: "#6b7280" }}>The quick brown fox</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Weight: {logo.fontWeight}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "downloads" && (
              <DownloadTab logo={logo} previewRef={previewRef} paid={paid} onUnlock={() => setPaid(true)} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#6b7280" }}>Loading...</div>}>
      <EditorInner />
    </Suspense>
  );
}