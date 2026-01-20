"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Book in Seconds", description: "Enter your family size and select the number of car seats needed, done in moments." },
    { title: "Meet Your Chauffeur", description: "Receive your family limo service Melbourne driver's details and a live GPS tracking link via SMS." },
    { title: "Sit Back & Relax", description: "Enjoy climate control, complimentary bottled water, and a safe journey for the whole family." }
];

const familyFAQs = [
    {
        question: "Do You Provide Child Seats?",
        answer: "Yes. Age-appropriate car seats (Infant, Toddler, Booster) are pre-installed, cleaned, and ready before your trip upon request."
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

export default function FamilyTravelContent() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Stress-Free Family Travel"
                subtitle="Comfortable & Safe"
                description="From pre-installed child seats to extra luggage space, we handle the logistics so you can focus on making memories."
                backgroundImage="/services/family_travel.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">Because Family Travel Shouldn't <span className="text-luxury-gold">Feel Like Work</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Managing suitcases, strollers, and restless kids while navigating traffic or airport queues is exhausting. At ChauffeurTop, we turn every family travel Melbourne into a seamless, stress-free transition, quiet, comfortable, and perfectly timed.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Safety First</span>
                            <span className="text-xs text-white/70">Vetted Drivers</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Child Seats</span>
                            <span className="text-xs text-white/70">Complimentary</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Spacious</span>
                            <span className="text-xs text-white/70">Fits Strollers</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Reliable</span>
                            <span className="text-xs text-white/70">5-Star Rated</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Content */}
            <ContentBlock
                title="Safety Isn't an Add-On. It's Our Priority."
                content={`At ChauffeurTop, we don't just provide a ride; we provide a safe and comfortable sanctuary for your family transportation Melbourne.\n\n• Vetted Professionals: All chauffeurs undergo rigorous background checks and are trained in "Family-First" etiquette.\n• Pre-Installed Car Seats: Age-appropriate seats (Infant, Toddler, Booster) are cleaned and installed before your arrival.\n• Door-to-Door Security: We ensure safe family transport in Melbourne, ensuring you and your children are safely at your destination before we depart.`}
                imageSrc="/services/content/family_travel.png"
                imageAlt="Safe Family Travel"
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Process For Families" />

            {/* FAQ Section */}
            <FAQSection items={familyFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Ready for a Better Way to <span className="text-luxury-black">Travel?</span></strong>}
                description="Don't leave your family's comfort to chance. Book your ChauffeurTop experience today."
                buttonText="Get Quote"
                showFeatures={true}
            />
        </main>
    );
}
