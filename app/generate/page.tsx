"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import LogoView from "@/components/LogoView";
import MonogramLogoView from "@/components/MonogramLogoView";
import RestaurantLogoView from "@/components/Restaurantlogoview";

import { generateLogos, type LogoConfig } from "@/lib/generator";
import { inspoLogos } from "@/lib/inspoLogos";
import AccountHeader from "@/components/AccountHeader";

/* =========================================================
   INDUSTRIES
========================================================= */

const INDUSTRIES = [
  "Technology",
  "AI & Machine Learning",
  "Startup",
  "Crypto & Web3",
  "Restaurant",
  "Cafe & Coffee",
  "Food & Beverage",
  "Fashion",
  "Beauty & Wellness",
  "Luxury",
  "Finance",
  "Banking",
  "Investment",
  "Fitness & Gym",
  "Sports",
  "Education",
  "Real Estate",
  "Health & Medical",
  "Travel & Hotel",
  "Gaming",
  "Music",
  "Media & Content",
  "Online Learning",
  "Construction",
];

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  {
    name: "Blue",
    a: "#1d4ed8",
    b: "#93c5fd",
  },
  {
    name: "Purple",
    a: "#7c3aed",
    b: "#c4b5fd",
  },
  {
    name: "Pink",
    a: "#db2777",
    b: "#fbcfe8",
  },
  {
    name: "Red",
    a: "#dc2626",
    b: "#fca5a5",
  },
  {
    name: "Orange",
    a: "#ea580c",
    b: "#fdba74",
  },
  {
    name: "Yellow",
    a: "#ca8a04",
    b: "#fde68a",
  },
  {
    name: "Green",
    a: "#15803d",
    b: "#bbf7d0",
  },
  {
    name: "Teal",
    a: "#0f766e",
    b: "#99f6e4",
  },
  {
    name: "Gold",
    a: "#92400e",
    b: "#fef3c7",
  },
  {
    name: "Black",
    a: "#111111",
    b: "#6b7280",
  },
  {
    name: "Navy",
    a: "#1e3a8a",
    b: "#bfdbfe",
  },
  {
    name: "Gray",
    a: "#374151",
    b: "#e5e7eb",
  },
];

/* =========================================================
   V2 TYPES
========================================================= */

type V2LogoProps = {
  logo: LogoConfig;
  selected?: boolean;
  onClick?: () => void;
};

/* =========================================================
   SVG CACHE
========================================================= */

const svgCache = new Map<string, string>();

/* =========================================================
   XML ESCAPE
========================================================= */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* =========================================================
   V2 SVG PLACEHOLDER REPLACER
========================================================= */

function replaceV2Placeholders(
  svg: string,
  logo: LogoConfig
): string {
  const data = logo as any;

  const customProps = data.customProps || {};

  const customStyles =
    data.customStyles || {};

  const logoProps =
    customStyles.logoProps || {};

  /*
   * NAME
   */

  const name =
    data.name ??
    customProps.name ??
    logoProps.name ??
    "BRAND NAME";

  /*
   * SLOGAN
   */

  const slogan =
    data.slogan ??
    customProps.slogan ??
    logoProps.slogan ??
    "";

  /*
   * YEAR
   */

  const yearLeft =
    customProps.yearLeft ??
    logoProps.yearLeft ??
    "";

  const yearRight =
    customProps.yearRight ??
    logoProps.yearRight ??
    "";

  /*
   * OTHER POSSIBLE VALUES
   */

  const year =
    customProps.year ??
    logoProps.year ??
    `${yearLeft}${yearRight}`;

  let result = svg;

  /* =======================================================
     BASIC LOGO VALUES
  ======================================================= */

  result = result.replace(
    /\$\{logo\.name\}/g,
    escapeXml(String(name))
  );

  result = result.replace(
    /\$\{logo\.slogan\}/g,
    escapeXml(String(slogan))
  );

  /* =======================================================
     CUSTOM PROPS
  ======================================================= */

  result = result.replace(
    /\$\{logo\.customProps\.name\}/g,
    escapeXml(String(name))
  );

  result = result.replace(
    /\$\{logo\.customProps\.slogan\}/g,
    escapeXml(String(slogan))
  );

  result = result.replace(
    /\$\{logo\.customProps\.year\}/g,
    escapeXml(String(year))
  );

  result = result.replace(
    /\$\{logo\.customProps\.yearLeft\}/g,
    escapeXml(String(yearLeft))
  );

  result = result.replace(
    /\$\{logo\.customProps\.yearRight\}/g,
    escapeXml(String(yearRight))
  );

  /* =======================================================
     OPTIONAL CHAIN
  ======================================================= */

  result = result.replace(
    /\$\{logo\.customProps\?\.name\}/g,
    escapeXml(String(name))
  );

  result = result.replace(
    /\$\{logo\.customProps\?\.slogan\}/g,
    escapeXml(String(slogan))
  );

  result = result.replace(
    /\$\{logo\.customProps\?\.year\}/g,
    escapeXml(String(year))
  );

  result = result.replace(
    /\$\{logo\.customProps\?\.yearLeft\}/g,
    escapeXml(String(yearLeft))
  );

  result = result.replace(
    /\$\{logo\.customProps\?\.yearRight\}/g,
    escapeXml(String(yearRight))
  );

  /* =======================================================
     CUSTOM STYLES
  ======================================================= */

  result = result.replace(
    /\$\{logo\.customStyles\.logoProps\.name\}/g,
    escapeXml(String(name))
  );

  result = result.replace(
    /\$\{logo\.customStyles\.logoProps\.slogan\}/g,
    escapeXml(String(slogan))
  );

  result = result.replace(
    /\$\{logo\.customStyles\.logoProps\.yearLeft\}/g,
    escapeXml(String(yearLeft))
  );

  result = result.replace(
    /\$\{logo\.customStyles\.logoProps\.yearRight\}/g,
    escapeXml(String(yearRight))
  );

  /* =======================================================
     OPTIONAL CUSTOM STYLES
  ======================================================= */

  result = result.replace(
    /\$\{logo\.customStyles\?\.logoProps\.name\}/g,
    escapeXml(String(name))
  );

  result = result.replace(
    /\$\{logo\.customStyles\?\.logoProps\.slogan\}/g,
    escapeXml(String(slogan))
  );

  result = result.replace(
    /\$\{logo\.customStyles\?\.logoProps\.yearLeft\}/g,
    escapeXml(String(yearLeft))
  );

  result = result.replace(
    /\$\{logo\.customStyles\?\.logoProps\.yearRight\}/g,
    escapeXml(String(yearRight))
  );

  /* =======================================================
     CLEAN UNKNOWN PLACEHOLDERS
  ======================================================= */

  result = result.replace(
    /\$\{logo\.[^}]+\}/g,
    ""
  );

  return result;
}

/* =========================================================
   V2 LOGO VIEW
========================================================= */

function V2LogoView({
  logo,
  selected = false,
  onClick,
}: V2LogoProps) {
  const [svgContent, setSvgContent] =
    useState<string>("");

  const [error, setError] =
    useState<string>("");

  const data = logo as any;

  useEffect(() => {
    let cancelled = false;

    async function loadSvg() {
      try {
        setError("");

        const path =
          data.iconPath;

        if (!path) {
          throw new Error(
            "V2 SVG iconPath is missing."
          );
        }

        /* =================================================
           CACHE
        ================================================= */

        if (svgCache.has(path)) {
          const cached =
            svgCache.get(path)!;

          if (!cancelled) {
            setSvgContent(
              replaceV2Placeholders(
                cached,
                logo
              )
            );
          }

          return;
        }

        /* =================================================
           FETCH SVG
        ================================================= */

        const response =
          await fetch(path, {
            cache: "no-store",
          });

        if (!response.ok) {
          throw new Error(
            `Unable to load SVG: ${response.status} ${response.statusText}`
          );
        }

        const rawSvg =
          await response.text();

        /* =================================================
           BASIC SVG VALIDATION
        ================================================= */

        if (
          !rawSvg
            .trim()
            .toLowerCase()
            .includes("<svg")
        ) {
          throw new Error(
            "The selected template is not a valid SVG file."
          );
        }

        /* =================================================
           CACHE RAW SVG
        ================================================= */

        svgCache.set(
          path,
          rawSvg
        );

        /* =================================================
           REPLACE VARIABLES
        ================================================= */

        const finalSvg =
          replaceV2Placeholders(
            rawSvg,
            logo
          );

        if (!cancelled) {
          setSvgContent(
            finalSvg
          );
        }

      } catch (err) {
        console.error(
          "V2LogoView SVG error:",
          err
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load SVG"
          );
        }
      }
    }

    loadSvg();

    return () => {
      cancelled = true;
    };

  }, [
    data.iconPath,
    data.name,
    data.slogan,
    data.customProps?.name,
    data.customProps?.slogan,
    data.customProps?.year,
    data.customProps?.yearLeft,
    data.customProps?.yearRight,
    data.customStyles?.logoProps?.name,
    data.customStyles?.logoProps?.slogan,
    data.customStyles?.logoProps?.yearLeft,
    data.customStyles?.logoProps?.yearRight,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    !svgContent &&
    !error
  ) {
    return (
      <div
        onClick={onClick}
        className="w-full h-full flex items-center justify-center"
        style={{
          background:
            data.background ||
            data.palette?.bg ||
            "#ffffff",

          cursor:
            onClick
              ? "pointer"
              : "default",

          border:
            selected
              ? "3px solid #6366f1"
              : "3px solid transparent",

          boxSizing:
            "border-box",
        }}
      >
        <div className="text-xs text-gray-400">
          Loading logo...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        onClick={onClick}
        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
        style={{
          background:
            data.background ||
            data.palette?.bg ||
            "#ffffff",

          cursor:
            onClick
              ? "pointer"
              : "default",

          border:
            selected
              ? "3px solid #6366f1"
              : "3px solid transparent",

          boxSizing:
            "border-box",
        }}
      >
        <div className="text-xs font-semibold text-red-500 mb-1">
          SVG Error
        </div>

        <div className="text-[10px] text-gray-500 break-all">
          {error}
        </div>
      </div>
    );
  }

  /* =======================================================
     FINAL SVG
  ======================================================= */

  return (
    <div
      onClick={onClick}
      className="w-full h-full relative overflow-hidden"
      style={{
        background:
          data.background ||
          data.palette?.bg ||
          "#ffffff",

        color:
          data.textColor ||
          data.palette?.text ||
          "#111111",

        cursor:
          onClick
            ? "pointer"
            : "default",

        border:
          selected
            ? "3px solid #6366f1"
            : "3px solid transparent",

        boxSizing:
          "border-box",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
        }}
        dangerouslySetInnerHTML={{
          __html:
            svgContent,
        }}
      />
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function GeneratePage() {

  const [step, setStep] =
    useState(1);

  const [name, setName] =
    useState("");

  const [slogan, setSlogan] =
    useState("");

  const [industry, setIndustry] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [likedInspo, setLikedInspo] =
    useState<number[]>([]);

  const [selectedColors, setSelectedColors] =
    useState<string[]>([]);

  const [logos, setLogos] =
    useState<LogoConfig[]>([]);

  const [displayCount, setDisplayCount] =
    useState(12);

  const [selectedLogo, setSelectedLogo] =
    useState<number | null>(null);

  const loadMoreRef =
    useRef<HTMLDivElement>(null);

  const router =
    useRouter();

  const progress =
    Math.round(
      (step / 7) * 100
    );

  /* =======================================================
     LOAD MORE
  ======================================================= */

  useEffect(() => {

    const observer =
      new IntersectionObserver(
        (entries) => {

          if (
            entries[0].isIntersecting &&
            displayCount < logos.length
          ) {
            setDisplayCount(
              (prev) =>
                Math.min(
                  prev + 12,
                  logos.length
                )
            );
          }

        },
        {
          threshold: 0.1,
        }
      );

    if (
      loadMoreRef.current
    ) {
      observer.observe(
        loadMoreRef.current
      );
    }

    return () => {
      observer.disconnect();
    };

  }, [
    logos.length,
    displayCount,
  ]);

  /* =======================================================
     OPEN EDITOR
  ======================================================= */

  function goToEditor(
    logoIndex?: number
  ) {

    const index =
      logoIndex ??
      selectedLogo;

    if (
      index === null ||
      index === undefined
    ) {
      return;
    }

    const logo =
      logos[index];

    router.push(
      `/editor?data=${encodeURIComponent(
        JSON.stringify(logo)
      )}`
    );
  }

  /* =======================================================
     GENERATE
  ======================================================= */

  function generateResult(
    count = 100
  ) {

    const generated =
      generateLogos(
        {
          name,
          slogan,
          industry,
        },
        count
      );

    setLogos(
      generated
    );

    setDisplayCount(
      Math.min(
        20,
        generated.length
      )
    );

    setSelectedLogo(
      null
    );
  }

  /* =======================================================
     STEP NAVIGATION
  ======================================================= */

  function goTo(
    n: number
  ) {

    if (n === 7) {
      generateResult(
        100
      );
    }

    setStep(n);

    window.scrollTo(
      0,
      0
    );
  }

  /* =======================================================
     INDUSTRY FILTER
  ======================================================= */

  const filtered =
    search
      ? INDUSTRIES.filter(
          (item) =>
            item
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        )
      : INDUSTRIES;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      {/* =================================================
          HEADER
      ================================================= */}

      <AccountHeader />

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="border-b border-gray-100">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">

          <span className="text-xs font-medium text-gray-400">
            Step {step} of 7
          </span>

          <div className="h-1 w-40 rounded-full bg-gray-100 sm:w-56">

            <div
              className="h-1 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className={
          step === 7
            ? "max-w-6xl mx-auto px-6 py-10"
            : "max-w-lg mx-auto px-4 py-10"
        }
      >

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (

          <div className="flex flex-col gap-8">

            <div className="text-center">

              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Design your own beautiful brand
              </h1>

              <p className="text-gray-400 text-sm">
                Use our AI-powered platform
                to design a logo and brand
                you love.
              </p>

            </div>

            <div className="flex flex-col gap-3">

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Brand name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400"
              />

              <button
                onClick={() =>
                  goTo(2)
                }
                disabled={
                  !name.trim()
                }
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium disabled:opacity-40 hover:bg-indigo-700"
              >
                Get started →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (

          <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">

              <button
                onClick={() =>
                  goTo(1)
                }
                className="text-sm text-gray-400"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  goTo(3)
                }
                disabled={
                  !industry
                }
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm disabled:opacity-40"
              >
                Continue →
              </button>

            </div>

            <div>

              <h2 className="text-xl font-medium">
                Pick your industry
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Knowing your industry helps
                us pick symbols, colors,
                and more.
              </p>

            </div>

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Restaurant, Consulting, Beauty, Photography, Fitness..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />

            <div className="flex flex-wrap gap-2">

              {filtered.map(
                (ind) => (

                  <button
                    key={ind}
                    onClick={() =>
                      setIndustry(
                        ind
                      )
                    }
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                      industry === ind
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-gray-200 text-gray-500 hover:border-indigo-300"
                    }`}
                  >
                    {ind}
                  </button>

                )
              )}

            </div>

          </div>
        )}

        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (

          <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">

              <button
                onClick={() =>
                  goTo(2)
                }
                className="text-sm text-gray-400"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  goTo(4)
                }
                className="text-sm text-gray-400 underline"
              >
                Skip →
              </button>

            </div>

            <div>

              <h2 className="text-xl font-medium">
                Pick some logos you like
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                We'll use these as inspiration.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              {inspoLogos.map(
                (logo, i) => (

                  <div
                    key={i}
                    onClick={() =>
                      setLikedInspo(
                        (prev) =>
                          prev.includes(i)
                            ? prev.filter(
                                (x) =>
                                  x !== i
                              )
                            : [
                                ...prev,
                                i,
                              ]
                      )
                    }
                    className="rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      border:
                        likedInspo.includes(
                          i
                        )
                          ? "2.5px solid #6366f1"
                          : "1.5px solid #e5e7eb",
                    }}
                  >

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          logo.svg,
                      }}
                    />

                    <div className="text-xs text-center py-1.5 text-gray-400 border-t border-gray-100">
                      {logo.name}
                    </div>

                  </div>

                )
              )}

            </div>

            <button
              onClick={() =>
                goTo(4)
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700"
            >
              Continue →
            </button>

          </div>
        )}

        {/* =================================================
            STEP 4
        ================================================= */}

        {step === 4 && (

          <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">

              <button
                onClick={() =>
                  goTo(3)
                }
                className="text-sm text-gray-400"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  goTo(5)
                }
                className="text-sm text-gray-400 underline"
              >
                Skip →
              </button>

            </div>

            <div>

              <h2 className="text-xl font-medium">
                Pick some colors you like
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Colors help convey emotion
                in your logo.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {COLORS.map(
                (c) => (

                  <div
                    key={c.name}
                    onClick={() =>
                      setSelectedColors(
                        (prev) =>
                          prev.includes(
                            c.name
                          )
                            ? prev.filter(
                                (x) =>
                                  x !==
                                  c.name
                              )
                            : [
                                ...prev,
                                c.name,
                              ]
                      )
                    }
                    className="h-16 rounded-xl cursor-pointer flex items-end overflow-hidden"
                    style={{
                      background:
                        `linear-gradient(135deg,${c.a},${c.b})`,

                      border:
                        selectedColors.includes(
                          c.name
                        )
                          ? "3px solid #6366f1"
                          : "2px solid transparent",

                      transform:
                        selectedColors.includes(
                          c.name
                        )
                          ? "scale(1.04)"
                          : "scale(1)",

                      transition:
                        "all 0.15s",
                    }}
                  >

                    <span
                      className="text-xs font-semibold px-2 py-1 w-full text-white"
                      style={{
                        background:
                          "rgba(0,0,0,0.3)",
                      }}
                    >
                      {c.name}
                    </span>

                  </div>

                )
              )}

            </div>

            <button
              onClick={() =>
                goTo(5)
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700"
            >
              Continue →
            </button>

          </div>
        )}

        {/* =================================================
            STEP 5
        ================================================= */}

        {step === 5 && (

          <div className="flex flex-col gap-6">

            <div className="flex justify-between items-center">

              <button
                onClick={() =>
                  goTo(4)
                }
                className="text-sm text-gray-400"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  goTo(6)
                }
                disabled={
                  !name.trim()
                }
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm disabled:opacity-40"
              >
                Continue →
              </button>

            </div>

            <div>

              <h2 className="text-xl font-medium">
                Enter your company name
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                You can always change these later
              </p>

            </div>

            <div className="flex flex-col gap-4">

              <div>

                <label className="text-xs text-gray-400 mb-1 block">
                  Company Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Brandify"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400"
                />

              </div>

              <div>

                <label className="text-xs text-gray-400 mb-1 block">
                  Slogan (optional)
                </label>

                <input
                  value={slogan}
                  onChange={(e) =>
                    setSlogan(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Build your brand"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400"
                />

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 6
        ================================================= */}

        {step === 6 && (

          <div className="flex flex-col gap-5">

            <div className="flex justify-between items-center">

              <button
                onClick={() =>
                  goTo(5)
                }
                className="text-sm text-gray-400"
              >
                ← Back
              </button>

              <button
                onClick={() =>
                  goTo(7)
                }
                className="text-sm text-gray-400 underline"
              >
                Skip →
              </button>

            </div>

            <div>

              <h2 className="text-xl font-medium">
                Pick some symbol types
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                We've hand-curated symbols
                for these types.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {[
                "Restaurant",
                "Food",
                "Food Truck",
                "Meal",
                "Organic",
                "Drink",
                "Food Shop",
                "Pizza",
                "Eat",
                "Flame",
                "Desserts",
                "Ice Cream",
                "Snacks",
                "Abstract",
                "Innovation",
                "Strength",
                "Excellence",
                "Tranquility",
                "Creativity",
                "Technology",
                "Nature",
                "Minimal",
                "Bold",
                "Geometric",
              ].map(
                (sym) => (

                  <button
                    key={sym}
                    className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {sym}
                  </button>

                )
              )}

            </div>

            <p className="text-xs text-indigo-500 cursor-pointer">
              I want to pick my own symbol →
            </p>

            <button
              onClick={() =>
                goTo(7)
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700"
            >
              Generate logos →
            </button>

          </div>
        )}

        {/* =================================================
            STEP 7
        ================================================= */}

        {step === 7 && (

          <div className="flex flex-col gap-5">

            {/* TOP */}

            <div className="flex justify-between items-center">

              <div>

                <p className="text-xs text-gray-400">
                  {industry}
                </p>

                <h2 className="text-xl font-medium">
                  {name}
                </h2>

              </div>

              <div className="flex gap-2 text-xs text-gray-400">

                <button
                  type="button"
                  className="cursor-pointer border border-gray-200 px-3 py-1.5 rounded-lg"
                  onClick={() =>
                    generateResult(
                      100
                    )
                  }
                >
                  ↺ Symbols
                </button>

                <button
                  type="button"
                  className="cursor-pointer border border-gray-200 px-3 py-1.5 rounded-lg"
                  onClick={() =>
                    generateResult(
                      100
                    )
                  }
                >
                  ↺ Layouts
                </button>

              </div>

            </div>

            <p className="text-xs text-gray-400">
              Pick a design and customize it
            </p>

            {/* =================================================
                LOGO GRID
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

              {logos
                .slice(
                  0,
                  displayCount
                )
                .map(
                  (logo, i) => (

                    <div
                      key={`${logo.v2TemplateId || logo.iconPath}-${i}`}
                      className="flex flex-col gap-3"
                    >

                      <div
                        style={{
                          height:
                            "280px",

                          borderRadius:
                            logo.borderRadius ||
                            "0px",

                          overflow:
                            "hidden",

                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      >

                        {/* =================================================
                            V2
                        ================================================= */}

                        {(logo as any)
                          .isV2 ? (

                          <V2LogoView
                            logo={logo}
                            selected={
                              selectedLogo ===
                              i
                            }
                            onClick={() =>
                              setSelectedLogo(
                                i
                              )
                            }
                          />

                        ) : logo.isRestaurant ? (

                          /* =================================================
                             RESTAURANT
                          ================================================= */

                          <RestaurantLogoView
                            logo={
                              logo
                            }
                            selected={
                              selectedLogo ===
                              i
                            }
                            onClick={() =>
                              setSelectedLogo(
                                i
                              )
                            }
                          />

                        ) : logo.isMonogram ? (

                          /* =================================================
                             MONOGRAM
                          ================================================= */

                          <MonogramLogoView
                            logo={
                              logo
                            }
                            selected={
                              selectedLogo ===
                              i
                            }
                            onClick={() =>
                              setSelectedLogo(
                                i
                              )
                            }
                          />

                        ) : (

                          /* =================================================
                             NORMAL
                          ================================================= */

                          <LogoView
                            logo={
                              logo
                            }
                            selected={
                              selectedLogo ===
                              i
                            }
                            onClick={() =>
                              setSelectedLogo(
                                i
                              )
                            }
                          />

                        )}

                      </div>

                      {/* =================================================
                          CUSTOMIZE
                      ================================================= */}

                      <button
                        onClick={() =>
                          goToEditor(
                            i
                          )
                        }
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Customize
                      </button>

                    </div>

                  )
                )}

            </div>

            {/* =================================================
                LOAD MORE
            ================================================= */}

            {displayCount <
              logos.length && (

              <div
                ref={
                  loadMoreRef
                }
                className="flex justify-center py-8"
              >

                <button
                  onClick={() =>
                    setDisplayCount(
                      (prev) =>
                        Math.min(
                          prev + 12,
                          logos.length
                        )
                    )
                  }
                  className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Load more logos
                </button>

              </div>

            )}

            {/* =================================================
                REGENERATE
            ================================================= */}

            <button
              onClick={() =>
                generateResult(
                  48
                )
              }
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              ↺ Regenerate Designs
            </button>

          </div>
        )}

      </div>

    </div>
  );
}