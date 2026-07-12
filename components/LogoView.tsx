
"use client";
import type { LogoConfig } from "@/lib/generator";

export default function LogoView({ logo, selected, onClick }: {
  logo: LogoConfig; selected?: boolean; onClick?: () => void;
}) {
  const { name, slogan, iconPath, layout, fontFamily, fontSize, fontWeight, borderRadius, textColor, background, palette, effect, decoration, decorationColor, textDecoration, iconColor, letterSpacing, textTransform, frameStyle } = logo;
  
  // اگر frame داشته باشد، background یک رنگ (بدون gradient)
  let bgColor = background?.includes("linear") ? background : (background || palette.bg);
  if (frameStyle !== "none" && background?.includes("linear")) {
    bgColor = palette.bg; // استفاده از solid color برای frames
  }
  
  const iconSize = layout === "iconBig" ? 72 : layout === "badge" ? 48 : 60;

  const effectBoxShadow = {
    none: "0 4px 12px rgba(0,0,0,0.08)",
    glow: `0 0 30px ${textColor}44, inset 0 0 20px ${textColor}22`,
    metallic: "0 8px 20px rgba(212, 175, 55, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.2)",
    shadow: "0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)",
    neon: `0 0 20px ${textColor}66, 0 0 40px ${textColor}33`,
  }[effect] || "0 4px 12px rgba(0,0,0,0.08)";

  const renderDecoration = () => {
    const decorStyle = { position: "absolute" as const, opacity: 0.15, color: decorationColor };
    
    if (decoration === "circle") {
      return <div style={{...decorStyle, top: 10, right: 10, fontSize: 40}}>●</div>;
    }
    if (decoration === "square") {
      return <div style={{...decorStyle, top: 10, left: 10, fontSize: 40}}>■</div>;
    }
    if (decoration === "border") {
      return <div style={{position: "absolute", inset: 15, border: `2px dashed ${decorationColor}`, opacity: 0.3, borderRadius: 8}} />;
    }
    if (decoration === "frame") {
      return <div style={{position: "absolute", inset: 20, border: `3px solid ${decorationColor}`, opacity: 0.2, borderRadius: 4}} />;
    }
    return null;
  };

  const renderLayout = () => {
    const getTextDecorationStyle = (): React.CSSProperties => {
      switch(textDecoration) {
        case "underline":
          return { textDecoration: "underline", textDecorationThickness: "2px", textUnderlineOffset: "4px" };
        case "overline":
          return { textDecoration: "overline", textDecorationThickness: "2px" };
        default:
          return {};
      }
    };

    const getIconFilter = () => {
      if (iconColor === "#ffffff") {
        return "brightness(0) invert(1)";
      } else if (iconColor === "#000000") {
        return "brightness(0)";
      } else {
        return "saturate(1.2) brightness(1.1)";
      }
    };

    const commonTextProps = { fontFamily, fontWeight, color: textColor, letterSpacing: letterSpacing as any, textTransform: textTransform as any, ...getTextDecorationStyle() };
    const iconStyle = { filter: getIconFilter() };
    
    if (layout === "textOnly") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
          <span style={{ ...commonTextProps, fontSize: fontSize + 10, letterSpacing: "0.02em", fontWeight: "700" }}>{name}</span>
          {slogan && <span style={{ ...commonTextProps, fontSize: 13, opacity: 0.6 }}>{slogan.toUpperCase()}</span>}
        </div>
      );
    }
    
    if (layout === "badge") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: "90%" }}>
          {iconPath && <img src={iconPath} width={36} height={36} alt="icon" style={iconStyle} />}
          <span style={{ ...commonTextProps, fontSize: fontSize + 4, fontWeight: "600" }}>{name}</span>
        </div>
      );
    }
    
    if (layout === "iconLeft") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {iconPath && <img src={iconPath} width={44} height={44} alt="icon" style={iconStyle} />}
          <div>
            <div style={{ ...commonTextProps, fontSize: fontSize + 2, fontWeight: "600" }}>{name}</div>
            {slogan && <div style={{ ...commonTextProps, fontSize: 11, opacity: 0.6, marginTop: 2 }}>{slogan.toUpperCase()}</div>}
          </div>
        </div>
      );
    }
    
    if (layout === "iconBig") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {iconPath && <img src={iconPath} width={iconSize} height={iconSize} alt="icon" style={iconStyle} />}
          <div style={{ textAlign: "center" }}>
            <span style={{ ...commonTextProps, fontSize: fontSize + 2 }}>{name}</span>
            {slogan && <div style={{ ...commonTextProps, fontSize: 11, opacity: 0.6, marginTop: 2 }}>{slogan.toUpperCase()}</div>}
          </div>
        </div>
      );
    }
    
    // default: iconTop - ICON بالا
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {iconPath && <img src={iconPath} width={iconSize} height={iconSize} alt="icon" style={iconStyle} />}
        <div style={{ textAlign: "center" }}>
          <span style={{ ...commonTextProps, fontSize: fontSize + 2, fontWeight: "700" }}>{name}</span>
          {slogan && <div style={{ ...commonTextProps, fontSize: 12, opacity: 0.6, marginTop: 3 }}>{slogan.toUpperCase()}</div>}
        </div>
      </div>
    );
  };

  // Frame Renderers - کوچکتر، بدون gradient، border بولدتر
  const renderFrame = () => {
    const content = renderLayout();

    if (frameStyle === "gold-square") {
      return (
        <div style={{
          background: bgColor,
          padding: "20px",
          border: "4px solid rgba(212, 175, 55, 0.7)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "220px",
        }}>
          {content}
        </div>
      );
    }

    if (frameStyle === "thin-circle") {
      return (
        <div style={{
          background: bgColor,
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "3px solid rgba(212, 175, 55, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
        }}>
          {content}
        </div>
      );
    }

    if (frameStyle === "inner-dashed-circle") {
      return (
        <div style={{
          background: bgColor,
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "3px solid rgba(212, 175, 55, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            inset: "20px",
            borderRadius: "50%",
            border: "2px dashed rgba(212, 175, 55, 0.5)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {content}
          </div>
        </div>
      );
    }

    if (frameStyle === "solid-dark-circle") {
      return (
        <div style={{
          background: "#1a1a1a",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "3px solid #666",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
        }}>
          <div style={{ color: "#ffffff" }}>
            {renderLayout()}
          </div>
        </div>
      );
    }

    if (frameStyle === "gradient-block") {
      return (
        <div style={{
          background: bgColor,
          padding: "20px",
          borderRadius: "8px",
          border: "4px solid rgba(212, 175, 55, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "220px",
        }}>
          <div style={{ color: "#1a1a1a" }}>
            {renderLayout()}
          </div>
        </div>
      );
    }

    return content;
  };

  return (
    <div onClick={onClick} style={{
      background: bgColor,
      borderRadius,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: selected ? "2.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.15)",
      transition: "all 0.2s",
      padding: "1.25rem",
      boxSizing: "border-box",
      boxShadow: frameStyle === "none" ? effectBoxShadow : "none",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}>
      {frameStyle === "none" && renderDecoration()}
      {renderFrame()}
    </div>
  );
}