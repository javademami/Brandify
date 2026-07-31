// Pattern combinations برای Abstract Logos
export interface Pattern {
  id: string;
  name: string;
  type: "geometric" | "organic" | "minimal" | "gradient" | "dots" | "waves" | "shapes";
  description: string;
}

export const PATTERNS: Pattern[] = [
  // Geometric patterns
  { id: "geo-01", name: "Hexagon Grid", type: "geometric", description: "تکرار شش‌ضلعی" },
  { id: "geo-02", name: "Triangle Wave", type: "geometric", description: "موجهای مثلثی" },
  { id: "geo-03", name: "Circle Rings", type: "geometric", description: "حلقه‌های متحد المرکز" },
  { id: "geo-04", name: "Square Spiral", type: "geometric", description: "مارپیچ مربعی" },
  { id: "geo-05", name: "Diamond Grid", type: "geometric", description: "شبکه الماسی" },
  
  // Organic patterns
  { id: "org-01", name: "Blob Flow", type: "organic", description: "جریان حباب‌ها" },
  { id: "org-02", name: "Organic Waves", type: "organic", description: "موجهای ارگانیک" },
  { id: "org-03", name: "Liquid Forms", type: "organic", description: "اشکال مایع" },
  { id: "org-04", name: "Spiral Growth", type: "organic", description: "رشد مارپیچی" },
  { id: "org-05", name: "Cell Pattern", type: "organic", description: "الگوی سلولی" },
  
  // Minimal patterns
  { id: "min-01", name: "Line Grid", type: "minimal", description: "شبکه خطی" },
  { id: "min-02", name: "Dot Matrix", type: "minimal", description: "ماتریس نقطه‌ای" },
  { id: "min-03", name: "Corner Marks", type: "minimal", description: "نشان‌های گوشه" },
  { id: "min-04", name: "Single Line", type: "minimal", description: "یک خط" },
  { id: "min-05", name: "Minimal Dots", type: "minimal", description: "نقاط حداقلی" },
  
  // Gradient patterns
  { id: "grad-01", name: "Radial Gradient", type: "gradient", description: "گرادینت شعاعی" },
  { id: "grad-02", name: "Linear Gradient", type: "gradient", description: "گرادینت خطی" },
  { id: "grad-03", name: "Mesh Gradient", type: "gradient", description: "گرادینت شبکه‌ای" },
  { id: "grad-04", name: "Color Fade", type: "gradient", description: "محو رنگ" },
  { id: "grad-05", name: "Gradient Waves", type: "gradient", description: "موجهای رنگی" },
];

// دریافت pattern رندوم
export function getRandomPattern(): Pattern {
  return PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
}

// دریافت pattern از نوع خاص
export function getPatternsByType(type: Pattern["type"]): Pattern[] {
  return PATTERNS.filter(p => p.type === type);
}

// ترکیب pattern و رنگ برای Abstract Logo
export interface AbstractLogoPattern {
  pattern: Pattern;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  opacity: number;
  scale: number;
  rotation: number;
}

export function generateAbstractPattern(color: string): AbstractLogoPattern {
  const pattern = getRandomPattern();
  const opacity = 0.8 + Math.random() * 0.2; // 0.8-1.0
  const scale = 0.8 + Math.random() * 0.4; // 0.8-1.2
  const rotation = Math.random() * 360;
  
  return {
    pattern,
    colorScheme: {
      primary: color,
      secondary: color,
      accent: color,
    },
    opacity,
    scale,
    rotation,
  };
}