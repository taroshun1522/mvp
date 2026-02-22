"use client";

import { useEffect, useRef } from "react";

export default function LessonVideo() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access camera:", err);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
      {/* Instructor video */}
      <video
        id="video"
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Learner camera (PiP) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-4 right-4 w-36 h-28 rounded-xl object-cover border-2 border-white/30 shadow-lg"
      />
    </div>
  );
}
