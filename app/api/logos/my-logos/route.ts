import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoConnect";
import { Logo } from "@/lib/db/models/Logo";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const logos = await Logo.find({ clerkId: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(logos, { status: 200 });
  } catch (error) {
    console.error("Get logos error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}