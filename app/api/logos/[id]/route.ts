import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoConnect";
import { Logo } from "@/lib/db/models/Logo";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const logo = await Logo.findById(id);

    if (!logo) {
      return NextResponse.json(
        { error: "Logo not found" },
        { status: 404 }
      );
    }

    if (logo.clerkId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await Logo.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "Logo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete logo error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}