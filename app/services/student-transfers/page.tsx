"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Book Ahead", description: "Secure your ride before you fly for guaranteed peace of mind upon arrival." },
    { title: "Meet & Greet", description: "Our driver meets you inside the terminal, holding a sign with your name." },
    { title: "Safe Arrival", description: "We transport you directly to your student accommodation or campus, hassle-free." }
];

const studentFAQs = [
    {
        question: "Is It Safe For International Students?",
        answer: "Yes. Safety is our top priority. All drivers are police-checked, and we provide real-time GPS tracking for peace of mind."
    },
    {
        question: "Can My Parents Track My Ride?",
        answer: "Absolutely. We can send a tracking link to parents or guardians so they know exactly when you've been picked up and dropped off."
    },
    {
        question: "Do You Offer University Campus Drop-offs?",
        answer: "Yes, we transfer students to all major Melbourne universities and student accommodation facilities."
    },
    {
        question: "How Much Luggage Can I Bring?",
        answer: "We have large vehicles capable of carrying multiple large suitcases. Please specify your luggage count when booking."
    }
];

export default function StudentTransfersPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="International Student Transfers"
                subtitle="Safe & Reliable"
                description="Make your move stress-free with our reliable, comfortable, and timely pick-up and drop-off services."
                backgroundImage="/services/student_transfer.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">A Warm Welcome to <span className="text-luxury-gold">Melbourne</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Moving to a new city or country for studies is a big step. ChauffeurTop ensures the first leg of that journey is safe and welcoming. Parents can have peace of mind knowing their children are in the hands of vetted professionals who will transport them directly to their university accommodation or homestay.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Safety First</span>
                            <span className="text-xs text-white/70">Vetted Drivers</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Tracking</span>
                            <span className="text-xs text-white/70">GPS Updates</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Helpful</span>
                            <span className="text-xs text-white/70">Luggage Assist</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Direct</span>
                            <span className="text-xs text-white/70">To Campus</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <ContentBlock
                title="Trusted by Families"
                content={`Our student transfer service is designed with safety as the #1 priority. We provide real-time tracking for parents overseas, ensuring they know exactly when their child has been picked up and arrived safely.\n\nOur chauffeurs are friendly and helpful, assisting with heavy luggage and providing a welcoming first impression of Melbourne.`}
                imageSrc="/hero_bg.png"
                imageAlt="Student Transfer"
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Simple Booking Process" />

            {/* FAQ Section */}
            <FAQSection items={studentFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Safe Arrival <span className="text-luxury-black">Guaranteed</span></strong>}
                description="Book a safe, reliable transfer for your student's arrival in Melbourne."
                buttonText="Book Student Transfer"
                showFeatures={true}
            />
        </main>
    );
}
