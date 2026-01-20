"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Plan Your Night", description: "Tell us your itinerary or book hourly for complete flexibility." },
    { title: "Ride in Style", description: "Your chauffeur arrives in a pristine luxury vehicle, ready to escort you." },
    { title: "Safe Return", description: "Enjoy your night knowing your safe ride home is waiting whenever you are." }
];

const nightOutFAQs = [
    {
        question: "Can We Make Multiple Stops?",
        answer: "Absolutely. With our 'As Directed' hourly hire, you have the vehicle at your disposal to visit as many venues as you like."
    },
    {
        question: "Is There A Minimum Booking Time?",
        answer: "For hourly hires, we typically have a minimum booking duration depending on the vehicle class, usually starting from 2-3 hours."
    },
    {
        question: "Can I Play My Own Music?",
        answer: "Yes, our vehicles are equipped with premium sound systems and Bluetooth connectivity so you can set the mood."
    },
    {
        question: "Are The Chauffeurs Discreet?",
        answer: "Privacy is paramount. Our professionally trained chauffeurs provide a discreet, unobtrusive service for your VIP night out."
    }
];

export default function NightOutPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="VIP Night Out Transfers"
                subtitle="Paint the Town Gold"
                description="Experience the ultimate night out in Melbourne. No parking, no waiting, just pure luxury."
                backgroundImage="/services/night_out.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">The City is <span className="text-luxury-gold">Yours</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        Whether it's a birthday celebration, a romantic dinner, or a night at the theatre, elevate your evening with ChauffeurTop. Forget about designated drivers or waiting for rideshares in the cold. Your private chauffeur waits for you, ensuring you move from venue to venue in safety and style.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">VIP</span>
                            <span className="text-xs text-white/70">Treatment</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Flexible</span>
                            <span className="text-xs text-white/70">Hourly Hire</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Privacy</span>
                            <span className="text-xs text-white/70">Tinted Windows</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Safety</span>
                            <span className="text-xs text-white/70">Late Night</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <ContentBlock
                title="A Night to Remember"
                content={`Customize your itinerary as you go. Our "As Directed" hourly hire gives you the freedom to change plans on a whim. Want to stop for late-night supper or head to a different club? Just let your chauffeur know.\n\nEnjoy the privacy of our tinted windows and the comfort of our luxury interiors as you enjoy Melbourne's vibrant nightlife.`}
                imageSrc="/services/content/night_out.png"
                imageAlt="Night Out Chauffeur"
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Your Perfect Night" />

            {/* FAQ Section */}
            <FAQSection items={nightOutFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Book Your <span className="text-luxury-black">Night Out</span></strong>}
                description="Don't kill the vibe waiting for a taxi. Your private car is ready when you are."
                buttonText="Reserve Now"
                showFeatures={true}
            />
        </main>
    );
}
