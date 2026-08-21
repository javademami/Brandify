"use client";

import type { LogoConfig } from "@/lib/generator";

function isLightColor(color: string): boolean {
  if (!color || color.includes("linear-gradient")) return false;
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const fullHex = hex.length === 3 ? hex.split('').map(x => x + x).join('') : hex;
    r = parseInt(fullHex.slice(0, 2), 16) || 0;
    g = parseInt(fullHex.slice(2, 4), 16) || 0;
    b = parseInt(fullHex.slice(4, 6), 16) || 0;
  }
  return (r + g + b) / 3 > 128;
}

export default function RestaurantLogoView({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  if (!logo || !logo.palette) return null;

  const { name = "", slogan = "", palette, background } = logo;
  const bgColor = background?.includes("linear") ? background : (background || palette.bg || "#ffffff");
  const bgIsLight = isLightColor(bgColor);
  
  const primaryColor = bgIsLight ? "#333333" : "#ffffff";
  const accentColor = bgIsLight ? "#8B6F47" : "#C4A67A";
  const textColor = bgIsLight ? "#111111" : "#ffffff";
  
  const nameChar = name.charCodeAt(0) || 0;
  const bgChar = palette.bg?.charCodeAt(1) || 0;
  const styleIndex = (nameChar + bgChar) % 5;

  return (
    <div
      onClick={onClick}
      style={{
        background: bgColor,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: selected ? "2.5px solid #6366f1" : "1px solid rgba(0,0,0,0.1)",
        padding: "30px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* 1️⃣ Style 1: Curved Text Badge & Crossed Utensils (+50% Scale) */}
      {styleIndex === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <svg width="210" height="210" viewBox="0 0 200 200" xmlns="http://w3.org">
            <path id="textPath1" d="M 30,95 A 70,70 0 0,1 170,95" fill="none" />
            <text fontSize="22" fontWeight="bold" fill={primaryColor} letterSpacing="2.5" textAnchor="middle">
              <textPath href="#textPath1" startOffset="50%">{name.substring(0, 14).toUpperCase()}</textPath>
            </text>
            <text x="100" y="85" fontSize="12" fontWeight="600" fill={accentColor} letterSpacing="1.5" textAnchor="middle">FOOD & DRINKS</text>
            
            <g transform="translate(100, 115) scale(1.1) rotate(45)">
              <line x1="-15" y1="-25" x2="-15" y2="25" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M-20,-25 L-20,-12 C-20,-8 -10,-8 -10,-12 L-10,-25 M-15,-25 L-15,-15" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="-25" x2="15" y2="25" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M7,-25 C7,-35 23,-35 23,-25 C23,-15 7,-15 7,-25 Z" fill={primaryColor} />
            </g>
            
            <line x1="35" y1="120" x2="65" y2="120" stroke={accentColor} strokeWidth="2" />
            <line x1="135" y1="120" x2="165" y2="120" stroke={accentColor} strokeWidth="2" />
            <text x="50" y="111" fontSize="10.5" fontWeight="600" fill={accentColor} textAnchor="middle">ESTD</text>
            <text x="150" y="111" fontSize="10.5" fontWeight="600" fill={accentColor} textAnchor="middle">1980</text>
          </svg>
        </div>
      )}

      {/* 2️⃣ Style 2: Complex Serrated Insignia Badge (+50% Scale) */}
      {styleIndex === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="225" height="225" viewBox="0 0 200 200" xmlns="http://w3.org">
            <circle cx="100" cy="100" r="85" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="78" fill="none" stroke={primaryColor} strokeWidth="2" />
            <circle cx="100" cy="100" r="54" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            
            <path id="circlePathTop" d="M 36,90 A 65,65 0 0,1 164,90" fill="none" />
            <text fontWeight="bold" fill={primaryColor} fontSize="18" letterSpacing="2" textAnchor="middle">
              <textPath href="#circlePathTop" startOffset="50%">{name.toUpperCase()}</textPath>
            </text>

            <path id="circlePathBottom" d="M 164,110 A 65,65 0 0,1 36,110" fill="none" />
            <text fontWeight="bold" fill={primaryColor} fontSize="15" letterSpacing="1.5" textAnchor="middle">
              <textPath href="#circlePathBottom" startOffset="50%">FOOD & DRINKS</textPath>
            </text>

            <g transform="translate(100, 100) scale(0.95) rotate(45)">
              <line x1="-15" y1="-25" x2="-15" y2="25" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M-20,-25 L-20,-12 C-20,-8 -10,-8 -10,-12 L-10,-25 M-15,-25 L-15,-15" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="-25" x2="15" y2="25" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M7,-25 C7,-35 23,-35 23,-25 C23,-15 7,-15 7,-25 Z" fill={primaryColor} />
            </g>
            <text x="100" y="132" fontSize="12" fontWeight="bold" fill={primaryColor} textAnchor="middle">NEW YORK</text>
            <text x="44" y="103" fontSize="11" fontWeight="bold" fill={primaryColor}>ESTD</text>
            <text x="133" y="103" fontSize="11" fontWeight="bold" fill={primaryColor}>1980</text>
          </svg>
        </div>
      )}

      {/* 3️⃣ Style 3: Vintage Chef Hat with Split Banner (+50% Scale) */}
      {styleIndex === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <svg width="105" height="90" viewBox="0 0 100 80" xmlns="http://w3.org">
            <path d="M35,40 C30,40 25,35 28,28 C25,23 32,15 40,18 C45,10 55,10 60,18 C68,15 75,23 72,28 C75,35 70,40 65,40 Z" fill="none" stroke={primaryColor} strokeWidth="3.5" strokeLinejoin="round" />
            <rect x="37" y="40" width="26" height="8" fill="none" stroke={primaryColor} strokeWidth="3.5" />
            <line x1="43" y1="48" x2="45" y2="40" stroke={primaryColor} strokeWidth="2.5" />
            <line x1="50" y1="48" x2="50" y2="40" stroke={primaryColor} strokeWidth="2.5" />
            <line x1="57" y1="48" x2="55" y2="40" stroke={primaryColor} strokeWidth="2.5" />
            <path d="M42,54 L44,58 L56,58 L58,54 Z" fill={primaryColor} />
          </svg>
          <div style={{ fontSize: "30px", fontWeight: "900", color: textColor, fontFamily: "serif", letterSpacing: "1.5px", textTransform: 'uppercase', marginTop: "10px" }}>
            {name}
          </div>
          <div style={{ position: "relative", background: "#8B5A3C", color: "#FFF", fontSize: "13.5px", fontWeight: "bold", padding: "6px 22px", marginTop: "12px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Premium Quality Food
            <div style={{ position: "absolute", left: "-9px", top: "0", borderTop: "13.5px solid transparent", borderBottom: "13.5px solid transparent", borderRight: "9px solid #8B5A3C" }} />
            <div style={{ position: "absolute", right: "-9px", top: "0", borderTop: "13.5px solid transparent", borderBottom: "13.5px solid transparent", borderLeft: "9px solid #8B5A3C" }} />
          </div>
        </div>
      )}

      {/* 4️⃣ Style 4: Classic Filigree Box Frame with Chef Icon (+50% Scale) */}
      {styleIndex === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <svg width="240" height="135" viewBox="0 0 200 110" xmlns="http://w3.org">
            <path d="M 20,30 L 75,30 A 15,15 0 0,1 125,30 L 180,30 A 10,10 0 0,1 190,40 L 190,80 A 10,10 0 0,1 180,90 L 20,90 A 10,10 0 0,1 10,80 L 10,40 A 10,10 0 0,1 20,30 Z" fill="none" stroke={primaryColor} strokeWidth="2" />
            <g transform="translate(100, 28) scale(0.75)" fill="none" stroke={primaryColor} strokeWidth="3">
              <path d="M-15,-5 C-25,-5 -25,-22 -10,-22 C-10,-32 10,-32 10,-22 C25,-22 25,-5 15,-5 Z" fill={bgColor} />
              <rect x="-12" y="-5" width="24" height="6" fill={primaryColor} />
            </g>
            <text x="35" y="48" fontSize="9" fontWeight="bold" fill={accentColor}>CHEF</text>
            <text x="165" y="48" fontSize="9" fontWeight="bold" fill={accentColor} textAnchor="end">MENU</text>
            <text x="100" y="70" fontSize="26" fontWeight="900" fill={textColor} letterSpacing="1" textAnchor="middle">{name.toUpperCase()}</text>
            <line x1="40" y1="80" x2="160" y2="80" stroke={accentColor} strokeWidth="1.5" />
            <text x="100" y="92" fontSize="10.5" fontWeight="bold" fill={accentColor} letterSpacing="3" textAnchor="middle">PREMIUM</text>
          </svg>
        </div>
      )}
      {/* 5️⃣ Style 5: Minimalist Modern Curved Fork & Spoon (+50% Scale) */}
      {styleIndex === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <svg width="165" height="165" viewBox="0 0 120 120" xmlns="http://w3.org">
            {/* چنگال منحنی سمت چپ */}
            <path d="M 40,35 C 33,35 30,45 35,65 C 38,78 48,88 60,88" fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="37" y1="35" x2="37" y2="48" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="43" y1="35" x2="43" y2="48" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* قاشق منحنی سمت راست */}
            <path d="M 80,35 C 87,35 90,45 85,65 C 82,78 72,88 60,88" fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 75,35 C 75,25 85,25 85,35 Z" fill={primaryColor} />
            {/* دسته مشترک عمودی پایینی */}
            <line x1="60" y1="88" x2="60" y2="105" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: "21px", fontWeight: "800", color: textColor, fontFamily: "serif", letterSpacing: "2px", textTransform: "uppercase", marginTop: "8px" }}>
            {name}
          </div>
          <div style={{ fontSize: "10.5px", color: accentColor, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "4px" }}>
            {slogan || "YOUR TAGLINE"}
          </div>
        </div>
      )}
    </div>
  );
}
