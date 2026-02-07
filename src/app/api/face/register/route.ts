import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, embedding } = await req.json();

    if (!userId || !embedding) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    await dbConnect();

    await User.findOneAndUpdate(
      { clerkUserId: userId },
      { faceEmbedding: embedding },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to register face" },
      { status: 500 }
    );
  }
}
