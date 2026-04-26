"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SAMPLE_LOGOS = [
  {
    name: "Kardia",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#1e3a8a"/>
      <path d="M16 20 L16 44 M16 32 L26 20 M16 32 L26 44" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <text x="36" y="38" font-family="Georgia,serif" font-size="18" font-weight="700" fill="white" letter-spacing="1">KARDIA</text>
    </svg>`,
    industry: "Health",
  },
  {
    name: "Apex",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#000"/>
      <polygon points="28,48 40,18 52,48" fill="none" stroke="#D4AF37" stroke-width="2"/>
      <text x="62" y="38" font-family="Arial,sans-serif" font-size="16" font-weight="900" fill="#D4AF37" letter-spacing="3">APEX</text>
    </svg>`,
    industry: "Finance",
  },
  {
    name: "Bloom",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#fdf2f8"/>
      <circle cx="28" cy="32" r="11" fill="#db2777" opacity="0.15"/>
      <circle cx="28" cy="21" r="6" fill="#db2777" opacity="0.7"/>
      <circle cx="39" cy="32" r="6" fill="#db2777" opacity="0.7"/>
      <circle cx="28" cy="43" r="6" fill="#db2777" opacity="0.7"/>
      <circle cx="17" cy="32" r="6" fill="#db2777" opacity="0.7"/>
      <circle cx="28" cy="32" r="4" fill="#db2777"/>
      <text x="50" y="37" font-family="Georgia,serif" font-size="18" font-weight="400" fill="#db2777" letter-spacing="2">Bloom</text>
    </svg>`,
    industry: "Beauty",
  },
  {
    name: "Cipher",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#0B0C10"/>
      <rect x="14" y="18" width="28" height="28" rx="3" fill="none" stroke="#66FCF1" stroke-width="1.5"/>
      <line x1="14" y1="32" x2="42" y2="32" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
      <line x1="28" y1="18" x2="28" y2="46" stroke="#66FCF1" stroke-width="1" opacity="0.4"/>
      <circle cx="28" cy="32" r="4" fill="#66FCF1"/>
      <text x="52" y="37" font-family="monospace" font-size="16" font-weight="700" fill="#66FCF1" letter-spacing="2">CIPHER</text>
    </svg>`,
    industry: "Tech",
  },
  {
    name: "Verdant",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#ecfdf5"/>
      <path d="M28 46 C28 46 14 36 20 24 C23 18 32 18 32 24 C32 18 41 18 44 24 C50 36 36 46 28 46Z" fill="#16a34a"/>
      <text x="54" y="37" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#14532d" letter-spacing="1">Verdant</text>
    </svg>`,
    industry: "Eco",
  },
  {
    name: "NovaTech",
    svg: `<svg width="160" height="64" viewBox="0 0 160 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="64" fill="#4f46e5"/>
      <rect x="12" y="20" width="24" height="24" rx="5" fill="white" opacity="0.2"/>
      <rect x="17" y="25" width="14" height="14" rx="3" fill="white"/>
      <text x="44" y="38" font-family="Arial,sans-serif" font-size="15" font-weight="800" fill="white" letter-spacing="0.5">NOVATECH</text>
    </svg>`,
    industry: "Startup",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Make a logo in minutes",
    desc: "Tell us your brand name and industry. Our engine generates dozens of unique logo concepts instantly.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    num: "02",
    title: "Bring your brand to life",
    desc: "Customize colors, fonts, and layouts. Download high-res files ready for print and digital use.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  },
  {
    num: "03",
    title: "Launch your business",
    desc: "Use your new brand across business cards, social media, websites, and more.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>`,
  },
];

export default function HomePage() {
  const [brandName, setBrandName] = useState("");
  const router = useRouter();

  function handleStart() {
    if (!brandName.trim()) return;
    router.push(`/generate?name=${encodeURIComponent(brandName)}`);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fafafa", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 2rem",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: "#111" }}>
          Brandify
        </span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#how" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>How it works</a>
          <a href="#logos" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>Examples</a>
          <Link href="/generate" style={{
            background: "#4f46e5",
            color: "white",
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(135deg, #f8f7ff 0%, #eff6ff 50%, #fdf4ff 100%)",
        padding: "80px 2rem 100px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "#eef2ff",
            color: "#4f46e5",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            padding: "5px 14px",
            borderRadius: 999,
            marginBottom: "1.5rem",
            textTransform: "uppercase",
          }}>
            AI-Powered Logo Maker
          </div>

          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "#0f0f1a",
            lineHeight: 1.2,
            marginBottom: "1.25rem",
          }}>
            Design your own<br />
            <span style={{ color: "#4f46e5" }}>beautiful brand</span>
          </h1>

          <p style={{ fontSize: 17, color: "#6b7280", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Use our AI-powered platform to design a logo and brand you love.
            <br />No design skills needed.
          </p>

          {/* Input + CTA */}
          <div style={{
            display: "flex",
            gap: 10,
            maxWidth: 480,
            margin: "0 auto 1.5rem",
            background: "white",
            borderRadius: 14,
            padding: "6px 6px 6px 16px",
            boxShadow: "0 4px 24px rgba(79,70,229,0.12)",
            border: "1.5px solid #e0e0ff",
          }}>
            <input
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleStart()}
              placeholder="Enter your brand name..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "#111",
                background: "transparent",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              onClick={handleStart}
              style={{
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Get started →
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, color: "#9ca3af" }}>
            <span style={{ color: "#f59e0b", letterSpacing: 1 }}>★★★★★</span>
            <span>Trusted by <strong style={{ color: "#374151" }}>10,000+</strong> businesses</span>
          </div>
        </div>

        {/* Sample logos floating */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
          marginTop: "3.5rem",
          maxWidth: 900,
          margin: "3.5rem auto 0",
        }}>
          {SAMPLE_LOGOS.map((logo, i) => (
            <div
              key={i}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                transform: i % 2 === 0 ? "translateY(-6px)" : "translateY(6px)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-12px) scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = i % 2 === 0 ? "translateY(-6px)" : "translateY(6px)")}
            >
              <div dangerouslySetInnerHTML={{ __html: logo.svg }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ padding: "80px 2rem", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#0f0f1a",
              marginBottom: "0.75rem",
            }}>
              The easiest way to design your new business
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280" }}>Three simple steps to a brand you'll love</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                background: "#fafafa",
                borderRadius: 16,
                padding: "2rem",
                border: "1px solid #f0f0f0",
                transition: "box-shadow 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(79,70,229,0.10)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  background: "#eef2ff",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4f46e5",
                  marginBottom: "1.25rem",
                }}
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.1em", marginBottom: 8 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Logo showcase ── */}
      <section id="logos" style={{ padding: "80px 2rem", background: "#f8f7ff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#0f0f1a",
              marginBottom: "0.75rem",
            }}>
              Cool brands designed with Brandify
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280" }}>Join thousands of businesses that trust us</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {SAMPLE_LOGOS.map((logo, i) => (
              <div key={i} style={{
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)";
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: logo.svg }} style={{ display: "block" }} />
                <div style={{ padding: "8px 12px", background: "white", fontSize: 11, color: "#9ca3af" }}>
                  {logo.industry}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        padding: "80px 2rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "white",
            marginBottom: "1rem",
          }}>
            Make a logo you'll be proud of
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: "2rem" }}>
            Get started free — no credit card required
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto", background: "white", borderRadius: 12, padding: "6px 6px 6px 16px" }}>
            <input
              placeholder="Enter your brand name..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#111", background: "transparent" }}
              onKeyDown={e => { if (e.key === "Enter") router.push("/generate"); }}
            />
            <button
              onClick={() => router.push("/generate")}
              style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Start free →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#0f0f1a", padding: "2rem", textAlign: "center" }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 18, color: "white" }}>Brandify</span>
        <p style={{ fontSize: 13, color: "#4b5563", marginTop: "0.5rem" }}>© 2025 Brandify. All rights reserved.</p>
      </footer>

    </div>
  );
}
