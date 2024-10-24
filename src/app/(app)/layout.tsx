'use client';

import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white dark:bg-gray-900 dark:text-white">
        © 2023 Project Management Tool. All rights reserved.
      </footer>
    </div>
  );
}
