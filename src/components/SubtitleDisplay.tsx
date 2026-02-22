"use client";

interface SubtitleDisplayProps {
  text: string;
  visible: boolean;
}

export default function SubtitleDisplay({ text, visible }: SubtitleDisplayProps) {
  if (!visible || !text) return null;

  return (
    <div className="bg-gray-900/80 px-4 py-3 shrink-0">
      <p className="text-center text-white text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
        {text}
      </p>
    </div>
  );
}
