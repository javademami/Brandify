export interface Palette {
  id: number;
  name: string;
  bg: string;
  primary: string;
  accent: string;
  textDark: string;
  textLight: string;
  category: string;
}

export const palettes: Palette[] = [
  // Luxury & Corporate
  { id: 1,  name: "شب طلایی",        bg: "#000000", primary: "#D4AF37", accent: "#FFFFFF", textDark: "#000000", textLight: "#FFFFFF", category: "luxury" },
  { id: 2,  name: "سرمه‌ای کلاسیک",  bg: "#002366", primary: "#C0C0C0", accent: "#F5F5F5", textDark: "#002366", textLight: "#FFFFFF", category: "luxury" },
  { id: 3,  name: "اشرافیت مدرن",    bg: "#1A1A1A", primary: "#E5E4E2", accent: "#B76E79", textDark: "#1A1A1A", textLight: "#FFFFFF", category: "luxury" },
  { id: 4,  name: "سلطنتی تیره",     bg: "#301934", primary: "#FFD700", accent: "#FFFFFF", textDark: "#301934", textLight: "#FFFFFF", category: "luxury" },
  // Tech & Startup
  { id: 5,  name: "نئون فیوچر",      bg: "#0B0C10", primary: "#66FCF1", accent: "#45A29E", textDark: "#0B0C10", textLight: "#FFFFFF", category: "tech" },
  { id: 6,  name: "دنیای دیجیتال",   bg: "#242582", primary: "#553D67", accent: "#F64C72", textDark: "#242582", textLight: "#FFFFFF", category: "tech" },
  { id: 7,  name: "کد نویسی",        bg: "#1F2833", primary: "#3361FF", accent: "#FFFFFF", textDark: "#1F2833", textLight: "#FFFFFF", category: "tech" },
  { id: 8,  name: "ابر هوشمند",      bg: "#EAEAEA", primary: "#007BFF", accent: "#282C34", textDark: "#282C34", textLight: "#FFFFFF", category: "tech" },
  // Eco & Wellness
  { id: 9,  name: "باغ زیتون",       bg: "#556B2F", primary: "#BDB76B", accent: "#FFFFFF", textDark: "#556B2F", textLight: "#FFFFFF", category: "health" },
  { id: 10, name: "شکوفه لطیف",      bg: "#FFB7C5", primary: "#778899", accent: "#4B0082", textDark: "#4B0082", textLight: "#FFFFFF", category: "health" },
  { id: 11, name: "اقیانوس آرام",    bg: "#0077BE", primary: "#E0FFFF", accent: "#00A36C", textDark: "#0077BE", textLight: "#FFFFFF", category: "health" },
  { id: 12, name: "زمین پاک",        bg: "#4E3524", primary: "#8FBC8F", accent: "#F5F5DC", textDark: "#4E3524", textLight: "#FFFFFF", category: "health" },
  // Food & Fun
  { id: 13, name: "فلفل تند",        bg: "#CC0000", primary: "#FFB11B", accent: "#1A1A1A", textDark: "#1A1A1A", textLight: "#FFFFFF", category: "food" },
  { id: 14, name: "کافه دنج",        bg: "#4B3621", primary: "#D2B48C", accent: "#FFFFFF", textDark: "#4B3621", textLight: "#FFFFFF", category: "food" },
  { id: 15, name: "میوه تابستانی",   bg: "#FF4500", primary: "#FFD700", accent: "#32CD32", textDark: "#FF4500", textLight: "#FFFFFF", category: "food" },
  { id: 16, name: "شیرینی‌پزی",      bg: "#800020", primary: "#FFC0CB", accent: "#FDF5E6", textDark: "#800020", textLight: "#FFFFFF", category: "food" },
  // Minimalist & Artistic
  { id: 17, name: "خاکستری بتنی",    bg: "#2C3E50", primary: "#95A5A6", accent: "#ECF0F1", textDark: "#2C3E50", textLight: "#FFFFFF", category: "minimal" },
  { id: 18, name: "تضاد مطلق",       bg: "#000000", primary: "#FFFFFF", accent: "#FF0000", textDark: "#000000", textLight: "#FFFFFF", category: "minimal" },
  { id: 19, name: "کویر مدرن",       bg: "#E27D60", primary: "#85DCB0", accent: "#E8A87C", textDark: "#333333", textLight: "#FFFFFF", category: "minimal" },
  { id: 20, name: "آبی اسکاندیناوی", bg: "#1D3557", primary: "#457B9D", accent: "#A8DADC", textDark: "#1D3557", textLight: "#FFFFFF", category: "minimal" },
];

// هر صنف → پالت‌های مرتبط
export const industryPalettes: Record<string, number[]> = {
  ai:            [5, 6, 7, 8],
  technology:    [5, 7, 8, 6],
  startup:       [6, 7, 5, 20],
  crypto:        [5, 6, 18, 7],
  food:          [13, 14, 15, 16],
  cafe:          [14, 13, 16, 19],
  restaurant:    [13, 15, 14, 16],
  fashion:       [1, 3, 18, 19],
  beauty:        [3, 10, 19, 16],
  luxury:        [1, 2, 3, 4],
  finance:       [2, 7, 17, 20],
  banking:       [2, 17, 20, 7],
  investment:    [1, 2, 7, 17],
  fitness:       [18, 5, 6, 15],
  sports:        [18, 13, 6, 15],
  education:     [20, 8, 11, 17],
  realestate:    [17, 20, 2, 12],
  health:        [9, 10, 11, 12],
  medical:       [11, 9, 17, 20],
  travel:        [20, 11, 5, 19],
  hotel:         [1, 2, 4, 3],
  gaming:        [5, 6, 18, 4],
  general:       [17, 7, 20, 18],
};

export function getPalettesForIndustry(industry: string): Palette[] {
  const key = industry.toLowerCase().replace(/[\s&\-]+/g, "").replace(/machine.*/, "").replace(/learning.*/, "");
  
  for (const [k, ids] of Object.entries(industryPalettes)) {
    if (key.includes(k)) {
      return ids.map(id => palettes.find(p => p.id === id)!).filter(Boolean);
    }
  }
  return [palettes[16], palettes[6], palettes[19], palettes[17]];
}

export function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0,2), 16);
  const g = parseInt(c.slice(2,4), 16);
  const b = parseInt(c.slice(4,6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 155;
}