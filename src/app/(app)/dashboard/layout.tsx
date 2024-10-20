'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
      <main className="flex-grow">{children}</main>
      </SidebarProvider>
    </div>
  );
}
