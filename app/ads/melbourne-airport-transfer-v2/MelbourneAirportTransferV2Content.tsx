"use client";

/**
 * A/B Test Variant B - Melbourne Airport Transfer
 * 
 * This variant tests:
 * - Different headline copy
 * - Video testimonial section (placeholder)
 * - Urgency messaging
 * - Different CTA button text
 * 
 * Control (v1): Standard layout
 * Variant (v2): This page - urgency-focused messaging
 */

import { useEffect } from "react";
import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, AIRPORT_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { LandingFleetGrid } from "@/components/landing/LandingFleetGrid";
import { FAQSection } from "@/components/home/FAQSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LiveBookingNotification } from "@/components/ui/LiveBookingNotification";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { useUTMCapture, useABVariant } from "@/hooks/useUTMCapture";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";

const airportFAQs = [
  {
    question: "How Long Is The Trip From Melbourne Airport To Melbourne CBD?",
    answer: "Melbourne CBD is about 23 km from Melbourne Airport. The journey typically takes 25–30 minutes during off-peak hours, but can take longer during peak traffic."
  },
  {
    question: "Where Will My Chauffeur Meet Me?",
    answer: "Your chauffeur will meet you at the arrivals area with a personalised name sign, ready to assist with your luggage and guide you to your vehicle."
  },
  {
    question: "Does It Cost Extra If My Flight Is Delayed?",
    answer: "No. We track your flight in real-time and provide up to 60 minutes of complimentary waiting time for international arrivals."
  },
  {
    question: "How Much Does A Melbourne Airport Transfer Cost?",
    answer: "Airport transfers start from $89 depending on your destination. Use our quote form for transparent, fixed pricing."
  }
];

export default function MelbourneAirportTransferV2Content() {
  // Track A/B variant
  useABVariant("airport_landing", "variant_b_urgency");
  
  // Capture UTM params
  useUTMCapture({
    serviceType: "Airport Transfer",
    source: "landing_airport_v2",
    pagePath: "/ads/melbourne-airport-transfer-v2",
    variant: "B",
  });

  const scrollToForm = () => {
    const formSection = document.getElementById('quote-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <LandingPageLayout>
      {/* Hero Section - Variant B: Urgency messaging */}
      <LandingPageHero
        headline="Melbourne Airport Transfers - Spots Filling Fast"
        subheadline="Don't risk missing your flight. Lock in your professional chauffeur now and travel stress-free with real-time flight tracking."
        backgroundImage="/services/airport_transfer.png"
        trustIndicators={[
          "Flight Tracking Included",
          "60 Minutes Free Wait",
          "Fixed Price Guarantee"
        ]}
        pricingText="From $89 - Limited slots available"
      />

      {/* Urgency Banner - Variant B specific */}
      <section className="py-4 bg-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-white">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium text-center">
              <span className="font-bold">High Demand Alert:</span> 8 bookings made in the last hour
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-1">1,000+</div>
              <div className="text-sm font-medium">Monthly Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm font-medium">Available Service</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm font-medium">Flight Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">5-Star</div>
              <div className="text-sm font-medium">Google Rated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-gray-700">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium">5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-sm font-medium">Licensed Operator</span>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <USPSection 
        title="Why Smart Travelers Choose ChauffeurTop"
        usps={AIRPORT_USPS}
      />

      {/* CTA After USPs - Variant B: Urgency CTA */}
      <section className="py-8 bg-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 mb-3">
            <Clock className="inline w-4 h-4 mr-1" />
            Average response time: 15 minutes
          </p>
          <button
            onClick={scrollToForm}
            className="bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Secure Your Spot Now
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Why Risk It With <span className="text-luxury-gold">Unreliable Transport?</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Every year, thousands of travelers miss flights or arrive stressed because of unreliable transport. Don't be one of them.
                </p>
                <p>
                  ChauffeurTop eliminates uncertainty. Our flight tracking ensures your chauffeur is waiting, even if your plane is delayed.
                </p>
                <p>
                  <span className="text-luxury-gold font-bold">Unlike rideshare:</span> Fixed pricing (no surge), professional chauffeurs, and premium vehicles.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Real-time flight monitoring</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">60 minutes free waiting time</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Meet & greet at arrivals</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">24/7 customer support</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-luxury-gold/10 rounded-lg overflow-hidden border border-luxury-gold/20">
                <Image 
                  src="/services/content/airport_transfer.png" 
                  alt="Luxury Airport Transfer" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <LandingFleetGrid onCTAClick={scrollToForm} />

      {/* Testimonials */}
      <TestimonialsSection 
        title="What Travelers Are Saying"
        serviceType="airport"
      />

      {/* Final Urgency CTA */}
      <section className="py-8 bg-luxury-gold">
        <div className="container mx-auto px-4 text-center">
          <p className="text-luxury-black font-medium mb-2">
            Limited availability for peak times
          </p>
          <button
            onClick={scrollToForm}
            className="bg-luxury-black hover:bg-luxury-black/90 text-luxury-gold font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg"
          >
            Reserve Now - Spots Filling Fast
          </button>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection items={airportFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Airport Transfer" source="landing_airport_v2" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-5">
              Prefer to Speak With Someone?
            </h3>
            <p className="text-white/70 mb-6 text-lg">
              Our team is available 24/7 to help with your booking.
            </p>
            <a 
              href="tel:0430240945"
              className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-xl px-10 py-4 rounded-md transition-all duration-300 shadow-xl"
            >
              Call (04) 3024 0945
            </a>
          </div>
        </div>
      </section>

      {/* Conversion Boosters */}
      <WhatsAppButton />
      <LiveBookingNotification />
      <ExitIntentPopup />
    </LandingPageLayout>
  );
}
