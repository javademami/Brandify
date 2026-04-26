export const designSystem: Record<string, any> = {
  Modern: {
    fonts: ["Inter", "Poppins", "DM Sans"],
    colors: ["#2563eb", "#0ea5e9", "#6366f1", "#0f172a"],
    bgStyles: [
      { type: "solid", value: "#0f172a" },
      { type: "gradient", value: ["#1e3a8a", "#2563eb"] },
      { type: "gradient", value: ["#0f172a", "#1e40af"] },
      { type: "solid", value: "#f8fafc" },
    ],
    textColors: ["#ffffff", "#f1f5f9", "#111827"],
    layouts: ["iconTop", "iconLeft", "iconBig", "badge"],
    fontWeights: ["700", "800"],
    borderRadius: ["12px", "16px", "20px"],
  },

  Minimal: {
    fonts: ["Inter", "DM Sans", "Outfit"],
    colors: ["#111111", "#374151", "#6b7280"],
    bgStyles: [
      { type: "solid", value: "#ffffff" },
      { type: "solid", value: "#f9fafb" },
      { type: "solid", value: "#f3f4f6" },
      { type: "solid", value: "#111111" },
    ],
    textColors: ["#111111", "#1f2937", "#ffffff"],
    layouts: ["iconLeft", "textOnly", "iconTop"],
    fontWeights: ["400", "500", "600"],
    borderRadius: ["8px", "4px", "0px"],
  },

  Bold: {
    fonts: ["Poppins", "Montserrat", "Nunito"],
    colors: ["#dc2626", "#ea580c", "#d97706", "#000000"],
    bgStyles: [
      { type: "solid", value: "#000000" },
      { type: "solid", value: "#dc2626" },
      { type: "gradient", value: ["#dc2626", "#7c3aed"] },
      { type: "gradient", value: ["#000000", "#dc2626"] },
    ],
    textColors: ["#ffffff", "#fef2f2", "#fbbf24"],
    layouts: ["iconLeft", "iconBig", "badge", "iconTop"],
    fontWeights: ["800", "900"],
    borderRadius: ["8px", "0px", "16px"],
  },

  Elegant: {
    fonts: ["Georgia", "Playfair Display", "Merriweather"],
    colors: ["#d4af37", "#b8860b", "#111111", "#5c4a1e"],
    bgStyles: [
      { type: "solid", value: "#111111" },
      { type: "gradient", value: ["#1a1a1a", "#2d2d2d"] },
      { type: "solid", value: "#fafaf0" },
      { type: "gradient", value: ["#2c1810", "#5c3d2e"] },
    ],
    textColors: ["#d4af37", "#ffffff", "#f5e6c8", "#111111"],
    layouts: ["iconTop", "textOnly", "badge", "iconLeft"],
    fontWeights: ["400", "700"],
    borderRadius: ["4px", "0px", "50px"],
  },

  Playful: {
    fonts: ["Poppins", "Nunito", "Fredoka One"],
    colors: ["#f59e0b", "#ec4899", "#22c55e", "#8b5cf6", "#06b6d4"],
    bgStyles: [
      { type: "gradient", value: ["#f59e0b", "#ec4899"] },
      { type: "gradient", value: ["#8b5cf6", "#06b6d4"] },
      { type: "solid", value: "#fef3c7" },
      { type: "gradient", value: ["#22c55e", "#06b6d4"] },
      { type: "solid", value: "#fdf2f8" },
    ],
    textColors: ["#ffffff", "#1f2937", "#111827"],
    layouts: ["iconTop", "badge", "iconBig", "iconLeft"],
    fontWeights: ["700", "800"],
    borderRadius: ["24px", "32px", "999px"],
  },

  Friendly: {
    fonts: ["Poppins", "Nunito", "DM Sans"],
    colors: ["#22c55e", "#3b82f6", "#06b6d4", "#10b981"],
    bgStyles: [
      { type: "gradient", value: ["#22c55e", "#3b82f6"] },
      { type: "solid", value: "#ecfdf5" },
      { type: "gradient", value: ["#06b6d4", "#3b82f6"] },
      { type: "solid", value: "#eff6ff" },
    ],
    textColors: ["#ffffff", "#064e3b", "#1e3a8a"],
    layouts: ["iconTop", "iconLeft", "badge"],
    fontWeights: ["600", "700"],
    borderRadius: ["16px", "20px", "12px"],
  },
};

// Industry-specific color overrides
export const industryColorOverrides: Record<string, Partial<typeof designSystem["Modern"]>> = {
  finance: {
    bgStyles: [
      { type: "solid", value: "#0f2027" },
      { type: "gradient", value: ["#0f2027", "#203a43"] },
      { type: "solid", value: "#1a1a2e" },
    ],
    colors: ["#d4af37", "#22c55e", "#ffffff"],
  },
  luxury: {
    bgStyles: [
      { type: "solid", value: "#0a0a0a" },
      { type: "gradient", value: ["#1a1a1a", "#000000"] },
    ],
    colors: ["#d4af37", "#c9a96e"],
  },
  health: {
    bgStyles: [
      { type: "solid", value: "#f0fdf4" },
      { type: "gradient", value: ["#dcfce7", "#bbf7d0"] },
    ],
    colors: ["#16a34a", "#15803d"],
    textColors: ["#14532d", "#166534"],
  },
  gaming: {
    bgStyles: [
      { type: "gradient", value: ["#0f0f1a", "#1a0533"] },
      { type: "solid", value: "#0a0a1a" },
    ],
    colors: ["#a855f7", "#06b6d4", "#ec4899"],
    textColors: ["#e879f9", "#ffffff", "#67e8f9"],
  },
  food: {
    bgStyles: [
      { type: "solid", value: "#fff7ed" },
      { type: "gradient", value: ["#fef3c7", "#fde68a"] },
      { type: "solid", value: "#fefce8" },
    ],
    colors: ["#ea580c", "#d97706", "#dc2626"],
    textColors: ["#7c2d12", "#431407"],
  },
};