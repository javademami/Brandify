import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"; // اضافه شد
import { 
  Geist, Geist_Mono, Playfair_Display, Montserrat, Cormorant_Garamond, 
  Poppins, Raleway, Bebas_Neue, DM_Sans, Outfit, Space_Mono, Syne, 
  Cinzel, Bodoni_Moda, Manrope, Caveat, Tangerine, Great_Vibes, 
  Dancing_Script, Pacifico, Fredoka, Oswald, Righteous, Lora, 
  Cinzel_Decorative, Space_Grotesk, Sacramento 
} from "next/font/google";
import "./fonts.css";
import "./globals.css";
 
// فونت‌های پیش‌فرض سیستم
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
 
// فونت‌های دکوراتیو و فانتزی لوگوساز
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "700", "900"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "700", "900"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "600", "700"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "700", "900"] });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["400", "700", "900"] });
const bebas = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: ["400"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "600", "700"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["400", "700", "800"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["400", "700"] });
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], weight: ["400", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "700"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: ["400", "700"] });
const tangerine = Tangerine({ variable: "--font-tangerine", subsets: ["latin"], weight: ["400", "700"] });
const greatVibes = Great_Vibes({ variable: "--font-great-vibes", subsets: ["latin"], weight: ["400"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], weight: ["400", "700"] });
const pacifico = Pacifico({ variable: "--font-pacifico", subsets: ["latin"], weight: ["400"] });
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["400", "600", "700"] });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], weight: ["400", "700"] });
const righteous = Righteous({ variable: "--font-righteous", subsets: ["latin"], weight: ["400"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], weight: ["400", "700"] });
const cinzelDeco = Cinzel_Decorative({ variable: "--font-cinzel-deco", subsets: ["latin"], weight: ["400", "700", "900"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["400", "600", "700"] });
const sacramento = Sacramento({ variable: "--font-sacramento", subsets: ["latin"], weight: ["400"] });
 
export const metadata: Metadata = {
  title: "Brandify - Design your own beautiful brand",
  description: "AI-powered logo generator",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`
          ${geistSans.variable} ${geistMono.variable} ${playfair.variable} 
          ${montserrat.variable} ${cormorant.variable} ${poppins.variable} 
          ${raleway.variable} ${bebas.variable} ${dmSans.variable} 
          ${outfit.variable} ${spaceMono.variable} ${syne.variable} 
          ${cinzel.variable} ${bodoni.variable} ${manrope.variable} 
          ${caveat.variable} ${tangerine.variable} ${greatVibes.variable} 
          ${dancing.variable} ${pacifico.variable} ${fredoka.variable} 
          ${oswald.variable} ${righteous.variable} ${lora.variable} 
          ${cinzelDeco.variable} ${spaceGrotesk.variable} ${sacramento.variable}
          h-full antialiased
        `}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
