"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import type { LogoConfig } from "@/lib/generator";
import DownloadTab from "@/components/Downloadtab";

function LogoPreview({ logo, scale = 1 }: { logo: LogoConfig; scale?: number }) {
  const { name, slogan, iconPath, palette, layout, font, fontSize, fontWeight, textColor, background, effect } = logo;
  const iconSize = layout === "iconBig" ? 72 : layout === "badge" ? 48 : 60;
  const bgStyle = background?.includes("linear") ? { background } : { background: background || palette.bg };

  const effectStyles: Record<string, React.CSSProperties> = {
    none: {},
    glow: { boxShadow: `0 0 30px ${textColor}44, inset 0 0 20px ${textColor}22` },
    metallic: { boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.2)" },
    shadow: { boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)" },
    neon: { boxShadow: `0 0 20px ${textColor}66, 0 0 40px ${textColor}33`, textShadow: `0 0 10px ${textColor}99` },
  };

  const textStyle: React.CSSProperties = effect === "neon" ? { textShadow: `0 0 8px ${textColor}88, 0 0 15px ${textColor}55` } : {};

  const inner = () => {
    if (layout === "textOnly") return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
        <span style={{ fontFamily: font, fontWeight, fontSize: (fontSize + 6) * scale, color: textColor, letterSpacing: "0.02em", ...textStyle }}>{name}</span>
        {slogan && <span style={{ fontFamily: font, fontSize: 12 * scale, color: textColor, opacity: 0.6 }}>{slogan.toUpperCase()}</span>}
      </div>
    );
    if (layout === "horizontalBar") return (
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 14 * scale }}>
        <img src={iconPath} width={48 * scale} height={48 * scale} alt="" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font, fontWeight, fontSize: (fontSize + 2) * scale, color: textColor, ...textStyle }}>{name}</div>
          {slogan && <div style={{ fontFamily: font, fontSize: 10 * scale, color: textColor, opacity: 0.6 }}>{slogan}</div>}
        </div>
      </div>
    );
    if (layout === "badge") return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 * scale }}>
        <img src={iconPath} width={iconSize * scale} height={iconSize * scale} alt="" />
        <span style={{ fontFamily: font, fontWeight, fontSize: (fontSize + 2) * scale, color: textColor, ...textStyle }}>{name}</span>
      </div>
    );
    if (layout === "iconLeft") return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 * scale }}>
        <img src={iconPath} width={iconSize * scale} height={iconSize * scale} alt="" />
        <div>
          <div style={{ fontFamily: font, fontWeight, fontSize: (fontSize + 2) * scale, color: textColor, ...textStyle }}>{name}</div>
          {slogan && <div style={{ fontFamily: font, fontSize: 11 * scale, color: textColor, opacity: 0.6 }}>{slogan.toUpperCase()}</div>}
        </div>
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * scale }}>
        <img src={iconPath} width={iconSize * scale} height={iconSize * scale} alt="" />
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: font, fontWeight, fontSize: (fontSize + 2) * scale, color: textColor, ...textStyle }}>{name}</span>
          {slogan && <div style={{ fontFamily: font, fontSize: 11 * scale, color: textColor, opacity: 0.6 }}>{slogan.toUpperCase()}</div>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ ...bgStyle, borderRadius: logo.borderRadius, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", ...effectStyles[effect] }}>
      {inner()}
    </div>
  );
}

const FONTS = [
  { label: "Playfair", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Cormorant", value: "'Cormorant Garamond', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
];

const LAYOUTS = [
  { label: "Icon Top", value: "iconTop" },
  { label: "Icon Left", value: "iconLeft" },
  { label: "Icon Big", value: "iconBig" },
  { label: "Badge", value: "badge" },
  { label: "Text Only", value: "textOnly" },
  { label: "Horizontal", value: "horizontalBar" },
];

const RADII = [
  { label: "Sharp", value: "0px" },
  { label: "Small", value: "8px" },
  { label: "Medium", value: "16px" },
  { label: "Large", value: "24px" },
  { label: "Pill", value: "999px" },
];

const EFFECTS = [
  { label: "None", value: "none" },
  { label: "Glow", value: "glow" },
  { label: "Metallic", value: "metallic" },
  { label: "Shadow", value: "shadow" },
  { label: "Neon", value: "neon" },
];

function EditorInner() {
  const params = useSearchParams();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<LogoConfig | null>(null);
  const [paid, setPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "layout" | "effects" | "brand" | "downloads">("colors");

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f8f8" }}>

      <div style={{ height: 56, background: "white", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13 }}>
            ← Back
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>Brandify Editor</span>
        </div>
        <button onClick={() => setActiveTab("downloads")} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ⬇ Downloads
        </button>
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

          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", flexWrap: "wrap" }}>
            {(["colors", "typography", "layout", "effects", "brand", "downloads"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, minWidth: 55, padding: "10px 0", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", textTransform: "capitalize",
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
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Background</label>
                  <input type="color" value={logo.background?.includes("linear") ? logo.palette.bg : (logo.background || logo.palette.bg)} onChange={e => update({ background: e.target.value })}
                    style={{ width: "100%", height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Text Color</label>
                  <input type="color" value={logo.textColor} onChange={e => update({ textColor: e.target.value })}
                    style={{ width: "100%", height: 40, borderRadius: 8, border: "none", cursor: "pointer" }} />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Quick Colors</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                    {[
                      { bg: "#000000", text: "#D4AF37" },
                      { bg: "#0f172a", text: "#3b82f6" },
                      { bg: "#ffffff", text: "#111111" },
                      { bg: "#dc2626", text: "#ffffff" },
                      { bg: "#065f46", text: "#6ee7b7" },
                      { bg: "#4f46e5", text: "#ffffff" },
                      { bg: "#1e3a8a", text: "#ffffff" },
                      { bg: "#7c3aed", text: "#f9a8d4" },
                    ].map((p, i) => (
                      <div key={i} onClick={() => { update({ background: p.bg, textColor: p.text }); }}
                        style={{ height: 32, borderRadius: 6, background: p.bg, border: "2px solid #e5e7eb", cursor: "pointer" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "typography" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Font</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {FONTS.map(f => (
                      <button key={f.value} onClick={() => update({ font: f.value })} style={{
                        padding: "8px 12px", borderRadius: 6, border: logo.font === f.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.font === f.value ? "#eef2ff" : "white", cursor: "pointer", textAlign: "left",
                        fontFamily: f.value, fontSize: 12, color: logo.font === f.value ? "#4338ca" : "#374151",
                      }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Font Weight</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["400", "600", "700", "800", "900"].map(w => (
                      <button key={w} onClick={() => update({ fontWeight: w })} style={{
                        padding: "6px 10px", borderRadius: 6, border: logo.fontWeight === w ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.fontWeight === w ? "#eef2ff" : "white", cursor: "pointer", fontSize: 11,
                        fontWeight: w as any, color: logo.fontWeight === w ? "#4338ca" : "#6b7280",
                      }}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Size</label>
                  <input type="range" min="16" max="28" value={logo.fontSize} onChange={e => update({ fontSize: parseInt(e.target.value) })}
                    style={{ width: "100%", cursor: "pointer" }} />
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{logo.fontSize}px</div>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {LAYOUTS.map(l => (
                      <button key={l.value} onClick={() => update({ layout: l.value as any })} style={{
                        padding: "10px 12px", borderRadius: 6, border: logo.layout === l.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.layout === l.value ? "#eef2ff" : "white", cursor: "pointer", textAlign: "left",
                        fontSize: 12, color: logo.layout === l.value ? "#4338ca" : "#374151", fontWeight: logo.layout === l.value ? 600 : 500,
                      }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>Radius</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {RADII.map(r => (
                      <button key={r.value} onClick={() => update({ borderRadius: r.value })} style={{
                        padding: "6px 10px", borderRadius: 6, border: logo.borderRadius === r.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                        background: logo.borderRadius === r.value ? "#eef2ff" : "white", cursor: "pointer",
                        fontSize: 11, color: logo.borderRadius === r.value ? "#4338ca" : "#6b7280",
                      }}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "effects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {EFFECTS.map(e => (
                    <button key={e.value} onClick={() => update({ effect: e.value as any })} style={{
                      padding: "10px 12px", borderRadius: 6, border: logo.effect === e.value ? "2px solid #4f46e5" : "1.5px solid #e5e7eb",
                      background: logo.effect === e.value ? "#eef2ff" : "white", cursor: "pointer", textAlign: "left",
                      fontSize: 12, color: logo.effect === e.value ? "#4338ca" : "#374151", fontWeight: logo.effect === e.value ? 600 : 500,
                    }}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "brand" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>Primary</p>
                <div style={{ height: 48, borderRadius: 6, background: logo.background?.includes("linear") ? logo.palette.bg : (logo.background || logo.palette.bg), border: "1px solid #e5e7eb", cursor: "pointer" }}
                  onClick={() => navigator.clipboard.writeText(logo.background || logo.palette.bg)} />
                <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280" }}>Text</p>
                <div style={{ height: 48, borderRadius: 6, background: logo.textColor, border: "1px solid #e5e7eb", cursor: "pointer" }}
                  onClick={() => navigator.clipboard.writeText(logo.textColor)} />
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