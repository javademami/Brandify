import type {
  LogoConfig,
  GenerateInput,
} from "./generator";

import {
  isDark,
  type Palette,
} from "./palettes";

/*
|--------------------------------------------------------------------------
| V2 Result
|--------------------------------------------------------------------------
*/

export interface LogoEngineV2Result {
  logo: LogoConfig;
  templateId: string;
}

/*
|--------------------------------------------------------------------------
| V2 Template
|--------------------------------------------------------------------------
|
| These objects are generated automatically by:
|
| /api/logo-templates
|
*/

export interface V2Template {
  id: string;
  fileName: string;
  path: string;
}

/*
|--------------------------------------------------------------------------
| Template Root
|--------------------------------------------------------------------------
|
| Kept here only as documentation/reference.
|
| The actual path comes from the discovered template object.
|
*/

const TEMPLATE_ROOT =
  "/Custom/badges/cafe";

/*
|--------------------------------------------------------------------------
| Industry Normalization
|--------------------------------------------------------------------------
*/

function normalizeIndustry(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[\s_\-]+/g,
      "");
}

/*
|--------------------------------------------------------------------------
| Cafe Keywords
|--------------------------------------------------------------------------
*/

const CAFE_KEYWORDS = [
  "cafe",
  "cafes",
  "coffee",
  "coffeeshop",
];

/*
|--------------------------------------------------------------------------
| Is Cafe
|--------------------------------------------------------------------------
*/

function isCafe(
  industry: string
): boolean {
  if (!industry) {
    return false;
  }

  const key =
    normalizeIndustry(industry);

  return CAFE_KEYWORDS.some(
    (keyword) =>
      key.includes(keyword)
  );
}

/*
|--------------------------------------------------------------------------
| Has V2 Template
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This function checks whether the industry
| supports V2.
|
| It does NOT check the filesystem.
|
| The actual SVG list is supplied later
| by generateLogos().
|
*/

export function hasV2Template(
  industry: string
): boolean {
  return isCafe(industry);
}

/*
|--------------------------------------------------------------------------
| Normalize Year
|--------------------------------------------------------------------------
|
| Examples:
|
| undefined -> 1991
| ""        -> 1991
| 2026      -> 2026
| 26        -> 0026
|
*/

function normalizeYear(
  value: unknown
): string {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return "1991";
  }

  const digits =
    String(value).replace(
      /\D/g,
      ""
    );

  if (!digits) {
    return "1991";
  }

  return digits
    .slice(-4)
    .padStart(4, "0");
}

/*
|--------------------------------------------------------------------------
| Create V2 Logo
|--------------------------------------------------------------------------
*/

export function createV2Logo(
  input: GenerateInput,
  index: number,
  totalCount: number,
  palette: Palette,
  templates: V2Template[]
): LogoEngineV2Result | null {

  /*
   * Only Cafe gets V2.
   */
  if (
    !hasV2Template(
      input.industry
    )
  ) {
    return null;
  }

  /*
   * No SVG templates available.
   */
  if (!templates.length) {
    console.warn(
      "[LogoEngine V2] No Cafe SVG templates found."
    );

    return null;
  }

  /*
   * Automatically select template.
   *
   * Example:
   *
   * 0 -> template 0
   * 1 -> template 1
   * 2 -> template 2
   * 3 -> template 0
   */
  const template =
    templates[
      index % templates.length
    ];

  if (!template) {
    return null;
  }

  /*
   * Actual filename.
   */
  const templateId =
    template.fileName;

  /*
   * Determine text color.
   */
  const dark =
    isDark(palette.bg);

  const textColor = dark
    ? "#ffffff"
    : "#1a1a1a";

  /*
   * Year.
   */
  const yearStr =
    normalizeYear(
      input.year
    );

  const yearLeft =
    yearStr.slice(0, 2);

  const yearRight =
    yearStr.slice(2, 4);

  /*
   * Brand data.
   */
  const name =
    input.name?.trim() ||
    "COFFEE";

  const slogan =
    input.slogan?.trim() ||
    "";

  /*
   * Create LogoConfig.
   */
  const logo: LogoConfig = {

    /*
     * Basic information
     */
    name,

    slogan,

    /*
     * IMPORTANT:
     *
     * This is now the automatically discovered
     * SVG path.
     */
    iconPath:
      template.path,

    /*
     * Palette
     */
    palette,

    /*
     * Layout
     */
    layout: "badge",

    /*
     * Typography
     */
    fontName: "Georgia",

    fontFamily:
      "Georgia, serif",

    fontSize: 40,

    fontWeight: "700",

    letterSpacing:
      "0.04em",

    textTransform:
      "uppercase",

    /*
     * Shape
     */
    borderRadius:
      "0px",

    /*
     * Colors
     */
    textColor,

    iconColor:
      palette.accent ||
      "#d4af37",

    background:
      palette.bg,

    /*
     * Effects
     */
    effect: "shadow",

    decoration: "none",

    decorationColor:
      palette.accent,

    textDecoration:
      "none",

    /*
     * Font metadata
     */
    fontStyle:
      "luxury",

    fontCategory:
      "serif",

    frameStyle:
      "none",

    sloganFont:
      "Arial, sans-serif",

    /*
     * Logo types
     */
    isMonogram: false,

    isAbstract: false,

    isRestaurant: false,

    /*
     * V2
     */
    isV2: true,

    /*
     * Stable V2 template ID.
     */
    v2TemplateId:
      `badge-cafe-${template.fileName
        .toLowerCase()
        .replace(
          /\.svg$/i,
          ""
        )
        .replace(
          /[\s_\-]+/g,
          "-"
        )}`,

    /*
     * Version
     */
    v2TemplateVersion:
      4,

    /*
     * Current template index
     */
    v2TemplateIndex:
      index,

    /*
     * Number of V2 templates
     */
    v2TemplateCount:
      templates.length,

    /*
     * Custom properties
     *
     * Used by V2LogoView.
     */
    customProps: {
      name,
      slogan,
      yearLeft,
      yearRight,
    },

    /*
     * Compatibility with renderers
     * that expect customStyles.logoProps.
     */
    customStyles: {
      logoProps: {
        name,
        slogan,
        yearLeft,
        yearRight,
      },
    },
  };

  return {
    logo,
    templateId,
  };
}