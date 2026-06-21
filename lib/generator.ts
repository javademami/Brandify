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

const LAYOUTS: Layout[] = ["iconTop", "iconLeft", "iconBig", "badge", "textOnly"];

const FONTS = [
  "'Playfair Display', serif",
  "'Montserrat', sans-serif",
  "'DM Sans', sans-serif",
  "'Poppins', sans-serif",
  "'Cormorant Garamond', serif",
  "'Outfit', sans-serif",
];

const FONT_WEIGHTS = ["400", "500", "600", "700", "800", "900"];
const BORDER_RADII = ["0px", "8px", "12px", "16px", "20px", "24px", "32px", "999px"];

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

export function generateLogos(input: GenerateInput, count = 12): LogoConfig[] {
  const { name, slogan, industry } = input;
  const allPalettes = getPalettesForIndustry(industry);
  // اگر palette‌ها کمتر از count باشند، از تمام palette‌ها استفاده کن و cycle کن
  const folder = getIconFolder(industry);
  const logos: LogoConfig[] = [];

  for (let i = 0; i < count; i++) {
    // palette: cycle through available palettes
    const palette = allPalettes[i % allPalettes.length];
    
    // icon: بهتر متنوع — استفاده از prime numbers
    const iconIndex = ((i * 11 + 5) % 20) + 1; // 16,7,18,9,20,11,2,13,4,15,6,17,8,19,10,1,12,3,14,5
    const iconPath = `/icons/${folder}/${iconIndex}.svg`;
    
    // colors: بر اساس palette
    const dark = isDark(palette.bg);
    const textColor = dark ? palette.textLight : palette.textDark;
    const iconColor = dark ? "#ffffff" : "#000000";

    // layout: متنوع‌تر
    const layout = LAYOUTS[(i * 2) % LAYOUTS.length];
    
    // font & weight: بیشتر متنوع
    const font = FONTS[(i * 2) % FONTS.length];
    const fontWeight = FONT_WEIGHTS[(i * 3 + 1) % FONT_WEIGHTS.length];
    
    // border radius: متنوع‌تر
    const borderRadius = BORDER_RADII[(i * 4 + 2) % BORDER_RADII.length];

    logos.push({
      name, slogan, iconPath, palette,
      layout, font, fontWeight, borderRadius,
      textColor, iconColor,
    });
  }
  return logos;
}