
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import type { LogoConfig } from "@/lib/generator";
import { PALETTES } from "@/lib/palettes";
import LogoSaveButton from "@/components/LogoSaveButton";
import DownloadTab from "@/components/Downloadtab";
import AccountHeader from "@/components/AccountHeader";
import { useMockupGenerator, MockupStage, MockupControls } from "@/components/DynamicMockupGenerator";

/* =========================================================
   DESIGN CONCEPT — "Spec Sheet"

   A logo editor is, structurally, a place where you annotate
   measurements on a mark: size, spacing, angle, weight. That's
   exactly what a technical drawing / brand-guideline spec sheet
   does. So the canvas is drawn like a cyanotype blueprint —
   ruled margins, tick-marked dimension lines that report the
   live rendered size of the mark, a drafting-style title block
   in the header (project / revision, tied to real undo depth).
   Controls live in a left icon RAIL, not a top tab strip, so
   the panel reads as a drafting toolbox, not a settings page.
========================================================= */

const theme = {
  blue: "#12293F",       // blueprint canvas
  blueDeep: "#0C1E30",
  blueLine: "rgba(255,255,255,0.16)",
  blueLineStrong: "rgba(255,255,255,0.30)",
  paper: "#FBFAF7",
  paperAlt: "#F2F0EA",
  line: "#E3E0D6",
  lineSoft: "#EDEBE3",
  ink: "#161A1F",
  inkSoft: "#585C63",
  mist: "#9A9C97",
  signal: "#FF6A39",      // hi-vis marker orange — the one warm accent
  signalDeep: "#D8501E",
  signalSoft: "#FFE9DE",
  fontDisplay: "'Space Grotesk', 'DM Sans', sans-serif",
  fontBody: "'Inter', 'DM Sans', sans-serif",
  fontMono: "'JetBrains Mono', 'SFMono-Regular', monospace",
};

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

      .bfy-scope * { box-sizing: border-box; }
      .bfy-scope ::-webkit-scrollbar { width: 8px; height: 8px; }
      .bfy-scope ::-webkit-scrollbar-track { background: transparent; }
      .bfy-scope ::-webkit-scrollbar-thumb { background: #DEDBD0; border-radius: 8px; }
      .bfy-scope ::-webkit-scrollbar-thumb:hover { background: #CBC7B9; }

      .bfy-scope button:focus-visible,
      .bfy-scope input:focus-visible,
      .bfy-scope select:focus-visible {
        outline: 2px solid ${theme.signal};
        outline-offset: 2px;
      }

      .bfy-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 3px;
        border-radius: 999px;
        background: ${theme.line};
        cursor: pointer;
      }
      .bfy-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 3px;
        background: ${theme.signal};
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.35);
        margin-top: -6px;
      }
      .bfy-range::-webkit-slider-runnable-track { height: 3px; border-radius: 999px; background: ${theme.line}; }
      .bfy-range::-moz-range-thumb { width: 13px; height: 13px; border-radius: 3px; background: ${theme.signal}; border: 2px solid #ffffff; }
      .bfy-range::-moz-range-track { height: 3px; border-radius: 999px; background: ${theme.line}; }

      .bfy-blueprint-grid {
        background-image:
          linear-gradient(${theme.blueLine} 1px, transparent 1px),
          linear-gradient(90deg, ${theme.blueLine} 1px, transparent 1px);
        background-size: 32px 32px;
        background-position: center;
      }

      @keyframes bfy-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      .bfy-pulse { animation: bfy-pulse 1.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .bfy-pulse { animation: none; } }
    `}</style>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontFamily: theme.fontMono, fontSize: 10,
      fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: theme.inkSoft,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 1, background: theme.signal, flexShrink: 0 }} />
      {children}
    </span>
  );
}

/* Ruled dimension line — like a drafting callout — reporting the
   live rendered size of the canvas box in millimetre-style ticks. */
function DimensionFrame({ width, height }: { width: number; height: number }) {
  const w = Math.round(width);
  const h = Math.round(height);

  return (
    <>
      {/* top ruler */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: -26, height: 18,
        display: "flex", alignItems: "center", pointerEvents: "none",
      }}>
        <div style={{ flex: 1, height: 1, background: theme.blueLineStrong, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: -4, width: 1, height: 8, background: theme.blueLineStrong }} />
          <span style={{ position: "absolute", right: 0, top: -4, width: 1, height: 8, background: theme.blueLineStrong }} />
        </div>
        <span style={{
          fontFamily: theme.fontMono, fontSize: 10, color: "rgba(255,255,255,0.65)", marginLeft: 10, whiteSpace: "nowrap",
        }}>
          W {w}
        </span>
      </div>

      {/* left ruler */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: -34, width: 18,
        display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none",
      }}>
        <div style={{ flex: 1, width: 1, background: theme.blueLineStrong, position: "relative" }}>
          <span style={{ position: "absolute", top: 0, left: -4, height: 1, width: 8, background: theme.blueLineStrong }} />
          <span style={{ position: "absolute", bottom: 0, left: -4, height: 1, width: 8, background: theme.blueLineStrong }} />
        </div>
        <span style={{
          fontFamily: theme.fontMono, fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 8,
          writingMode: "vertical-rl", transform: "rotate(180deg)", whiteSpace: "nowrap",
        }}>
          H {h}
        </span>
      </div>

      {/* corner ticks */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => {
        const pos: React.CSSProperties =
          corner === "tl" ? { top: -1, left: -1 } :
          corner === "tr" ? { top: -1, right: -1 } :
          corner === "bl" ? { bottom: -1, left: -1 } :
          { bottom: -1, right: -1 };
        return (
          <span key={corner} style={{
            position: "absolute", width: 9, height: 9, borderTop: corner[0] === "t" ? `2px solid ${theme.signal}` : "none",
            borderBottom: corner[0] === "b" ? `2px solid ${theme.signal}` : "none",
            borderLeft: corner[1] === "l" ? `2px solid ${theme.signal}` : "none",
            borderRight: corner[1] === "r" ? `2px solid ${theme.signal}` : "none",
            ...pos, pointerEvents: "none",
          }} />
        );
      })}
    </>
  );
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const box = entry.contentRect;
        setSize({ width: box.width, height: box.height });
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

/* =========================================================
   TYPES
========================================================= */

type EditorTab = "colors" | "typography" | "layout" | "icons" | "effects" | "brand" | "mockups" | "downloads";
type IconFolders = Record<string, string[]>;
type IconItem = { name: string; path: string };
type BackgroundType = "solid" | "linear-gradient" | "radial-gradient";
type FrameStyle = "none" | "circle" | "square" | "rounded" | "border" | "dashed";
type Variant = "full" | "iconOnly" | "wordmark" | "stacked" | "dark" | "light";
type Alignment = "top" | "center" | "bottom";
type TransformType = "none" | "uppercase" | "lowercase" | "capitalize";

type ExtendedLogo = Omit<LogoConfig, "frameStyle"> & {
  iconSize?: number; iconColor?: string; iconGap?: number; iconRotation?: number; iconOpacity?: number;
  iconOffsetX?: number; iconOffsetY?: number;
  letterSpacing?: string; lineHeight?: number; textTransform?: TransformType; nameSloganGap?: number;
  sloganFontSize?: number; sloganFontWeight?: number; sloganColor?: string;
  layoutGap?: number; layoutPadding?: number; alignment?: Alignment; layoutScale?: number;
  layoutOffsetX?: number; layoutOffsetY?: number;
  backgroundType?: BackgroundType; backgroundColor1?: string; backgroundColor2?: string; backgroundAngle?: number;
  frameStyle?: FrameStyle; frameThickness?: number; frameColor?: string;
  variant?: Variant;
};

/* =========================================================
   HELPERS
========================================================= */

function safeDecodeLogoData(value: string): LogoConfig | null {
  try {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed as LogoConfig;
    } catch {}
    try {
      const decoded = decodeURIComponent(value);
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === "object") return parsed as LogoConfig;
    } catch {}
    return null;
  } catch (error) {
    console.error("[Editor] Failed to parse logo data:", error);
    return null;
  }
}

function makeIconPath(folder: string, file: string): string {
  return `/icons/${encodeURIComponent(folder)}/${encodeURIComponent(file)}.svg`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function isLightColor(value: string): boolean {
  const rgb = hexToRgb(value);
  if (!rgb) return false;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 160;
}

function getTransform(transform?: TransformType): React.CSSProperties["textTransform"] {
  switch (transform) {
    case "uppercase": return "uppercase";
    case "lowercase": return "lowercase";
    case "capitalize": return "capitalize";
    default: return "none";
  }
}

/* =========================================================
   FONTS available to the generated logo (unrelated to editor chrome)
========================================================= */

const FONTS = [
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Manrope", value: "'Manrope', sans-serif" },
  { label: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif" },
  { label: "Raleway", value: "'Raleway', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Oswald", value: "'Oswald', sans-serif" },
  { label: "Bebas Neue", value: "'Bebas Neue', sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Space Mono", value: "'Space Mono', monospace" },
  { label: "Libre Baskerville", value: "'Libre Baskerville', serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "DM Serif Display", value: "'DM Serif Display', serif" },
  { label: "Bodoni Moda", value: "'Bodoni Moda', serif" },
  { label: "Cinzel", value: "'Cinzel', serif" },
  { label: "Abril Fatface", value: "'Abril Fatface', serif" },
  { label: "Dancing Script", value: "'Dancing Script', cursive" },
  { label: "Pacifico", value: "'Pacifico', cursive" },
  { label: "Caveat", value: "'Caveat', cursive" },
  { label: "Satisfy", value: "'Satisfy', cursive" },
  { label: "Tangerine", value: "'Tangerine', cursive" },
  { label: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
  { label: "Quicksand", value: "'Quicksand', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Archivo", value: "'Archivo', sans-serif" },
  { label: "Barlow", value: "'Barlow', sans-serif" },
  { label: "Barlow Condensed", value: "'Barlow Condensed', sans-serif" },
  { label: "Fira Sans", value: "'Fira Sans', sans-serif" },
  { label: "Karla", value: "'Karla', sans-serif" },
  { label: "Rubik", value: "'Rubik', sans-serif" },
  { label: "Work Sans", value: "'Work Sans', sans-serif" },
  { label: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
  { label: "Source Serif 4", value: "'Source Serif 4', serif" },
];

const LAYOUTS = [
  { label: "Icon Top", value: "iconTop", description: "Icon above the name" },
  { label: "Icon Left", value: "iconLeft", description: "Icon beside the name" },
  { label: "Icon Big", value: "iconBig", description: "Large symbol with text" },
  { label: "Badge", value: "badge", description: "Compact badge composition" },
  { label: "Text Only", value: "textOnly", description: "Typography only" },
  { label: "Horizontal", value: "horizontalBar", description: "Wide horizontal composition" },
];

const RADII = [
  { label: "Sharp", value: "0px" },
  { label: "Small", value: "8px" },
  { label: "Medium", value: "16px" },
  { label: "Large", value: "24px" },
  { label: "Pill", value: "999px" },
];

const EFFECTS = [
  { label: "None", value: "none", description: "Clean logo" },
  { label: "Glow", value: "glow", description: "Soft colored glow" },
  { label: "Metallic", value: "metallic", description: "Metallic depth" },
  { label: "Shadow", value: "shadow", description: "Deep shadow" },
  { label: "Neon", value: "neon", description: "Neon light effect" },
];

const QUICK_PALETTE_COLORS = PALETTES.slice(0, 20).map((palette) => ({
  bg: palette.bg,
  text: palette.textLight || palette.textDark || "#111111",
}));

/* =========================================================
   ICON MASK / FRAME / LOGO PREVIEW — render the user's actual
   logo. Left functionally identical; only the chrome around
   them changes.
========================================================= */

function MaskedIcon({
  src, color, size, rotation = 0, opacity = 1, offsetX = 0, offsetY = 0, effect = "none",
}: {
  src: string; color: string; size: number; rotation?: number; opacity?: number;
  offsetX?: number; offsetY?: number; effect?: string;
}) {
  let filter = "";
  if (effect === "glow") filter = `drop-shadow(0 0 10px ${color}66)`;
  if (effect === "neon") filter = `drop-shadow(0 0 8px ${color}99) drop-shadow(0 0 18px ${color}55)`;
  if (effect === "shadow") filter = "drop-shadow(0 8px 8px rgba(0,0,0,0.25))";

  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, flexShrink: 0, backgroundColor: color, opacity,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`, transformOrigin: "center center",
        WebkitMaskImage: `url("${src}")`, maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
        WebkitMaskPosition: "center", maskPosition: "center",
        WebkitMaskSize: "contain", maskSize: "contain",
        filter,
      }}
    />
  );
}

function FrameWrapper({ children, logo }: { children: React.ReactNode; logo: ExtendedLogo }) {
  const style: React.CSSProperties = { position: "relative", width: "100%", height: "100%" };
  const frameStyle = logo.frameStyle || "none";
  if (frameStyle === "none") return <div style={style}>{children}</div>;

  const thickness = clamp(Number(logo.frameThickness) || 2, 1, 10);
  const frameColor = logo.frameColor || logo.iconColor || logo.textColor || "#111111";
  const borderRadius = logo.borderRadius || "16px";
  const borderStyle: "solid" | "dashed" = frameStyle === "dashed" ? "dashed" : "solid";

  const frame: React.CSSProperties = {
    position: "absolute", inset: thickness, pointerEvents: "none",
    border: `${thickness}px ${borderStyle} ${frameColor}`, zIndex: 10,
    borderRadius: frameStyle === "circle" ? "50%" : frameStyle === "square" ? "0px" : borderRadius,
  };

  return (
    <div style={style}>
      {children}
      <div style={frame} />
    </div>
  );
}

function LogoPreview({ logo, scale = 1 }: { logo: LogoConfig; scale?: number }) {
  const data = logo as ExtendedLogo;
  const { name, slogan, iconPath, palette, layout, fontFamily, fontSize, fontWeight, background, effect } = data;

  const safeFont = fontFamily || "'DM Sans', sans-serif";
  const safeTextColor = data.textColor || palette?.textDark || "#111111";
  const safeIconColor = data.iconColor || safeTextColor;
  const safeSloganColor = data.sloganColor || safeTextColor;
  const safeBackground = background || palette?.bg || "#ffffff";

  const backgroundType = data.backgroundType || "solid";
  const backgroundColor1 = data.backgroundColor1 || safeBackground;
  const backgroundColor2 = data.backgroundColor2 || safeTextColor;
  const angle = Number(data.backgroundAngle) || 90;

  let finalBackground = backgroundColor1;
  if (backgroundType === "linear-gradient") finalBackground = `linear-gradient(${angle}deg, ${backgroundColor1}, ${backgroundColor2})`;
  if (backgroundType === "radial-gradient") finalBackground = `radial-gradient(circle, ${backgroundColor1}, ${backgroundColor2})`;

  const size = Number(fontSize) || 32;
  const iconSize = clamp(Number(data.iconSize) || 64, 30, 120) * scale;
  const iconGap = Number(data.iconGap ?? 16) * scale;
  const layoutGap = Number(data.layoutGap ?? 10) * scale;
  const padding = Number(data.layoutPadding ?? 24) * scale;
  const layoutScale = Number(data.layoutScale ?? 1);
  const layoutOffsetX = Number(data.layoutOffsetX ?? 0) * scale;
  const layoutOffsetY = Number(data.layoutOffsetY ?? 0) * scale;
  const iconOffsetX = Number(data.iconOffsetX ?? 0) * scale;
  const iconOffsetY = Number(data.iconOffsetY ?? 0) * scale;
  const iconRotation = Number(data.iconRotation ?? 0);
  const iconOpacity = clamp(Number(data.iconOpacity ?? 100) / 100, 0, 1);
  const letterSpacing = Number(data.letterSpacing ?? 0) * scale;
  const lineHeight = Number(data.lineHeight ?? 1.1);
  const nameSloganGap = Number(data.nameSloganGap ?? 5) * scale;
  const sloganSize = Number(data.sloganFontSize ?? Math.max(9, size * 0.32)) * scale;
  const sloganWeight = Number(data.sloganFontWeight ?? 500);
  const alignment = data.alignment || "center";
  const alignmentValue = alignment === "top" ? "flex-start" : alignment === "bottom" ? "flex-end" : "center";
  const transform = getTransform(data.textTransform);

  const effectStyles: Record<string, React.CSSProperties> = {
    none: {},
    glow: { boxShadow: `0 0 35px ${safeTextColor}55, inset 0 0 25px ${safeTextColor}15` },
    metallic: { boxShadow: "0 10px 30px rgba(212,175,55,0.28), inset 0 0 18px rgba(255,255,255,0.22)" },
    shadow: { boxShadow: "0 18px 38px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)" },
    neon: { boxShadow: `0 0 18px ${safeTextColor}88, 0 0 45px ${safeTextColor}44` },
  };

  const textEffect: React.CSSProperties =
    effect === "neon" ? { textShadow: `0 0 8px ${safeTextColor}99, 0 0 18px ${safeTextColor}55` } : {};

  const nameStyle: React.CSSProperties = {
    fontFamily: safeFont, fontWeight: Number(fontWeight) || 600, fontSize: size * scale * layoutScale,
    color: safeTextColor, lineHeight, letterSpacing, textTransform: transform, whiteSpace: "nowrap", ...textEffect,
  };

  const sloganStyle: React.CSSProperties = {
    fontFamily: safeFont, fontSize: sloganSize * layoutScale, fontWeight: sloganWeight, color: safeSloganColor,
    opacity: 0.72, lineHeight, letterSpacing: letterSpacing * 0.5, textTransform: transform,
    whiteSpace: "nowrap", marginTop: nameSloganGap, ...textEffect,
  };

  const rootStyle: React.CSSProperties = {
    width: "100%", height: "100%", background: finalBackground, borderRadius: data.borderRadius || "16px",
    display: "flex", alignItems: alignmentValue, justifyContent: "center", padding, overflow: "hidden",
    boxSizing: "border-box", ...effectStyles[effect || "none"],
  };

  const contentStyle: React.CSSProperties = {
    transform: `translate(${layoutOffsetX}px, ${layoutOffsetY}px) scale(${layoutScale})`, transformOrigin: "center center",
  };

  const textBlock = (
    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: layout === "iconLeft" ? "flex-start" : "center" }}>
      <div style={nameStyle}>{name}</div>
      {slogan && <div style={sloganStyle}>{slogan}</div>}
    </div>
  );

  const variant = data.variant || "full";

  if (variant === "iconOnly") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={contentStyle}>
            {iconPath && <MaskedIcon src={iconPath} color={safeIconColor} size={iconSize * (layout === "iconBig" ? 1.25 : 1)}
              rotation={iconRotation} opacity={iconOpacity} offsetX={iconOffsetX} offsetY={iconOffsetY} effect={effect} />}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  if (variant === "wordmark") {
    return <FrameWrapper logo={data}><div style={rootStyle}><div style={contentStyle}>{textBlock}</div></div></FrameWrapper>;
  }

  if (variant === "dark") {
    const darkLogo: ExtendedLogo = { ...data, backgroundType: "solid", backgroundColor1: "#111111", background: "#111111", textColor: "#ffffff", sloganColor: "#ffffff", iconColor: "#ffffff" };
    return <LogoPreview logo={darkLogo as LogoConfig} scale={scale} />;
  }

  if (variant === "light") {
    const lightLogo: ExtendedLogo = { ...data, backgroundType: "solid", backgroundColor1: "#ffffff", background: "#ffffff", textColor: "#111111", sloganColor: "#111111", iconColor: "#111111" };
    return <LogoPreview logo={lightLogo as LogoConfig} scale={scale} />;
  }

  if (layout === "horizontalBar") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={{ ...contentStyle, width: "100%", display: "flex", alignItems: "center", gap: iconGap }}>
            {iconPath && <MaskedIcon src={iconPath} color={safeIconColor} size={iconSize} rotation={iconRotation} opacity={iconOpacity} offsetX={iconOffsetX} offsetY={iconOffsetY} effect={effect} />}
            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  if (layout === "badge") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={{ ...contentStyle, display: "flex", alignItems: "center", gap: iconGap }}>
            {iconPath && <MaskedIcon src={iconPath} color={safeIconColor} size={Math.min(iconSize, 64 * scale)} rotation={iconRotation} opacity={iconOpacity} offsetX={iconOffsetX} offsetY={iconOffsetY} effect={effect} />}
            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  if (layout === "iconLeft") {
    return (
      <FrameWrapper logo={data}>
        <div style={rootStyle}>
          <div style={{ ...contentStyle, display: "flex", alignItems: "center", gap: iconGap }}>
            {iconPath && <MaskedIcon src={iconPath} color={safeIconColor} size={iconSize} rotation={iconRotation} opacity={iconOpacity} offsetX={iconOffsetX} offsetY={iconOffsetY} effect={effect} />}
            {textBlock}
          </div>
        </div>
      </FrameWrapper>
    );
  }

  return (
    <FrameWrapper logo={data}>
      <div style={rootStyle}>
        <div style={{ ...contentStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: layout === "iconBig" ? layoutGap + 4 : layoutGap, textAlign: "center" }}>
          {iconPath && <MaskedIcon src={iconPath} color={safeIconColor}
            size={layout === "iconBig" ? Math.min(120 * scale, iconSize * 1.3) : iconSize}
            rotation={iconRotation} opacity={iconOpacity} offsetX={iconOffsetX} offsetY={iconOffsetY} effect={effect} />}
          {textBlock}
        </div>
      </div>
    </FrameWrapper>
  );
}

/* =========================================================
   UI HELPERS
========================================================= */

function Section({ title, children, onReset }: { title: string; children: React.ReactNode; onReset?: () => void }) {
  return (
    <section style={{ paddingBottom: 20, borderBottom: `1px solid ${theme.lineSoft}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Eyebrow>{title}</Eyebrow>
        {onReset && (
          <button type="button" onClick={onReset} style={{
            border: "none", background: "transparent", color: theme.signalDeep, fontFamily: theme.fontMono,
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", padding: 0,
          }}>
            Reset ↺
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function RangeControl({ label, value, min, max, step = 1, suffix = "", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: theme.inkSoft, fontWeight: 500, fontFamily: theme.fontBody }}>{label}</span>
        <span style={{
          fontSize: 10, color: theme.signalDeep, fontWeight: 600, fontFamily: theme.fontMono,
          background: theme.signalSoft, borderRadius: 5, padding: "2px 7px", minWidth: 40, textAlign: "center",
        }}>
          {value}{suffix}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="bfy-range" />
    </div>
  );
}

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const safeValue = /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#111111";
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: theme.inkSoft, marginBottom: 8, fontFamily: theme.fontBody }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 6, background: safeValue, border: `1px solid ${theme.line}`, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.5)" }} />
          <input type="color" value={safeValue} onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: 0, padding: 0 }} />
        </div>
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: 0, boxSizing: "border-box", border: `1px solid ${theme.line}`, borderRadius: 8, padding: "9px 10px", outline: "none", fontSize: 11, fontFamily: theme.fontMono, color: theme.ink, background: "#fff" }} />
      </div>
    </div>
  );
}

function SwatchChip({ bg, text, index, onClick }: { bg: string; text: string; index: number; onClick: () => void }) {
  const hex = bg.startsWith("#") ? bg.toUpperCase() : `GRAD·${String(index + 1).padStart(2, "0")}`;
  return (
    <button type="button" onClick={onClick} title={hex} style={{
      border: `1px solid ${theme.line}`, borderRadius: 8, padding: 5, background: "#fff", cursor: "pointer",
      display: "flex", flexDirection: "column", gap: 5, transition: "border-color 120ms, transform 120ms",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.signal; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = theme.line; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
    >
      <div style={{ height: 30, borderRadius: 4, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: text, fontSize: 10, fontWeight: 700, fontFamily: theme.fontDisplay }}>Aa</div>
      <span style={{ fontSize: 8, fontFamily: theme.fontMono, color: theme.mist, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hex}</span>
    </button>
  );
}

/* Left icon rail — replaces the old horizontal tab strip. Reads as
   a drafting toolbox: one column of tools, panel opens beside it. */
function ToolRail({ activeTab, onChange }: { activeTab: EditorTab; onChange: (tab: EditorTab) => void }) {
  const tabs: { id: EditorTab; label: string; icon: string }[] = [
    { id: "colors", label: "Color", icon: "◐" },
    { id: "typography", label: "Type", icon: "Aa" },
    { id: "layout", label: "Layout", icon: "▦" },
    { id: "icons", label: "Icon", icon: "✦" },
    { id: "effects", label: "FX", icon: "✧" },
    { id: "brand", label: "Brand", icon: "◉" },
    { id: "mockups", label: "Mockup", icon: "▣" },
    { id: "downloads", label: "Export", icon: "↓" },
  ];

  return (
    <div style={{ width: 60, flexShrink: 0, borderRight: `1px solid ${theme.line}`, background: theme.paperAlt, display: "flex", flexDirection: "column", paddingTop: 6 }}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id} type="button" onClick={() => onChange(tab.id)}
            style={{
              border: "none", background: "transparent", cursor: "pointer", padding: "11px 4px", position: "relative",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}
          >
            {active && <span style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 3, borderRadius: 2, background: theme.signal }} />}
            <span style={{ fontSize: tab.id === "typography" ? 11 : 14, fontWeight: 700, color: active ? theme.signalDeep : theme.mist, fontFamily: theme.fontDisplay }}>{tab.icon}</span>
            <span style={{ fontSize: 8, fontWeight: active ? 700 : 500, color: active ? theme.ink : theme.mist, fontFamily: theme.fontMono, letterSpacing: "0.02em" }}>{tab.label}</span>
          </button>
        );
      })}
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

  const previewRef = useRef<HTMLDivElement>(null);
  const { ref: canvasSizeRef, size: canvasSize } = useElementSize<HTMLDivElement>();

  const [logo, setLogo] = useState<ExtendedLogo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>("colors");

  const [history, setHistory] = useState<ExtendedLogo[]>([]);
  const [future, setFuture] = useState<ExtendedLogo[]>([]);
  const historyRef = useRef<ExtendedLogo[]>([]);
  const futureRef = useRef<ExtendedLogo[]>([]);

  const [iconFolders, setIconFolders] = useState<IconFolders>({});
  const [iconsLoading, setIconsLoading] = useState(false);
  const [iconsError, setIconsError] = useState<string | null>(null);
  const [selectedIconFolder, setSelectedIconFolder] = useState<string>("");
  const [iconSearch, setIconSearch] = useState("");

  /* Mockup generator — shared state so the Image Stage lives in the
     central canvas while the Controls + Code Box live in the sidebar. */
  const mockupGenerator = useMockupGenerator();

  useEffect(() => {
    let cancelled = false;
    async function loadLogo() {
      const id = params.get("id");
      const data = params.get("data");
      setLoading(true);
      try {
        let loaded: ExtendedLogo | null = null;

        if (id) {
          const response = await fetch("/api/logos/my-logos", { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const responseData = await response.json();
          const found = responseData?.logos?.find((item: any) => item._id === id);
          if (found?.logoData) loaded = found.logoData;
        } else if (data) {
          const parsed = safeDecodeLogoData(data);
          if (parsed) loaded = parsed as ExtendedLogo;
        } else if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("logoData") || window.sessionStorage.getItem("logoData");
          if (stored) {
            const parsed = safeDecodeLogoData(stored);
            if (parsed) loaded = parsed as ExtendedLogo;
            window.localStorage.removeItem("logoData");
            window.sessionStorage.removeItem("logoData");
          }
        }

        if (!cancelled && loaded) {
          const normalized: ExtendedLogo = {
            ...loaded,
            iconSize: Number((loaded as any).iconSize ?? 64),
            iconColor: (loaded as any).iconColor || (loaded as any).textColor || "#111111",
            iconGap: Number((loaded as any).iconGap ?? 16),
            iconRotation: Number((loaded as any).iconRotation ?? 0),
            iconOpacity: Number((loaded as any).iconOpacity ?? 100),
            iconOffsetX: Number((loaded as any).iconOffsetX ?? 0),
            iconOffsetY: Number((loaded as any).iconOffsetY ?? 0),
            letterSpacing: `${Number((loaded as any).letterSpacing ?? 0)}px`,
            lineHeight: Number((loaded as any).lineHeight ?? 1.1),
            textTransform: (loaded as any).textTransform || "none",
            nameSloganGap: Number((loaded as any).nameSloganGap ?? 5),
            sloganFontSize: Number((loaded as any).sloganFontSize ?? Math.max(9, Number((loaded as any).fontSize ?? 32) * 0.32)),
            sloganFontWeight: Number((loaded as any).sloganFontWeight ?? 500),
            sloganColor: (loaded as any).sloganColor || (loaded as any).textColor || "#111111",
            layoutGap: Number((loaded as any).layoutGap ?? 10),
            layoutPadding: Number((loaded as any).layoutPadding ?? 24),
            alignment: (loaded as any).alignment || "center",
            layoutScale: Number((loaded as any).layoutScale ?? 1),
            layoutOffsetX: Number((loaded as any).layoutOffsetX ?? 0),
            layoutOffsetY: Number((loaded as any).layoutOffsetY ?? 0),
            backgroundType: (loaded as any).backgroundType || "solid",
            backgroundColor1: (loaded as any).backgroundColor1 || (loaded as any).background || "#ffffff",
            backgroundColor2: (loaded as any).backgroundColor2 || "#111111",
            backgroundAngle: Number((loaded as any).backgroundAngle ?? 90),
            frameStyle: (loaded as any).frameStyle || "none",
            frameThickness: Number((loaded as any).frameThickness ?? 2),
            frameColor: (loaded as any).frameColor || (loaded as any).textColor || "#111111",
            variant: (loaded as any).variant || "full",
          };

          setLogo(normalized);
          historyRef.current = [];
          futureRef.current = [];
          setHistory([]);
          setFuture([]);
        }
      } catch (error) {
        console.error("[Editor] Failed to load logo:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLogo();
    return () => { cancelled = true; };
  }, [params]);

  useEffect(() => {
    if (activeTab !== "icons") return;
    let cancelled = false;
    async function loadIcons() {
      setIconsLoading(true);
      setIconsError(null);
      try {
        const response = await fetch("/api/icons", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data && typeof data === "object" && !Array.isArray(data) && !data.error) {
          if (!cancelled) {
            setIconFolders(data);
            const folders = Object.keys(data);
            if (!selectedIconFolder && folders.length > 0) setSelectedIconFolder(folders[0]);
          }
        } else {
          throw new Error(data?.error || "Invalid icon API response");
        }
      } catch (error) {
        console.error("[Editor] Failed to load icons:", error);
        if (!cancelled) setIconsError("Could not load icons.");
      } finally {
        if (!cancelled) setIconsLoading(false);
      }
    }
    loadIcons();
    return () => { cancelled = true; };
  }, [activeTab, selectedIconFolder]);

  const update = useCallback((patch: Partial<ExtendedLogo>) => {
    setLogo((previous) => {
      if (!previous) return previous;
      const next = { ...previous, ...patch };
      historyRef.current = [...historyRef.current, previous];
      futureRef.current = [];
      setHistory(historyRef.current);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (!logo || historyRef.current.length === 0) return;
    const previous = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    futureRef.current = [logo, ...futureRef.current];
    setHistory(historyRef.current);
    setFuture(futureRef.current);
    setLogo(previous);
  }, [logo]);

  const redo = useCallback(() => {
    if (!logo || futureRef.current.length === 0) return;
    const next = futureRef.current[0];
    futureRef.current = futureRef.current.slice(1);
    historyRef.current = [...historyRef.current, logo];
    setHistory(historyRef.current);
    setFuture(futureRef.current);
    setLogo(next);
  }, [logo]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier) return;
      if (event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
      if (event.key.toLowerCase() === "y") { event.preventDefault(); redo(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const resetAll = () => {
    if (!logo) return;
    const resetLogo: ExtendedLogo = {
      ...logo,
      iconSize: 64, iconColor: logo.textColor || "#111111", iconGap: 16, iconRotation: 0, iconOpacity: 100, iconOffsetX: 0, iconOffsetY: 0,
      letterSpacing: "0px", lineHeight: 1.1, textTransform: "none", nameSloganGap: 5,
      sloganFontSize: Math.max(9, Number(logo.fontSize || 32) * 0.32), sloganFontWeight: 500, sloganColor: logo.textColor || "#111111",
      layoutGap: 10, layoutPadding: 24, alignment: "center", layoutScale: 1, layoutOffsetX: 0, layoutOffsetY: 0,
      backgroundType: "solid", backgroundColor1: logo.background || logo.palette?.bg || "#ffffff", backgroundColor2: "#111111", backgroundAngle: 90,
      frameStyle: "none", frameThickness: 2, frameColor: logo.textColor || "#111111",
      variant: "full",
    };
    historyRef.current = [...historyRef.current, logo];
    futureRef.current = [];
    setHistory(historyRef.current);
    setFuture([]);
    setLogo(resetLogo);
  };

  const resetSection = () => {
    if (!logo) return;
    if (activeTab === "colors") {
      update({ backgroundType: "solid", backgroundColor1: logo.palette?.bg || "#ffffff", backgroundColor2: "#111111", backgroundAngle: 90, background: logo.palette?.bg || "#ffffff", textColor: logo.palette?.textDark || "#111111" });
      return;
    }
    if (activeTab === "typography") {
      update({ fontFamily: "'DM Sans', sans-serif", fontWeight: "600", fontSize: 32, letterSpacing: "0", lineHeight: 1.1, textTransform: "none", nameSloganGap: 5, sloganFontSize: 10, sloganFontWeight: 500, sloganColor: logo.textColor || "#111111" });
      return;
    }
    if (activeTab === "layout") {
      update({ layout: "iconTop", layoutGap: 10, layoutPadding: 24, alignment: "center", layoutScale: 1, layoutOffsetX: 0, layoutOffsetY: 0, borderRadius: "16px" });
      return;
    }
    if (activeTab === "icons") {
      update({ iconSize: 64, iconGap: 16, iconRotation: 0, iconOpacity: 100, iconOffsetX: 0, iconOffsetY: 0, iconColor: logo.textColor || "#111111" });
      return;
    }
    if (activeTab === "effects") {
      update({ effect: "none", frameStyle: "none", frameThickness: 2, frameColor: logo.textColor || "#111111" });
      return;
    }
    if (activeTab === "brand") update({ variant: "full" });
  };

  /* Renders the FULL logo — icon, typography AND its background
     color block (e.g. green/yellow canvas) — for mockup compositing.
     The stage's live 3D transform layer applies the perspective. */
  const renderMockupLogo = useCallback(() => {
    if (!logo) return null;
    return <LogoPreview logo={logo as LogoConfig} />;
  }, [logo]);

  if (loading) {
    return (
      <div className="bfy-scope" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: theme.blue, fontFamily: theme.fontBody }}>
        <GlobalStyle />
        <AccountHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column", gap: 10 }}>
          <span className="bfy-pulse" style={{ width: 8, height: 8, borderRadius: 2, background: theme.signal }} />
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontFamily: theme.fontMono, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Loading Brandify Editor
          </p>
        </div>
      </div>
    );
  }

  if (!logo) {
    return (
      <div className="bfy-scope" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: theme.fontBody, background: theme.paper }}>
        <GlobalStyle />
        <AccountHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, flex: 1 }}>
          <p style={{ color: theme.inkSoft, fontSize: 14 }}>No logo selected.</p>
          <button onClick={() => router.push("/generate")}
            style={{ background: theme.signal, color: "#1A0E08", border: "none", borderRadius: 9, padding: "11px 24px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: theme.fontDisplay }}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const folderNames = Object.keys(iconFolders);
  const currentIcons: IconItem[] = selectedIconFolder
    ? (iconFolders[selectedIconFolder] || [])
        .filter((file) => file.toLowerCase().includes(iconSearch.toLowerCase().trim()))
        .map((file) => ({ name: file, path: makeIconPath(selectedIconFolder, file) }))
    : [];

  const revision = String(history.length).padStart(3, "0");

  return (
    <div className="bfy-scope" style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", overflow: "hidden", fontFamily: theme.fontBody, background: theme.paper }}>
      <GlobalStyle />
      <AccountHeader />

      {/* ============================= HEADER — title block ============================= */}
      <header style={{
        height: 58, minHeight: 58, background: theme.blueDeep, borderBottom: `1px solid ${theme.blueLine}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.back()} style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 13, padding: "6px 0" }}>← Back</button>
          <div style={{ width: 1, height: 20, background: theme.blueLine }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, background: theme.signal }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#F5F4EF", fontFamily: theme.fontDisplay }}>Brandify</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: theme.fontMono, letterSpacing: "0.08em", textTransform: "uppercase" }}>Spec Sheet</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* drafting-style revision block, tied to real undo depth */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, border: `1px solid ${theme.blueLine}`, borderRadius: 8,
            padding: "6px 10px", fontFamily: theme.fontMono, fontSize: 10, color: "rgba(255,255,255,0.7)",
          }}>
            <span style={{ letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Rev</span>
            <span style={{ color: theme.signal, fontWeight: 700 }}>{revision}</span>
            <span style={{ width: 1, height: 12, background: theme.blueLine }} />
            <button type="button" onClick={undo} disabled={history.length === 0} title="Undo — Ctrl+Z"
              style={{ border: "none", background: "transparent", color: history.length ? "#fff" : "rgba(255,255,255,0.25)", cursor: history.length ? "pointer" : "default", fontSize: 13, padding: 0 }}>↶</button>
            <button type="button" onClick={redo} disabled={future.length === 0} title="Redo — Ctrl+Shift+Z"
              style={{ border: "none", background: "transparent", color: future.length ? "#fff" : "rgba(255,255,255,0.25)", cursor: future.length ? "pointer" : "default", fontSize: 13, padding: 0 }}>↷</button>
          </div>

          <button type="button" onClick={resetAll} title="Reset all settings"
            style={{ height: 34, padding: "0 12px", border: `1px solid ${theme.blueLine}`, borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: theme.fontMono, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Reset All
          </button>

          <div style={{ width: 1, height: 20, background: theme.blueLine, margin: "0 2px" }} />
          {isSignedIn && <LogoSaveButton logo={logo as LogoConfig} />}

          <button onClick={() => setActiveTab("downloads")}
            style={{ background: theme.signal, color: "#1A0E08", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: theme.fontDisplay }}>
            ↓ Export
          </button>
        </div>
      </header>

      {/* ============================= MAIN ============================= */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ---------------- CANVAS ---------------- */}
        {activeTab === "mockups" ? (
          /* MOCKUP MODE — the spacious central canvas hosts the live
             4:3 composite stage. The stage's clean #ffffff container +
             white border contrasts beautifully against the dark blueprint. */
          <main className="bfy-blueprint-grid" style={{
            width: "60%", flex: "0 0 60%", minWidth: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: "48px 56px", overflow: "auto", background: theme.blue,
          }}>
            <div style={{ width: "min(760px, 100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <MockupStage
                activeSpec={mockupGenerator.activeSpec}
                calibration={mockupGenerator.calibration}
                renderLogoHTML={renderMockupLogo}
                variant="dark"
              />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: theme.fontMono, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Live mockup composite · 4:3 stage
              </p>
            </div>
          </main>
        ) : (
          /* BLUEPRINT MODE — default spec sheet */
          <main className="bfy-blueprint-grid" style={{
            width: "60%", flex: "0 0 60%", minWidth: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: "48px 56px", gap: 26, overflow: "auto", background: theme.blue,
          }}>
            <div ref={canvasSizeRef} style={{ position: "relative", width: "min(620px, 82%)" }}>
              <DimensionFrame width={canvasSize.width} height={canvasSize.height} />
              <div ref={previewRef} style={{
                width: "100%", aspectRatio: "2 / 1", position: "relative", overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.45)", borderRadius: logo.borderRadius || "16px",
              }}>
                <LogoPreview logo={logo as LogoConfig} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 22, width: "100%", flexWrap: "wrap", marginTop: 6 }}>
              {[{ s: 0.42, label: "L" }, { s: 0.28, label: "M" }, { s: 0.18, label: "S" }].map(({ s, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 560 * s, aspectRatio: "2 / 1", overflow: "hidden", borderRadius: logo.borderRadius || "10px", boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>
                    <LogoPreview logo={logo as LogoConfig} scale={s} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: theme.fontMono, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>{label}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: theme.fontMono, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Scale 1:1 · live spec
            </p>
          </main>
        )}

        {/* ---------------- SIDEBAR: rail + panel ---------------- */}
        <aside style={{ width: "40%", flex: "0 0 40%", minWidth: 0, background: theme.paper, display: "flex", overflow: "hidden" }}>
          <ToolRail activeTab={activeTab} onChange={setActiveTab} />

          <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "20px 20px 32px" }}>

            {activeTab === "colors" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Section title="Background" onReset={resetSection}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
                    {[{ value: "solid", label: "Solid" }, { value: "linear-gradient", label: "Linear" }, { value: "radial-gradient", label: "Radial" }].map((item) => {
                      const active = logo.backgroundType === item.value || (!logo.backgroundType && item.value === "solid");
                      return (
                        <button key={item.value} type="button" onClick={() => update({ backgroundType: item.value as BackgroundType })}
                          style={{ padding: "9px 5px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: theme.fontMono, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <ColorControl label="Color 1" value={logo.backgroundColor1 || logo.background || "#ffffff"} onChange={(value) => update({ backgroundColor1: value, background: value })} />
                    {logo.backgroundType !== "solid" && (
                      <>
                        <ColorControl label="Color 2" value={logo.backgroundColor2 || "#111111"} onChange={(value) => update({ backgroundColor2: value })} />
                        <RangeControl label="Angle" value={clamp(Number(logo.backgroundAngle ?? 90), 0, 360)} min={0} max={360} suffix="°" onChange={(value) => update({ backgroundAngle: value })} />
                      </>
                    )}
                  </div>
                </Section>

                <Section title="Text Color">
                  <ColorControl label="Text" value={logo.textColor || "#111111"} onChange={(value) => update({ textColor: value, sloganColor: logo.sloganColor || value, iconColor: logo.iconColor || value })} />
                </Section>

                <Section title="Quick Palettes">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {QUICK_PALETTE_COLORS.map((palette, index) => (
                      <SwatchChip key={index} bg={palette.bg} text={palette.text} index={index}
                        onClick={() => update({ background: palette.bg, backgroundType: "solid", backgroundColor1: palette.bg, textColor: palette.text, iconColor: palette.text, sloganColor: palette.text })} />
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {activeTab === "typography" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Section title="Font Family" onReset={resetSection}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, maxHeight: 260, overflowY: "auto", paddingRight: 2 }}>
                    {FONTS.map((font) => {
                      const active = logo.fontFamily === font.value;
                      return (
                        <button key={font.value} type="button" onClick={() => update({ fontFamily: font.value })}
                          style={{ minHeight: 42, padding: "8px 10px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 8, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.ink, cursor: "pointer", textAlign: "left", fontFamily: font.value, fontSize: 11, fontWeight: 600 }}>
                          {font.label}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Font Weight">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {[400, 500, 600, 700, 800, 900].map((weight) => {
                      const active = Number(logo.fontWeight) === weight;
                      return (
                        <button key={weight} type="button" onClick={() => update({ fontWeight: String(weight) })}
                          style={{ padding: "7px 11px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 11, fontWeight: weight }}>
                          {weight}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Name">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <RangeControl label="Font Size" value={Number(logo.fontSize ?? 32)} min={16} max={96} suffix="px" onChange={(value) => update({ fontSize: value })} />
                    <RangeControl label="Letter Spacing" value={Number(logo.letterSpacing ?? 0)} min={-5} max={10} step={0.5} suffix="px" onChange={(value) => update({ letterSpacing: `${value}px` })} />
                    <RangeControl label="Line Height" value={Number(logo.lineHeight ?? 1.1)} min={0.8} max={2} step={0.05} onChange={(value) => update({ lineHeight: value })} />
                  </div>
                </Section>

                <Section title="Transform">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
                    {[["none", "None"], ["uppercase", "UPPER"], ["lowercase", "lower"], ["capitalize", "Title"]].map((item) => {
                      const active = (logo.textTransform || "none") === item[0];
                      return (
                        <button key={item[0]} type="button" onClick={() => update({ textTransform: item[0] as TransformType })}
                          style={{ padding: "7px 3px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 9, fontWeight: 700 }}>
                          {item[1]}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Slogan">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <RangeControl label="Slogan Size" value={Number(logo.sloganFontSize ?? 10)} min={8} max={40} suffix="px" onChange={(value) => update({ sloganFontSize: value })} />
                    <RangeControl label="Slogan Weight" value={Number(logo.sloganFontWeight ?? 500)} min={300} max={800} step={100} onChange={(value) => update({ sloganFontWeight: value })} />
                    <RangeControl label="Name-Slogan Gap" value={Number(logo.nameSloganGap ?? 5)} min={0} max={40} suffix="px" onChange={(value) => update({ nameSloganGap: value })} />
                    <ColorControl label="Slogan Color" value={logo.sloganColor || logo.textColor || "#111111"} onChange={(value) => update({ sloganColor: value })} />
                  </div>
                </Section>
              </div>
            )}

            {activeTab === "layout" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Section title="Logo Structure" onReset={resetSection}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {LAYOUTS.map((item) => {
                      const active = logo.layout === item.value;
                      return (
                        <button key={item.value} type="button" onClick={() => update({ layout: item.value as any })}
                          style={{ minHeight: 66, padding: "10px 11px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 9, background: active ? theme.signalSoft : "#ffffff", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: active ? theme.signalDeep : theme.ink }}>{item.label}</div>
                          <div style={{ marginTop: 4, fontSize: 9, lineHeight: 1.35, color: theme.mist }}>{item.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Layout Controls">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <RangeControl label="Gap" value={Number(logo.layoutGap ?? 10)} min={0} max={80} suffix="px" onChange={(value) => update({ layoutGap: value })} />
                    <RangeControl label="Padding" value={Number(logo.layoutPadding ?? 24)} min={0} max={100} suffix="px" onChange={(value) => update({ layoutPadding: value })} />
                    <RangeControl label="Scale" value={Number(logo.layoutScale ?? 1)} min={0.5} max={1.5} step={0.05} suffix="x" onChange={(value) => update({ layoutScale: value })} />
                    <RangeControl label="Offset X" value={Number(logo.layoutOffsetX ?? 0)} min={-100} max={100} suffix="px" onChange={(value) => update({ layoutOffsetX: value })} />
                    <RangeControl label="Offset Y" value={Number(logo.layoutOffsetY ?? 0)} min={-100} max={100} suffix="px" onChange={(value) => update({ layoutOffsetY: value })} />
                  </div>
                </Section>

                <Section title="Alignment">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {[["top", "Top"], ["center", "Center"], ["bottom", "Bottom"]].map((item) => {
                      const active = (logo.alignment || "center") === item[0];
                      return (
                        <button key={item[0]} type="button" onClick={() => update({ alignment: item[0] as Alignment })}
                          style={{ padding: "8px 4px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
                          {item[1]}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Corner Radius">
                  <div style={{ display: "flex", gap: 6 }}>
                    {RADII.map((radius) => {
                      const active = logo.borderRadius === radius.value;
                      return (
                        <button key={radius.value} type="button" onClick={() => update({ borderRadius: radius.value })}
                          style={{ flex: 1, minWidth: 0, padding: "8px 4px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 9, fontWeight: 600 }}>
                          {radius.label}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              </div>
            )}

            {activeTab === "icons" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Section title="Icon Controls" onReset={resetSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <RangeControl label="Size" value={clamp(Number(logo.iconSize ?? 64), 30, 120)} min={30} max={120} suffix="px" onChange={(value) => update({ iconSize: value })} />
                    <ColorControl label="Icon Color" value={logo.iconColor || logo.textColor || "#111111"} onChange={(value) => update({ iconColor: value })} />
                    <RangeControl label="Gap" value={Number(logo.iconGap ?? 16)} min={0} max={80} suffix="px" onChange={(value) => update({ iconGap: value })} />
                    <RangeControl label="Rotation" value={clamp(Number(logo.iconRotation ?? 0), 0, 360)} min={0} max={360} suffix="°" onChange={(value) => update({ iconRotation: value })} />
                    <RangeControl label="Opacity" value={clamp(Number(logo.iconOpacity ?? 100), 0, 100)} min={0} max={100} suffix="%" onChange={(value) => update({ iconOpacity: value })} />
                    <RangeControl label="Offset X" value={Number(logo.iconOffsetX ?? 0)} min={-100} max={100} suffix="px" onChange={(value) => update({ iconOffsetX: value })} />
                    <RangeControl label="Offset Y" value={Number(logo.iconOffsetY ?? 0)} min={-100} max={100} suffix="px" onChange={(value) => update({ iconOffsetY: value })} />
                  </div>
                </Section>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme.ink, fontFamily: theme.fontDisplay }}>Icon Library</div>
                      <div style={{ fontSize: 9, color: theme.mist, marginTop: 3 }}>All SVG icons from public/icons</div>
                    </div>
                    <button type="button" onClick={() => setIconsError(null)} style={{ border: `1px solid ${theme.line}`, background: "#ffffff", borderRadius: 7, padding: "6px 9px", fontSize: 9, cursor: "pointer", fontFamily: theme.fontMono }}>Refresh</button>
                  </div>
                  <input value={iconSearch} onChange={(e) => setIconSearch(e.target.value)} placeholder="Search icons..."
                    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${theme.line}`, borderRadius: 8, padding: "9px 11px", outline: "none", fontSize: 11, fontFamily: theme.fontBody }} />
                </div>

                {iconsLoading && <div style={{ padding: "24px 10px", textAlign: "center", color: theme.mist, fontSize: 11 }}>Loading icons...</div>}
                {iconsError && <div style={{ padding: 12, borderRadius: 8, background: "#FBEAE8", border: "1px solid #E2483D55", color: "#B23422", fontSize: 10 }}>{iconsError}</div>}

                {!iconsLoading && !iconsError && folderNames.length > 0 && (
                  <>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: theme.inkSoft, marginBottom: 7 }}>Categories</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxHeight: 120, overflowY: "auto" }}>
                        {folderNames.map((folder) => {
                          const active = selectedIconFolder === folder;
                          return (
                            <button key={folder} type="button" onClick={() => { setSelectedIconFolder(folder); setIconSearch(""); }}
                              style={{ border: active ? `1px solid ${theme.signal}` : `1px solid ${theme.line}`, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : "#4b5563", borderRadius: 7, padding: "6px 8px", cursor: "pointer", fontSize: 9, fontWeight: active ? 700 : 600 }}>
                              {folder}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: theme.ink, fontFamily: theme.fontMono }}>{selectedIconFolder}</span>
                      <span style={{ fontSize: 9, color: theme.mist }}>{currentIcons.length} icons</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 7 }}>
                      {currentIcons.map((icon) => {
                        const active = logo.iconPath === icon.path;
                        return (
                          <button key={icon.path} type="button" title={icon.name} onClick={() => update({ iconPath: icon.path })}
                            style={{ aspectRatio: "1 / 1", minWidth: 0, border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 8, background: active ? theme.signalSoft : "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, position: "relative" }}>
                            <MaskedIcon src={icon.path} color={logo.iconColor || logo.textColor || "#111111"} size={32} />
                            {active && <span style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: theme.signal, color: "#1A0E08", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800 }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {!currentIcons.length && <div style={{ padding: "28px 10px", textAlign: "center", color: theme.mist, fontSize: 10 }}>No icons found.</div>}
                  </>
                )}

                {!iconsLoading && !iconsError && folderNames.length === 0 && <div style={{ padding: 20, textAlign: "center", color: theme.mist, fontSize: 10 }}>No icon folders found.</div>}
              </div>
            )}

            {activeTab === "effects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Section title="Visual Effect" onReset={resetSection}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {EFFECTS.map((item) => {
                      const active = logo.effect === item.value;
                      return (
                        <button key={item.value} type="button" onClick={() => update({ effect: item.value as any })}
                          style={{ minHeight: 70, padding: "11px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 9, background: active ? theme.signalSoft : "#ffffff", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: active ? theme.signalDeep : theme.ink }}>{item.label}</div>
                          <div style={{ marginTop: 5, fontSize: 9, lineHeight: 1.35, color: theme.mist }}>{item.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Frame">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {[["none", "None"], ["circle", "Circle"], ["square", "Square"], ["rounded", "Rounded"], ["border", "Border"], ["dashed", "Dashed"]].map((item) => {
                      const active = (logo.frameStyle || "none") === item[0];
                      return (
                        <button key={item[0]} type="button" onClick={() => update({ frameStyle: item[0] as FrameStyle })}
                          style={{ padding: "8px 3px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 7, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.inkSoft, cursor: "pointer", fontSize: 9, fontWeight: 700 }}>
                          {item[1]}
                        </button>
                      );
                    })}
                  </div>
                  {logo.frameStyle !== "none" && (
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                      <RangeControl label="Thickness" value={clamp(Number(logo.frameThickness ?? 2), 1, 10)} min={1} max={10} suffix="px" onChange={(value) => update({ frameThickness: value })} />
                      <ColorControl label="Frame Color" value={logo.frameColor || logo.textColor || "#111111"} onChange={(value) => update({ frameColor: value })} />
                    </div>
                  )}
                </Section>
              </div>
            )}

            {activeTab === "brand" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Section title="Brand" onReset={resetSection}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: theme.inkSoft, marginBottom: 8 }}>Brand Name</label>
                      <input value={logo.name || ""} onChange={(e) => update({ name: e.target.value })}
                        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1px solid ${theme.line}`, borderRadius: 8, outline: "none", fontSize: 12 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: theme.inkSoft, marginBottom: 8 }}>Slogan</label>
                      <input value={logo.slogan || ""} onChange={(e) => update({ slogan: e.target.value })}
                        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1px solid ${theme.line}`, borderRadius: 8, outline: "none", fontSize: 12 }} />
                    </div>
                  </div>
                </Section>

                <Section title="Variants">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    {[["full", "Full Logo"], ["iconOnly", "Icon Only"], ["wordmark", "Wordmark"], ["stacked", "Stacked"], ["dark", "Dark"], ["light", "Light"]].map((item) => {
                      const active = (logo.variant || "full") === item[0];
                      return (
                        <button key={item[0]} type="button" onClick={() => update({ variant: item[0] as Variant })}
                          style={{ minHeight: 48, padding: "9px", border: active ? `2px solid ${theme.signal}` : `1px solid ${theme.line}`, borderRadius: 8, background: active ? theme.signalSoft : "#ffffff", color: active ? theme.signalDeep : theme.ink, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
                          {item[1]}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Current Icon">
                  <div style={{ height: 80, border: `1px solid ${theme.line}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: theme.paperAlt }}>
                    {logo.iconPath ? <MaskedIcon src={logo.iconPath} color={logo.iconColor || logo.textColor || "#111111"} size={54} /> : <span style={{ color: theme.mist, fontSize: 10 }}>No icon</span>}
                  </div>
                </Section>
              </div>
            )}

            {activeTab === "mockups" && (
              <MockupControls generator={mockupGenerator} />
            )}

            {activeTab === "downloads" && (
              <DownloadTab logo={logo as LogoConfig} previewRef={previewRef} paid={paid} onUnlock={() => setPaid(true)} />
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
    <Suspense fallback={
      <div className="bfy-scope" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: theme.fontBody, background: theme.paper }}>
        <GlobalStyle />
        <AccountHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: theme.inkSoft, fontSize: 13 }}>Loading editor...</div>
      </div>
    }>
      <EditorInner />
    </Suspense>
  );
}
