"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, CORPORATE_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { LandingFleetGrid } from "@/components/landing/LandingFleetGrid";
import { FAQSection } from "@/components/home/FAQSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LiveBookingNotification } from "@/components/ui/LiveBookingNotification";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { useUTMCapture } from "@/hooks/useUTMCapture";
import { CheckCircle2, Briefcase, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

const corporateFAQs = [
  {
    question: "Can I Track My Chauffeur In Real-Time?",
    answer: "Yes. All corporate transfers come with real-time GPS tracking for complete peace of mind."
  },
  {
    question: "Will The Chauffeur Wait If My Flight Is Delayed?",
    answer: "Absolutely. We monitor your flight and provide complimentary wait time to ensure punctual pickups."
  },
  {
    question: "Do You Offer Monthly Billing?",
    answer: "Yes, we offer centralized monthly billing with detailed reporting for all our corporate account holders."
  },
  {
    question: "Can I Request A Specific Chauffeur?",
    answer: "We strive to accommodate specific chauffeur requests for our regular corporate clients to build familiarity and trust."
  }
];

export default function CorporateTransferContent() {
  // Capture UTM params and track page view
  useUTMCapture({
    serviceType: "Corporate Travel",
    source: "landing_corporate",
    pagePath: "/ads/corporate-transfer",
  });

  const scrollToForm = () => {
    const formSection = document.getElementById('quote-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        pricingText="Corporate transfers from $99"
      />

      {/* Trust Bar */}
      <section className="py-10 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm font-medium">Corporate Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">45 Min</div>
              <div className="text-sm font-medium">Avg. Time Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-sm font-medium">On-Time Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm font-medium">Business Support</div>
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
              <span className="text-sm font-medium">NDA Available</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - USPs */}
      <USPSection 
        title="Why Melbourne's Top Businesses Choose ChauffeurTop"
        usps={CORPORATE_USPS}
      />

      {/* CTA After USPs */}
      <section className="py-8 bg-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={scrollToForm}
            className="bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Your Corporate Quote
          </button>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Save 45 Minutes Per Trip vs. <span className="text-luxury-gold">Rideshare Services</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Business travel shouldn't be complicated. Between meetings, client dinners, and airport runs, the last thing you need is uncertainty about transport.
                </p>
                <p>
                  Unlike rideshare, your price is locked before you book—no surge pricing, ever. Professional chauffeur, not a random driver. Confidential conversations stay confidential.
                </p>
                <p>
                  Our corporate chauffeur service offers monthly billing with consolidated invoicing, making expense reporting effortless. One account. One invoice. Unlimited rides.
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
                <Image 
                  src="/services/content/corporate_travel.png" 
                  alt="Corporate Transfer" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-luxury-black mb-12">
            Streamlined Logistics for Your Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Briefcase className="text-luxury-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Centralized Billing</h3>
              <p className="text-gray-600">
                One monthly invoice with clear, fixed-rate pricing. Detailed trip reports for accounting reconciliation.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Users className="text-luxury-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Dedicated Account Manager</h3>
              <p className="text-gray-600">
                A single point of contact who understands your preferences and manages all bookings efficiently.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <TrendingUp className="text-luxury-gold" size={28} />
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
      <LandingFleetGrid onCTAClick={scrollToForm} />

      {/* How It Works */}
      <section className="py-16 bg-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">
            Simple 3-Step Corporate Booking
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reserve</h3>
              <p className="text-white/70">
                Book through our dedicated corporate line or online portal. Multiple passengers? No problem.
              </p>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
              <p className="text-white/70">
                Receive chauffeur details and real-time tracking link one hour before pickup.
              </p>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
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

      {/* CTA After Testimonials */}
      <section className="py-8 bg-luxury-gold">
        <div className="container mx-auto px-4 text-center">
          <p className="text-luxury-black font-medium mb-4">Ready to elevate your corporate travel?</p>
          <button
            onClick={scrollToForm}
            className="bg-luxury-black hover:bg-luxury-black/90 text-luxury-gold font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg"
          >
            Get Your Corporate Quote
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection items={corporateFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

      {/* Quote Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Corporate Travel" source="landing_corporate" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-5">
              Ready to Elevate Your Corporate Travel?
            </h3>
            <p className="text-white/70 mb-6 text-lg">
              Speak with our corporate accounts team about monthly billing and volume discounts.
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
