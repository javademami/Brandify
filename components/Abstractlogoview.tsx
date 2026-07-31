"use client";

import type { LogoConfig } from "@/lib/generator";
import { getRandomPattern } from "@/lib/Pattern";

// تابع تشخیص روشن/تاریک
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

// Pattern SVG patterns
const PatternSVGs: Record<string, (color: string, opacity: number) => string> = {
  "geo-01": (color, opacity) => `
    <defs>
      <pattern id="hexagon" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon points="20,0 40,11.5 40,34.5 20,46 0,34.5 0,11.5" 
                 fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexagon)"/>
  `,
  
  "geo-02": (color, opacity) => `
    <defs>
      <pattern id="triangle" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <polygon points="15,0 30,26 0,26" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#triangle)"/>
  `,
  
  "geo-03": (color, opacity) => `
    <defs>
      <pattern id="circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <circle cx="25" cy="25" r="20" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
        <circle cx="25" cy="25" r="15" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity * 0.7}"/>
        <circle cx="25" cy="25" r="10" fill="none" stroke="${color}" stroke-width="1" opacity="${opacity * 0.4}"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circles)"/>
  `,
  
  "min-01": (color, opacity) => `
    <defs>
      <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="20" y2="20" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
        <line x1="20" y1="0" x2="0" y2="20" stroke="${color}" stroke-width="1" opacity="${opacity}"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines)"/>
  `,
  
  "min-02": (color, opacity) => `
    <defs>
      <pattern id="dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
        <circle cx="7.5" cy="7.5" r="2" fill="${color}" opacity="${opacity}"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)"/>
  `,
  
  "grad-01": (color, opacity) => `
    <defs>
      <radialGradient id="radial">
        <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#radial)"/>
  `,
  
  "org-01": (color, opacity) => `
    <defs>
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
      </filter>
    </defs>
    <circle cx="30%" cy="30%" r="80" fill="${color}" opacity="${opacity * 0.6}" filter="url(#blur)"/>
    <circle cx="70%" cy="70%" r="60" fill="${color}" opacity="${opacity * 0.5}" filter="url(#blur)"/>
    <circle cx="50%" cy="80%" r="70" fill="${color}" opacity="${opacity * 0.4}" filter="url(#blur)"/>
  `,
};

export default function AbstractLogoView({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  const { name, slogan, palette, fontFamily, fontWeight, fontSize, textColor, background } = logo;
  
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);
  const bgIsLight = isLightColor(bgColor);
  
  // برای Abstract Logo: رنگ یکسان برای همه چیز
  const unifiedColor = bgIsLight ? "#1a1a1a" : "#ffffff";
  const textDisplayColor = unifiedColor; // یکسان برای نام و اسلاگن و آیکن
  
  // دریافت pattern رندوم
  const pattern = getRandomPattern();
  const patternSvg = PatternSVGs[pattern.id] || PatternSVGs["min-02"];
  const opacity = 0.8 + Math.random() * 0.2;
  
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
        border: selected ? "2.5px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
        padding: "12px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Pattern SVG Background */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="abstractMask">
            <rect width="100%" height="100%" fill="white" />
          </mask>
        </defs>
        <g mask="url(#abstractMask)" dangerouslySetInnerHTML={{
          __html: patternSvg(textDisplayColor, opacity)
        }} />
      </svg>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "6px",
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* نام برند */}
        <div
          style={{
            fontFamily,
            fontWeight: fontWeight as any,
            fontSize: Math.floor(fontSize * 0.9),
            color: textDisplayColor,
            lineHeight: "1.2",
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {name}
        </div>

        {/* اسلاگن */}
        {slogan && (
          <div
            style={{
              fontFamily,
              fontWeight: "400",
              fontSize: Math.max(8, Math.floor(fontSize * 0.35)),
              color: textDisplayColor,
              lineHeight: "1.2",
              opacity: 0.8,
              textAlign: "center",
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {slogan}
          </div>
        )}
      </div>

      {/* Pattern Name (خیلی کوچک) */}
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          right: "4px",
          fontSize: "8px",
          color: textDisplayColor,
          opacity: 0.3,
          fontFamily: "monospace",
          zIndex: 2,
        }}
      >
        {pattern.id}
      </div>
    </div>
  );
}