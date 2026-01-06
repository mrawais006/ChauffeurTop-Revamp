"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Reserve", description: "Book quickly through our dedicated corporate chauffeur services Melbourne line." },
    { title: "Connect", description: "Receive your chauffeur’s details and real-time tracking one hour before pickup." },
    { title: "Arrive", description: "Reach your destination on time, refreshed, and ready for business." }
];

const corporateFAQs = [
    {
        question: "Can I Track My Chauffeur In Real-Time?",
        answer: "Yes. All corporate transfers come with real-time GPS tracking for complete peace of mind."
    },
    {
        question: "Will The Chauffeur Wait If My Flight Is Delayed?",
        answer: "Absolutely. We monitor your flight and provide complimentary wait time to ensure punctual pickups."
    },
    {
        question: "Do You Offer Monthly Billing?",
        answer: "Yes, we offer centralized monthly billing with detailed reporting for all our corporate account holders."
    },
    {
        question: "Can I Request A Specific Chauffeur?",
        answer: "We strive to accommodate specific chauffeur requests for our regular corporate clients to build familiarity and trust."
    }
];

export default function CorporateTravelPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Reliable Corporate Travel"
                subtitle="Business Class Ground Transport"
                description="Focus on your business while ChauffeurTop handles your transport."
                backgroundImage="/services/corporate_travel.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">Take the Stress Out of <span className="text-luxury-gold">Business Travel</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Business travel is demanding. Between tight schedules, back-to-back meetings, and unexpected delays, the last thing you need is uncertainty about your transport. Say goodbye to waiting, unprofessional drivers, and cramped rides. Enjoy a quiet, climate-controlled space to prepare, focus, and arrive ready to succeed.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Excellence</span>
                            <span className="text-xs text-white/70">Corporate Standards</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">GPS</span>
                            <span className="text-xs text-white/70">Real-Time Tracking</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Billing</span>
                            <span className="text-xs text-white/70">Centralized Accounts</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">24/7</span>
                            <span className="text-xs text-white/70">Support Team</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Excellence Content */}
            <ContentBlock
                title="Premium Corporate Travel"
                content={`ChauffeurTop is the trusted choice for businesses, delivering seamless corporate chauffeur Melbourne with reliability, comfort, and professional service. From easy online booking to effortless payment, we ensure every aspect of your journey is handled with precision.\n\nOur corporate travel Melbourne chauffeurs are more than drivers; they are dedicated service professionals. Whether you prefer a quiet space to work, personalised route options, or local insights, your journey is tailored to meet your exact needs.`}
                imageSrc="/hero_bg.png"
                imageAlt="Corporate Travel"
            />

            {/* Corporate Benefits List (Kept as darker section for contrast) */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-white text-center mb-12">Streamlined Logistics for Your Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-luxury-black border border-white/10 rounded-sm hover:border-luxury-gold transition-colors">
                            <h3 className="text-xl font-bold text-luxury-gold mb-3">Centralized Billing</h3>
                            <p className="text-white/60">One monthly invoice with clear, fixed-rate pricing, no surprises.</p>
                        </div>
                        <div className="p-8 bg-luxury-black border border-white/10 rounded-sm hover:border-luxury-gold transition-colors">
                            <h3 className="text-xl font-bold text-luxury-gold mb-3">Dedicated Account Manager</h3>
                            <p className="text-white/60">A single point of contact to manage all bookings efficiently.</p>
                        </div>
                        <div className="p-8 bg-luxury-black border border-white/10 rounded-sm hover:border-luxury-gold transition-colors">
                            <h3 className="text-xl font-bold text-luxury-gold mb-3">Duty of Care</h3>
                            <p className="text-white/60">Fully vetted chauffeurs ensure passenger safety and peace of mind.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Simple 3-Step Booking" />

            {/* FAQ Section */}
            <FAQSection items={corporateFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Make Every Business Trip <span className="text-luxury-black">Effortless</span></strong>}
                description="Join the corporate travel services Melbourne that rely on ChauffeurTop."
                buttonText="Request a Corporate Account"
                showFeatures={true}
            />
        </main>
    );
}
