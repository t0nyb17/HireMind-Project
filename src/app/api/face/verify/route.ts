import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Application from "@/models/Application";

function euclideanDistance(a: number[], b: number[]) {
  return Math.sqrt(
    a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0)
  );
}

export async function POST(req: Request) {
  try {
    const { userId, embedding, applicationId } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ match: false, error: "Invalid embedding" }, { status: 400 });
    }

    await dbConnect();

    let storedEmbedding: number[] | null = null;

    // If applicationId is provided, verify against Application's faceEmbedding (for real interviews)
    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (application && application.faceEmbedding && Array.isArray(application.faceEmbedding)) {
        storedEmbedding = application.faceEmbedding;
      }
    }

    // If no application embedding found, try User model (for mock interviews or general verification)
    if (!storedEmbedding && userId) {
      const user = await User.findOne({ clerkUserId: userId });
      if (user && user.faceEmbedding && Array.isArray(user.faceEmbedding)) {
        storedEmbedding = user.faceEmbedding;
      }
    }

    if (!storedEmbedding) {
      return NextResponse.json({ 
        match: false, 
        error: "No face embedding found. Please register your face first.",
        needsRegistration: true 
      });
    }

    const distance = euclideanDistance(storedEmbedding, embedding);
    const THRESHOLD = 0.6;

    return NextResponse.json({
      match: distance < THRESHOLD,
      distance,
      threshold: THRESHOLD,
    });
  } catch (err) {
    console.error("Face verification error:", err);
    return NextResponse.json(
      { error: "Verification failed", match: false },
      { status: 500 }
    );
  }
}
