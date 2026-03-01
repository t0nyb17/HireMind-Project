import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// FIX: Specify Node.js runtime for Buffer compatibility
export const runtime = 'nodejs';

// Function to convert a File to a GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File) {
  const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString("base64");
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ success: false, error: 'No audio file provided.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const audioPart = await fileToGenerativePart(audioFile);
    
    const result = await model.generateContent([
      { text: "Transcribe this audio recording accurately." },
      audioPart
    ]);

    const transcription = result.response.text();

    if (!transcription) {
      throw new Error("Transcription failed, received empty response from AI.");
    }

    return NextResponse.json({ success: true, transcription });

  } catch (error: any) {
    console.error('Error in transcription API:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to transcribe audio.' }, { status: 500 });
  }
}