"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Book Online", description: "Enter your cruise details and select your vehicle for a seamless start to your holiday." },
    { title: "Terminal Drop-off", description: "We drop you right at the terminal entrance, assisting with all heavy luggage." },
    { title: "Sail Away", description: "Start your cruise relaxed, knowing your return transfer is already taken care of." }
];

const cruiseFAQs = [
    {
        question: "Do You Service Station Pier?",
        answer: "Yes, we provide transfers to and from Station Pier and all other major Victorian cruise terminals."
    },
    {
        question: "How Much Luggage Can I Bring?",
        answer: "Cruises often mean extra luggage. Our fleet includes spacious SUVs and vans to accommodate multiple large suitcases."
    },
    {
        question: "What If My Ship Is Delayed?",
        answer: "We track ship arrival schedules just like flights. Your chauffeur will adjust the pick-up time accordingly."
    },
    {
        question: "Where Will The Chauffeur Meet Me?",
        answer: "Your chauffeur will meet you at the designated pick-up area with a name sign, ready to assist with your bags."
    }
];

export default function CruiseTransfersContent() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Cruise Ship Transfers"
                subtitle="Start Your Voyage in Style"
                description="Seamless door-to-port service. We ensure you arrive at the terminal relaxed and ready to sail."
                backgroundImage="/services/cruise_ship.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">The Perfect Start to Your <span className="text-luxury-gold">Holiday</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Don't let the stress of parking or public transport dampen your holiday spirit. ChauffeurTop provides premium transfers to Station Pier and other major cruise terminals. With ample luggage space and punctuality guaranteed, your holiday begins the moment you step into our car.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Station Pier</span>
                            <span className="text-xs text-white/70">Connections</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Spacious</span>
                            <span className="text-xs text-white/70">Luggage Capacity</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Punctual</span>
                            <span className="text-xs text-white/70">Guaranteed</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Door-to-Port</span>
                            <span className="text-xs text-white/70">Service</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <ContentBlock
                title="Seamless Port Connections"
                content={`Navigating cruise terminals can be chaotic. Our experienced chauffeurs know exactly where to drop you off for the smoothest check-in experience. We assist with all heavy luggage, ensuring you don't lift a finger until you're on board.\n\nReturning home? We track your ship's arrival time to ensure we are waiting for you as soon as you disembark, ready to whisk you home in comfort.`}
                imageSrc="/services/content/cruise_transfers.png"
                imageAlt="Cruise Ship Transfer"
                isReversed
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Process For Cruisers" />

            {/* FAQ Section */}
            <FAQSection items={cruiseFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Sail Away <span className="text-luxury-black">Stress-Free</span></strong>}
                description="Start your holiday with a smooth, luxurious ride to the port."
                buttonText="Book Cruise Transfer"
                showFeatures={true}
            />
        </main>
    );
}
