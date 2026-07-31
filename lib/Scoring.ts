import type { LogoConfig } from "./generator";

export interface LogoScore {
  balanceScore: number;      // تعادل (0-100)
  readabilityScore: number;  // خوانایی (0-100)
  contrastScore: number;     // کنتراست (0-100)
  harmonyScore: number;      // هماهنگی (0-100)
  uniquenessScore: number;   // تنوع (0-100)
  totalScore: number;        // نمره نهایی (0-100)
}

// ✅ تابع تشخیص روشن/تاریک
function isLightColor(color: string): boolean {
  if (color.includes("linear-gradient")) return false;
  
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  return (r + g + b) / 3 > 128;
}

// ✅ محاسبه WCAG Contrast Ratio
function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    if (hex.includes("linear-gradient")) return 0.5;
    
    const rgb = hex.replace("#", "");
    const r = parseInt(rgb.slice(0, 2), 16) / 255;
    const g = parseInt(rgb.slice(2, 4), 16) / 255;
    const b = parseInt(rgb.slice(4, 6), 16) / 255;
    
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance <= 0.03928 ? luminance / 12.92 : Math.pow((luminance + 0.055) / 1.055, 2.4);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// ✅ نمره تعادل (Balance)
function scoreBalance(layout: string, fontSize: number): number {
  let score = 70; // base score
  
  // layouts خوب برای تعادل
  const balancedLayouts = ["iconTop", "badge", "textOnly"];
  if (balancedLayouts.includes(layout)) score += 20;
  else if (layout === "iconLeft") score += 10;
  
  // اندازه فونت معقول
  if (fontSize >= 24 && fontSize <= 40) score += 10;
  
  return Math.min(100, score);
}

// ✅ نمره خوانایی (Readability)
function scoreReadability(fontSize: number, letterSpacing: string, layout: string): number {
  let score = 60; // base score
  
  // fontSize خوب
  if (fontSize >= 28 && fontSize <= 38) score += 20;
  else if (fontSize >= 24 && fontSize <= 42) score += 10;
  
  // letter spacing
  const spacing = parseFloat(letterSpacing);
  if (spacing >= 0 && spacing <= 0.15) score += 15;
  
  // text-only layout کمتر خوانا است
  if (layout === "textOnly") score -= 10;
  
  return Math.min(100, score);
}

// ✅ نمره کنتراست (Contrast)
function scoreContrast(textColor: string, bgColor: string): number {
  const ratio = getContrastRatio(textColor, bgColor);
  
  // WCAG standards
  if (ratio >= 7) return 100;        // AAA (بسیار خوب)
  if (ratio >= 4.5) return 90;       // AA (خوب)
  if (ratio >= 3) return 75;         // Large text (قابل قبول)
  if (ratio >= 2) return 50;         // ضعیف
  
  return 30; // بسیار ضعیف
}

// ✅ نمره هماهنگی (Harmony)
function scoreHarmony(
  fontStyle: string,
  fontCategory: string,
  palette: any,
  effect: string
): number {
  let score = 70; // base score
  
  // font pairing خوب
  if (fontStyle === "luxury" && fontCategory === "serif") score += 10;
  else if (fontStyle === "tech" && fontCategory === "sans") score += 10;
  else if (fontStyle === "retro" && fontCategory === "sans") score += 5;
  else if (fontStyle === "playful" && fontCategory === "script") score += 10;
  
  // effects
  if (effect === "none" || effect === "glow") score += 5;
  if (effect === "neon") score -= 5;
  
  // palette harmony (primary + secondary should be different)
  if (palette.primary !== palette.secondary) score += 10;
  
  return Math.min(100, score);
}

// ✅ نمره تنوع (Uniqueness)
function scoreUniqueness(logo: LogoConfig, allLogos: LogoConfig[], index: number): number {
  let score = 80; // base score
  
  // مقایسه با لوگوهای قبلی
  let similarCount = 0;
  
  for (let i = 0; i < index; i++) {
    const other = allLogos[i];
    
    // same palette
    if (other.palette.bg === logo.palette.bg) similarCount++;
    
    // same layout
    if (other.layout === logo.layout) similarCount++;
    
    // same font
    if (other.fontFamily === logo.fontFamily) similarCount++;
  }
  
  // کاهش نمره برای شباهت‌های بیشتر
  if (similarCount > 0) score -= Math.min(20, similarCount * 3);
  
  // abstract logos بیشتر unique هستند
  if (logo.isAbstract) score += 10;
  
  // monogram logos unique هستند
  if (logo.isMonogram) score += 5;
  
  return Math.min(100, Math.max(50, score));
}

// ✅ محاسبه نمره نهایی
export function scoreLogo(logo: LogoConfig, allLogos: LogoConfig[], index: number): LogoScore {
  const balanceScore = scoreBalance(logo.layout, logo.fontSize);
  const readabilityScore = scoreReadability(logo.fontSize, logo.letterSpacing, logo.layout);
  const contrastScore = scoreContrast(logo.textColor, logo.background || logo.palette.bg);
  const harmonyScore = scoreHarmony(logo.fontStyle, logo.fontCategory, logo.palette, logo.effect);
  const uniquenessScore = scoreUniqueness(logo, allLogos, index);
  
  // میانگین وزن‌دار
  const totalScore = Math.round(
    (balanceScore * 0.20 +
      readabilityScore * 0.20 +
      contrastScore * 0.25 +
      harmonyScore * 0.20 +
      uniquenessScore * 0.15) / 1
  );
  
  return {
    balanceScore: Math.round(balanceScore),
    readabilityScore: Math.round(readabilityScore),
    contrastScore: Math.round(contrastScore),
    harmonyScore: Math.round(harmonyScore),
    uniquenessScore: Math.round(uniquenessScore),
    totalScore: Math.min(100, Math.max(0, totalScore)),
  };
}

// ✅ فیلتر کنید: فقط لوگوهای > 85
export function filterByScore(logos: LogoConfig[], scores: LogoScore[], threshold = 85): Array<{ logo: LogoConfig; score: LogoScore }> {
  return logos
    .map((logo, idx) => ({ logo, score: scores[idx] }))
    .filter(({ score }) => score.totalScore >= threshold)
    .sort((a, b) => b.score.totalScore - a.score.totalScore);
}

// ✅ Extend LogoConfig برای نگهداری score
export interface ScoredLogoConfig extends LogoConfig {
  score?: LogoScore;
}