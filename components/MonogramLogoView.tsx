"use client";
import type { LogoConfig } from "@/lib/generator";

function isLightColor(bgColor: string): boolean {
  if (bgColor.includes("linear-gradient")) return false;
  
  let r = 0, g = 0, b = 0;
  
  if (bgColor.startsWith("#")) {
    const hex = bgColor.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (bgColor.startsWith("rgb")) {
    const match = bgColor.match(/\d+/g);
    if (match) [r, g, b] = match.map(Number);
  }
  
  return (r + g + b) / 3 > 128;
}

export default function MonogramLogoView({ logo, selected, onClick }: {
  logo: LogoConfig; selected?: boolean; onClick?: () => void;
}) {
  const { name, slogan, background, palette, effect, textColor } = logo;
  
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);
  const bgIsLight = isLightColor(bgColor);
  
  const firstLetter = name.charAt(0).toLowerCase();
  const validLetter = /[a-z]/.test(firstLetter) ? firstLetter : "a";
  
  const monogramNumber = Math.floor(Math.random() * 10) + 1;
  const monogramPath = `/icons/monogram/${validLetter}/${monogramNumber}.svg`;
  
  const effectBoxShadow = {
    none: "0 2px 8px rgba(0,0,0,0.1)",
    glow: `0 0 20px ${textColor}40`,
    metallic: "0 4px 12px rgba(212, 175, 55, 0.2)",
    shadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    neon: `0 0 15px ${textColor}50`,
  }[effect] || "0 2px 8px rgba(0,0,0,0.1)";

  const iconSize = "35%";
  const maxIconSize = 98;
  
  const displayFontSize = 20;
  const sloganFontSize = Math.max(10, Math.floor(displayFontSize * 0.35));
  
  const gapNameSlogan = 6;
  const gapIconName = 10;
  
  // Monogram: همیشه روی backgrounds هوشمند
  const displayTextColor = bgIsLight ? "#1a1a1a" : "#ffffff";

  return (
    <div onClick={onClick} style={{
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
      boxShadow: effectBoxShadow,
      transition: "all 0.2s",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}>
      
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "18px",
        marginBottom: gapIconName,
      }}>
        <img 
          src={monogramPath} 
          alt={`${name} monogram`}
          style={{
            width: iconSize,
            maxWidth: maxIconSize,
            height: "auto",
            aspectRatio: "1 / 1",
          }}
        />
      </div>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        minWidth: 0,
        gap: `${gapNameSlogan}px`,
        paddingLeft: "8px",
        paddingRight: "8px",
      }}>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "700",
          color: displayTextColor,
          fontSize: displayFontSize,
          lineHeight: "1.2",
          textAlign: "center",
          wordBreak: "break-word",
          maxWidth: "100%",
        }}>
          {name}
        </div>
        
        {slogan && (
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "400",
            color: displayTextColor,
            fontSize: sloganFontSize,
            lineHeight: "1.2",
            opacity: 0.8,
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
          }}>
            {slogan}
          </div>
        )}
      </div>
    </div>
  );
}