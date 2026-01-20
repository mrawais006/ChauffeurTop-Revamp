"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, AIRPORT_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { FleetGrid } from "@/components/services/FleetGrid";
import { Shield, Clock, Star, CheckCircle2 } from "lucide-react";

export default function MelbourneAirportTransferContent() {
  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <LandingPageHero
        headline="Reliable Melbourne Airport Transfers - Guaranteed On Time"
        subheadline="Skip the taxi queue anxiety. Your professional chauffeur tracks your flight and waits for you—no rush, no stress."
        backgroundImage="/services/airport_transfer.png"
        trustIndicators={[
          "Flight Tracking Included",
          "60 Minutes Free Wait Time",
          "Fixed Pricing"
        ]}
      />

      {/* Trust Bar */}
      <section className="py-12 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-2">1,000+</div>
              <div className="text-sm">Monthly Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Available Service</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm">Flight Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5-Star</div>
              <div className="text-sm">Google Rated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - USPs */}
      <USPSection 
        title="Why Choose ChauffeurTop for Airport Transfers?"
        usps={AIRPORT_USPS}
      />

      {/* Detailed Content Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Never Miss a Flight Due to <span className="text-luxury-gold">Unreliable Transport</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Missing a flight is stressful. Waiting in taxi queues is frustrating. Not knowing if your driver will show up is anxiety-inducing.
                </p>
                <p>
                  ChauffeurTop eliminates all of that. Our Melbourne Airport transfers use real-time flight tracking technology—we monitor every arrival and departure automatically. If your flight is delayed, your chauffeur adjusts without you lifting a finger.
                </p>
                <p>
                  For arrivals, your chauffeur meets you inside the terminal at the arrivals area with a personalized name sign. No searching. No confusion. Just a smooth transition from plane to luxury vehicle.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Pristine Mercedes, BMW, and Audi fleet</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Professional chauffeurs in business attire</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Complimentary bottled water and phone chargers</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">24/7 customer support for peace of mind</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-luxury-gold/10 rounded-lg overflow-hidden border border-luxury-gold/20">
                <img 
                  src="/services/content/airport_transfer.png" 
                  alt="Luxury Airport Transfer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <FleetGrid />

      {/* How It Works - Simple Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-16">
            Book in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Enter Details</h3>
              <p className="text-gray-600">
                Fill out the form below with your flight details and destination. Takes under 2 minutes.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Get Instant Quote</h3>
              <p className="text-gray-600">
                Receive your fixed-price quote immediately. No hidden fees or surge pricing.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Enjoy the Ride</h3>
              <p className="text-gray-600">
                Your chauffeur tracks your flight and meets you at arrivals. Sit back and relax.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <TestimonialsSection 
        title="What Airport Travelers Say About Us"
        serviceType="airport"
      />

      {/* Quote Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Airport Transfer" />
        </div>
      </section>

      {/* Final Trust Section */}
      <section className="py-16 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
              Still Have Questions?
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Our 24/7 concierge team is ready to help. Call now for immediate assistance.
            </p>
            <a 
              href="tel:0430240945"
              className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-xl px-10 py-5 rounded-md transition-all duration-300 shadow-xl"
            >
              Call (04) 3024 0945
            </a>
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
}
