interface HighlightItemProps {
  text: string;
}

export default function HighlightItem({ text }: HighlightItemProps) {
  return (
    <div className="px-5 py-4 flex items-start gap-3">
      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
