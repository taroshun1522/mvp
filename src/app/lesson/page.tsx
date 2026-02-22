"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { getInstructor } from "@/lib/instructors";
import { ErrorEntry, LessonStorageData } from "@/types";
import Timer from "@/components/Timer";
import LessonVideo from "@/components/LessonVideo";
import SubtitleDisplay from "@/components/SubtitleDisplay";

const TOTAL_SECONDS = 180;

function LessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const instructorId = searchParams.get("instructor");
  const token = searchParams.get("token");
  const instructor = instructorId ? getInstructor(instructorId) : undefined;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anamClientRef = useRef<any>(null);
  const errorsRef = useRef<ErrorEntry[]>([]);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);
  const hasEndedRef = useRef(false);

  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [subtitleText, setSubtitleText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  const toggleMute = useCallback(() => {
    const client = anamClientRef.current;
    if (client) {
      if (isMuted) {
        client.unmuteInputAudio?.();
      } else {
        client.muteInputAudio?.();
      }
    }
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  const handleSessionEnd = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const storageData: LessonStorageData = {
      conversationHistory: conversationRef.current,
      errors: errorsRef.current,
    };
    sessionStorage.setItem("lessonData", JSON.stringify(storageData));
    setConnectionStatus("disconnected");
    router.push("/feedback");
  }, [router]);

  useEffect(() => {
    if (!token || !instructor) return;

    let client: unknown = null;

    const initAnam = async () => {
      try {
        const { createClient, AnamEvent } = await import("@anam-ai/js-sdk");

        client = createClient(token);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anamClient = client as any;
        anamClientRef.current = anamClient;

        // Connection established
        anamClient.addListener(AnamEvent.CONNECTION_ESTABLISHED, () => {
          setConnectionStatus("connected");
          // Start countdown timer
          timerRef.current = setInterval(() => {
            setRemainingSeconds((prev) => {
              if (prev <= 1) {
                handleSessionEnd();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        });

        // Connection closed
        anamClient.addListener(AnamEvent.CONNECTION_CLOSED, () => {
          handleSessionEnd();
        });

        // Client tool events (error tracking)
        anamClient.addListener(
          AnamEvent.CLIENT_TOOL_EVENT_RECEIVED,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (toolEvent: any) => {
            if (toolEvent.eventName === "log_error") {
              const data = toolEvent.eventData || {};
              errorsRef.current.push({
                original: data.original || "",
                corrected: data.corrected || "",
                explanation: data.explanation || "",
                category: data.category || "grammar",
                timestamp: Date.now(),
              });
            }
          }
        );

        // Subtitle stream
        anamClient.addListener(
          AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event: any) => {
            if (event?.content) {
              setSubtitleText(event.content);
            }
          }
        );

        // Conversation history updated
        anamClient.addListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (history: any) => {
            if (Array.isArray(history)) {
              conversationRef.current = history.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (msg: any) => ({
                  role: msg.role || "unknown",
                  content: msg.content || "",
                })
              );
            }
          }
        );

        // Start streaming to video element (SDK expects element ID string)
        anamClient.streamToVideoElement("video");
      } catch (err) {
        console.error("Failed to initialize Anam client:", err);
        setConnectionStatus("disconnected");
      }
    };

    initAnam();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (client && typeof (client as Record<string, unknown>).disconnect === "function") {
        (client as { disconnect: () => void }).disconnect();
      }
    };
  }, [token, instructor, handleSessionEnd]);

  if (!instructor || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Session not found. Please start a new lesson.
          </p>
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

  if (connectionStatus === "disconnected" && !hasEndedRef.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connection failed. Please check your internet and try again.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-indigo-600 px-6 py-2 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Instructors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Timer */}
      <Timer remainingSeconds={remainingSeconds} totalSeconds={TOTAL_SECONDS} />

      {/* Video */}
      <LessonVideo />

      {/* Subtitles */}
      <SubtitleDisplay text={subtitleText} visible={subtitlesOn} />

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 shrink-0">
        <button
          onClick={toggleMute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isMuted
              ? "bg-red-500/20 text-red-400"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {connectionStatus === "connecting" && (
          <span className="text-sm text-gray-400">Connecting...</span>
        )}

        <button
          onClick={() => setSubtitlesOn(!subtitlesOn)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subtitlesOn
              ? "bg-indigo-500/20 text-indigo-400"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          aria-label={subtitlesOn ? "Hide subtitles" : "Show subtitles"}
        >
          CC {subtitlesOn ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
