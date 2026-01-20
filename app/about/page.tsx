import React from "react";
import type { Metadata } from "next";
import { ServiceHero } from "@/components/services/ServiceHero";
import OurHistory from "@/components/about/OurHistory";
import Timeline from "@/components/about/Timeline";
import ServicesChecklist from "@/components/about/ServicesChecklist";
import AboutContent from "@/components/about/AboutContent";
import OurChauffeurs from "@/components/about/OurChauffeurs";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import ReadyToBook from "@/components/about/ReadyToBook";

export const metadata: Metadata = {
  title: "About ChauffeurTop | Melbourne's Premier Chauffeur Service Since 2012",
  description: "12 years of excellence in luxury chauffeur services. Learn about ChauffeurTop's commitment to punctuality, professionalism, and premium Melbourne transportation.",
  keywords: ["about chauffeurtop", "melbourne chauffeur company", "luxury car service history", "professional chauffeurs melbourne"],
  alternates: {
    canonical: "https://chauffeurtop.com.au/about",
  },
  openGraph: {
    title: "About ChauffeurTop | Melbourne's Premier Chauffeur Service",
    description: "12 years of excellence in luxury chauffeur services across Melbourne and Victoria.",
    url: "https://chauffeurtop.com.au/about",
    type: "website",
  },
};

export default function AboutPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="About Us"
                subtitle="12 Years. 1 Million Miles. One Promise: Punctuality"
                description="Melbourne’s Luxury Chauffeur Services"
                backgroundImage="/about/luxury_chauffeur_opening_door.png"

            />
            <OurHistory />
            <Timeline />
            <ServicesChecklist />
            <AboutContent />
            <OurChauffeurs />
            <WhyChooseUs />
            <ReadyToBook />
        </main>
    );
};


