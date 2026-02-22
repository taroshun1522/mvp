"use client";

import { useRouter } from "next/navigation";
import { FeedbackData } from "@/types";
import CorrectionCard from "./CorrectionCard";
import HighlightItem from "./HighlightItem";

interface FeedbackReportProps {
  data: FeedbackData;
}

const labelStyles: Record<string, string> = {
  Great: "bg-emerald-100 text-emerald-700",
  Good: "bg-indigo-100 text-indigo-700",
  "Keep Practicing": "bg-amber-100 text-amber-700",
};

export default function FeedbackReport({ data }: FeedbackReportProps) {
  const router = useRouter();

  const handleTryAnother = () => {
    sessionStorage.removeItem("lessonData");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* A. Overall Score Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 text-center">
          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${
              labelStyles[data.overallLabel] || ""
            }`}
          >
            {data.overallLabel}
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {data.summary}
          </p>
        </div>

        {/* B. Highlights */}
        {data.strengths.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Highlights</h3>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {data.strengths.map((s, i) => (
                <HighlightItem key={i} text={s} />
              ))}
            </div>
          </div>
        )}

        {/* Natural Expressions */}
        {data.naturalExpressions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Great Expressions
            </h3>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {data.naturalExpressions.map((expr, i) => (
                <div key={i} className="px-5 py-4">
                  <p className="font-medium text-indigo-900">
                    &ldquo;{expr.used}&rdquo;
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{expr.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. Corrections */}
        {data.errors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Corrections</h3>
            {data.errors.map((error, i) => (
              <CorrectionCard key={i} error={error} />
            ))}
          </div>
        )}

        {/* D. Next Step */}
        {data.suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Next Step</h3>
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
              <ul className="space-y-2">
                {data.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm text-indigo-800 leading-relaxed flex items-start gap-2"
                  >
                    <span className="shrink-0">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* E. Try Another Lesson */}
        <div className="pt-4 pb-8 text-center">
          <button
            onClick={handleTryAnother}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700
                       text-white font-semibold rounded-xl shadow-sm
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:ring-offset-2"
          >
            Try Another Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
