"use client";

import { CheckCircle2, Shield, Clock, Star } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface USP {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface USPSectionProps {
  title: string;
  usps: USP[];
}

export function USPSection({ title, usps }: USPSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 text-luxury-black">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <div
                key={index}
                className="group bg-luxury-black border border-luxury-gold/20 rounded-lg p-8 hover:border-luxury-gold transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-6 inline-flex p-4 bg-luxury-gold/10 rounded-full">
                  <Icon className="text-luxury-gold" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors">
                  {usp.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pre-configured USP sets for each landing page type
export const AIRPORT_USPS: USP[] = [
  {
    icon: Clock,
    title: "Real-Time Flight Tracking",
    description: "We monitor your flight status automatically. Your chauffeur adjusts pickup time if you're delayed—no phone calls needed."
  },
  {
    icon: Star,
    title: "Meet & Greet Inside Terminal",
    description: "Skip the confusion. Your chauffeur waits at arrivals with a personalized name sign, ready to assist with luggage."
  },
  {
    icon: Shield,
    title: "Fixed Pricing Guarantee",
    description: "No surge charges or meter anxiety. Your rate is locked before you book—what you see is what you pay."
  },
  {
    icon: CheckCircle2,
    title: "60 Minutes Free Wait Time",
    description: "Flight delayed? We've got you covered with complimentary waiting time for international arrivals."
  }
];

export const CORPORATE_USPS: USP[] = [
  {
    icon: CheckCircle2,
    title: "Monthly Billing Portal",
    description: "One invoice, unlimited rides. Simplify accounting with centralized billing and detailed trip reports."
  },
  {
    icon: Shield,
    title: "NDA-Compliant Chauffeurs",
    description: "Discuss confidential matters freely. Our drivers are trained professionals who respect your privacy."
  },
  {
    icon: Star,
    title: "Mobile Office Comfort",
    description: "Leather interiors, climate control, and smooth rides. Work productively while we handle the traffic."
  },
  {
    icon: Clock,
    title: "Preferred Chauffeur Assignment",
    description: "Request the same professional driver for every trip. Build familiarity and trust with consistent service."
  }
];

export const FAMILY_USPS: USP[] = [
  {
    icon: Shield,
    title: "Certified Child Safety Seats",
    description: "Infant capsules, toddler seats, and boosters—all professionally installed and compliant with Australian standards."
  },
  {
    icon: CheckCircle2,
    title: "Background-Checked Chauffeurs",
    description: "Every driver passes Working With Children Check and comprehensive background screening for your peace of mind."
  },
  {
    icon: Star,
    title: "Extra Luggage & Stroller Space",
    description: "SUVs and vans with ample room for strollers, luggage, sports equipment—everything your family needs."
  },
  {
    icon: Clock,
    title: "Patient, Family-Friendly Service",
    description: "Drivers trained in family-first etiquette. We understand kids need time, and we're never in a rush."
  }
];
