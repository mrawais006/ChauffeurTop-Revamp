'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactButton } from '@/components/ui/FloatingContactButton';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navigation elements on admin and login pages
  const isAdminOrLoginPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrLoginPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminOrLoginPage && <Footer />}
      {!isAdminOrLoginPage && <FloatingContactButton />}
    </div>
  );
}

