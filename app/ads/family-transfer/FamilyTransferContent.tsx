"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { USPSection, FAMILY_USPS } from "@/components/landing/USPSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingPageForm from "@/components/landing/LandingPageForm";
import { FleetGrid } from "@/components/services/FleetGrid";
import { CheckCircle2, Baby, Shield, Car } from "lucide-react";

export default function FamilyTransferContent() {
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
      />

      {/* Trust Bar */}
      <section className="py-12 bg-luxury-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-luxury-black">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm">Safety Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-sm">Child Seats</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5-Star</div>
              <div className="text-sm">Family Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Family Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - USPs */}
      <USPSection 
        title="Why Families Trust ChauffeurTop"
        usps={FAMILY_USPS}
      />

      {/* Detailed Content Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                No More Folding Strollers in <span className="text-luxury-gold">Cramped Taxis</span>
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Herding kids through airports. Wrestling car seats. Cramming luggage into tiny boots. If you've traveled with children, you know the struggle.
                </p>
                <p>
                  ChauffeurTop removes the stress from family travel. Our spacious SUVs and vans offer room for strollers, luggage, sports equipment—everything your family needs. Child safety seats come pre-installed and professionally fitted before your journey.
                </p>
                <p>
                  Every chauffeur passes comprehensive background checks, including Working With Children verification. We understand that patience matters when traveling with little ones, and our drivers are trained in family-first service.
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
                <img 
                  src="/services/content/family_travel.png" 
                  alt="Family Transfer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-luxury-black mb-16">
            Safety Isn't an Add-On. It's Our Priority.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Shield className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Vetted Professionals</h3>
              <p className="text-gray-600">
                All chauffeurs undergo rigorous background checks and Working With Children verification. Your family's safety is non-negotiable.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Baby className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Pre-Installed Car Seats</h3>
              <p className="text-gray-600">
                Age-appropriate seats (infant, toddler, booster) are cleaned, inspected, and installed before your trip. Australian standards compliant.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all">
              <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                <Car className="text-luxury-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold text-luxury-black mb-3">Door-to-Door Security</h3>
              <p className="text-gray-600">
                We ensure you and your children are safely inside your destination before departing. No rushing. No stress.
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
            Family Booking Process
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Book in Seconds</h3>
              <p className="text-white/70">
                Enter your family size and select the number of car seats needed. Takes moments to complete.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Meet Your Chauffeur</h3>
              <p className="text-white/70">
                Receive driver details and live GPS tracking link via SMS. Know exactly when they'll arrive.
              </p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
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

      {/* FAQ Section for Parents */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-luxury-black mb-12">
            Common Questions from Parents
          </h2>
          <div className="space-y-6">
            <div className="border border-luxury-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-luxury-black mb-3">
                Do You Provide Child Seats?
              </h3>
              <p className="text-gray-600">
                Yes. Age-appropriate car seats (infant capsules, toddler seats, boosters) are pre-installed, cleaned, and ready before your trip. Just let us know your children's ages when booking.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-luxury-black mb-3">
                How Much Luggage Can We Bring?
              </h3>
              <p className="text-gray-600">
                Our family vehicles (SUVs and vans) offer ample space for suitcases, strollers, sports gear, and everything else your family needs. No cramming required.
              </p>
            </div>
            <div className="border border-luxury-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-luxury-black mb-3">
                Are Your Chauffeurs Trained For Family Travel?
              </h3>
              <p className="text-gray-600">
                Yes. Our chauffeurs are vetted professionals trained in family-first etiquette. They understand kids need time and are never in a rush. Background checks and Working With Children verification are mandatory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <LandingPageForm preSelectedService="Point to Point" />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-luxury-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
              Have Questions About Child Seats or Safety?
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Our family travel specialists are here to help. Call now for immediate assistance.
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
