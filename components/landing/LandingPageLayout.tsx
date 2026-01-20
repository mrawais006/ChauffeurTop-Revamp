"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { BUSINESS_CONFIG, contactHelpers } from "@/lib/constants";
import { ReactNode } from "react";

interface LandingPageLayoutProps {
  children: ReactNode;
}

export function LandingPageLayout({ children }: LandingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header with Static Logo and Call Button */}
      <header className="bg-luxury-black border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm bg-luxury-black/95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Static Logo - NON-CLICKABLE */}
          <div className="flex items-center">
            <Image
              src="/logo/logo-1.png"
              alt="ChauffeurTop Melbourne"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>

          {/* Call Now Button */}
          <a
            href={contactHelpers.getPhoneUrl()}
            className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold px-6 py-3 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Phone size={18} />
            <span className="hidden sm:inline">Call Now: </span>
            <span>{BUSINESS_CONFIG.PHONE_DISPLAY}</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Minimal Footer - Google Ads Compliant */}
      <footer className="bg-luxury-black border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} {BUSINESS_CONFIG.NAME_SHORT}. All rights reserved.</p>
            
            {/* Only Terms & Privacy - No Other Navigation */}
            <div className="flex gap-6">
              <Link 
                href="/terms-and-conditions" 
                className="hover:text-luxury-gold transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/privacy-policy" 
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
