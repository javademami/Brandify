"use client";

import { useRef, useState } from "react";
import type { LogoConfig } from "@/lib/generator";

interface MockupProps {
  logo: LogoConfig;
}

// لوگو رو به data URL تبدیل میکنه برای استفاده توی mockup
async function logoToDataUrl(logo: LogoConfig): Promise<string> {
  const { toPng } = await import("html-to-image");
  const el = document.getElementById("__logo-render-target__");
  if (!el) return "";
  return await toPng(el, { pixelRatio: 3, backgroundColor: "transparent" });
}

function LogoRenderTarget({ logo }: { logo: LogoConfig }) {
  const { name, slogan, iconPath, palette, layout, fontFamily, fontWeight, textColor, iconColor } = logo;

  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";

  return (
    <div id="__logo-render-target__" style={{
      position: "absolute", left: -9999, top: -9999,
      width: 240, height: 120,
      background: palette.bg,
      borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      {layout === "textOnly" && (
        <span style={{ fontFamily: fontFamily, fontWeight, fontSize: 28, color: textColor }}>{name}</span>

      )}
      {(layout === "iconTop" || layout === "iconBig") && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <img src={iconPath} width={layout === "iconBig" ? 48 : 36} height={layout === "iconBig" ? 48 : 36} style={{ filter: iconFilter }} alt="" />
         <span style={{ fontFamily: fontFamily, fontWeight, fontSize: 20, color: textColor }}>{name}</span>

        </div>
      )}
      {(layout === "iconLeft" || layout === "badge") && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={iconPath} width={36} height={36} style={{ filter: iconFilter }} alt="" />
         <span style={{ fontFamily: fontFamily, fontWeight, fontSize: 22, color: textColor }}>{name}</span>

        </div>
      )}
    </div>
  );
}

// ── Mockup SVGs ──

function TshirtMockup({ logo }: { logo: LogoConfig }) {
  const { palette, name } = logo;
  const iconFilter = logo.iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  return (
    <svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* tshirt shape */}
      <path d="M60 40 L20 90 L70 110 L70 240 L230 240 L230 110 L280 90 L240 40 L200 20 C195 50 175 65 150 65 C125 65 105 50 100 20 Z"
        fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5"/>
      {/* collar */}
      <path d="M100 20 C105 50 125 65 150 65 C175 65 195 50 200 20" fill="none" stroke="#d1d5db" strokeWidth="1.5"/>
      {/* logo area on shirt */}
      <g transform="translate(105, 110)">
        <rect width="90" height="45" rx="6" fill={palette.bg} opacity="0.95"/>
        {logo.layout === "iconLeft" || logo.layout === "badge" ? (
          <>
            <image href={logo.iconPath} x="6" y="9" width="24" height="24" style={{ filter: iconFilter }} />
            <text x="36" y="27" fontFamily={logo.font} fontWeight={logo.fontWeight} fontSize="13" fill={logo.textColor}>{name.slice(0,8)}</text>
          </>
        ) : (
          <>
            <image href={logo.iconPath} x="33" y="4" width="24" height="24" style={{ filter: iconFilter }} />
            <text x="45" y="40" fontFamily={logo.font} fontWeight={logo.fontWeight} fontSize="11" fill={logo.textColor} textAnchor="middle">{name.slice(0,10)}</text>
          </>
        )}
      </g>
    </svg>
  );
}

function BusinessCardMockup({ logo }: { logo: LogoConfig }) {
  const { palette, name, slogan, font, fontWeight, textColor, iconPath, iconColor, layout } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* card shadow */}
      <rect x="14" y="14" width="292" height="172" rx="12" fill="rgba(0,0,0,0.08)"/>
      {/* card */}
      <rect x="10" y="10" width="292" height="172" rx="12" fill={palette.bg}/>
      {/* logo */}
      {layout === "iconLeft" || layout === "badge" ? (
        <>
          <image href={iconPath} x="28" y="30" width="36" height="36" style={{ filter: iconFilter }} />
          <text x="74" y="54" fontFamily={font} fontWeight={fontWeight} fontSize="18" fill={textColor}>{name}</text>
        </>
      ) : (
        <>
          <image href={iconPath} x="28" y="24" width="36" height="36" style={{ filter: iconFilter }} />
          <text x="28" y="80" fontFamily={font} fontWeight={fontWeight} fontSize="18" fill={textColor}>{name}</text>
        </>
      )}
      {slogan && <text x="28" y="96" fontFamily={font} fontSize="10" fill={textColor} opacity="0.6">{slogan.toUpperCase()}</text>}
      {/* contact lines */}
      <line x1="28" y1="118" x2="292" y2="118" stroke={textColor} strokeWidth="0.5" opacity="0.2"/>
      <text x="28" y="136" fontFamily="sans-serif" fontSize="10" fill={textColor} opacity="0.5">hello@{name.toLowerCase().replace(/\s/g,"")}.com</text>
      <text x="28" y="152" fontFamily="sans-serif" fontSize="10" fill={textColor} opacity="0.5">+1 (555) 000-0000</text>
      <text x="28" y="168" fontFamily="sans-serif" fontSize="10" fill={textColor} opacity="0.5">www.{name.toLowerCase().replace(/\s/g,"")}.com</text>
    </svg>
  );
}

function MugMockup({ logo }: { logo: LogoConfig }) {
  const { palette, name, font, fontWeight, textColor, iconPath, iconColor } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  return (
    <svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* mug body */}
      <path d="M40 50 L40 170 Q40 190 60 190 L180 190 Q200 190 200 170 L200 50 Z" fill={palette.bg} stroke="#d1d5db" strokeWidth="1.5"/>
      {/* mug top ellipse */}
      <ellipse cx="120" cy="50" rx="80" ry="18" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
      {/* handle */}
      <path d="M200 80 Q240 80 240 120 Q240 160 200 160" fill="none" stroke="#d1d5db" strokeWidth="12" strokeLinecap="round"/>
      {/* logo on mug */}
      <image href={iconPath} x="88" y="88" width="64" height="64" style={{ filter: iconFilter }} />
      <text x="120" y="170" fontFamily={font} fontWeight={fontWeight} fontSize="13" fill={textColor} textAnchor="middle">{name.slice(0,12)}</text>
    </svg>
  );
}

function PhoneMockup({ logo }: { logo: LogoConfig }) {
  const { palette, name, font, fontWeight, textColor, iconPath, iconColor } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  return (
    <svg viewBox="0 0 180 320" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* phone frame */}
      <rect x="20" y="10" width="140" height="300" rx="22" fill="#1f2937" stroke="#374151" strokeWidth="2"/>
      {/* screen */}
      <rect x="28" y="30" width="124" height="260" rx="14" fill="#111827"/>
      {/* notch */}
      <rect x="60" y="28" width="60" height="12" rx="6" fill="#1f2937"/>
      {/* app icon style */}
      <rect x="54" y="110" width="72" height="72" rx="16" fill={palette.bg}/>
      <image href={iconPath} x="70" y="122" width="40" height="40" style={{ filter: iconFilter }} />
      <text x="90" y="205" fontFamily={font} fontWeight={fontWeight} fontSize="11" fill="white" textAnchor="middle" opacity="0.8">{name.slice(0,10)}</text>
      {/* home bar */}
      <rect x="65" y="280" width="50" height="4" rx="2" fill="#4b5563"/>
    </svg>
  );
}

function BagMockup({ logo }: { logo: LogoConfig }) {
  const { palette, name, font, fontWeight, textColor, iconPath, iconColor } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  return (
    <svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* bag body */}
      <path d="M30 80 L210 80 L225 250 L15 250 Z" fill={palette.bg} stroke="#d1d5db" strokeWidth="1.5"/>
      {/* bag top */}
      <rect x="30" y="72" width="180" height="16" rx="4" fill="#9ca3af"/>
      {/* handles */}
      <path d="M80 72 Q80 30 120 30 Q160 30 160 72" fill="none" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round"/>
      {/* logo */}
      <image href={iconPath} x="92" y="120" width="56" height="56" style={{ filter: iconFilter }} />
      <text x="120" y="196" fontFamily={font} fontWeight={fontWeight} fontSize="14" fill={textColor} textAnchor="middle">{name.slice(0,12)}</text>
    </svg>
  );
}

const MOCKUPS = [
  { id: "tshirt", label: "T-Shirt", component: TshirtMockup },
  { id: "card", label: "Business Card", component: BusinessCardMockup },
  { id: "mug", label: "Mug", component: MugMockup },
  { id: "phone", label: "Phone App", component: PhoneMockup },
  { id: "bag", label: "Tote Bag", component: BagMockup },
];

export default function MockupPreview({ logo }: MockupProps) {
  const [active, setActive] = useState("card");
  const ActiveMockup = MOCKUPS.find(m => m.id === active)?.component || BusinessCardMockup;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <LogoRenderTarget logo={logo} />

      {/* Mockup selector tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MOCKUPS.map(m => (
          <button key={m.id} onClick={() => setActive(m.id)} style={{
            padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
            background: active === m.id ? "#4f46e5" : "#f3f4f6",
            color: active === m.id ? "white" : "#374151",
            transition: "all 0.15s",
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Active mockup */}
      <div style={{
        background: "#f9fafb",
        borderRadius: 16,
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 280,
        border: "1px solid #f0f0f0",
      }}>
        <div style={{ width: "100%", maxWidth: 320 }}>
          <ActiveMockup logo={logo} />
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
        Preview only — download to use on real products
      </p>
    </div>
  );
}
