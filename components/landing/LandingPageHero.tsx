"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface LandingPageHeroProps {
  headline: string;
  subheadline: string;
  backgroundImage: string;
  trustIndicators?: string[];
  pricingText?: string;
}

export function LandingPageHero({
  headline,
  subheadline,
  backgroundImage,
  trustIndicators = [],
  pricingText
}: LandingPageHeroProps) {
  const scrollToForm = () => {
    const formSection = document.getElementById('quote-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black/90 via-luxury-black/80 to-luxury-black/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            {subheadline}
          </p>

          {/* Primary CTA */}
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-xl px-12 py-8 rounded-md shadow-2xl hover:shadow-luxury-gold/50 transition-all duration-300 hover:scale-105"
          >
            GET INSTANT QUOTE
            <ArrowDown className="ml-2" size={24} />
          </Button>

          {/* Pricing Text */}
          {pricingText && (
            <p className="mt-4 text-luxury-gold font-semibold text-lg">{pricingText}</p>
          )}

          {/* Trust Indicators */}
          {trustIndicators.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-luxury-gold text-xl">✓</span>
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <ArrowDown className="text-luxury-gold mx-auto" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
}
