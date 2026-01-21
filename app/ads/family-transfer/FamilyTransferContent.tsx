"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, FAMILY_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { LandingFleetGrid } from "@/components/landing/LandingFleetGrid";
import { FAQSection } from "@/components/home/FAQSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LiveBookingNotification } from "@/components/ui/LiveBookingNotification";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { useUTMCapture } from "@/hooks/useUTMCapture";
import { CheckCircle2, Baby, Shield, Car } from "lucide-react";
import Image from "next/image";

const familyFAQs = [
  {
    question: "Do You Provide Child Seats?",
    answer: "Yes. Age-appropriate car seats (infant capsules, toddler seats, boosters) are pre-installed, cleaned, and ready before your trip upon request."
  },
  {
    question: "How Much Luggage Can We Bring?",
    answer: "Our family vehicles offer ample space for suitcases, strollers, and sports gear, ensuring comfort for the whole family."
  },
  {
    question: "Are Your Chauffeurs Trained For Family Travel?",
    answer: "Yes, our chauffeurs are vetted professionals trained in family-first etiquette, ensuring a safe and smooth journey for children."
  },
  {
    question: "Can You Wait If Our Flight Is Delayed?",
    answer: "Absolutely. We track all flights in real-time and provide complimentary waiting time for airport family transfers."
  }
];

export default function FamilyTransferContent() {
  // Capture UTM params and track page view
  useUTMCapture({
    serviceType: "Family Travel",
    source: "landing_family",
    pagePath: "/ads/family-transfer",
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
        headline="Safe Family Transfers Melbourne - Child Seats Included"
        subheadline="Traveling with kids is stressful enough. Pre-installed car seats, patient drivers, and room for all your luggage—guaranteed."
        backgroundImage="/services/family_travel.png"
        trustIndicators={[
          "Certified Child Seats",
          "Background-Checked Drivers",
          "Extra Luggage Space"
        ]}
        pricingText="Family transfers from $99"
      />

      {/* Trust Bar */}
      <section className="py-10 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm font-medium">Safety Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">Free</div>
              <div className="text-sm font-medium">Child Seats</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">5-Star</div>
              <div className="text-sm font-medium">Family Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm font-medium">Family Support</div>
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
              <span className="text-sm font-medium">WWC Verified Drivers</span>
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
        title="Why Families Trust ChauffeurTop"
        usps={FAMILY_USPS}
      />

      {/* CTA After USPs */}
      <section className="py-8 bg-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={scrollToForm}
            className="bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Your Family Quote
          </button>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                No More Folding Strollers in <span className="text-luxury-gold">Cramped Taxis</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Herding kids through airports. Wrestling car seats. Cramming luggage into tiny boots. If you've traveled with children, you know the struggle.
                </p>
                <p>
                  Unlike rideshare, your price is locked before you book—no surge pricing surprises. Professional chauffeur who's trained to work with families, not a random driver.
                </p>
                <p>
                  Our spacious SUVs and vans offer room for strollers, luggage, sports equipment—everything your family needs. Child safety seats come pre-installed and professionally fitted.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Infant capsules, toddler seats, and boosters available</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Climate-controlled comfort for sensitive little ones</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Extra luggage space for family travel essentials</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-luxury-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-white/90">Patient, family-friendly professional drivers</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-luxury-gold/10 rounded-lg overflow-hidden border border-luxury-gold/20">
                <Image 
                  src="/services/content/family_travel.png" 
                  alt="Family Transfer" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-luxury-black mb-12">
            Safety Isn't an Add-On. It's Our Priority.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Shield className="text-luxury-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Vetted Professionals</h3>
              <p className="text-gray-600">
                All chauffeurs undergo rigorous background checks and Working With Children verification.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Baby className="text-luxury-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Pre-Installed Car Seats</h3>
              <p className="text-gray-600">
                Age-appropriate seats are cleaned, inspected, and installed before your trip. Australian standards compliant.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-5 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Car className="text-luxury-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Door-to-Door Security</h3>
              <p className="text-gray-600">
                We ensure you and your children are safely inside your destination before departing.
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
            Family Booking Process
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Book in Seconds</h3>
              <p className="text-white/70">
                Enter your family size and select the number of car seats needed. Takes moments to complete.
              </p>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Meet Your Chauffeur</h3>
              <p className="text-white/70">
                Receive driver details and live GPS tracking link via SMS. Know exactly when they'll arrive.
              </p>
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sit Back & Relax</h3>
              <p className="text-white/70">
                Enjoy climate control, complimentary water, and a safe journey for the whole family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <TestimonialsSection 
        title="What Families Say About ChauffeurTop"
        serviceType="family"
      />

      {/* CTA After Testimonials */}
      <section className="py-8 bg-luxury-gold">
        <div className="container mx-auto px-4 text-center">
          <p className="text-luxury-black font-medium mb-4">Ready for stress-free family travel?</p>
          <button
            onClick={scrollToForm}
            className="bg-luxury-black hover:bg-luxury-black/90 text-luxury-gold font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg"
          >
            Get Your Family Quote
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection items={familyFAQs} title="Common Questions from Parents" className="bg-zinc-900" />

      {/* Quote Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Family Travel" source="landing_family" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-5">
              Have Questions About Child Seats or Safety?
            </h3>
            <p className="text-white/70 mb-6 text-lg">
              Our family travel specialists are here to help. Call now for immediate assistance.
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
