
"use client";
import type { LogoConfig } from "@/lib/generator";
 
export type FrameStyle = "none" | "gold-square" | "thin-circle" | "inner-dashed-circle" | "solid-dark-circle" | "gradient-block";
 
export default function LogoFrame({ 
  logo, 
  frameStyle = "none", 
  selected, 
  onClick 
}: {
  logo: LogoConfig;
  frameStyle?: FrameStyle;
  selected?: boolean;
  onClick?: () => void;
}) {
  const { name, slogan, iconPath, layout, fontFamily, fontSize, fontWeight, textColor, background, palette, effect, textDecoration, iconColor, letterSpacing, textTransform } = logo;
  
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);
 
  const getIconFilter = () => {
    if (iconColor === "#ffffff") {
      return "brightness(0) invert(1)";
    } else if (iconColor === "#000000") {
      return "brightness(0)";
    } else {
      return "saturate(1.2) brightness(1.1)";
    }
  };
 
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
 
  const commonTextProps = {
    fontFamily,
    fontWeight,
    color: textColor,
    letterSpacing: letterSpacing as any,
    textTransform: textTransform as any,
    ...getTextDecorationStyle(),
  };
 
  const iconStyle = { filter: getIconFilter() };
 
  // Content
  const logoContent = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
      {/* Icon - بیشتر بالا */}
      {iconPath && (
        <img
          src={iconPath}
          width={56}
          height={56}
          alt="icon"
          style={iconStyle}
        />
      )}
      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <div style={{ ...commonTextProps, fontSize: fontSize + 6, fontWeight: "700", letterSpacing: "0.05em" }}>
          {name}
        </div>
        {slogan && (
          <div style={{ ...commonTextProps, fontSize: 12, opacity: 0.7, marginTop: 4, letterSpacing: "0.02em" }}>
            {slogan.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
 
  // Frame Renderers
  const renderGoldSquare = () => (
    <div style={{
      background: bgColor,
      padding: "40px",
      border: "2px solid rgba(212, 175, 55, 0.5)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "200px",
      minHeight: "200px",
    }}>
      {logoContent}
    </div>
  );
 
  const renderThinCircle = () => (
    <div style={{
      background: bgColor,
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      border: "1.5px solid rgba(212, 175, 55, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      {logoContent}
    </div>
  );
 
  const renderInnerDashedCircle = () => (
    <div style={{
      background: bgColor,
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      border: "2px solid rgba(212, 175, 55, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
    }}>
      {/* دایره داخلی خط‌چین */}
      <div style={{
        position: "absolute",
        inset: "20px",
        borderRadius: "50%",
        border: "1px dashed rgba(212, 175, 55, 0.4)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {logoContent}
      </div>
    </div>
  );
 
  const renderSolidDarkCircle = () => {
    const dark = palette.bg.substring(1).match(/.{1,2}/g)?.reduce((a, b) => a + parseInt(b, 16), 0) ?? 0 < 383;
    const innerColor = dark ? "#ffffff" : "#000000";
    
    return (
      <div style={{
        background: "#1a1a1a",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        border: "2px solid #444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{ ...logoContent, color: innerColor as any }}>
          {/* Re-render content with light colors */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
            {iconPath && (
              <img
                src={iconPath}
                width={56}
                height={56}
                alt="icon"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{ ...commonTextProps, color: innerColor, fontSize: fontSize + 6, fontWeight: "700" }}>
                {name}
              </div>
              {slogan && (
                <div style={{ ...commonTextProps, color: innerColor, fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                  {slogan.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  const renderGradientBlock = () => (
    <div style={{
      background: "linear-gradient(135deg, #d4af37 0%, #ffeaa7 50%, #d4af37 100%)",
      padding: "40px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "200px",
      minHeight: "200px",
      boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)",
    }}>
      <div style={{ ...logoContent, color: "#1a1a1a" as any }}>
        {/* Re-render with dark text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
          {iconPath && (
            <img
              src={iconPath}
              width={56}
              height={56}
              alt="icon"
              style={{ filter: "brightness(0) saturate(0)" }}
            />
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily, fontWeight, color: "#1a1a1a", fontSize: fontSize + 6, fontWeight: "700" }}>
              {name}
            </div>
            {slogan && (
              <div style={{ fontFamily, fontWeight, color: "#1a1a1a", fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                {slogan.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
 
  // Render based on frameStyle
  const renderFrame = () => {
    switch (frameStyle) {
      case "gold-square":
        return renderGoldSquare();
      case "thin-circle":
        return renderThinCircle();
      case "inner-dashed-circle":
        return renderInnerDashedCircle();
      case "solid-dark-circle":
        return renderSolidDarkCircle();
      case "gradient-block":
        return renderGradientBlock();
      case "none":
      default:
        return logoContent;
    }
  };
 
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        padding: "20px",
        borderRadius: "12px",
        border: selected ? "2.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.15)",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "280px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
      }}
    >
      {renderFrame()}
    </div>
  );
}