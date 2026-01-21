"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { BUSINESS_CONFIG, contactHelpers } from "@/lib/constants";
import { ReactNode, useState, useEffect } from "react";

interface LandingPageLayoutProps {
  children: ReactNode;
}

export function LandingPageLayout({ children }: LandingPageLayoutProps) {
  const [isNearForm, setIsNearForm] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile bar after scrolling 300px
      setShowMobileBar(window.scrollY > 300);

      // Check if form is in viewport
      const formElement = document.getElementById('quote-form');
      if (formElement) {
        const rect = formElement.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsNearForm(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById('quote-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden md:block bg-luxury-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm bg-luxury-black/95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo - Clickable, opens homepage in new tab */}
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/logo/logo-1.png"
              alt="ChauffeurTop Melbourne"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </a>

          {/* Call Now Button */}
          <a
            href={contactHelpers.getPhoneUrl()}
            className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold px-6 py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl min-h-[56px]"
          >
            <Phone size={18} />
            <span>Call Now: {BUSINESS_CONFIG.PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      {/* Mobile Header - Only logo, fixed at top */}
      <header className="md:hidden bg-luxury-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm bg-luxury-black/95">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image
              src="/logo/logo-1.png"
              alt="ChauffeurTop Melbourne"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Mobile Sticky CTA Bar - Only visible on mobile after scroll */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-luxury-black border-t border-luxury-gold/30 shadow-2xl transition-transform duration-300 ${
          showMobileBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex gap-2 p-3 safe-area-pb">
          {isNearForm ? (
            // When near form, show Call button prominently
            <a
              href={contactHelpers.getPhoneUrl()}
              className="flex-1 flex items-center justify-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold py-4 rounded-md transition-all min-h-[56px]"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </a>
          ) : (
            // When away from form, show Get Quote prominently
            <>
              <button
                onClick={scrollToForm}
                className="flex-1 flex items-center justify-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold py-4 rounded-md transition-all min-h-[56px]"
              >
                <MessageSquare size={20} />
                <span>Get Quote</span>
              </button>
              <a
                href={contactHelpers.getPhoneUrl()}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-md transition-all min-h-[56px]"
              >
                <Phone size={20} />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Minimal Footer - Google Ads Compliant */}
      <footer className="bg-luxury-black border-t border-white/10 py-8 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} {BUSINESS_CONFIG.NAME_SHORT}. All rights reserved.</p>
            
            {/* Only Terms & Privacy - No Other Navigation */}
            <div className="flex gap-6">
              <Link 
                href="/terms-and-conditions" 
                target="_blank"
                className="hover:text-luxury-gold transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/privacy-policy" 
                target="_blank"
                className="hover:text-luxury-gold transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
