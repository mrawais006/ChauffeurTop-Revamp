"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Consult", description: "Discuss your wedding theme, schedule, and vehicle preferences with our specialists." },
    { title: "Prepare", description: "Our team details the vehicle and adds requested ribbons or decorations." },
    { title: "Celebrate", description: "Enjoy a flawless, punctual arrival on your most special day." }
];

const weddingFAQs = [
    {
        question: "Do You provide Wedding Ribbons?",
        answer: "Yes. We include classic white satin ribbons and red carpet service upon arrival as part of our wedding packages."
    },
    {
        question: "Can We View The Cars Before Booking?",
        answer: "Absolutely. We encourage couples to view our fleet in person to ensure the vehicle perfectly matches your vision."
    },
    {
        question: "Is There A Minimum Hire Time?",
        answer: "Wedding bookings typically have a minimum hire duration, often starting from 3 hours to cover pickup, ceremony, and photos."
    },
    {
        question: "Do You Provide Champagne?",
        answer: "We offer complimentary sparkling wine and refreshments for the bridal party to enjoy en route to the reception."
    }
];

export default function WeddingLimosPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Wedding Chauffeur Services"
                subtitle="Elegance for Your Special Day"
                description="Arrive in breathtaking style. Immaculate vehicles and white-glove service for the bride, groom, and guests."
                backgroundImage="/services/wedding_limo.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">Your Fairytale <span className="text-luxury-gold">Arrival</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Your wedding day deserves perfection. At ChauffeurTop, we understand the importance of timing, presentation, and grace. Our wedding cars are detailed to a mirror finish, and our chauffeurs are dressed to impress, ready to roll out the red carpet for your grand entrance.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Immaculate</span>
                            <span className="text-xs text-white/70">Presentation</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Red Carpet</span>
                            <span className="text-xs text-white/70">Included</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Punctual</span>
                            <span className="text-xs text-white/70">Guaranteed</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">White Glove</span>
                            <span className="text-xs text-white/70">Service</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <ContentBlock
                title="Tailored Wedding Packages"
                content={`We offer flexible packages to suit your wedding schedule, whether you need a single transfer to the ceremony or an all-day service for photos and reception transport.\n\nAmenities include white ribbons, red carpet service upon arrival, and complimentary sparkling wine to toast your celebration on the way to the reception.`}
                imageSrc="/hero_bg.png"
                imageAlt="Wedding Car"
                isReversed
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Planning Your Perfect Ride" />

            {/* FAQ Section */}
            <FAQSection items={weddingFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Say "I Do" to <span className="text-luxury-black">Luxury</span></strong>}
                description="Let us handle the transport details so you can focus on your special day."
                buttonText="Inquire About Weddings"
                showFeatures={true}
            />
        </main>
    );
}
