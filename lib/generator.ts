import { getPalettesForIndustry, isDark, type Palette } from "./palettes";

export type Layout = "iconTop" | "iconLeft" | "iconBig" | "badge" | "textOnly" | "horizontalBar";
export type Effect = "none" | "glow" | "metallic" | "shadow" | "neon";
export type Decoration = "none" | "circle" | "square" | "border" | "frame";
export type TextDecoration = "none" | "underline" | "overline";
export type FontStyle = "luxury" | "tech" | "retro" | "playful";
export type FontCategory = "script" | "serif" | "sans";
export type FrameStyle = "none" | "gold-square" | "thin-circle" | "inner-dashed-circle" | "solid-dark-circle" | "gradient-block";

export interface LogoConfig {
  name: string;
  slogan?: string;
  iconPath: string;
  palette: Palette;
  layout: Layout;
  fontName: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: string;
  textTransform: "uppercase" | "lowercase" | "capitalize" | "none";
  borderRadius: string;
  textColor: string;
  iconColor: string;
  background?: string;
  effect: Effect;
  decoration: Decoration;
  decorationColor?: string;
  textDecoration: TextDecoration;
  fontStyle: FontStyle;
  fontCategory: FontCategory;
  frameStyle: FrameStyle;
  sloganFont?: string;
  isMonogram?: boolean;
  isAbstract?: boolean;  // ✅ اضافه شد
}

const LAYOUTS: Layout[] = ["iconTop", "iconTop", "iconTop", "iconBig", "iconTop", "badge"];
const EFFECTS: Effect[] = ["none", "glow", "metallic", "shadow", "neon"];
const DECORATIONS: Decoration[] = ["none", "circle", "square", "border", "frame"];
const TEXT_DECORATIONS: TextDecoration[] = ["none", "underline", "overline"];
const FONT_STYLES: FontStyle[] = ["luxury", "tech", "retro", "playful"];
const FRAME_STYLES: FrameStyle[] = ["none", "gold-square", "thin-circle", "inner-dashed-circle", "solid-dark-circle", "gradient-block"];

// 🎨 فونت‌های دسته‌بندی شده (مثل Looka)
const LUXURY_FONTS = [
  { name: "Playfair Display", family: "'Playfair Display', serif", weight: ["400", "700", "900"] },
  { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", weight: ["400", "600", "700"] },
  { name: "Bodoni Moda", family: "'Bodoni Moda', serif", weight: ["400", "700"] },
  { name: "Cinzel", family: "'Cinzel', serif", weight: ["400", "700"] },
  { name: "Cinzel Decorative", family: "'Cinzel Decorative', serif", weight: ["400", "700", "900"] },
  { name: "Lora", family: "'Lora', serif", weight: ["400", "700"] },
  { name: "Arkadelphia", family: "'Arkadelphia'", weight: ["400", "700"] },
  { name: "Rochester", family: "'Rochester'", weight: ["400"] },
  { name: "Library3am", family: "'Library3am'", weight: ["400"] },
  { name: "Weddingmagnolia", family: "'Weddingmagnolia'", weight: ["400"] },
];

const TECH_FONTS = [
  { name: "Montserrat", family: "'Montserrat', sans-serif", weight: ["400", "700", "900"] },
  { name: "DM Sans", family: "'DM Sans', sans-serif", weight: ["400", "500", "700"] },
  { name: "Syne", family: "'Syne', sans-serif", weight: ["400", "700", "800"] },
  { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", weight: ["400", "600", "700"] },
  { name: "Oswald", family: "'Oswald', sans-serif", weight: ["400", "700"] },
  { name: "Raleway", family: "'Raleway', sans-serif", weight: ["400", "700", "900"] },
  { name: "Morrison", family: "'Morrison'", weight: ["400"] },
  { name: "Apestron", family: "'Apestron'", weight: ["400"] },
  { name: "Koumon", family: "'Koumon'", weight: ["100", "300", "400", "500", "700", "900"] },
];

const RETRO_FONTS = [
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", weight: ["400"] },
  { name: "Fredoka One", family: "'Fredoka One', sans-serif", weight: ["400"] },
  { name: "Righteous", family: "'Righteous', sans-serif", weight: ["400"] },
  { name: "Poppins", family: "'Poppins', sans-serif", weight: ["400", "700", "900"] },
  { name: "Arogant", family: "'Arogant'", weight: ["400"] },
  { name: "Racehugo", family: "'Racehugo'", weight: ["400"] },
  { name: "Atavian", family: "'Atavian'", weight: ["400"] },
  { name: "Eightstone", family: "'Eightstone'", weight: ["400"] },
];

const PLAYFUL_FONTS = [
  { name: "Caveat", family: "'Caveat', cursive", weight: ["400", "700"] },
  { name: "Tangerine", family: "'Tangerine', cursive", weight: ["400", "700"] },
  { name: "Great Vibes", family: "'Great Vibes', cursive", weight: ["400"] },
  { name: "Dancing Script", family: "'Dancing Script', cursive", weight: ["400", "700"] },
  { name: "Pacifico", family: "'Pacifico', cursive", weight: ["400"] },
  { name: "Sacramento", family: "'Sacramento', cursive", weight: ["400"] },
  { name: "Manbow Clear", family: "'Manbow Clear'", weight: ["400"] },
  { name: "Manbow Dots", family: "'Manbow Dots'", weight: ["400"] },
  { name: "Manbow Fill", family: "'Manbow Fill'", weight: ["400"] },
  { name: "Manbow Lines", family: "'Manbow Lines'", weight: ["400"] },
  { name: "Manbow Solid", family: "'Manbow Solid'", weight: ["400"] },
  { name: "Manbow Spots", family: "'Manbow Spots'", weight: ["400"] },
  { name: "Manbow Stripe", family: "'Manbow Stripe'", weight: ["400"] },
  { name: "Manbow Tone", family: "'Manbow Tone'", weight: ["400"] },
  { name: "Nouveaunostalgia", family: "'Nouveaunostalgia'", weight: ["400"] },
  { name: "Mollyn", family: "'Mollyn'", weight: ["400"] },
  { name: "Corpta", family: "'Corpta'", weight: ["400"] },
  { name: "Kabisatitalictall", family: "'Kabisatitalictall'", weight: ["400"] },
  { name: "Library3amsoft", family: "'Library3amsoft'", weight: ["400"] },
  { name: "Vetro", family: "'Vetro'", weight: ["400"] },
  { name: "Rushmax", family: "'Rushmax'", weight: ["400"] },
  { name: "Decobra", family: "'Decobra'", weight: ["400"] },
  { name: "Moubarubold", family: "'Moubarubold'", weight: ["700"] },
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

// 📏 Letter Spacing Variations (مثل Looka) - کاهش شده
const LETTER_SPACINGS = [
  "0px",      // compact
  "0px",      // tight
  "0.02em",   // very tight
  "0.05em",   // tight
  "0.1em",    // normal
  "0.15em",   // wide
];

// 🔤 Text Transform Options
const TEXT_TRANSFORMS: Array<"uppercase" | "lowercase" | "capitalize" | "none"> = [
  "uppercase",
  "uppercase",
  "uppercase",
  "capitalize",
  "none",
];

export interface GenerateInput {
  name: string;
  slogan?: string;
  industry: string;
}

function getPrimaryFont(fontStyle: FontStyle): typeof LUXURY_FONTS[0] {
  let fontList = LUXURY_FONTS;
  if (fontStyle === "tech") fontList = TECH_FONTS;
  if (fontStyle === "retro") fontList = RETRO_FONTS;
  if (fontStyle === "playful") fontList = PLAYFUL_FONTS;
  return fontList[Math.floor(Math.random() * fontList.length)];
}

// 🎯 Determine font category (Script vs Serif vs Sans)
function getFontCategory(fontStyle: FontStyle): FontCategory {
  if (fontStyle === "playful") {
    return "script"; // Playful = Script fonts (Caveat, Tangerine, etc)
  } else if (fontStyle === "luxury") {
    return "serif"; // Luxury = Serif fonts
  } else {
    return "sans"; // Tech & Retro = Sans fonts
  }
}

// 🎨 Font Pairing - Slogan gets different font than name (فقط Serif یا Sans - بدون Script)
function getComplementaryFont(fontStyle: FontStyle): typeof LUXURY_FONTS[0] {
  // Slogan فقط Serif یا Sans استفاده کند
  const luxurySans = Math.random() > 0.5 ? LUXURY_FONTS : TECH_FONTS;
  return luxurySans[Math.floor(Math.random() * luxurySans.length)];
}

// 🧠 Smart Text Transform (Looka logic)
function getSmartTextTransform(fontCategory: FontCategory): "uppercase" | "lowercase" | "capitalize" | "none" {
  if (fontCategory === "script") {
    return "capitalize"; // Script fonts: capitalize (Caveat)
  } else if (fontCategory === "serif") {
    return "uppercase"; // Serif fonts: uppercase (Playfair)
  } else {
    return "none"; // Sans fonts: NO transform (keep original case)
  }
}

function getSecondaryFont(): typeof TECH_FONTS[0] {
  // Font pairing: serif + sans (مثل Looka)
  return TECH_FONTS[Math.floor(Math.random() * TECH_FONTS.length)];
}

export function generateLogos(input: GenerateInput, count = 100): LogoConfig[] {
  const { name, slogan, industry } = input;
  const allPalettes = getPalettesForIndustry(industry, count);
  const folder = getIconFolder(industry);
  const logos: LogoConfig[] = [];

  for (let i = 0; i < count; i++) {
    const palette = allPalettes[i % allPalettes.length];
    const iconIndex = (i * 7 + Math.floor(i / 3)) % 100 + 1;
    const iconPath = `/icons/${folder}/${iconIndex}.svg`;
    
    const dark = isDark(palette.bg);
    const textColor = dark ? palette.textLight : palette.textDark;

    const layout = LAYOUTS[i % LAYOUTS.length];
    const fontStyle = FONT_STYLES[i % FONT_STYLES.length];
    const fontCategory = getFontCategory(fontStyle);
    
    // 🎨 Font Pairing Strategy (مثل Looka)
    const primaryFont = getPrimaryFont(fontStyle);
    const primaryWeight = primaryFont.weight[i % primaryFont.weight.length];
    
    // Use primary for main name, secondary for slogan/subtitle
    const fontSize = 28 + (i % 6) * 2;  // بیشتر از 24-39 به 28-39
    const letterSpacing = LETTER_SPACINGS[i % LETTER_SPACINGS.length];
    // 🧠 Smart text transform based on font type (Script vs Non-Script)
    const textTransform = getSmartTextTransform(fontCategory);
    
    const borderRadius = BORDER_RADII[(i * 3) % BORDER_RADII.length];
    
    // 🎨 Frame Style - فقط 15% لوگوها (15 تا از 100)
    const frameStyle = (i % 7 === 0) ? FRAME_STYLES[Math.floor(i / 7) % FRAME_STYLES.length] : "none";
    
    let background = palette.bg;
    const useGradient = i % 2 === 0 && dark && frameStyle === "none"; // فقط اگر frame نباشد
    const useMetallic = i % 5 === 0 && frameStyle === "none"; // فقط اگر frame نباشد
    
    if (useMetallic && frameStyle === "none") {
      background = METALLIC_GRADIENTS[i % METALLIC_GRADIENTS.length];
    } else if (useGradient && frameStyle === "none") {
      background = GRADIENTS[i % GRADIENTS.length];
    }
    // برای frames: همیشه solid color

    const effect: Effect = EFFECTS[i % EFFECTS.length];
    const canHaveDecoration = layout === "textOnly" && i % 10 === 0;
    const decoration: Decoration = canHaveDecoration ? "border" : "none";
    const textDecoration: TextDecoration = i % 8 === 0 ? TEXT_DECORATIONS[i % TEXT_DECORATIONS.length] : "none";
    
    let decorationColor = textColor;
    if (decoration !== "none" && i % 2 === 0) {
      decorationColor = dark ? palette.accent : palette.primary;
    }
    
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

    // 🎨 Slogan Font - مختلف از نام لوگو
    const complementaryFont = getComplementaryFont(fontStyle);
    const sloganFont = complementaryFont.family;
    
    // ✅ 30% Abstract Logos (هر 10 لوگو: آخر 3 تا Abstract)
    const isAbstract = i % 10 === 7 || i % 10 === 8 || i % 10 === 9;
    
    // 📱 Monogram Logo - فقط 10% (هر 10 لوگو یکی) - متفاوت از frames و abstract
    const isMonogram = frameStyle === "none" && !isAbstract && (i % 10 === 3);

    logos.push({
      name, slogan, iconPath, palette,
      layout,
      fontName: primaryFont.name,
      fontFamily: primaryFont.family,
      fontSize,
      fontWeight: primaryWeight,
      letterSpacing,
      textTransform,
      borderRadius,
      textColor,
      iconColor,
      background,
      effect,
      decoration,
      decorationColor,
      textDecoration,
      fontStyle,
      fontCategory,
      frameStyle,
      sloganFont,
      isMonogram,
      isAbstract,  // ✅ اضافه شد
    });
  }
  return logos;
}