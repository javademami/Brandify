import { NextResponse } from "next/server";
import { generateLogos } from "@/lib/generator";

export async function POST(req: Request) {
  try {
    const { name, slogan, industry } = await req.json();
    if (!name || !industry) return NextResponse.json({ error: "name and industry required" }, { status: 400 });
    const logos = generateLogos({ name, slogan, industry }, 6);
    return NextResponse.json(logos);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}