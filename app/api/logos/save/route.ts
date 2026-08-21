import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoConnect";
import { Logo } from "@/lib/db/models/Logo";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slogan, industry, logoData } = await req.json();

    if (!name || !industry || !logoData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const logo = await Logo.create({
      clerkId: userId,
      name,
      slogan,
      industry,
      logoData,
    });

    return NextResponse.json(
      { message: "Logo saved successfully", logo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save logo error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}