import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TEMPLATE_ROOT = path.join(
  process.cwd(),
  "public",
  "Custom",
  "badges",
  "cafe"
);

const PUBLIC_ROOT = "/Custom/badges/cafe";

export async function GET() {
  try {
    if (!fs.existsSync(TEMPLATE_ROOT)) {
      return NextResponse.json([]);
    }

    const files = fs
      .readdirSync(TEMPLATE_ROOT, {
        withFileTypes: true,
      })
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.toLowerCase().endsWith(".svg")
      )
      .map((entry) => entry.name)
      .sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

    const templates = files.map((fileName) => ({
      id: fileName
        .replace(/\.svg$/i, "")
        .toLowerCase()
        .replace(/[\s_\-]+/g, "-"),

      fileName,

      path: `${PUBLIC_ROOT}/${encodeURIComponent(fileName)}`,
    }));

    return NextResponse.json(templates, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "[Logo Templates API]",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load logo templates",
      },
      {
        status: 500,
      }
    );
  }
}