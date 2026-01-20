"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, CORPORATE_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { FleetGrid } from "@/components/services/FleetGrid";
import { CheckCircle2, Briefcase, TrendingUp, Users } from "lucide-react";

export default function CorporateTransferContent() {
  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <LandingPageHero
        headline="Melbourne Corporate Transfers - Work While You Travel"
        subheadline="Impress clients. Meet deadlines. Your executive chauffeur handles the driving, you handle the deal."
        backgroundImage="/services/corporate_travel.png"
        trustIndicators={[
          "Monthly Billing Available",
          "NDA-Compliant Drivers",
          "Preferred Chauffeur Assignment"
        ]}
      />

      {/* Trust Bar */}
      <section className="py-12 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm">Corporate Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">45 Min</div>
              <div className="text-sm">Avg. Time Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm">On-Time Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Business Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - USPs */}
      <USPSection 
        title="Why Melbourne's Top Businesses Choose ChauffeurTop"
        usps={CORPORATE_USPS}
      />

      {/* Detailed Content Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Save 45 Minutes Per Trip vs. <span className="text-luxury-gold">Rideshare Services</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Business travel shouldn't be complicated. Between meetings, client dinners, and airport runs, the last thing you need is uncertainty about transport.
                </p>
                <p>
                  ChauffeurTop delivers executive-level ground transportation designed for professionals who value their time. No waiting for drivers. No surge pricing surprises. No awkward small talk if you need to work.
                </p>
                <p>
                  Our corporate chauffeur service offers monthly billing with consolidated invoicing, making expense reporting effortless. One account. One invoice. Unlimited rides. Your finance team will thank you.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Premium leather interiors with climate control</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Quiet cabin for confidential calls and work</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Real-time GPS tracking for your EA or assistant</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Dedicated account manager for repeat bookings</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-luxury-gold/10 rounded-lg overflow-hidden border border-luxury-gold/20">
                <img 
                  src="/services/content/corporate_travel.png" 
                  alt="Corporate Transfer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-luxury-black mb-16">
            Streamlined Logistics for Your Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Briefcase className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Centralized Billing</h3>
              <p className="text-gray-600">
                One monthly invoice with clear, fixed-rate pricing. Detailed trip reports for accounting reconciliation.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Users className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Dedicated Account Manager</h3>
              <p className="text-gray-600">
                A single point of contact who understands your preferences and manages all bookings efficiently.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <TrendingUp className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Duty of Care</h3>
              <p className="text-gray-600">
                Fully vetted chauffeurs with background checks ensure passenger safety and corporate compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <FleetGrid />

      {/* How It Works */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-16">
            Simple 3-Step Corporate Booking
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reserve</h3>
              <p className="text-white/70">
                Book through our dedicated corporate line or online portal. Multiple passengers? No problem.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
              <p className="text-white/70">
                Receive chauffeur details and real-time tracking link one hour before pickup.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Arrive</h3>
              <p className="text-white/70">
                Reach your destination on time, refreshed, and ready for business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <TestimonialsSection 
        title="What Corporate Clients Say About Us"
        serviceType="corporate"
      />

      {/* Quote Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Corporate Travel" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
              Ready to Elevate Your Corporate Travel?
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Speak with our corporate accounts team about monthly billing and volume discounts.
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
