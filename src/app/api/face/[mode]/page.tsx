"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useUser } from "@clerk/nextjs";

export default function FacePage({ params }: any) {
  const { user } = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const mode = params.mode; // "register" | "verify"

  useEffect(() => {
    const init = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      setLoading(false);
    };

    init();
  }, []);

  // 🔴 THIS is where the fetch goes
  const captureAndSend = async () => {
    if (!videoRef.current || !user?.id) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected");
      return;
    }

    const embedding = Array.from(detection.descriptor);

    // ✅ EXACT PLACE where you add this
    await fetch(`/api/face/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id, // 👈 YOUR MongoDB userId
        embedding,
      }),
    });

    alert(
      mode === "register"
        ? "Face registered successfully"
        : "Face verification sent"
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-xl font-semibold">
        {mode === "register" ? "Face Registration" : "Face Verification"}
      </h1>

      {loading ? (
        <p>Loading camera...</p>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted className="w-80 rounded" />
          <button
            onClick={captureAndSend}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {mode === "register" ? "Register Face" : "Verify Face"}
          </button>
        </>
      )}
    </div>
  );
}
