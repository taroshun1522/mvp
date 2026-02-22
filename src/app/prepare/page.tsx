"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { getInstructor } from "@/lib/instructors";

function PrepareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const instructorId = searchParams.get("instructor");
  const instructor = instructorId ? getInstructor(instructorId) : undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Instructor not found.</p>
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleStartLesson = async () => {
    setError(null);
    setIsLoading(true);

    // Request microphone and camera permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch {
      setError(
        "Microphone and camera access are required for the lesson. Please allow them in your browser settings."
      );
      setIsLoading(false);
      return;
    }

    // Get session token
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId: instructor.id }),
      });

      if (!res.ok) {
        throw new Error("Failed to start the session");
      }

      const data = await res.json();
      router.push(
        `/lesson?instructor=${instructor.id}&token=${encodeURIComponent(data.sessionToken)}`
      );
    } catch {
      setError("Failed to start the session. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Instructor avatar + name */}
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={instructor.imageSrc}
            alt={instructor.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-indigo-100 mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 items-center justify-center text-3xl font-bold text-indigo-600 ring-2 ring-indigo-100 mx-auto hidden">
            {instructor.name[0]}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {instructor.name}
          </h1>
        </div>

        {/* Today's Topic */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
            Today&apos;s Topic
          </p>
          <p className="text-lg text-gray-800 leading-relaxed italic">
            &ldquo;{instructor.topic}&rdquo;
          </p>
        </div>

        {/* 3-minute label */}
        <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          3-minute conversation
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Start Lesson button */}
        <button
          onClick={handleStartLesson}
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700
                     text-white text-lg font-semibold rounded-xl shadow-sm
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Connecting...
            </span>
          ) : (
            "Start Lesson"
          )}
        </button>

        {/* Back link */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-gray-500 underline hover:text-gray-700"
        >
          Choose a different instructor
        </button>
      </div>
    </div>
  );
}

export default function PreparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      }
    >
      <PrepareContent />
    </Suspense>
  );
}
