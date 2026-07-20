"use client";

import type { LogoConfig } from "@/lib/generator";

export default function LogoCard({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  const { name, slogan, iconPath, palette, fontFamily, fontWeight, textColor, layout, borderRadius, background } = logo;
  const bgColor = background?.includes("linear") ? background : (background || palette.bg);

  const iconSize = layout === "iconBig" ? 52 : 36;

  const renderContent = () => {
    if (layout === "textOnly") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily, fontWeight: fontWeight as any, color: textColor, fontSize: 22, letterSpacing: "0.04em" }}>
            {name}
          </span>
          {slogan && (
            <span style={{ fontFamily, color: textColor, fontSize: 11, opacity: 0.7, letterSpacing: "0.1em" }}>
              {slogan.toUpperCase()}
            </span>
          )}
        </div>
      );
    }

    if (layout === "iconLeft" || layout === "badge") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {iconPath && <img src={iconPath} alt="" style={{ width: iconSize, height: iconSize }} />}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily, fontWeight: fontWeight as any, color: textColor, fontSize: 18, letterSpacing: "0.02em" }}>
              {name}
            </span>
            {slogan && (
              <span style={{ fontFamily, color: textColor, fontSize: 10, opacity: 0.6, letterSpacing: "0.08em" }}>
                {slogan.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      );
    }

    // iconTop or iconBig
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {iconPath && <img src={iconPath} alt="" style={{ width: iconSize, height: iconSize }} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily, fontWeight: fontWeight as any, color: textColor, fontSize: layout === "iconBig" ? 20 : 17, letterSpacing: "0.04em" }}>
            {name}
          </span>
          {slogan && (
            <span style={{ fontFamily, color: textColor, fontSize: 10, opacity: 0.6, letterSpacing: "0.1em" }}>
              {slogan.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: bgColor,
        borderRadius,
        width: "100%",
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: selected ? "2.5px solid #6366f1" : "1.5px solid rgba(0,0,0,0.08)",
        transition: "transform 0.15s, border-color 0.15s",
        padding: "1rem",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {renderContent()}
    </div>
  );
}