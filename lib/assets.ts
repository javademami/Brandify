// ================= ICON MAP (LARGE SET) =================
export const iconMap: Record<string, string[]> = {
  technology: [
    "cpu","server","database","hard-drive","wifi","bluetooth","cloud","cloud-cog",
    "rocket","zap","circuit-board","binary","code","terminal","smartphone",
    "laptop","tablet","monitor","router","battery","radar","satellite",
    "scan","git-branch","shield-check","layers","box","globe","lock",
  ],
  startup: [
    "rocket","zap","trending-up","lightbulb","target","star","sparkles",
    "compass","flag","trophy","medal","award","crown","bolt","flame",
  ],
  ai: [
    "brain","cpu","circuit-board","binary","bot","sparkles","zap","eye",
    "network","layers","infinity","code","terminal","radar","satellite",
  ],
  crypto: [
    "bitcoin","coins","wallet","shield","lock","key","link","globe",
    "trending-up","bar-chart","database","server","layers","infinity",
  ],
  food: [
    "coffee","cup-soda","beer","wine","glass-water","utensils","utensils-crossed",
    "chef-hat","pizza","ice-cream","sandwich","cookie","cake","croissant",
    "egg","apple","carrot","fish","flame","leaf","sprout","milk",
  ],
  cafe: [
    "coffee","cup-soda","bean","leaf","sun","moon","star","sparkles",
    "heart","flame","droplets","wind",
  ],
  restaurant: [
    "utensils","utensils-crossed","chef-hat","pizza","flame","wine","beer",
    "apple","egg","fish","star","crown",
  ],
  fashion: [
    "shirt","scissors","sparkles","gem","diamond","star","palette",
    "brush","paintbrush","wand-2","flower","feather","crown","sun","moon",
  ],
  beauty: [
    "sparkles","heart","flower","gem","star","palette","brush","wand-2",
    "feather","sun","moon","droplets","leaf","smile",
  ],
  luxury: [
    "crown","gem","diamond","star","sparkles","award","medal","trophy",
    "shield","feather","sun","moon","compass","infinity",
  ],
  finance: [
    "wallet","credit-card","banknote","coins","badge-dollar-sign","piggy-bank",
    "receipt","calculator","trending-up","line-chart","bar-chart","pie-chart",
    "shield","shield-check","lock","key","scale","landmark","percent",
  ],
  banking: [
    "landmark","shield","lock","key","credit-card","banknote","wallet",
    "trending-up","bar-chart","scale","coins","percent",
  ],
  investment: [
    "trending-up","bar-chart","line-chart","pie-chart","coins","banknote",
    "target","trophy","award","shield-check","globe","compass",
  ],
  fitness: [
    "dumbbell","activity","heart-pulse","flame","zap","target","trophy",
    "medal","award","timer","running","bicycle","mountain",
  ],
  sports: [
    "trophy","medal","award","target","flag","star","crown","shield",
    "zap","flame","activity","heart-pulse",
  ],
  education: [
    "graduation-cap","book","book-open","bookmark","pen","pencil","lightbulb",
    "brain","star","award","globe","compass","telescope","microscope",
  ],
  realestate: [
    "home","building","building-2","map-pin","key","door-open","layers",
    "map","compass","star","shield","landmark",
  ],
  health: [
    "heart","heart-pulse","activity","cross","stethoscope","pill","syringe",
    "microscope","eye","brain","leaf","shield-check","plus",
  ],
  medical: [
    "cross","stethoscope","heart-pulse","pill","syringe","microscope",
    "eye","brain","shield-check","activity","plus","hospital",
  ],
  travel: [
    "plane","ship","train","car","compass","map","map-pin","globe",
    "mountain","sun","moon","star","camera","backpack",
  ],
  hotel: [
    "hotel","building","star","crown","key","bed","coffee","wine",
    "sparkles","sun","moon","compass","map-pin",
  ],
  ecommerce: [
    "shopping-cart","shopping-bag","package","box","tag","store","credit-card",
    "truck","gift","star","heart","zap","badge-percent",
  ],
  retail: [
    "store","shopping-bag","tag","package","box","credit-card","gift",
    "star","sparkles","badge-percent","heart",
  ],
  media: [
    "play","video","camera","film","mic","radio","tv","monitor",
    "music","headphones","speaker","globe","star","zap",
  ],
  music: [
    "music","music-2","headphones","mic","speaker","radio","disc",
    "play","heart","star","sparkles","wave",
  ],
  gaming: [
    "gamepad","gamepad-2","joystick","controller","sword","shield","star",
    "zap","flame","trophy","crown","gem","target","rocket",
  ],
  general: [
    "star","sparkles","sun","moon","globe","map","map-pin","compass","flag",
    "thumbs-up","heart","smile","party-popper","trophy","medal","gift",
    "diamond","crown","rocket","zap","flame","shield",
  ],
};

// ================= FONT MAP =================
export const fontMap: Record<string, string[]> = {
  Modern: ["Inter", "Poppins", "DM Sans"],
  Minimal: ["Inter", "DM Sans", "Outfit"],
  Bold: ["Poppins", "Montserrat", "Nunito"],
  Elegant: ["Georgia", "Playfair Display", "Merriweather"],
  Playful: ["Poppins", "Nunito", "Fredoka One"],
  Friendly: ["Poppins", "Nunito", "DM Sans"],
};

// ================= COLOR MAP =================
export const colorMap: Record<string, string[]> = {
  Modern: ["#2563eb", "#0ea5e9", "#6366f1"],
  Minimal: ["#111111", "#555555", "#888888"],
  Bold: ["#dc2626", "#000000", "#ea580c"],
  Elegant: ["#d4af37", "#111111", "#b8860b"],
  Playful: ["#f59e0b", "#ec4899", "#22c55e", "#8b5cf6"],
  Friendly: ["#22c55e", "#3b82f6", "#06b6d4"],
};

// ================= LAYOUTS =================
export const layouts = [
  "iconTop",
  "iconLeft",
  "badge",
  "textOnly",
  "iconBig",
];