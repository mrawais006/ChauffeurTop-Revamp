"use client"

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroductionSection } from "@/components/home/IntroductionSection";
import { FourPillars } from "@/components/home/FourPillars";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { VehicleFleet } from "@/components/home/VehicleFleet";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { InformationSection } from "@/components/home/InformationSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomeContent() {
  return (
    <main className="min-h-screen relative bg-luxury-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar />
      <HeroSection />
      <IntroductionSection />
      <FourPillars />
      <ServicesGrid />
      <VehicleFleet />
      <ReviewsSection />
      <InformationSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
