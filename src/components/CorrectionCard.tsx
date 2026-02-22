import { FeedbackError } from "@/types";

interface CorrectionCardProps {
  error: FeedbackError;
}

export default function CorrectionCard({ error }: CorrectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      {/* Category label */}
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {error.category}
      </span>

      {/* Original (wrong) */}
      <div className="mt-3 flex items-start gap-2">
        <span className="text-red-400 shrink-0 mt-0.5">✗</span>
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 w-full">
          {error.original}
        </p>
      </div>

      {/* Corrected */}
      <div className="mt-2 flex items-start gap-2">
        <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 w-full">
          {error.corrected}
        </p>
      </div>

      {/* Explanation (Japanese) */}
      <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
        <span className="shrink-0">💡</span>
        <p className="leading-relaxed">{error.explanation}</p>
      </div>
    </div>
  );
}
