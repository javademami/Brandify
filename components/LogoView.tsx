"use client";
import type { LogoConfig } from "@/lib/generator";

// تشخیص روشن/تاریک بودن رنگ
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

export default function LogoView({ logo, selected, onClick }: {
  logo: LogoConfig; selected?: boolean; onClick?: () => void;
}) {
  const { name, slogan, fontFamily, fontSize, fontWeight, background, palette, effect, textColor, frameStyle } = logo;
  
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);
  const isFramed = frameStyle !== "none";
  const bgIsLight = isLightColor(bgColor);
  
  const effectBoxShadow = {
    none: "0 2px 8px rgba(0,0,0,0.1)",
    glow: `0 0 20px ${textColor}40`,
    metallic: "0 4px 12px rgba(212, 175, 55, 0.2)",
    shadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    neon: `0 0 15px ${textColor}50`,
  }[effect] || "0 2px 8px rgba(0,0,0,0.1)";

  // آیکن: 35% عرض
  const iconSize = "35%";
  const maxIconSize = 98;
  
  // فونت‌های Frames بزرگ‌تر
  const displayFontSize = isFramed ? 18 : fontSize;
  const sloganFontSize = Math.max(10, Math.floor(displayFontSize * 0.35));
  
  // فاصله‌ها
  const gapNameSlogan = 6;
  const gapIconName = 10;
  
  // رنگ‌های متن برای Frames: هوشمند
  // اگر پس‌زمینه روشن است → متن تاریک
  // اگر پس‌زمینه تاریک است → متن روشن/طلایی
  const frameTextColor = bgIsLight ? "#1a1a1a" : "#ffffff";
  const frameGolden = "#d4af37";
  const goldenGradient = `linear-gradient(135deg, ${frameGolden} 0%, #ffeaa7 50%, ${frameGolden} 100%)`;
  
  const renderContent = () => {
    // در Frames: اگر bg تاریک، متن طلایی؛ اگر روشن، متن تاریک
    const textColorForFrame = isFramed && !bgIsLight ? frameGolden : (isFramed ? frameTextColor : textColor);
    
    const nameStyle: React.CSSProperties = isFramed && !bgIsLight ? {
      fontFamily,
      fontWeight,
      color: textColorForFrame,
      fontSize: displayFontSize,
      margin: 0,
      lineHeight: "1.2",
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    } : isFramed && bgIsLight ? {
      fontFamily,
      fontWeight,
      color: frameTextColor,
      fontSize: displayFontSize,
      margin: 0,
      lineHeight: "1.2",
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    } : {
      fontFamily,
      fontWeight,
      color: textColor,
      fontSize: displayFontSize,
      margin: 0,
      lineHeight: "1.1",
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    };

    const sloganStyle: React.CSSProperties = isFramed && !bgIsLight ? {
      fontFamily: logo.sloganFont || fontFamily,
      fontWeight: "400",
      color: textColorForFrame,
      fontSize: sloganFontSize,
      margin: 0,
      lineHeight: "1.2",
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    } : isFramed && bgIsLight ? {
      fontFamily: logo.sloganFont || fontFamily,
      fontWeight: "400",
      color: frameTextColor,
      fontSize: sloganFontSize,
      margin: 0,
      lineHeight: "1.2",
      opacity: 0.9,
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    } : {
      fontFamily: logo.sloganFont || fontFamily,
      fontWeight: "400",
      color: textColor,
      fontSize: sloganFontSize,
      margin: 0,
      lineHeight: "1.1",
      opacity: 0.8,
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "100%",
    };

    const iconStyle: React.CSSProperties = {
      width: iconSize,
      maxWidth: maxIconSize,
      height: "auto",
      aspectRatio: "1 / 1",
      flexShrink: 0,
      marginBottom: gapIconName,
    };

    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        width: "100%",
        minWidth: 0,
        paddingTop: "18px",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "8px",
      }}>
        {logo.iconPath && (
          <img 
            src={logo.iconPath} 
            alt="icon" 
            style={iconStyle}
          />
        )}
        <div style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", 
          minWidth: 0,
          gap: `${gapNameSlogan}px`,
        }}>
          <div style={nameStyle}>{name}</div>
          {slogan && <div style={sloganStyle}>{slogan}</div>}
        </div>
      </div>
    );
  };

  const content = renderContent();

  if (isFramed) {
    const frameTextColorBorder = bgIsLight ? "#333333" : frameGolden;
    
    const frameContainerStyle: React.CSSProperties = frameStyle === "thin-circle" || frameStyle === "inner-dashed-circle" || frameStyle === "solid-dark-circle"
      ? {
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: `5px solid ${frameStyle === "solid-dark-circle" ? "#888" : frameTextColorBorder}`,
          background: frameStyle === "solid-dark-circle" ? "#1a1a1a" : bgColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          position: "relative" as const,
          overflow: "hidden" as const,
          boxShadow: frameStyle === "solid-dark-circle" ? "none" : `0 0 20px ${frameTextColorBorder}30`,
        }
      : {
          minWidth: "160px",
          maxWidth: "180px",
          minHeight: "160px",
          border: `5px solid ${frameTextColorBorder}`,
          borderRadius: "8px",
          background: bgColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          overflow: "hidden" as const,
          boxShadow: `0 0 20px ${frameTextColorBorder}30`,
        };

    if (frameStyle === "solid-dark-circle") {
      return (
        <div onClick={onClick} style={{
          background: bgColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: selected ? "2.5px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
          padding: "8px",
          boxSizing: "border-box",
        }}>
          <div style={{ ...frameContainerStyle, color: "#ffffff" }}>
            {content}
          </div>
        </div>
      );
    }

    if (frameStyle === "inner-dashed-circle") {
      return (
        <div onClick={onClick} style={{
          background: bgColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: selected ? "2.5px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
          padding: "8px",
          boxSizing: "border-box",
        }}>
          <div style={{ ...frameContainerStyle, position: "relative" }}>
            <div style={{
              position: "absolute",
              inset: "14px",
              borderRadius: "50%",
              border: `2px dashed ${frameTextColorBorder}`,
              opacity: 0.5,
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              {content}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div onClick={onClick} style={{
        background: bgColor,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: selected ? "2.5px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
        padding: "8px",
        boxSizing: "border-box",
      }}>
        <div style={frameContainerStyle}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} style={{
      background: bgColor,
      width: "100%",
      height: "100%",
      display: "flex",
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
      {content}
    </div>
  );
}