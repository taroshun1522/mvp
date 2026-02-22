"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeedbackData, LessonStorageData } from "@/types";
import LoadingScreen from "@/components/LoadingScreen";
import FeedbackReport from "@/components/FeedbackReport";

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem("lessonData");
    if (!raw) {
      router.push("/");
      return;
    }

    let lessonData: LessonStorageData;
    try {
      lessonData = JSON.parse(raw);
    } catch {
      router.push("/");
      return;
    }

    const fetchFeedback = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationHistory: lessonData.conversationHistory,
            errors: lessonData.errors,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error("Failed to generate feedback");
        }

        const data: FeedbackData = await res.json();
        setFeedback(data);
      } catch {
        setError("Failed to generate feedback. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                window.location.reload();
              }}
              className="rounded-xl bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("lessonData");
                router.push("/");
              }}
              className="rounded-xl border border-gray-300 px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return null;
  }

  return <FeedbackReport data={feedback} />;
}
