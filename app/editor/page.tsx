"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import type { LogoConfig } from "@/lib/generator";
import { PALETTES } from "@/lib/palettes";
import LogoSaveButton from "@/components/LogoSaveButton";
import DownloadTab from "@/components/Downloadtab";

/* =========================================================
   TYPES
========================================================= */

type EditorTab =
  | "colors"
  | "typography"
  | "layout"
  | "icons"
  | "effects"
  | "brand"
  | "downloads";

type IconFolders = Record<string, string[]>;

type IconItem = {
  name: string;
  path: string;
};

type BackgroundType =
  | "solid"
  | "linear-gradient"
  | "radial-gradient";

type FrameStyle =
  | "none"
  | "circle"
  | "square"
  | "rounded"
  | "border"
  | "dashed";

type Variant =
  | "full"
  | "iconOnly"
  | "wordmark"
  | "stacked"
  | "dark"
  | "light";

type Alignment =
  | "top"
  | "center"
  | "bottom";

type TransformType =
  | "none"
  | "uppercase"
  | "lowercase"
  | "capitalize";

type ExtendedLogo = Omit<LogoConfig, "frameStyle"> & {
  iconSize?: number;
  iconColor?: string;
  iconGap?: number;
  iconRotation?: number;
  iconOpacity?: number;
  iconOffsetX?: number;
  iconOffsetY?: number;

  letterSpacing?: string;
  lineHeight?: number;
  textTransform?: TransformType;
  nameSloganGap?: number;
  sloganFontSize?: number;
  sloganFontWeight?: number;
  sloganColor?: string;

  layoutGap?: number;
  layoutPadding?: number;
  alignment?: Alignment;
  layoutScale?: number;
  layoutOffsetX?: number;
  layoutOffsetY?: number;

  backgroundType?: BackgroundType;
  backgroundColor1?: string;
  backgroundColor2?: string;
  backgroundAngle?: number;

  frameStyle?: FrameStyle;
  frameThickness?: number;
  frameColor?: string;

  variant?: Variant;
};

/* =========================================================
   HELPERS
========================================================= */

function safeDecodeLogoData(value: string): LogoConfig | null {
  try {
    try {
      const parsed = JSON.parse(value);

      if (parsed && typeof parsed === "object") {
        return parsed as LogoConfig;
      }
    } catch {
      // fallback
    }

    try {
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded);

      if (parsed && typeof parsed === "object") {
        return parsed as LogoConfig;
      }
    } catch {
      // invalid
    }

    return null;
  } catch (error) {
    console.error("[Editor] Failed to parse logo data:", error);
    return null;
  }
}

function makeIconPath(folder: string, file: string): string {
  return `/icons/${encodeURIComponent(folder)}/${encodeURIComponent(file)}.svg`;
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  if (clean.length !== 6) {
    return null;
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  if (
    Number.isNaN(r) ||
    Number.isNaN(g) ||
    Number.isNaN(b)
  ) {
    return null;
  }

  return { r, g, b };
}

function isLightColor(value: string): boolean {
  const rgb = hexToRgb(value);

  if (!rgb) {
    return false;
  }

  const brightness =
    (rgb.r * 299 +
      rgb.g * 587 +
      rgb.b * 114) /
    1000;

  return brightness > 160;
}

function getTransform(
  transform?: TransformType
): React.CSSProperties["textTransform"] {
  switch (transform) {
    case "uppercase":
      return "uppercase";
    case "lowercase":
      return "lowercase";
    case "capitalize":
      return "capitalize";
    default:
      return "none";
  }
}

/* =========================================================
   FONTS
========================================================= */

const FONTS = [
  {
    label: "Playfair Display",
    value: "'Playfair Display', serif",
  },
  {
    label: "Montserrat",
    value: "'Montserrat', sans-serif",
  },
  {
    label: "DM Sans",
    value: "'DM Sans', sans-serif",
  },
  {
    label: "Poppins",
    value: "'Poppins', sans-serif",
  },
  {
    label: "Cormorant Garamond",
    value: "'Cormorant Garamond', serif",
  },
  {
    label: "Outfit",
    value: "'Outfit', sans-serif",
  },
  {
    label: "Inter",
    value: "'Inter', sans-serif",
  },
  {
    label: "Manrope",
    value: "'Manrope', sans-serif",
  },
  {
    label: "Plus Jakarta Sans",
    value: "'Plus Jakarta Sans', sans-serif",
  },
  {
    label: "Raleway",
    value: "'Raleway', sans-serif",
  },
  {
    label: "Lato",
    value: "'Lato', sans-serif",
  },
  {
    label: "Roboto",
    value: "'Roboto', sans-serif",
  },
  {
    label: "Oswald",
    value: "'Oswald', sans-serif",
  },
  {
    label: "Bebas Neue",
    value: "'Bebas Neue', sans-serif",
  },
  {
    label: "Space Grotesk",
    value: "'Space Grotesk', sans-serif",
  },
  {
    label: "Space Mono",
    value: "'Space Mono', monospace",
  },
  {
    label: "Libre Baskerville",
    value: "'Libre Baskerville', serif",
  },
  {
    label: "Merriweather",
    value: "'Merriweather', serif",
  },
  {
    label: "DM Serif Display",
    value: "'DM Serif Display', serif",
  },
  {
    label: "Bodoni Moda",
    value: "'Bodoni Moda', serif",
  },
  {
    label: "Cinzel",
    value: "'Cinzel', serif",
  },
  {
    label: "Abril Fatface",
    value: "'Abril Fatface', serif",
  },
  {
    label: "Dancing Script",
    value: "'Dancing Script', cursive",
  },
  {
    label: "Pacifico",
    value: "'Pacifico', cursive",
  },
  {
    label: "Caveat",
    value: "'Caveat', cursive",
  },
  {
    label: "Satisfy",
    value: "'Satisfy', cursive",
  },
  {
    label: "Tangerine",
    value: "'Tangerine', cursive",
  },
  {
    label: "Josefin Sans",
    value: "'Josefin Sans', sans-serif",
  },
  {
    label: "Quicksand",
    value: "'Quicksand', sans-serif",
  },
  {
    label: "Nunito",
    value: "'Nunito', sans-serif",
  },
  {
    label: "Archivo",
    value: "'Archivo', sans-serif",
  },
  {
    label: "Barlow",
    value: "'Barlow', sans-serif",
  },
  {
    label: "Barlow Condensed",
    value: "'Barlow Condensed', sans-serif",
  },
  {
    label: "Fira Sans",
    value: "'Fira Sans', sans-serif",
  },
  {
    label: "Karla",
    value: "'Karla', sans-serif",
  },
  {
    label: "Rubik",
    value: "'Rubik', sans-serif",
  },
  {
    label: "Work Sans",
    value: "'Work Sans', sans-serif",
  },
  {
    label: "Source Sans 3",
    value: "'Source Sans 3', sans-serif",
  },
  {
    label: "Source Serif 4",
    value: "'Source Serif 4', serif",
  },
];

/* =========================================================
   LAYOUTS
========================================================= */

const LAYOUTS = [
  {
    label: "Icon Top",
    value: "iconTop",
    description: "Icon above the name",
  },
  {
    label: "Icon Left",
    value: "iconLeft",
    description: "Icon beside the name",
  },
  {
    label: "Icon Big",
    value: "iconBig",
    description: "Large symbol with text",
  },
  {
    label: "Badge",
    value: "badge",
    description: "Compact badge composition",
  },
  {
    label: "Text Only",
    value: "textOnly",
    description: "Typography only",
  },
  {
    label: "Horizontal",
    value: "horizontalBar",
    description: "Wide horizontal composition",
  },
];

/* =========================================================
   RADII
========================================================= */

const RADII = [
  {
    label: "Sharp",
    value: "0px",
  },
  {
    label: "Small",
    value: "8px",
  },
  {
    label: "Medium",
    value: "16px",
  },
  {
    label: "Large",
    value: "24px",
  },
  {
    label: "Pill",
    value: "999px",
  },
];

/* =========================================================
   EFFECTS
========================================================= */

const EFFECTS = [
  {
    label: "None",
    value: "none",
    description: "Clean logo",
  },
  {
    label: "Glow",
    value: "glow",
    description: "Soft colored glow",
  },
  {
    label: "Metallic",
    value: "metallic",
    description: "Metallic depth",
  },
  {
    label: "Shadow",
    value: "shadow",
    description: "Deep shadow",
  },
  {
    label: "Neon",
    value: "neon",
    description: "Neon light effect",
  },
];

/* =========================================================
   QUICK PALETTE
========================================================= */

const QUICK_PALETTE_COLORS = PALETTES.slice(
  0,
  20
).map((palette) => ({
  bg: palette.bg,
  text:
    palette.textLight ||
    palette.textDark ||
    "#111111",
}));

/* =========================================================
   ICON MASK
========================================================= */

function MaskedIcon({
  src,
  color,
  size,
  rotation = 0,
  opacity = 1,
  offsetX = 0,
  offsetY = 0,
  effect = "none",
}: {
  src: string;
  color: string;
  size: number;
  rotation?: number;
  opacity?: number;
  offsetX?: number;
  offsetY?: number;
  effect?: string;
}) {
  let filter = "";

  if (effect === "glow") {
    filter = `drop-shadow(0 0 10px ${color}66)`;
  }

  if (effect === "neon") {
    filter = `drop-shadow(0 0 8px ${color}99) drop-shadow(0 0 18px ${color}55)`;
  }

  if (effect === "shadow") {
    filter = "drop-shadow(0 8px 8px rgba(0,0,0,0.25))";
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: color,
        opacity,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        transformOrigin: "center center",
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        filter,
      }}
    />
  );
}

/* =========================================================
   FRAME
========================================================= */

function FrameWrapper({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo: ExtendedLogo;
}) {
  const style: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
  };

  const frameStyle = logo.frameStyle || "none";

  if (frameStyle === "none") {
    return (
      <div style={style}>
        {children}
      </div>
    );
  }

  const thickness = clamp(
    Number(logo.frameThickness) || 2,
    1,
    10
  );

  const frameColor =
    logo.frameColor ||
    logo.iconColor ||
    logo.textColor ||
    "#111111";

  const borderRadius =
    logo.borderRadius || "16px";

  let borderStyle:
    | "solid"
    | "dashed" = "solid";

  if (frameStyle === "dashed") {
    borderStyle = "dashed";
  }

  const frame: React.CSSProperties = {
    position: "absolute",
    inset: thickness,
    pointerEvents: "none",
    border: `${thickness}px ${borderStyle} ${frameColor}`,
    zIndex: 10,
    borderRadius:
      frameStyle === "circle"
        ? "50%"
        : frameStyle === "square"
          ? "0px"
          : frameStyle === "rounded"
            ? borderRadius
            : frameStyle === "border"
              ? borderRadius
              : borderRadius,
  };

  return (
    <div style={style}>
      {children}
      <div style={frame} />
    </div>
  );
}

/* =========================================================
   LOGO PREVIEW
========================================================= */

function LogoPreview({
  logo,
  scale = 1,
}: {
  logo: LogoConfig;
  scale?: number;
}) {
  const data = logo as ExtendedLogo;

  const {
    name,
    slogan,
    iconPath,
    palette,
    layout,
    fontFamily,
    fontSize,
    fontWeight,
    textColor,
    background,
    effect,
  } = data;

  const safeFont =
    fontFamily ||
    "'DM Sans', sans-serif";

  const safeTextColor =
    data.textColor ||
    palette?.textDark ||
    "#111111";

  const safeIconColor =
    data.iconColor ||
    safeTextColor;

  const safeSloganColor =
    data.sloganColor ||
    safeTextColor;

  const safeBackground =
    background ||
    palette?.bg ||
    "#ffffff";

  const backgroundType =
    data.backgroundType ||
    "solid";

  const backgroundColor1 =
    data.backgroundColor1 ||
    safeBackground;

  const backgroundColor2 =
    data.backgroundColor2 ||
    safeTextColor;

  const angle =
    Number(data.backgroundAngle) || 90;

  let finalBackground =
    backgroundColor1;

  if (backgroundType === "linear-gradient") {
    finalBackground = `linear-gradient(${angle}deg, ${backgroundColor1}, ${backgroundColor2})`;
  }

  if (backgroundType === "radial-gradient") {
    finalBackground = `radial-gradient(circle, ${backgroundColor1}, ${backgroundColor2})`;
  }

  const size =
    Number(fontSize) || 32;

  const iconSize =
    clamp(
      Number(data.iconSize) || 64,
      30,
      120
    ) * scale;

  const iconGap =
    Number(data.iconGap ?? 16) * scale;

  const layoutGap =
    Number(data.layoutGap ?? 10) * scale;

  const padding =
    Number(data.layoutPadding ?? 24) * scale;

  const layoutScale =
    Number(data.layoutScale ?? 1);

  const layoutOffsetX =
    Number(data.layoutOffsetX ?? 0) *
    scale;

  const layoutOffsetY =
    Number(data.layoutOffsetY ?? 0) *
    scale;

  const iconOffsetX =
    Number(data.iconOffsetX ?? 0) *
    scale;

  const iconOffsetY =
    Number(data.iconOffsetY ?? 0) *
    scale;

  const iconRotation =
    Number(data.iconRotation ?? 0);

  const iconOpacity =
    clamp(
      Number(data.iconOpacity ?? 100) /
        100,
      0,
      1
    );

  const letterSpacing =
    Number(data.letterSpacing ?? 0) *
    scale;

  const lineHeight =
    Number(data.lineHeight ?? 1.1);

  const nameSloganGap =
    Number(data.nameSloganGap ?? 5) *
    scale;

  const sloganSize =
    Number(
      data.sloganFontSize ??
        Math.max(9, size * 0.32)
    ) * scale;

  const sloganWeight =
    Number(
      data.sloganFontWeight ?? 500
    );

  const alignment =
    data.alignment || "center";

  const alignmentValue =
    alignment === "top"
      ? "flex-start"
      : alignment === "bottom"
        ? "flex-end"
        : "center";

  const transform =
    getTransform(
      data.textTransform
    );

  const effectStyles: Record<
    string,
    React.CSSProperties
  > = {
    none: {},

    glow: {
      boxShadow: `0 0 35px ${safeTextColor}55, inset 0 0 25px ${safeTextColor}15`,
    },

    metallic: {
      boxShadow:
        "0 10px 30px rgba(212,175,55,0.28), inset 0 0 18px rgba(255,255,255,0.22)",
    },

    shadow: {
      boxShadow:
        "0 18px 38px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)",
    },

    neon: {
      boxShadow: `0 0 18px ${safeTextColor}88, 0 0 45px ${safeTextColor}44`,
    },
  };

  const textEffect: React.CSSProperties =
    effect === "neon"
      ? {
          textShadow: `0 0 8px ${safeTextColor}99, 0 0 18px ${safeTextColor}55`,
        }
      : {};

  const nameStyle: React.CSSProperties = {
    fontFamily: safeFont,
    fontWeight:
      Number(fontWeight) || 600,
    fontSize:
      size *
      scale *
      layoutScale,
    color: safeTextColor,
    lineHeight,
    letterSpacing,
    textTransform: transform,
    whiteSpace: "nowrap",
    ...textEffect,
  };

  const sloganStyle: React.CSSProperties = {
    fontFamily: safeFont,
    fontSize:
      sloganSize *
      layoutScale,
    fontWeight: sloganWeight,
    color: safeSloganColor,
    opacity: 0.72,
    lineHeight,
    letterSpacing:
      letterSpacing * 0.5,
    textTransform: transform,
    whiteSpace: "nowrap",
    marginTop: nameSloganGap,
    ...textEffect,
  };

  const rootStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: finalBackground,
    borderRadius:
      data.borderRadius ||
      "16px",
    display: "flex",
    alignItems: alignmentValue,
    justifyContent: "center",
    padding,
    overflow: "hidden",
    boxSizing: "border-box",
    ...effectStyles[
      effect || "none"
    ],
  };

  const contentStyle: React.CSSProperties = {
    transform: `translate(${layoutOffsetX}px, ${layoutOffsetY}px) scale(${layoutScale})`,
    transformOrigin: "center center",
  };

  const textBlock = (
    <div
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems:
          layout === "iconLeft"
            ? "flex-start"
            : "center",
      }}
    >
      <div style={nameStyle}>
        {name}
      </div>

      {slogan && (
        <div style={sloganStyle}>
          {slogan}
        </div>
      )}
    </div>
  );

  /* =====================================================
     VARIANTS
  ===================================================== */

  const variant =
    data.variant || "full";

  if (variant === "iconOnly") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={contentStyle}>
            {iconPath && (
              <MaskedIcon
                src={iconPath}
                color={safeIconColor}
                size={
                  iconSize *
                  (layout === "iconBig"
                    ? 1.25
                    : 1)
                }
                rotation={
                  iconRotation
                }
                opacity={
                  iconOpacity
                }
                offsetX={
                  iconOffsetX
                }
                offsetY={
                  iconOffsetY
                }
                effect={
                  effect
                }
              />
            )}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  if (variant === "wordmark") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={contentStyle}>
            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  if (variant === "dark") {
    const darkLogo: ExtendedLogo = {
      ...data,
      backgroundType: "solid",
      backgroundColor1:
        "#111111",
      background: "#111111",
      textColor: "#ffffff",
      sloganColor: "#ffffff",
      iconColor: "#ffffff",
    };

    return (
      <LogoPreview
        logo={darkLogo as LogoConfig}
        scale={scale}
      />
    );
  }

  if (variant === "light") {
    const lightLogo: ExtendedLogo = {
      ...data,
      backgroundType: "solid",
      backgroundColor1:
        "#ffffff",
      background: "#ffffff",
      textColor: "#111111",
      sloganColor: "#111111",
      iconColor: "#111111",
    };

    return (
      <LogoPreview
        logo={lightLogo as LogoConfig}
        scale={scale}
      />
    );
  }

  /* =====================================================
     TEXT ONLY
  ===================================================== */

  if ((variant as string) === "wordmark") {
  return (
    <FrameWrapper logo={data}>
      <div style={rootStyle}>
        <div style={contentStyle}>
          {textBlock}
        </div>
      </div>
    </FrameWrapper>
  );
}
  /* =====================================================
     HORIZONTAL
  ===================================================== */

  if (layout === "horizontalBar") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div
            style={{
              ...contentStyle,
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: iconGap,
            }}
          >
            {iconPath && (
              <MaskedIcon
                src={iconPath}
                color={safeIconColor}
                size={iconSize}
                rotation={
                  iconRotation
                }
                opacity={
                  iconOpacity
                }
                offsetX={
                  iconOffsetX
                }
                offsetY={
                  iconOffsetY
                }
                effect={
                  effect
                }
              />
            )}

            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  /* =====================================================
     BADGE
  ===================================================== */

  if (layout === "badge") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div
            style={{
              ...contentStyle,
              display: "flex",
              alignItems: "center",
              gap: iconGap,
            }}
          >
            {iconPath && (
              <MaskedIcon
                src={iconPath}
                color={safeIconColor}
                size={
                  Math.min(
                    iconSize,
                    64 * scale
                  )
                }
                rotation={
                  iconRotation
                }
                opacity={
                  iconOpacity
                }
                offsetX={
                  iconOffsetX
                }
                offsetY={
                  iconOffsetY
                }
                effect={
                  effect
                }
              />
            )}

            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  /* =====================================================
     ICON LEFT
  ===================================================== */

  if (layout === "iconLeft") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div
            style={{
              ...contentStyle,
              display: "flex",
              alignItems: "center",
              gap: iconGap,
            }}
          >
            {iconPath && (
              <MaskedIcon
                src={iconPath}
                color={safeIconColor}
                size={iconSize}
                rotation={
                  iconRotation
                }
                opacity={
                  iconOpacity
                }
                offsetX={
                  iconOffsetX
                }
                offsetY={
                  iconOffsetY
                }
                effect={
                  effect
                }
              />
            )}

            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  /* =====================================================
     ICON TOP / ICON BIG / STACKED
  ===================================================== */

  return (
    <FrameWrapper logo={data}>
      <div style={rootStyle}>
        <div
          style={{
            ...contentStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent:
              "center",
            gap:
              layout ===
              "iconBig"
                ? layoutGap +
                  4
                : layoutGap,
            textAlign: "center",
          }}
        >
          {iconPath && (
            <MaskedIcon
              src={iconPath}
              color={safeIconColor}
              size={
                layout === "iconBig"
                  ? Math.min(
                      120 *
                        scale,
                      iconSize *
                        1.3
                    )
                  : iconSize
              }
              rotation={
                iconRotation
              }
              opacity={
                iconOpacity
              }
              offsetX={
                iconOffsetX
              }
              offsetY={
                iconOffsetY
              }
              effect={
                effect
              }
            />
          )}

          {textBlock}
        </div>
      </div>
    </FrameWrapper>
  );
}

/* =========================================================
   UI HELPERS
========================================================= */

function Section({
  title,
  children,
  onReset,
}: {
  title: string;
  children: React.ReactNode;
  onReset?: () => void;
}) {
  return (
    <section
      style={{
        paddingBottom: 18,
        borderBottom:
          "1px solid #f0f0f2",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          marginBottom: 10,
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7280",
          }}
        >
          {title}
        </label>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              border: "none",
              background:
                "transparent",
              color: "#4f46e5",
              fontSize: 9,
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Reset
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: 10,
            color: "#374151",
            fontWeight: 700,
          }}
        >
          {value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value
            )
          )
        }
        style={{
          width: "100%",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const safeValue =
    /^#[0-9a-fA-F]{6}$/.test(
      value || ""
    )
      ? value
      : "#111111";

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 700,
          color: "#6b7280",
          marginBottom: 7,
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          type="color"
          value={safeValue}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          style={{
            width: 42,
            height: 36,
            border:
              "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 3,
            cursor: "pointer",
            background:
              "#ffffff",
          }}
        />

        <input
          type="text"
          value={value || ""}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          style={{
            flex: 1,
            minWidth: 0,
            boxSizing:
              "border-box",
            border:
              "1px solid #e5e7eb",
            borderRadius: 8,
            padding:
              "8px 10px",
            outline: "none",
            fontSize: 11,
            fontFamily:
              "monospace",
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   EDITOR
========================================================= */

function EditorInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const previewRef =
    useRef<HTMLDivElement>(null);

  const [logo, setLogo] =
    useState<ExtendedLogo | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [paid, setPaid] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<EditorTab>("colors");

  /* =====================================================
     HISTORY
  ===================================================== */

  const [history, setHistory] =
    useState<ExtendedLogo[]>([]);

  const [future, setFuture] =
    useState<ExtendedLogo[]>([]);

  const historyRef =
    useRef<ExtendedLogo[]>([]);

  const futureRef =
    useRef<ExtendedLogo[]>([]);

  /* =====================================================
     ICON STATE
  ===================================================== */

  const [iconFolders, setIconFolders] =
    useState<IconFolders>({});

  const [iconsLoading, setIconsLoading] =
    useState(false);

  const [iconsError, setIconsError] =
    useState<string | null>(null);

  const [selectedIconFolder, setSelectedIconFolder] =
    useState<string>("");

  const [iconSearch, setIconSearch] =
    useState("");

  /* =====================================================
     LOAD LOGO
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadLogo() {
      const id = params.get("id");
      const data = params.get("data");

      setLoading(true);

      try {
        let loaded: ExtendedLogo | null =
          null;

        if (id) {
          const response =
            await fetch(
              "/api/logos/my-logos",
              {
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }

          const responseData =
            await response.json();

          const found =
            responseData?.logos?.find(
              (item: any) =>
                item._id === id
            );

          if (found?.logoData) {
            loaded =
              found.logoData;
          }
        } else if (data) {
          const parsed =
            safeDecodeLogoData(
              data
            );

          if (parsed) {
           loaded = parsed as ExtendedLogo;
          }
        }

        if (
          !cancelled &&
          loaded
        ) {
          const normalized: ExtendedLogo =
            {
              ...loaded,

              iconSize:
                Number(
                  (loaded as any)
                    .iconSize ??
                    64
                ),

              iconColor:
                (loaded as any)
                  .iconColor ||
                (loaded as any)
                  .textColor ||
                "#111111",

              iconGap:
                Number(
                  (loaded as any)
                    .iconGap ??
                    16
                ),

              iconRotation:
                Number(
                  (loaded as any)
                    .iconRotation ??
                    0
                ),

              iconOpacity:
                Number(
                  (loaded as any)
                    .iconOpacity ??
                    100
                ),

              iconOffsetX:
                Number(
                  (loaded as any)
                    .iconOffsetX ??
                    0
                ),

              iconOffsetY:
                Number(
                  (loaded as any)
                    .iconOffsetY ??
                    0
                ),

             letterSpacing:
  `${Number(
    (loaded as any).letterSpacing ?? 0
  )}px`,

              lineHeight:
                Number(
                  (loaded as any)
                    .lineHeight ??
                    1.1
                ),

              textTransform:
                (loaded as any)
                  .textTransform ||
                "none",

              nameSloganGap:
                Number(
                  (loaded as any)
                    .nameSloganGap ??
                    5
                ),

              sloganFontSize:
                Number(
                  (loaded as any)
                    .sloganFontSize ??
                    Math.max(
                      9,
                      Number(
                        (loaded as any)
                          .fontSize ??
                          32
                      ) * 0.32
                    )
                ),

              sloganFontWeight:
                Number(
                  (loaded as any)
                    .sloganFontWeight ??
                    500
                ),

              sloganColor:
                (loaded as any)
                  .sloganColor ||
                (loaded as any)
                  .textColor ||
                "#111111",

              layoutGap:
                Number(
                  (loaded as any)
                    .layoutGap ??
                    10
                ),

              layoutPadding:
                Number(
                  (loaded as any)
                    .layoutPadding ??
                    24
                ),

              alignment:
                (loaded as any)
                  .alignment ||
                "center",

              layoutScale:
                Number(
                  (loaded as any)
                    .layoutScale ??
                    1
                ),

              layoutOffsetX:
                Number(
                  (loaded as any)
                    .layoutOffsetX ??
                    0
                ),

              layoutOffsetY:
                Number(
                  (loaded as any)
                    .layoutOffsetY ??
                    0
                ),

              backgroundType:
                (loaded as any)
                  .backgroundType ||
                "solid",

              backgroundColor1:
                (loaded as any)
                  .backgroundColor1 ||
                (loaded as any)
                  .background ||
                "#ffffff",

              backgroundColor2:
                (loaded as any)
                  .backgroundColor2 ||
                "#111111",

              backgroundAngle:
                Number(
                  (loaded as any)
                    .backgroundAngle ??
                    90
                ),

              frameStyle:
                (loaded as any)
                  .frameStyle ||
                "none",

              frameThickness:
                Number(
                  (loaded as any)
                    .frameThickness ??
                    2
                ),

              frameColor:
                (loaded as any)
                  .frameColor ||
                (loaded as any)
                  .textColor ||
                "#111111",

              variant:
                (loaded as any)
                  .variant ||
                "full",
            };

          setLogo(normalized);

          historyRef.current = [];
          futureRef.current = [];
          setHistory([]);
          setFuture([]);
        }
      } catch (error) {
        console.error(
          "[Editor] Failed to load logo:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLogo();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* =====================================================
     LOAD ICONS
  ===================================================== */

  useEffect(() => {
    if (
      activeTab !== "icons"
    ) {
      return;
    }

    let cancelled = false;

    async function loadIcons() {
      setIconsLoading(true);
      setIconsError(null);

      try {
        const response =
          await fetch(
            "/api/icons",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          data &&
          typeof data ===
            "object" &&
          !Array.isArray(data) &&
          !data.error
        ) {
          if (!cancelled) {
            setIconFolders(data);

            const folders =
              Object.keys(data);

            if (
              !selectedIconFolder &&
              folders.length > 0
            ) {
              setSelectedIconFolder(
                folders[0]
              );
            }
          }
        } else {
          throw new Error(
            data?.error ||
              "Invalid icon API response"
          );
        }
      } catch (error) {
        console.error(
          "[Editor] Failed to load icons:",
          error
        );

        if (!cancelled) {
          setIconsError(
            "Could not load icons."
          );
        }
      } finally {
        if (!cancelled) {
          setIconsLoading(false);
        }
      }
    }

    loadIcons();

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    selectedIconFolder,
  ]);

  /* =====================================================
     UPDATE
  ===================================================== */

  const update = useCallback(
    (
      patch: Partial<ExtendedLogo>
    ) => {
      setLogo((previous) => {
        if (!previous) {
          return previous;
        }

        const next = {
          ...previous,
          ...patch,
        };

        historyRef.current = [
          ...historyRef.current,
          previous,
        ];

        futureRef.current = [];

        setHistory(
          historyRef.current
        );
        setFuture([]);

        return next;
      });
    },
    []
  );

  /* =====================================================
     UNDO
  ===================================================== */

  const undo = useCallback(() => {
    if (
      !logo ||
      historyRef.current.length === 0
    ) {
      return;
    }

    const previous =
      historyRef.current[
        historyRef.current.length - 1
      ];

    historyRef.current =
      historyRef.current.slice(
        0,
        -1
      );

    futureRef.current = [
      logo,
      ...futureRef.current,
    ];

    setHistory(
      historyRef.current
    );
    setFuture(
      futureRef.current
    );

    setLogo(previous);
  }, [logo]);

  /* =====================================================
     REDO
  ===================================================== */

  const redo = useCallback(() => {
    if (
      !logo ||
      futureRef.current.length === 0
    ) {
      return;
    }

    const next =
      futureRef.current[0];

    futureRef.current =
      futureRef.current.slice(1);

    historyRef.current = [
      ...historyRef.current,
      logo,
    ];

    setHistory(
      historyRef.current
    );
    setFuture(
      futureRef.current
    );

    setLogo(next);
  }, [logo]);

  /* =====================================================
     KEYBOARD UNDO / REDO
  ===================================================== */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      const modifier =
        event.ctrlKey ||
        event.metaKey;

      if (!modifier) {
        return;
      }

      if (
        event.key.toLowerCase() ===
        "z"
      ) {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (
        event.key.toLowerCase() ===
        "y"
      ) {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [undo, redo]);

  /* =====================================================
     RESET ALL
  ===================================================== */

  const resetAll = () => {
    if (!logo) {
      return;
    }

    const resetLogo: ExtendedLogo =
      {
        ...logo,

        iconSize: 64,
        iconColor:
          logo.textColor ||
          "#111111",
        iconGap: 16,
        iconRotation: 0,
        iconOpacity: 100,
        iconOffsetX: 0,
        iconOffsetY: 0,

       letterSpacing: "0px",
        lineHeight: 1.1,
        textTransform: "none",
        nameSloganGap: 5,
        sloganFontSize:
          Math.max(
            9,
            Number(
              logo.fontSize ||
                32
            ) * 0.32
          ),
        sloganFontWeight: 500,
        sloganColor:
          logo.textColor ||
          "#111111",

        layoutGap: 10,
        layoutPadding: 24,
        alignment: "center",
        layoutScale: 1,
        layoutOffsetX: 0,
        layoutOffsetY: 0,

        backgroundType: "solid",
        backgroundColor1:
          logo.background ||
          logo.palette?.bg ||
          "#ffffff",
        backgroundColor2:
          "#111111",
        backgroundAngle: 90,

        frameStyle: "none",
        frameThickness: 2,
        frameColor:
          logo.textColor ||
          "#111111",

        variant: "full",
      };

    historyRef.current = [
      ...historyRef.current,
      logo,
    ];

    futureRef.current = [];

    setHistory(
      historyRef.current
    );
    setFuture([]);

    setLogo(resetLogo);
  };

  /* =====================================================
     RESET CURRENT SECTION
  ===================================================== */

  const resetSection = () => {
    if (!logo) {
      return;
    }

    if (
      activeTab === "colors"
    ) {
      update({
        backgroundType: "solid",
        backgroundColor1:
          logo.palette?.bg ||
          "#ffffff",
        backgroundColor2:
          "#111111",
        backgroundAngle: 90,
        background:
          logo.palette?.bg ||
          "#ffffff",
        textColor:
          logo.palette?.textDark ||
          "#111111",
      });

      return;
    }

    if (
      activeTab === "typography"
    ) {
      update({
        fontFamily:
          "'DM Sans', sans-serif",
        fontWeight: "600",
        fontSize: 32,
       letterSpacing: "0",
        lineHeight: 1.1,
        textTransform: "none",
        nameSloganGap: 5,
        sloganFontSize: 10,
        sloganFontWeight: 500,
        sloganColor:
          logo.textColor ||
          "#111111",
      });

      return;
    }

    if (
      activeTab === "layout"
    ) {
      update({
        layout:
          "iconTop",
        layoutGap: 10,
        layoutPadding: 24,
        alignment: "center",
        layoutScale: 1,
        layoutOffsetX: 0,
        layoutOffsetY: 0,
        borderRadius:
          "16px",
      });

      return;
    }

    if (
      activeTab === "icons"
    ) {
      update({
        iconSize: 64,
        iconGap: 16,
        iconRotation: 0,
        iconOpacity: 100,
        iconOffsetX: 0,
        iconOffsetY: 0,
        iconColor:
          logo.textColor ||
          "#111111",
      });

      return;
    }

    if (
      activeTab === "effects"
    ) {
      update({
        effect: "none",
        frameStyle: "none",
        frameThickness: 2,
        frameColor:
          logo.textColor ||
          "#111111",
      });

      return;
    }

    if (
      activeTab === "brand"
    ) {
      update({
        variant: "full",
      });
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          height: "100vh",
          background:
            "#f8f8f8",
          fontFamily:
            "'DM Sans', sans-serif",
        }}
      >
        <p
          style={{
            color:
              "#4f46e5",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Loading Brandify Editor...
        </p>
      </div>
    );
  }

  /* =====================================================
     NO LOGO
  ===================================================== */

  if (!logo) {
    return (
      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          height: "100vh",
          flexDirection:
            "column",
          gap: 16,
          fontFamily:
            "'DM Sans', sans-serif",
        }}
      >
        <p
          style={{
            color:
              "#6b7280",
            fontSize: 15,
          }}
        >
          No logo selected.
        </p>

        <button
          onClick={() =>
            router.push(
              "/generate"
            )
          }
          style={{
            background:
              "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding:
              "10px 24px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  /* =====================================================
     ICON LIST
  ===================================================== */

  const folderNames =
    Object.keys(
      iconFolders
    );

  const currentIcons: IconItem[] =
    selectedIconFolder
      ? (
          iconFolders[
            selectedIconFolder
          ] || []
        )
          .filter((file) =>
            file
              .toLowerCase()
              .includes(
                iconSearch
                  .toLowerCase()
                  .trim()
              )
          )
          .map((file) => ({
            name: file,
            path: makeIconPath(
              selectedIconFolder,
              file
            ),
          }))
      : [];

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      style={{
        display: "flex",
        flexDirection:
          "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        fontFamily:
          "'DM Sans', sans-serif",
        background:
          "#f7f7f8",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          height: 58,
          minHeight: 58,
          background:
            "#ffffff",
          borderBottom:
            "1px solid #ececef",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          padding:
            "0 20px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 16,
          }}
        >
          <button
            onClick={() =>
              router.back()
            }
            style={{
              border: "none",
              background:
                "transparent",
              color:
                "#6b7280",
              cursor:
                "pointer",
              fontSize: 13,
              padding:
                "6px 0",
            }}
          >
            ← Back
          </button>

          <div
            style={{
              width: 1,
              height: 20,
              background:
                "#e5e7eb",
            }}
          />

          <span
            style={{
              fontWeight: 750,
              fontSize: 16,
              color:
                "#111827",
            }}
          >
            Brandify Editor
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 8,
          }}
        >
          {/* UNDO */}
          <button
            type="button"
            onClick={undo}
            disabled={
              history.length ===
              0
            }
            title="Undo — Ctrl + Z"
            style={{
              width: 34,
              height: 34,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              background:
                "#ffffff",
              color:
                history.length
                  ? "#374151"
                  : "#c4c7ce",
              cursor:
                history.length
                  ? "pointer"
                  : "default",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ↶
          </button>

          {/* REDO */}
          <button
            type="button"
            onClick={redo}
            disabled={
              future.length ===
              0
            }
            title="Redo — Ctrl + Shift + Z"
            style={{
              width: 34,
              height: 34,
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              background:
                "#ffffff",
              color:
                future.length
                  ? "#374151"
                  : "#c4c7ce",
              cursor:
                future.length
                  ? "pointer"
                  : "default",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ↷
          </button>

          {/* RESET ALL */}
          <button
            type="button"
            onClick={resetAll}
            title="Reset all settings"
            style={{
              height: 34,
              padding:
                "0 11px",
              border:
                "1px solid #e5e7eb",
              borderRadius: 8,
              background:
                "#ffffff",
              color:
                "#6b7280",
              cursor:
                "pointer",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            Reset All
          </button>

          {isSignedIn && (
            <LogoSaveButton
              logo={
                logo as LogoConfig
              }
            />
          )}

          <button
            onClick={() =>
              setActiveTab(
                "downloads"
              )
            }
            style={{
              background:
                "#4f46e5",
              color:
                "#ffffff",
              border: "none",
              borderRadius: 8,
              padding:
                "8px 18px",
              fontSize: 13,
              fontWeight: 650,
              cursor:
                "pointer",
            }}
          >
            ↓ Downloads
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* =================================================
            LEFT / CANVAS
        ================================================= */}

        <main
          style={{
            width: "60%",
            flex:
              "0 0 60%",
            minWidth: 0,
            display: "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 32,
            gap: 24,
            overflow: "auto",
          }}
        >
          <div
            ref={previewRef}
            style={{
              width:
                "min(680px, 90%)",
              aspectRatio:
                "2 / 1",
              position:
                "relative",
              border: "none",
              outline: "none",
              overflow:
                "hidden",
              boxShadow:
                "0 18px 50px rgba(0,0,0,0.10)",
              borderRadius:
                logo.borderRadius ||
                "16px",
            }}
          >
            <LogoPreview
              logo={
                logo as LogoConfig
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: 14,
              width: "100%",
              flexWrap:
                "wrap",
            }}
          >
            {[0.42, 0.28, 0.18].map(
              (scale) => (
                <div
                  key={scale}
                  style={{
                    width:
                      560 *
                      scale,
                    aspectRatio:
                      "2 / 1",
                    overflow:
                      "hidden",
                    borderRadius:
                      logo.borderRadius ||
                      "12px",
                    boxShadow:
                      "0 5px 16px rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <LogoPreview
                    logo={
                      logo as LogoConfig
                    }
                    scale={scale}
                  />
                </div>
              )
            )}
          </div>

          <p
            style={{
              fontSize: 11,
              color:
                "#9ca3af",
              margin: 0,
            }}
          >
            Live preview
          </p>
        </main>

        {/* =================================================
            RIGHT / SIDEBAR
        ================================================= */}

        <aside
          style={{
            width: "40%",
            flex:
              "0 0 40%",
            minWidth: 0,
            background:
              "#ffffff",
            borderLeft:
              "1px solid #e7e7ea",
            display: "flex",
            flexDirection:
              "column",
            overflow:
              "hidden",
          }}
        >
          {/* =================================================
              TABS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7, minmax(0, 1fr))",
              borderBottom:
                "1px solid #eeeeef",
              background:
                "#ffffff",
              flexShrink: 0,
            }}
          >
            {[
              {
                id: "colors" as const,
                label: "Colors",
                icon: "◐",
              },
              {
                id: "typography" as const,
                label: "Type",
                icon: "Aa",
              },
              {
                id: "layout" as const,
                label: "Layout",
                icon: "▦",
              },
              {
                id: "icons" as const,
                label: "Icons",
                icon: "✦",
              },
              {
                id: "effects" as const,
                label: "Effects",
                icon: "✧",
              },
              {
                id: "brand" as const,
                label: "Brand",
                icon: "◉",
              },
              {
                id: "downloads" as const,
                label: "Export",
                icon: "↓",
              },
            ].map(
              (tab) => {
                const active =
                  activeTab ===
                  tab.id;

                return (
                  <button
                    key={
                      tab.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id
                      )
                    }
                    style={{
                      minWidth: 0,
                      padding:
                        "11px 3px 9px",
                      border:
                        "none",
                      borderBottom:
                        active
                          ? "2px solid #4f46e5"
                          : "2px solid transparent",
                      background:
                        active
                          ? "#ffffff"
                          : "#fafafa",
                      color:
                        active
                          ? "#4f46e5"
                          : "#737780",
                      cursor:
                        "pointer",
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          tab.id ===
                          "typography"
                            ? 10
                            : 13,
                        fontWeight:
                          700,
                        lineHeight: 1,
                      }}
                    >
                      {
                        tab.icon
                      }
                    </span>

                    <span
                      style={{
                        fontSize: 9,
                        fontWeight:
                          active
                            ? 700
                            : 600,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        tab.label
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {/* =================================================
              TAB CONTENT
          ================================================= */}

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY:
                "auto",
              padding: 20,
            }}
          >
            {/* =================================================
                COLORS / BACKGROUND
            ================================================= */}

            {activeTab ===
              "colors" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 18,
                }}
              >
                <Section
                  title="Background"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(3, 1fr)",
                      gap: 6,
                      marginBottom: 12,
                    }}
                  >
                    {[
                      {
                        value:
                          "solid",
                        label:
                          "Solid",
                      },
                      {
                        value:
                          "linear-gradient",
                        label:
                          "Linear",
                      },
                      {
                        value:
                          "radial-gradient",
                        label:
                          "Radial",
                      },
                    ].map(
                      (
                        item
                      ) => {
                        const active =
                          logo.backgroundType ===
                            item.value ||
                          (!logo.backgroundType &&
                            item.value ===
                              "solid");

                        return (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            onClick={() =>
                              update({
                                backgroundType:
                                  item.value as BackgroundType,
                              })
                            }
                            style={{
                              padding:
                                "8px 5px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            {
                              item.label
                            }
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 10,
                    }}
                  >
                    <ColorControl
                      label="Color 1"
                      value={
                        logo.backgroundColor1 ||
                        logo.background ||
                        "#ffffff"
                      }
                      onChange={(
                        value
                      ) =>
                        update({
                          backgroundColor1:
                            value,
                          background:
                            value,
                        })
                      }
                    />

                    {logo.backgroundType !==
                      "solid" && (
                      <>
                        <ColorControl
                          label="Color 2"
                          value={
                            logo.backgroundColor2 ||
                            "#111111"
                          }
                          onChange={(
                            value
                          ) =>
                            update({
                              backgroundColor2:
                                value,
                            })
                          }
                        />

                        <RangeControl
                          label="Angle"
                          value={clamp(
                            Number(
                              logo.backgroundAngle ??
                                90
                            ),
                            0,
                            360
                          )}
                          min={0}
                          max={360}
                          suffix="°"
                          onChange={(
                            value
                          ) =>
                            update({
                              backgroundAngle:
                                value,
                            })
                          }
                        />
                      </>
                    )}
                  </div>
                </Section>

                <Section title="Text Color">
                  <ColorControl
                    label="Text"
                    value={
                      logo.textColor ||
                      "#111111"
                    }
                    onChange={(
                      value
                    ) =>
                      update({
                        textColor:
                          value,
                        sloganColor:
                          logo.sloganColor ||
                          value,
                        iconColor:
                          logo.iconColor ||
                          value,
                      })
                    }
                  />
                </Section>

                <Section title="Quick Palettes">
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(4, 1fr)",
                      gap: 8,
                    }}
                  >
                    {QUICK_PALETTE_COLORS.map(
                      (
                        palette,
                        index
                      ) => (
                        <button
                          type="button"
                          key={
                            index
                          }
                          onClick={() =>
                            update({
                              background:
                                palette.bg,
                              backgroundType:
                                "solid",
                              backgroundColor1:
                                palette.bg,
                              textColor:
                                palette.text,
                              iconColor:
                                palette.text,
                              sloganColor:
                                palette.text,
                            })
                          }
                          style={{
                            height: 42,
                            border:
                              "1px solid #e5e7eb",
                            borderRadius: 8,
                            background:
                              palette.bg,
                            color:
                              palette.text,
                            cursor:
                              "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          Aa
                        </button>
                      )
                    )}
                  </div>
                </Section>
              </div>
            )}

            {/* =================================================
                TYPOGRAPHY
            ================================================= */}

            {activeTab ===
              "typography" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 18,
                }}
              >
                <Section
                  title="Font Family"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: 7,
                    }}
                  >
                    {FONTS.map(
                      (font) => {
                        const active =
                          logo.fontFamily ===
                          font.value;

                        return (
                          <button
                            key={
                              font.value
                            }
                            type="button"
                            onClick={() =>
                              update({
                                fontFamily:
                                  font.value,
                              })
                            }
                            style={{
                              minHeight:
                                42,
                              padding:
                                "8px 10px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 8,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#374151",
                              cursor:
                                "pointer",
                              textAlign:
                                "left",
                              fontFamily:
                                font.value,
                              fontSize: 11,
                              fontWeight:
                                600,
                            }}
                          >
                            {
                              font.label
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Font Weight">
                  <div
                    style={{
                      display:
                        "flex",
                      flexWrap:
                        "wrap",
                      gap: 7,
                    }}
                  >
                    {[
                      400,
                      500,
                      600,
                      700,
                      800,
                      900,
                    ].map(
                      (
                        weight
                      ) => {
                        const active =
                          Number(
                            logo.fontWeight
                          ) ===
                          weight;

                        return (
                          <button
                            key={
                              weight
                            }
                            type="button"
                            onClick={() =>
                              update({
                                 fontWeight: String(weight),
                              })
                            }
                            style={{
                              padding:
                                "7px 11px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 11,
                              fontWeight:
                                weight,
                            }}
                          >
                            {
                              weight
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Name">
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    <RangeControl
                      label="Font Size"
                      value={Number(
                        logo.fontSize ??
                          32
                      )}
                      min={16}
                      max={96}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          fontSize:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Letter Spacing"
                      value={Number(
                        logo.letterSpacing ??
                          0
                      )}
                      min={-5}
                      max={10}
                      step={0.5}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          
                           letterSpacing: `${value}px`,
                        })
                      }
                    />

                    <RangeControl
                      label="Line Height"
                      value={Number(
                        logo.lineHeight ??
                          1.1
                      )}
                      min={0.8}
                      max={2}
                      step={0.05}
                      onChange={(
                        value
                      ) =>
                        update({
                          lineHeight:
                            value,
                        })
                      }
                    />
                  </div>
                </Section>

                <Section title="Transform">
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(4, 1fr)",
                      gap: 5,
                    }}
                  >
                    {[
                      [
                        "none",
                        "None",
                      ],
                      [
                        "uppercase",
                        "UPPER",
                      ],
                      [
                        "lowercase",
                        "lower",
                      ],
                      [
                        "capitalize",
                        "Title",
                      ],
                    ].map(
                      (item) => {
                        const active =
                          (logo.textTransform ||
                            "none") ===
                          item[0];

                        return (
                          <button
                            key={
                              item[0]
                            }
                            type="button"
                            onClick={() =>
                              update({
                                textTransform:
                                  item[0] as TransformType,
                              })
                            }
                            style={{
                              padding:
                                "7px 3px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            {
                              item[1]
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Slogan">
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    <RangeControl
                      label="Slogan Size"
                      value={Number(
                        logo.sloganFontSize ??
                          10
                      )}
                      min={8}
                      max={40}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          sloganFontSize:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Slogan Weight"
                      value={Number(
                        logo.sloganFontWeight ??
                          500
                      )}
                      min={300}
                      max={800}
                      step={100}
                      onChange={(
                        value
                      ) =>
                        update({
                          sloganFontWeight:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Name-Slogan Gap"
                      value={Number(
                        logo.nameSloganGap ??
                          5
                      )}
                      min={0}
                      max={40}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          nameSloganGap:
                            value,
                        })
                      }
                    />

                    <ColorControl
                      label="Slogan Color"
                      value={
                        logo.sloganColor ||
                        logo.textColor ||
                        "#111111"
                      }
                      onChange={(
                        value
                      ) =>
                        update({
                          sloganColor:
                            value,
                        })
                      }
                    />
                  </div>
                </Section>
              </div>
            )}

            {/* =================================================
                LAYOUT
            ================================================= */}

            {activeTab ===
              "layout" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 18,
                }}
              >
                <Section
                  title="Logo Structure"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {LAYOUTS.map(
                      (
                        item
                      ) => {
                        const active =
                          logo.layout ===
                          item.value;

                        return (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            onClick={() =>
                              update({
                                layout:
                                  item.value as any,
                              })
                            }
                            style={{
                              minHeight:
                                66,
                              padding:
                                "10px 11px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 9,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              cursor:
                                "pointer",
                              textAlign:
                                "left",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight:
                                  700,
                                color:
                                  active
                                    ? "#4338ca"
                                    : "#374151",
                              }}
                            >
                              {
                                item.label
                              }
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 9,
                                lineHeight:
                                  1.35,
                                color:
                                  "#9ca3af",
                              }}
                            >
                              {
                                item.description
                              }
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Layout Controls">
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    <RangeControl
                      label="Gap"
                      value={Number(
                        logo.layoutGap ??
                          10
                      )}
                      min={0}
                      max={80}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          layoutGap:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Padding"
                      value={Number(
                        logo.layoutPadding ??
                          24
                      )}
                      min={0}
                      max={100}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          layoutPadding:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Scale"
                      value={Number(
                        logo.layoutScale ??
                          1
                      )}
                      min={0.5}
                      max={1.5}
                      step={0.05}
                      suffix="x"
                      onChange={(
                        value
                      ) =>
                        update({
                          layoutScale:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Offset X"
                      value={Number(
                        logo.layoutOffsetX ??
                          0
                      )}
                      min={-100}
                      max={100}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          layoutOffsetX:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Offset Y"
                      value={Number(
                        logo.layoutOffsetY ??
                          0
                      )}
                      min={-100}
                      max={100}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          layoutOffsetY:
                            value,
                        })
                      }
                    />
                  </div>
                </Section>

                <Section title="Alignment">
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(3, 1fr)",
                      gap: 6,
                    }}
                  >
                    {[
                      [
                        "top",
                        "Top",
                      ],
                      [
                        "center",
                        "Center",
                      ],
                      [
                        "bottom",
                        "Bottom",
                      ],
                    ].map(
                      (item) => {
                        const active =
                          (logo.alignment ||
                            "center") ===
                          item[0];

                        return (
                          <button
                            key={
                              item[0]
                            }
                            type="button"
                            onClick={() =>
                              update({
                                alignment:
                                  item[0] as Alignment,
                              })
                            }
                            style={{
                              padding:
                                "8px 4px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            {
                              item[1]
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Corner Radius">
                  <div
                    style={{
                      display:
                        "flex",
                      gap: 6,
                    }}
                  >
                    {RADII.map(
                      (
                        radius
                      ) => {
                        const active =
                          logo.borderRadius ===
                          radius.value;

                        return (
                          <button
                            key={
                              radius.value
                            }
                            type="button"
                            onClick={() =>
                              update({
                                borderRadius:
                                  radius.value,
                              })
                            }
                            style={{
                              flex: 1,
                              minWidth: 0,
                              padding:
                                "8px 4px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 9,
                              fontWeight: 600,
                            }}
                          >
                            {
                              radius.label
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>
              </div>
            )}

            {/* =================================================
                ICONS
            ================================================= */}

            {activeTab ===
              "icons" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 14,
                }}
              >
                <Section
                  title="Icon Controls"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 12,
                    }}
                  >
                    <RangeControl
                      label="Size"
                      value={clamp(
                        Number(
                          logo.iconSize ??
                            64
                        ),
                        30,
                        120
                      )}
                      min={30}
                      max={120}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconSize:
                            value,
                        })
                      }
                    />

                    <ColorControl
                      label="Icon Color"
                      value={
                        logo.iconColor ||
                        logo.textColor ||
                        "#111111"
                      }
                      onChange={(
                        value
                      ) =>
                        update({
                          iconColor:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Gap"
                      value={Number(
                        logo.iconGap ??
                          16
                      )}
                      min={0}
                      max={80}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconGap:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Rotation"
                      value={clamp(
                        Number(
                          logo.iconRotation ??
                            0
                        ),
                        0,
                        360
                      )}
                      min={0}
                      max={360}
                      suffix="°"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconRotation:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Opacity"
                      value={clamp(
                        Number(
                          logo.iconOpacity ??
                            100
                        ),
                        0,
                        100
                      )}
                      min={0}
                      max={100}
                      suffix="%"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconOpacity:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Offset X"
                      value={Number(
                        logo.iconOffsetX ??
                          0
                      )}
                      min={-100}
                      max={100}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconOffsetX:
                            value,
                        })
                      }
                    />

                    <RangeControl
                      label="Offset Y"
                      value={Number(
                        logo.iconOffsetY ??
                          0
                      )}
                      min={-100}
                      max={100}
                      suffix="px"
                      onChange={(
                        value
                      ) =>
                        update({
                          iconOffsetY:
                            value,
                        })
                      }
                    />
                  </div>
                </Section>

                <div>
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight:
                            750,
                          color:
                            "#111827",
                        }}
                      >
                        Icon Library
                      </div>

                      <div
                        style={{
                          fontSize: 9,
                          color:
                            "#9ca3af",
                          marginTop: 3,
                        }}
                      >
                        All SVG icons from
                        public/icons
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIconsError(
                          null
                        )
                      }
                      style={{
                        border:
                          "1px solid #e5e7eb",
                        background:
                          "#ffffff",
                        borderRadius: 7,
                        padding:
                          "6px 9px",
                        fontSize: 9,
                        cursor:
                          "pointer",
                      }}
                    >
                      Refresh
                    </button>
                  </div>

                  <input
                    value={
                      iconSearch
                    }
                    onChange={(
                      event
                    ) =>
                      setIconSearch(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Search icons..."
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding:
                        "9px 11px",
                      outline:
                        "none",
                      fontSize: 11,
                    }}
                  />
                </div>

                {iconsLoading && (
                  <div
                    style={{
                      padding:
                        "24px 10px",
                      textAlign:
                        "center",
                      color:
                        "#9ca3af",
                      fontSize: 11,
                    }}
                  >
                    Loading icons...
                  </div>
                )}

                {iconsError && (
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      background:
                        "#fef2f2",
                      border:
                        "1px solid #fecaca",
                      color:
                        "#b91c1c",
                      fontSize: 10,
                    }}
                  >
                    {
                      iconsError
                    }
                  </div>
                )}

                {!iconsLoading &&
                  !iconsError &&
                  folderNames.length >
                    0 && (
                    <>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight:
                              700,
                            color:
                              "#6b7280",
                            marginBottom:
                              7,
                          }}
                        >
                          Categories
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap: 5,
                            maxHeight:
                              120,
                            overflowY:
                              "auto",
                          }}
                        >
                          {folderNames.map(
                            (
                              folder
                            ) => {
                              const active =
                                selectedIconFolder ===
                                folder;

                              return (
                                <button
                                  key={
                                    folder
                                  }
                                  type="button"
                                  onClick={() => {
                                    setSelectedIconFolder(
                                      folder
                                    );
                                    setIconSearch(
                                      ""
                                    );
                                  }}
                                  style={{
                                    border:
                                      active
                                        ? "1px solid #4f46e5"
                                        : "1px solid #e5e7eb",
                                    background:
                                      active
                                        ? "#eef2ff"
                                        : "#ffffff",
                                    color:
                                      active
                                        ? "#4338ca"
                                        : "#4b5563",
                                    borderRadius:
                                      7,
                                    padding:
                                      "6px 8px",
                                    cursor:
                                      "pointer",
                                    fontSize: 9,
                                    fontWeight:
                                      active
                                        ? 700
                                        : 600,
                                  }}
                                >
                                  {
                                    folder
                                  }
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight:
                              700,
                            color:
                              "#374151",
                          }}
                        >
                          {
                            selectedIconFolder
                          }
                        </span>

                        <span
                          style={{
                            fontSize: 9,
                            color:
                              "#9ca3af",
                          }}
                        >
                          {
                            currentIcons.length
                          }{" "}
                          icons
                        </span>
                      </div>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(5, minmax(0, 1fr))",
                          gap: 7,
                        }}
                      >
                        {currentIcons.map(
                          (
                            icon
                          ) => {
                            const active =
                              logo.iconPath ===
                              icon.path;

                            return (
                              <button
                                key={
                                  icon.path
                                }
                                type="button"
                                title={
                                  icon.name
                                }
                                onClick={() =>
                                  update({
                                    iconPath:
                                      icon.path,
                                  })
                                }
                                style={{
                                  aspectRatio:
                                    "1 / 1",
                                  minWidth: 0,
                                  border:
                                    active
                                      ? "2px solid #4f46e5"
                                      : "1px solid #e5e7eb",
                                  borderRadius:
                                    8,
                                  background:
                                    active
                                      ? "#eef2ff"
                                      : "#ffffff",
                                  cursor:
                                    "pointer",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  padding:
                                    8,
                                  position:
                                    "relative",
                                }}
                              >
                                <MaskedIcon
                                  src={
                                    icon.path
                                  }
                                  color={
                                    logo.iconColor ||
                                    logo.textColor ||
                                    "#111111"
                                  }
                                  size={32}
                                />

                                {active && (
                                  <span
                                    style={{
                                      position:
                                        "absolute",
                                      top: 3,
                                      right: 3,
                                      width: 14,
                                      height: 14,
                                      borderRadius:
                                        "50%",
                                      background:
                                        "#4f46e5",
                                      color:
                                        "#ffffff",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      fontSize: 8,
                                      fontWeight:
                                        800,
                                    }}
                                  >
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {!currentIcons.length && (
                        <div
                          style={{
                            padding:
                              "28px 10px",
                            textAlign:
                              "center",
                            color:
                              "#9ca3af",
                            fontSize: 10,
                          }}
                        >
                          No icons found.
                        </div>
                      )}
                    </>
                  )}

                {!iconsLoading &&
                  !iconsError &&
                  folderNames.length ===
                    0 && (
                    <div
                      style={{
                        padding: 20,
                        textAlign:
                          "center",
                        color:
                          "#9ca3af",
                        fontSize: 10,
                      }}
                    >
                      No icon folders found.
                    </div>
                  )}
              </div>
            )}

            {/* =================================================
                EFFECTS + FRAME
            ================================================= */}

            {activeTab ===
              "effects" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 18,
                }}
              >
                <Section
                  title="Visual Effect"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {EFFECTS.map(
                      (
                        item
                      ) => {
                        const active =
                          logo.effect ===
                          item.value;

                        return (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            onClick={() =>
                              update({
                                effect:
                                  item.value as any,
                              })
                            }
                            style={{
                              minHeight:
                                70,
                              padding:
                                "11px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 9,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              cursor:
                                "pointer",
                              textAlign:
                                "left",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight:
                                  700,
                                color:
                                  active
                                    ? "#4338ca"
                                    : "#374151",
                              }}
                            >
                              {
                                item.label
                              }
                            </div>

                            <div
                              style={{
                                marginTop: 5,
                                fontSize: 9,
                                lineHeight:
                                  1.35,
                                color:
                                  "#9ca3af",
                              }}
                            >
                              {
                                item.description
                              }
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Frame">
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(3, 1fr)",
                      gap: 6,
                    }}
                  >
                    {[
                      [
                        "none",
                        "None",
                      ],
                      [
                        "circle",
                        "Circle",
                      ],
                      [
                        "square",
                        "Square",
                      ],
                      [
                        "rounded",
                        "Rounded",
                      ],
                      [
                        "border",
                        "Border",
                      ],
                      [
                        "dashed",
                        "Dashed",
                      ],
                    ].map(
                      (item) => {
                        const active =
                          (logo.frameStyle ||
                            "none") ===
                          item[0];

                        return (
                          <button
                            key={
                              item[0]
                            }
                            type="button"
                            onClick={() =>
                              update({
                                frameStyle:
                                  item[0] as FrameStyle,
                              })
                            }
                            style={{
                              padding:
                                "8px 3px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 7,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#6b7280",
                              cursor:
                                "pointer",
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            {
                              item[1]
                            }
                          </button>
                        );
                      }
                    )}
                  </div>

                  {logo.frameStyle !==
                    "none" && (
                    <div
                      style={{
                        marginTop: 12,
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: 12,
                      }}
                    >
                      <RangeControl
                        label="Thickness"
                        value={clamp(
                          Number(
                            logo.frameThickness ??
                              2
                          ),
                          1,
                          10
                        )}
                        min={1}
                        max={10}
                        suffix="px"
                        onChange={(
                          value
                        ) =>
                          update({
                            frameThickness:
                              value,
                          })
                        }
                      />

                      <ColorControl
                        label="Frame Color"
                        value={
                          logo.frameColor ||
                          logo.textColor ||
                          "#111111"
                        }
                        onChange={(
                          value
                        ) =>
                          update({
                            frameColor:
                              value,
                          })
                        }
                      />
                    </div>
                  )}
                </Section>
              </div>
            )}

            {/* =================================================
                BRAND / VARIANTS
            ================================================= */}

            {activeTab ===
              "brand" && (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: 18,
                }}
              >
                <Section
                  title="Brand"
                  onReset={
                    resetSection
                  }
                >
                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display:
                            "block",
                          fontSize: 10,
                          fontWeight:
                            700,
                          color:
                            "#6b7280",
                          marginBottom:
                            7,
                        }}
                      >
                        Brand Name
                      </label>

                      <input
                        value={
                          logo.name ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          update({
                            name:
                              event
                                .target
                                .value,
                          })
                        }
                        style={{
                          width:
                            "100%",
                          boxSizing:
                            "border-box",
                          padding:
                            "10px 12px",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius: 8,
                          outline:
                            "none",
                          fontSize: 12,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display:
                            "block",
                          fontSize: 10,
                          fontWeight:
                            700,
                          color:
                            "#6b7280",
                          marginBottom:
                            7,
                        }}
                      >
                        Slogan
                      </label>

                      <input
                        value={
                          logo.slogan ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          update({
                            slogan:
                              event
                                .target
                                .value,
                          })
                        }
                        style={{
                          width:
                            "100%",
                          boxSizing:
                            "border-box",
                          padding:
                            "10px 12px",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius: 8,
                          outline:
                            "none",
                          fontSize: 12,
                        }}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Variants">
                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: 7,
                    }}
                  >
                    {[
                      [
                        "full",
                        "Full Logo",
                      ],
                      [
                        "iconOnly",
                        "Icon Only",
                      ],
                      [
                        "wordmark",
                        "Wordmark",
                      ],
                      [
                        "stacked",
                        "Stacked",
                      ],
                      [
                        "dark",
                        "Dark",
                      ],
                      [
                        "light",
                        "Light",
                      ],
                    ].map(
                      (item) => {
                        const active =
                          (logo.variant ||
                            "full") ===
                          item[0];

                        return (
                          <button
                            key={
                              item[0]
                            }
                            type="button"
                            onClick={() =>
                              update({
                                variant:
                                  item[0] as Variant,
                              })
                            }
                            style={{
                              minHeight:
                                48,
                              padding:
                                "9px",
                              border:
                                active
                                  ? "2px solid #4f46e5"
                                  : "1px solid #e5e7eb",
                              borderRadius: 8,
                              background:
                                active
                                  ? "#eef2ff"
                                  : "#ffffff",
                              color:
                                active
                                  ? "#4338ca"
                                  : "#374151",
                              cursor:
                                "pointer",
                              fontSize: 10,
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              item[1]
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </Section>

                <Section title="Current Icon">
                  <div
                    style={{
                      height: 80,
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: 9,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "#fafafa",
                    }}
                  >
                    {logo.iconPath ? (
                      <MaskedIcon
                        src={
                          logo.iconPath
                        }
                        color={
                          logo.iconColor ||
                          logo.textColor ||
                          "#111111"
                        }
                        size={54}
                      />
                    ) : (
                      <span
                        style={{
                          color:
                            "#9ca3af",
                          fontSize: 10,
                        }}
                      >
                        No icon
                      </span>
                    )}
                  </div>
                </Section>
              </div>
            )}

            {/* =================================================
                DOWNLOADS
            ================================================= */}

            {activeTab ===
              "downloads" && (
              <DownloadTab
                logo={
                  logo as LogoConfig
                }
                previewRef={
                  previewRef
                }
                paid={paid}
                onUnlock={() =>
                  setPaid(true)
                }
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            height: "100vh",
            fontFamily:
              "'DM Sans', sans-serif",
            color:
              "#6b7280",
            fontSize: 13,
          }}
        >
          Loading editor...
        </div>
      }
    >
      <EditorInner />
    </Suspense>
  );
}