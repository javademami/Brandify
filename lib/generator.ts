import { getPalettesForIndustry, isDark, type Palette } from "./palettes";

export type Layout = "iconTop" | "iconLeft" | "iconBig" | "badge" | "textOnly" | "horizontalBar";
export type Effect = "none" | "glow" | "metallic" | "shadow" | "neon";
export type Decoration = "none" | "circle" | "square" | "border" | "frame";
export type TextDecoration = "none" | "underline" | "overline";

export interface LogoConfig {
  name: string;
  slogan?: string;
  iconPath: string;
  palette: Palette;
  layout: Layout;
  font: string;
  fontSize: number;
  fontWeight: string;
  borderRadius: string;
  textColor: string;
  iconColor: string;
  background?: string;
  effect: Effect;
  decoration: Decoration;
  decorationColor?: string;
  textDecoration: TextDecoration;
}

const LAYOUTS: Layout[] = ["iconTop", "iconLeft", "iconBig", "badge", "textOnly", "horizontalBar"];
const EFFECTS: Effect[] = ["none", "glow", "metallic", "shadow", "neon"];
const DECORATIONS: Decoration[] = ["none", "circle", "square", "border", "frame"];
const TEXT_DECORATIONS: TextDecoration[] = ["none", "underline", "overline"];

const FONTS = [
  { name: "'Playfair Display', serif", weight: ["400", "700", "900"] },
  { name: "'Montserrat', sans-serif", weight: ["400", "700", "900"] },
  { name: "'Cormorant Garamond', serif", weight: ["400", "600", "700"] },
  { name: "'Poppins', sans-serif", weight: ["400", "700", "900"] },
  { name: "'Raleway', sans-serif", weight: ["400", "700", "900"] },
  { name: "'Bebas Neue', sans-serif", weight: ["400"] },
  { name: "'DM Sans', sans-serif", weight: ["400", "500", "700"] },
  { name: "'Outfit', sans-serif", weight: ["400", "600", "700"] },
  { name: "'Space Mono', monospace", weight: ["400", "700"] },
  { name: "'Syne', sans-serif", weight: ["400", "700", "800"] },
  { name: "'Fredoka One', sans-serif", weight: ["400"] },
  { name: "'Cinzel', serif", weight: ["400", "700"] },
  { name: "'Bodoni Moda', serif", weight: ["400", "700"] },
  { name: "'Manrope', sans-serif", weight: ["400", "700"] },
  { name: "'Caveat', cursive", weight: ["400", "700"] },
  { name: "'Tangerine', cursive", weight: ["400", "700"] },
];

const BORDER_RADII = ["0px", "8px", "12px", "16px", "24px", "999px"];

const INDUSTRY_MAP: Record<string, string> = {
  ai: "ai", technology: "technology", startup: "startup", crypto: "crypto",
  food: "food", cafe: "cafe", restaurant: "restaurant", fashion: "fashion",
  beauty: "beauty", luxury: "luxury", finance: "finance", banking: "banking",
  investment: "investment", fitness: "fitness", sports: "fitness",
  education: "education", realestate: "realestate", health: "health",
  medical: "health", travel: "travel", hotel: "hotel", gaming: "gaming",
};

function getIconFolder(industry: string): string {
  const key = industry.toLowerCase().replace(/[\s&\-]+/g, "");
  for (const [k, v] of Object.entries(INDUSTRY_MAP)) {
    if (key.includes(k)) return v;
  }
  return "general";
}

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
  "linear-gradient(135deg, #2e2e78 0%, #16213e 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
  "linear-gradient(135deg, #a8a8ff 0%, #7f7fd5 100%)",
];

const METALLIC_GRADIENTS = [
  "linear-gradient(135deg, #d4af37 0%, #ffeaa7 50%, #d4af37 100%)",
  "linear-gradient(135deg, #c0c0c0 0%, #ffffff 50%, #c0c0c0 100%)",
  "linear-gradient(135deg, #b87333 0%, #ffd700 50%, #b87333 100%)",
  "linear-gradient(135deg, #71797e 0%, #b8b8b8 50%, #71797e 100%)",
];

export interface GenerateInput {
  name: string;
  slogan?: string;
  industry: string;
}

export function generateLogos(input: GenerateInput, count = 48): LogoConfig[] {
  const { name, slogan, industry } = input;
  const allPalettes = getPalettesForIndustry(industry, count);
  const folder = getIconFolder(industry);
  const logos: LogoConfig[] = [];

  for (let i = 0; i < count; i++) {
    const palette = allPalettes[i % allPalettes.length];
    // Use all 100 icons - rotate through them
    const iconIndex = (i * 7 + Math.floor(i / 3)) % 100 + 1;
    const iconPath = `/icons/${folder}/${iconIndex}.svg`;
    
    const dark = isDark(palette.bg);
    const textColor = dark ? palette.textLight : palette.textDark;

    const layout = LAYOUTS[i % LAYOUTS.length];
    const fontObj = FONTS[(i * 2) % FONTS.length];
    const font = fontObj.name;
    const fontWeight = fontObj.weight[i % fontObj.weight.length];
    const fontSize = 20 + (i % 4) * 2;
    
    const borderRadius = BORDER_RADII[(i * 3) % BORDER_RADII.length];
    
    let background = palette.bg;
    const useGradient = i % 2 === 0 && dark;
    const useMetallic = i % 5 === 0;
    
    if (useMetallic) {
      background = METALLIC_GRADIENTS[i % METALLIC_GRADIENTS.length];
    } else if (useGradient) {
      background = GRADIENTS[i % GRADIENTS.length];
    }

    const effect: Effect = EFFECTS[i % EFFECTS.length];
    // Smart decoration: only for icon layouts that have space
    const canHaveDecoration = layout === "iconTop" || layout === "iconBig";
    const decoration: Decoration = (canHaveDecoration && i % 4 === 0) ? DECORATIONS[(i + 1) % DECORATIONS.length] : "none";
    const textDecoration: TextDecoration = layout !== "badge" && i % 6 === 0 ? TEXT_DECORATIONS[i % TEXT_DECORATIONS.length] : "none";
    
    // Decoration color - contrasting with background
    let decorationColor = textColor;
    if (decoration !== "none" && i % 2 === 0) {
      decorationColor = dark ? palette.accent : palette.primary;
    }
    
    // Icon color variations - not always b&w
    let iconColor = dark ? "#ffffff" : "#000000";
    const colorVariation = i % 5;
    if (colorVariation === 1) {
      iconColor = palette.accent;
    } else if (colorVariation === 2) {
      iconColor = palette.primary;
    } else if (colorVariation === 3 && dark) {
      iconColor = palette.textLight;
    } else if (colorVariation === 4 && !dark) {
      iconColor = palette.textDark;
    }

    logos.push({
      name, slogan, iconPath, palette,
      layout, font, fontSize, fontWeight, borderRadius,
      textColor,
      iconColor,
      background,
      effect,
      decoration,
      decorationColor,
      textDecoration,
    });
  }
  return logos;
}