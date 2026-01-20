"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Choose Your Ride", description: "Select a vehicle from our premium fleet that perfectly suits your group size." },
    { title: "Plan Your Route", description: "Follow our expert-curated tours or provide your own 'must-visit' list." },
    { title: "Indulge", description: "Your chauffeur navigates the roads, managing parking, leaving you free to enjoy." }
];

const tourFAQs = [
    {
        question: "Can We Choose Which Wineries To Visit?",
        answer: "Absolutely. Our private wine tours are fully customizable. You can provide a wish list, or we can recommend hidden gems."
    },
    {
        question: "How Long Is A Typical Tour?",
        answer: "Most tours run for 6-8 hours, but we offer flexible durations to suit your schedule and tasting pace."
    },
    {
        question: "Can I Drink Alcohol In The Vehicle?",
        answer: "Consuming alcohol in the vehicle is generally not permitted by law, but we provide ample stops and chilled water for hydration."
    },
    {
        question: "Do You Pick Up From Hotels Or Private Addresses?",
        answer: "Yes, we provide door-to-door service from any hotel, residence, or airport location in Melbourne."
    }
];

export default function LuxuryToursContent() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Luxury Sightseeing & Winery Tours"
                subtitle="Experience Victoria in Style"
                description="Relax and enjoy private tours as ChauffeurTop handles the driving so you can focus on tasting, sightseeing, and celebrating."
                backgroundImage="/services/luxury_tour.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">The Agony of <span className="text-luxury-gold">DIY Tours</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Traffic congestion, winding rural roads, and parking hassles are common. Melbourne's wine regions see over 1.2 million visitors annually, many struggling with logistics. Add strict tasting schedules and debates over who stays sober, and what should be a relaxing day becomes stressful.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Taste Freely</span>
                            <span className="text-xs text-white/70">Safe Return</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Door-to-Door</span>
                            <span className="text-xs text-white/70">Flexible Pickup</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Expertise</span>
                            <span className="text-xs text-white/70">Scenic Routes</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Custom</span>
                            <span className="text-xs text-white/70">Itineraries</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Winery Content */}
            <ContentBlock
                title="A Seamless Experience From Start to Finish"
                content={`Every Yarra Valley private wine tours Melbourne is tailored to your group's preferences, from boutique wineries to renowned estates. Choose your pace, stops, and tasting schedule for a truly bespoke experience.\n\nFlexible Group Sizes: Whether it's an intimate tasting for two or a larger celebration with friends and family, we provide the perfect vehicle and service for every group.\n\nComfort & Convenience: Spacious vehicles with climate control, chilled beverages, and secure storage for wine purchases ensure the journey is as enjoyable as the destinations.`}
                imageSrc="/services/content/luxury_tours.png"
                imageAlt="Luxury Winery Tour"
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Book Your Private Tour" />

            {/* FAQ Section */}
            <FAQSection items={tourFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Why Settle for <span className="text-luxury-black">Less?</span></strong>}
                description="Book your private chauffeur for the ultimate tour experience."
                buttonText="Book Tour Now"
                showFeatures={true}
            />
        </main>
    );
}
