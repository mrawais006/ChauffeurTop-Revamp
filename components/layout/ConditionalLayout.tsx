'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactButton } from '@/components/ui/FloatingContactButton';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navigation elements on admin, login, and ads (landing) pages
  const isAdminOrLoginPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');
  const isLandingPage = pathname?.startsWith('/ads');
  const hideNavigation = isAdminOrLoginPage || isLandingPage;

  // Landing pages use their own isolated layout (LandingPageLayout)
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavigation && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavigation && <Footer />}
      {!hideNavigation && <FloatingContactButton />}
    </div>
  );
}

