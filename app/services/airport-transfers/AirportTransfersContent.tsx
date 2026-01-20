"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Book Online", description: "Enter your flight details and select your luxury airport transfer Melbourne in under 2 minutes." },
    { title: "Receive Confirmation", description: "Instantly receive your executive airport transfers Melbourne booking confirmation and chauffeur details via email or SMS." },
    { title: "Enjoy the Ride", description: "Your professional chauffeur will meet you at the designated spot. Sit back, relax, and travel in comfort and style." }
];

const airportFAQs = [
    {
        question: "How Long Is The Trip From Melbourne Airport To Melbourne CBD?",
        answer: "Melbourne CBD is about 23 km from Melbourne Airport. The journey typically takes 25–30 minutes during off-peak hours, but can take longer during peak traffic sounds."
    },
    {
        question: "Where Will My Chauffeur Meet Me?",
        answer: "Your chauffeur will meet you at the arrivals area with a personalised name sign, ready to assist with your luggage and guide you to your vehicle."
    },
    {
        question: "Does It Cost Extra If My Flight Is Delayed?",
        answer: "No. We track your flight in real-time and provide up to 60 minutes of complimentary waiting time for international arrivals, ensuring your chauffeur is there when you land."
    },
    {
        question: "How Much Does A Melbourne Airport Transfer Cost?",
        answer: "Pricing depends on your chosen vehicle. uses our online booking tool for transparent, fixed pricing with no hidden fees."
    }
];

export default function AirportTransfersContent() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Melbourne Airport Transfers"
                subtitle="Premium & Punctual"
                description="Premium airport transfers Melbourne with flight tracking, on-time pick-ups, and professional Meet & Greet service."
                backgroundImage="/services/airport_transfer.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black"><strong>Luxury Melbourne <span className="text-luxury-gold">Airport Transfers</span></strong></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        ChauffeurTop offers dependable Melbourne Airport transfers, prioritising luxury, comfort, punctuality, and professional service. Skip taxi queues and delays; your chauffeur will meet you at the terminal, assist with luggage, and transfer you smoothly to your hotel, office, or event.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Professional</span>
                            <span className="text-xs text-white/70">Chauffeurs</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Real-time</span>
                            <span className="text-xs text-white/70">Flight Monitoring</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Luxury</span>
                            <span className="text-xs text-white/70">Late-model Vehicles</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">24/7</span>
                            <span className="text-xs text-white/70">Customer Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* City Transfers Content */}
            <ContentBlock
                title="Melbourne Airport to City Transfers"
                content={`Travel from Melbourne Tullamarine Airport to the city in approximately 25–30 minutes, depending on traffic and time of day. Our airport transfers in Melbourne ensure a relaxed, uninterrupted journey in a well-appointed vehicle.\n\nWe offer the best airport transfers Melbourne for business and leisure travellers alike. Choose from executive sedans, luxury SUVs, people movers, minibuses, and coaches to suit your travel needs. Request a quick quote to find the private airport transfers Melbourne for your journey.`}
                imageSrc="/services/content/airport_transfer.png"
                imageAlt="Airport Transfer"
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="How It Works" />

            {/* FAQ Section */}
            <FAQSection items={airportFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            {/* Bottom CTA */}
            <CTASection
                title={<strong>Ready to Upgrade Your Airport Experience?</strong>}
                description="Don't leave your arrival to chance. Book your ChauffeurTop 24/7 airport transfer today."
                buttonText="Check Availability"
                showFeatures={false}
            />
        </main>
    );
}
