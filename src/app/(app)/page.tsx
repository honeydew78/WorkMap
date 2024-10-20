'use client';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white dark:bg-gray-800 dark:text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Welcome to the Project Management Tool
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Efficiently organize, track, and collaborate on your projects with our user-friendly platform. Manage tasks, teams, and timelines all in one place.
          </p>
        </section>

        {/* Additional Information */}
        <section className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-semibold">Why Choose Us?</h2>
          <p className="mt-4 text-sm md:text-base">
            Our platform is designed with flexibility and ease-of-use in mind, allowing you to effortlessly manage multiple projects at once. With features like task assignments, progress tracking, and real-time collaboration, you can stay on top of your team’s productivity.
          </p>
          <p className="mt-4 text-sm md:text-base">
            Whether you’re a small business or a large enterprise, our tool is scalable to meet your needs.
          </p>
        </section>

        {/* Optional: Call-to-action button */}
        <div className="mt-6">
          <Button className="text-white bg-green-500 hover:bg-green-600">
            Get Started
          </Button>
        </div>
      </main>
    </div>
  );
}
