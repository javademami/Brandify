"use client";

import type { LogoConfig } from "@/lib/generator";

// تشخیص روشن/تاریک بودن رنگ
function isLightColor(bgColor: string): boolean {
  if (bgColor.includes("linear-gradient")) return false;
  if (bgColor.includes("radial-gradient")) return false;

  let r = 0, g = 0, b = 0;

  if (bgColor.startsWith("#")) {
    const hex = bgColor.slice(1);

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (bgColor.startsWith("rgb")) {
    const match = bgColor.match(/\d+/g);
    if (match) [r, g, b] = match.map(Number);
  }

  return (r + g + b) / 3 > 128;
}

export default function LogoView({
  logo,
  selected,
  onClick,
}: {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
}) {
  const {
    name,
    slogan,
    fontFamily,
    fontSize,
    fontWeight,
    background,
    palette,
    effect,
    textColor,
    frameStyle,
  } = logo;

  const bgColor = background?.includes("linear")
    ? background
    : background || palette.bg;

  const isFramed = frameStyle !== "none";
  const bgIsLight = isLightColor(bgColor);

  const effectBoxShadow = {
    none: "0 2px 8px rgba(0,0,0,0.1)",
    glow: `0 0 20px ${textColor}40`,
    metallic: "0 4px 12px rgba(212, 175, 55, 0.2)",
    shadow: "0 8px 16px rgba(0,0,0,0.2)",
    neon: `0 0 15px ${textColor}50`,
  }[effect] || "0 2px 8px rgba(0,0,0,0.1)";

  // آیکن: 35% عرض
  const iconSize = "35%";
  const maxIconSize = 98;

  // فونت‌های Frames بزرگ‌تر
  const displayFontSize = isFramed ? 18 : fontSize;
  const sloganFontSize = Math.max(
    10,
    Math.floor(displayFontSize * 0.35)
  );

  // فاصله‌ها
  const gapNameSlogan = 6;
  const gapIconName = 10;

  // رنگ‌های متن برای Frames: هوشمند
  const frameTextColor = bgIsLight ? "#1a1a1a" : "#ffffff";
  const frameGolden = "#d4af37";

  const goldenGradient = `linear-gradient(135deg, ${frameGolden} 0%, #ffeaa7 50%, ${frameGolden} 100%)`;

  /*
   * مهم:
   * قبلاً iconColor اصلاً استفاده نمی‌شد.
   *
   * اگر iconColor در LogoConfig وجود داشته باشد،
   * همان رنگ را برای آیکن استفاده می‌کنیم.
   *
   * fallback:
   * اگر iconColor ذخیره نشده باشد، textColor استفاده می‌شود.
   */
  const iconColor =
    (logo as LogoConfig & { iconColor?: string }).iconColor ||
    textColor ||
    "#111111";

  /*
   * برای SVG:
   *
   * اگر SVG به صورت فایل خارجی باشد، color روی img معمولی
   * مستقیماً رنگ pathهای SVG را تغییر نمی‌دهد.
   *
   * بنابراین برای رنگ‌های رایج از CSS filter استفاده می‌کنیم.
   *
   * سفید مهم‌ترین حالت برای Saved Logos است.
   */
  const getIconFilter = (color: string): string => {
    const normalized = color.toLowerCase().trim();

    if (
      normalized === "#ffffff" ||
      normalized === "#fff" ||
      normalized === "white" ||
      normalized === "rgb(255, 255, 255)"
    ) {
      return "brightness(0) invert(1)";
    }

    if (
      normalized === "#000000" ||
      normalized === "#000" ||
      normalized === "black" ||
      normalized === "rgb(0, 0, 0)"
    ) {
      return "brightness(0)";
    }

    return "none";
  };

  const iconFilter = getIconFilter(iconColor);

  const renderContent = () => {
    // در Frames: اگر bg تاریک، متن طلایی؛ اگر روشن، متن تاریک
    const textColorForFrame =
      isFramed && !bgIsLight
        ? frameGolden
        : isFramed
        ? frameTextColor
        : textColor;

    const nameStyle: React.CSSProperties =
      isFramed && !bgIsLight
        ? {
            fontFamily,
            fontWeight,
            color: textColorForFrame,
            fontSize: displayFontSize,
            margin: 0,
            lineHeight: "1.2",
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
          }
        : isFramed && bgIsLight
        ? {
            fontFamily,
            fontWeight,
            color: frameTextColor,
            fontSize: displayFontSize,
            margin: 0,
            lineHeight: "1.2",
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
          }
        : {
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

    const sloganStyle: React.CSSProperties =
      isFramed && !bgIsLight
        ? {
            fontFamily: logo.sloganFont || fontFamily,
            fontWeight: "400",
            color: textColorForFrame,
            fontSize: sloganFontSize,
            margin: 0,
            lineHeight: "1.2",
            textAlign: "center",
            wordBreak: "break-word",
            maxWidth: "100%",
          }
        : isFramed && bgIsLight
        ? {
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
          }
        : {
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

      /*
       * اصلاح اصلی:
       * رنگ آیکن از logo.iconColor خوانده می‌شود.
       */
      filter: iconFilter,

      /*
       * اگر SVG دارای currentColor باشد،
       * این مقدار هم کمک می‌کند.
       */
      color: iconColor,
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minWidth: 0,
          paddingTop: "18px",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingBottom: "8px",
        }}
      >
        {logo.iconPath && (
          <img
            src={logo.iconPath}
            alt="icon"
            style={iconStyle}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            gap: `${gapNameSlogan}px`,
          }}
        >
          <div style={nameStyle}>{name}</div>

          {slogan && (
            <div style={sloganStyle}>
              {slogan}
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = renderContent();

  if (isFramed) {
    const frameTextColorBorder = bgIsLight
      ? "#333333"
      : frameGolden;

    const frameContainerStyle: React.CSSProperties =
      frameStyle === "thin-circle" ||
      frameStyle === "inner-dashed-circle" ||
      frameStyle === "solid-dark-circle"
        ? {
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            border: `5px solid ${
              frameStyle === "solid-dark-circle"
                ? "#888"
                : frameTextColorBorder
            }`,
            background:
              frameStyle === "solid-dark-circle"
                ? "#1a1a1a"
                : bgColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              frameStyle === "solid-dark-circle"
                ? "none"
                : `0 0 20px ${frameTextColorBorder}30`,
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
            overflow: "hidden",
            boxShadow: `0 0 20px ${frameTextColorBorder}30`,
          };

    if (frameStyle === "solid-dark-circle") {
      return (
        <div
          onClick={onClick}
          style={{
            background: bgColor,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: selected
              ? "2.5px solid #6366f1"
              : "1px solid rgba(255,255,255,0.1)",
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              ...frameContainerStyle,
              color: "#ffffff",
            }}
          >
            {content}
          </div>
        </div>
      );
    }

    if (frameStyle === "inner-dashed-circle") {
      return (
        <div
          onClick={onClick}
          style={{
            background: bgColor,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: selected
              ? "2.5px solid #6366f1"
              : "1px solid rgba(255,255,255,0.1)",
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              ...frameContainerStyle,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "14px",
                borderRadius: "50%",
                border: `2px dashed ${frameTextColorBorder}`,
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              {content}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        style={{
          background: bgColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: selected
            ? "2.5px solid #6366f1"
            : "1px solid rgba(255,255,255,0.1)",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        <div style={frameContainerStyle}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: bgColor,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: selected
          ? "2.5px solid #6366f1"
          : "1px solid rgba(255,255,255,0.1)",
        padding: "12px",
        boxSizing: "border-box",
        boxShadow: effectBoxShadow,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (
          e.currentTarget as HTMLDivElement
        ).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (
          e.currentTarget as HTMLDivElement
        ).style.transform = "translateY(0)";
      }}
    >
      {content}
    </div>
  );
}