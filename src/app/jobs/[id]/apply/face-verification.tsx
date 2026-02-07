"use client";

import { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

// This is a Face Verification component for job application
export default function FaceVerification({ onVerified }: { onVerified: (embedding: number[] | null) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [embedding, setEmbedding] = useState<number[] | null>(null);

  const startCamera = async () => {
    setError(null);
    setLoading(true);
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Camera access denied or not available.");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    if (!videoRef.current) {
      setError("No video ref");
      setLoading(false);
      return;
    }
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!detection) {
        setError("No face detected. Please make sure your face is clearly visible.");
        setLoading(false);
        return;
      }
      setEmbedding(Array.from(detection.descriptor));
      setVerified(true);
      onVerified(Array.from(detection.descriptor));
    } catch (err: any) {
      setError("Face detection failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Face Verification</CardTitle>
        <CardDescription>
          Please verify your face. This will be used to confirm your application authenticity.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <video ref={videoRef} autoPlay muted className="w-64 rounded" style={{ display: verified ? "none" : "block" }} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!verified && (
          <div className="flex gap-2 w-full justify-center">
            <Button onClick={startCamera} disabled={loading}>Enable Camera</Button>
            <Button onClick={handleVerify} disabled={loading}>Verify Face</Button>
          </div>
        )}
        {verified && <p className="text-green-600 font-semibold">Face verified!</p>}
      </CardContent>
    </Card>
  );
}
