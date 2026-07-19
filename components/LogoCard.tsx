"use client";

import { iconPaths } from "@/lib/icons";
import type { LogoConfig } from "@/lib/generator";

function IconSVG({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) {
  const path = iconPaths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {path ? (
        <path
          d={path}
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" />
      )}
    </svg>
  );
}

export default function LogoCard({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  const { name, slogan, icon, fontFamily, fontWeight, textColor, iconColor, bgCSS, layout, borderRadius } = logo;

  const iconSize = layout === "iconBig" ? 52 : 36;

  const renderContent = () => {
    if (layout === "textOnly") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: fontFamily, fontWeight, color: textColor, fontSize: 22, letterSpacing: "0.04em" }}>
            {name}
          </span>
          {slogan && (
            <span style={{ fontFamily: fontFamily, color: textColor, fontSize: 11, opacity: 0.7, letterSpacing: "0.1em" }}>
              {slogan.toUpperCase()}
            </span>
          )}
        </div>
      );
    }

    if (layout === "iconLeft" || layout === "badge") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconSVG name={icon} size={iconSize} color={iconColor} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: fontFamily, fontWeight, color: textColor, fontSize: 18, letterSpacing: "0.02em" }}>
              {name}
            </span>
            {slogan && (
              <span style={{ fontFamily: fontFamily, color: textColor, fontSize: 10, opacity: 0.6, letterSpacing: "0.08em" }}>
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
        <IconSVG name={icon} size={iconSize} color={iconColor} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily: fontFamily, fontWeight, color: textColor, fontSize: layout === "iconBig" ? 20 : 17, letterSpacing: "0.04em" }}>
            {name}
          </span>
          {slogan && (
            <span style={{ fontFamily: fontFamily, color: textColor, fontSize: 10, opacity: 0.6, letterSpacing: "0.1em" }}>
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
        background: bgCSS,
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