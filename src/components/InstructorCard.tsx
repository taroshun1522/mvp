"use client";

import { useRouter } from "next/navigation";
import { InstructorId } from "@/types";

interface InstructorCardProps {
  id: InstructorId;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  imageSrc: string;
}

export default function InstructorCard({
  id,
  name,
  tagline,
  description,
  tags,
  imageSrc,
}: InstructorCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/prepare?instructor=${id}`)}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm
                 hover:shadow-lg hover:scale-[1.02] hover:border-indigo-300
                 transition-all duration-200 cursor-pointer
                 p-6 text-center focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label={`Select ${name} as your instructor`}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={name}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 items-center justify-center text-3xl font-bold text-indigo-600 ring-2 ring-gray-100 hidden"
        >
          {name[0]}
        </div>
      </div>

      {/* Name */}
      <h2 className="text-xl font-semibold text-gray-900">{name}</h2>

      {/* Tagline */}
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{tagline}</p>

      {/* Description */}
      <p className="mt-2 text-xs text-gray-400 leading-relaxed">{description}</p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
