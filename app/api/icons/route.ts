import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type IconsResult = Record<string, string[]>;

export async function GET() {
  try {
    const iconsDir = path.join(
      process.cwd(),
      "public",
      "icons"
    );

    // بررسی وجود پوشه اصلی
    if (!fs.existsSync(iconsDir)) {
      console.error(
        "[/api/icons] Icons directory not found:",
        iconsDir
      );

      return NextResponse.json(
        {
          error: "Icons directory not found",
        },
        { status: 404 }
      );
    }

    const entries = fs.readdirSync(
      iconsDir,
      { withFileTypes: true }
    );

    const result: IconsResult = {};

    /*
     * فقط فولدرهای داخل public/icons
     *
     * مثال:
     *
     * public/icons/
     * ├── beauty/
     * ├── cafe/
     * ├── finance/
     * ├── gaming/
     * └── ...
     */
    const categories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) =>
        a.localeCompare(b)
      );

    for (const category of categories) {
      const categoryPath = path.join(
        iconsDir,
        category
      );

      /*
       * فقط فایل‌های SVG
       *
       * هم .svg و هم .SVG و ... قبول می‌شود.
       */
      const files = fs
        .readdirSync(
          categoryPath,
          { withFileTypes: true }
        )
        .filter((entry) => {
          if (!entry.isFile()) {
            return false;
          }

          return (
            path
              .extname(entry.name)
              .toLowerCase() === ".svg"
          );
        })
        .map((entry) => {
          /*
           * فقط نام فایل بدون .svg
           *
           * 1.svg       → 1
           * coffee.svg  → coffee
           */
          return path.parse(entry.name).name;
        })
        .sort((a, b) => {
          /*
           * اگر نام فایل عددی باشد:
           *
           * 1
           * 2
           * 3
           * 10
           *
           * نه:
           *
           * 1
           * 10
           * 2
           */
          const aNumber = Number(a);
          const bNumber = Number(b);

          const aIsNumber =
            Number.isFinite(aNumber);

          const bIsNumber =
            Number.isFinite(bNumber);

          if (
            aIsNumber &&
            bIsNumber
          ) {
            return aNumber - bNumber;
          }

          if (aIsNumber) return -1;
          if (bIsNumber) return 1;

          return a.localeCompare(b);
        });

      /*
       * حتی اگر یک فولدر خالی باشد،
       * category در خروجی باقی می‌ماند.
       *
       * مثال:
       * {
       *   "beauty": [],
       *   "cafe": ["1", "2"]
       * }
       */
      result[category] = files;
    }

    console.log(
      `[/api/icons] Loaded ${categories.length} icon categories`
    );

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error(
      "[/api/icons] Failed to load icons:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load icons",
      },
      { status: 500 }
    );
  }
}