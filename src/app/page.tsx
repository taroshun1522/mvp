import InstructorCard from "@/components/InstructorCard";
import { instructors } from "@/lib/instructors";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          AI English Lesson
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-500">
          Choose your instructor
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              id={instructor.id}
              name={instructor.name}
              tagline={instructor.tagline}
              description={instructor.description}
              tags={instructor.tags}
              imageSrc={instructor.imageSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
