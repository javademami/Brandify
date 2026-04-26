// lib/logoEngine.ts

type LogoInput = {
  name: string;
  industry: string;
};

const PALETTES = {
  tech: ["#1F2833", "#3361FF", "#FFFFFF"],
  luxury: ["#000000", "#D4AF37", "#FFFFFF"],
  food: ["#CC0000", "#FFB11B", "#1A1A1A"],
  eco: ["#556B2F", "#BDB76B", "#FFFFFF"],
  minimal: ["#2C3E50", "#ECF0F1", "#111111"],
};

function getPalette(industry: string) {
  if (["ai", "startup", "technology"].includes(industry)) return PALETTES.tech;
  if (["luxury", "fashion"].includes(industry)) return PALETTES.luxury;
  if (["food", "cafe"].includes(industry)) return PALETTES.food;
  if (["health"].includes(industry)) return PALETTES.eco;
  return PALETTES.minimal;
}

function isDark(hex: string) {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

// 🧠 Grid based SVG logo
export function generateSVGLogo({ name, industry }: LogoInput) {
  const [primary, secondary, accent] = getPalette(industry);

  const bg = secondary;
  const text = isDark(bg) ? "#ffffff" : "#111111";
  const icon = accent;

  return {
    full: buildFullLogo(name, bg, text, icon),
    compact: buildCompactLogo(name, bg, text, icon),
    icon: buildIconOnly(bg, icon),
  };
}

// 🎯 FULL LOGO (icon + text)
function buildFullLogo(name: string, bg: string, text: string, icon: string) {
  return `
<svg width="320" height="120" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="120" rx="16" fill="${bg}"/>

  <!-- Grid icon -->
  <g transform="translate(40,30)">
    <circle cx="24" cy="24" r="20" fill="${icon}" />
  </g>

  <!-- Text -->
  <text x="100" y="65" font-size="28" font-family="Inter, sans-serif" fill="${text}" font-weight="600">
    ${name}
  </text>
</svg>
`;
}

// 🎯 COMPACT
function buildCompactLogo(name: string, bg: string, text: string, icon: string) {
  return `
<svg width="220" height="80" viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="220" height="80" rx="12" fill="${bg}"/>

  <circle cx="40" cy="40" r="16" fill="${icon}" />

  <text x="80" y="48" font-size="18" font-family="Inter" fill="${text}">
    ${name}
  </text>
</svg>
`;
}

// 🎯 ICON ONLY
function buildIconOnly(bg: string, icon: string) {
  return `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="${bg}"/>
  <circle cx="50" cy="50" r="24" fill="${icon}" />
</svg>
`;
}
