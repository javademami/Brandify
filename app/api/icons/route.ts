import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), "public/icons");

    const categories = fs.readdirSync(iconsDir);

    const result: any = {};

    for (const category of categories) {
      const categoryPath = path.join(iconsDir, category);

      // فقط فولدرها رو بخون
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".svg"))
        .map((file) => file.replace(".svg", ""));

      result[category] = files;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load icons" }, { status: 500 });
  }
}