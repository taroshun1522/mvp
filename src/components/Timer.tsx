"use client";

interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
}

export default function Timer({ remainingSeconds, totalSeconds }: TimerProps) {
  const progressPercent = (remainingSeconds / totalSeconds) * 100;
  const isWarning = remainingSeconds <= 30;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="relative h-8 bg-gray-900 flex items-center px-4 shrink-0">
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-gray-800">
        {/* Progress bar fill */}
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isWarning ? "bg-amber-500" : "bg-indigo-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {/* Time display */}
      <span className="relative ml-auto text-sm font-mono text-gray-300">
        {timeDisplay}
      </span>
    </div>
  );
}
