import { getPalettesForIndustry, isDark, type Palette } from "./palettes";

export type Layout = "iconTop" | "iconLeft" | "iconBig" | "badge" | "textOnly";

export interface LogoConfig {
  name: string;
  slogan?: string;
  iconPath: string;
  palette: Palette;
  layout: Layout;
  font: string;
  fontWeight: string;
  borderRadius: string;
  textColor: string;
  iconColor: string;
}

const LAYOUTS: Layout[] = ["iconTop", "iconLeft", "iconBig", "badge", "textOnly", "iconLeft"];

const FONTS = [
  "'Playfair Display', serif",
  "'Montserrat', sans-serif",
  "'DM Sans', sans-serif",
  "'Poppins', sans-serif",
  "'Cormorant Garamond', serif",
  "'Outfit', sans-serif",
];

const FONT_WEIGHTS = ["700", "800", "600", "900", "700", "800"];
const BORDER_RADII = ["12px", "0px", "24px", "8px", "16px", "999px"];

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

export interface GenerateInput {
  name: string;
  slogan?: string;
  industry: string;
}

export function generateLogos(input: GenerateInput, count = 6): LogoConfig[] {
  const { name, slogan, industry } = input;
  const palettesForIndustry = getPalettesForIndustry(industry);
  const folder = getIconFolder(industry);
  const logos: LogoConfig[] = [];

  for (let i = 0; i < count; i++) {
    const palette = palettesForIndustry[i % palettesForIndustry.length];
    const iconIndex = (i * 3 + 1) % 20 + 1; // 1,4,7,10,13,16,19,2,5,8...
    const iconPath = `/icons/${folder}/${iconIndex}.svg`;
    const dark = isDark(palette.bg);
    const textColor = dark ? palette.primary : palette.accent;
    const iconColor = dark ? "#ffffff" : palette.bg;

    logos.push({
      name, slogan, iconPath, palette,
      layout: LAYOUTS[i % LAYOUTS.length],
      font: FONTS[i % FONTS.length],
      fontWeight: FONT_WEIGHTS[i % FONT_WEIGHTS.length],
      borderRadius: BORDER_RADII[i % BORDER_RADII.length],
      textColor, iconColor,
    });
  }
  return logos;
}