"use client";

import type { LogoConfig } from "@/lib/generator";

function isLightColor(color: string): boolean {
  if (color.includes("linear-gradient")) return false;
  
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  return (r + g + b) / 3 > 128;
}

// Retro Food Decorations
const RETRO_DECORATIONS = ["🍴", "🍽", "👨‍🍳", "🥘", "🍳", "🔪", "🥄", "🍖"];
const RETRO_BADGES = ["SINCE", "EST", "FINEST", "FRESH", "BEST", "QUALITY", "PREMIUM", "CLASSIC"];

export default function RetroFoodLogoView({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  const { name, slogan, palette, fontFamily, fontWeight, background } = logo;
  
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);
  const bgIsLight = isLightColor(bgColor);
  
  // ✅ Fixed: بهتر رنگ‌بندی
  const primaryColor = bgIsLight ? "#6B4423" : "#D4AF37";
  const textDisplayColor = bgIsLight ? "#1a1a1a" : "#ffffff";
  const accentColor = bgIsLight ? "#8B7355" : "#E5C158";
  
  const decoration = RETRO_DECORATIONS[Math.floor(Math.random() * RETRO_DECORATIONS.length)];
  const badge = RETRO_BADGES[Math.floor(Math.random() * RETRO_BADGES.length)];
  const year = 1980 + Math.floor(Math.random() * 40);
  
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
        padding: "8px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    >
      {/* SVG Circle Background */}
      <svg
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          height: "85%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="100" cy="100" r="95" fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.8" />
        
        {/* Inner circle */}
        <circle cx="100" cy="100" r="80" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.6" />
        
        {/* Decorative dots */}
        <circle cx="100" cy="10" r="2.5" fill={primaryColor} />
        <circle cx="190" cy="100" r="2.5" fill={primaryColor} />
        <circle cx="100" cy="190" r="2.5" fill={primaryColor} />
        <circle cx="10" cy="100" r="2.5" fill={primaryColor} />
      </svg>

      {/* Content Container - ✅ Fixed: بهتر positioning */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          height: "100%",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Badge Label */}
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "10px",
            letterSpacing: "2px",
            color: primaryColor,
            fontWeight: "700",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {badge}
        </div>

        {/* Decoration Icon */}
        <div
          style={{
            fontSize: "18px",
            lineHeight: "1",
            margin: "2px 0",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {decoration}
        </div>

        {/* Brand Name - ✅ Fixed: بهتر font sizing و overflow handling */}
        <div
          style={{
            fontFamily: fontFamily || "Arial, sans-serif",
            fontWeight: (parseInt(fontWeight) || 700).toString() as any,
            fontSize: "13px",
            color: textDisplayColor,
            lineHeight: "1.2",
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
            margin: "2px 0",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          } as any}
        >
          {name.toUpperCase()}
        </div>

        {/* Slogan or Year */}
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "8px",
            color: primaryColor,
            letterSpacing: "0.5px",
            marginTop: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {slogan ? slogan.substring(0, 20).toUpperCase() : `SINCE ${year}`}
        </div>
      </div>

      {/* Bottom Badge - ✅ Fixed: بهتر positioning */}
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Arial, sans-serif",
          fontSize: "7px",
          letterSpacing: "1px",
          color: primaryColor,
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        FINEST FOOD
      </div>
    </div>
  );
}