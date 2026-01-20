"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { ContentBlock } from "@/components/services/ContentBlock";
import { FleetGrid } from "@/components/services/FleetGrid";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";

const processSteps = [
    { title: "Reserve", description: "Easily book our chauffeur by speaking directly with an event specialist." },
    { title: "Confirm", description: "Receive a detailed itinerary along with your chauffeur's information for complete peace of mind." },
    { title: "Enjoy", description: "Your chauffeur arrives early, assists with luggage, doors, and navigates the best route." }
];

const eventFAQs = [
    {
        question: "What Types Of Events Do You Cover?",
        answer: "We provide transport for weddings, galas, conferences, red-carpet events, and private celebrations."
    },
    {
        question: "Can I Book Multiple Vehicles For Large Events?",
        answer: "Yes. We can coordinate multiple cars or minibuses to ensure a seamless accommodation for all your guests."
    },
    {
        question: "Do You Offer Hourly Hires?",
        answer: "Absolutely. Our hourly hire service is perfect for events where you need a chauffeur on standby."
    },
    {
        question: "Can We Decorate The Vehicles?",
        answer: "For special events like weddings, we can arrange for ribbons and other elegant decorations upon request."
    }
];

export default function ConferenceEventsContent() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Special Events & Conferences"
                subtitle="Professional, Punctual, Prestigious"
                description="Professional chauffeurs for weddings, galas, and corporate milestones. Make every entrance count."
                backgroundImage="/services/conference_event.png"
            />

            {/* Introduction */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6 text-black">Why Professional <span className="text-luxury-gold">Transport Matters?</span></h2>
                    <p className="text-black text-lg leading-relaxed mb-8">
                        You've spent months planning the perfect event, every detail, from the décor to the guest list, has been carefully considered. The last thing you want is stress over traffic, parking, or last-minute delays. With ChauffeurTop, your arrival and departure are seamless, allowing you and your guests to focus on celebrating.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Stress-Free</span>
                            <span className="text-xs text-white/70">Logistics</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Safety First</span>
                            <span className="text-xs text-white/70">Secure Travel</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">The 'Wow' Factor</span>
                            <span className="text-xs text-white/70">Grand Entrance</span>
                        </div>
                        <div className="p-4 bg-luxury-black border border-luxury-gold/20 rounded-sm shadow-lg">
                            <span className="block text-luxury-gold font-bold mb-1">Coordination</span>
                            <span className="text-xs text-white/70">Event Planner Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Show-Stopping Content */}
            <ContentBlock
                title="Start Every Event with a Show-Stopping Entrance"
                content={`ChauffeurTop Conference and Events transport elevates your guests' experience, moving attendees or VIPs from hotels, homes, offices, or airport terminals in comfort and style. Ensure a lasting impression with a premium, reliable, and professional chauffeur service that speaks volumes before your event even begins.\n\nFrom smooth navigation through busy streets to valet-level service and punctual pick-ups, we handle the logistics so you can enjoy the moment. Make every entrance count, impress your guests, and turn ordinary travel into a memorable part of your event experience.`}
                imageSrc="/services/content/conference_events.png"
                imageAlt="Red carpet event arrival"
                isReversed
            />

            {/* Exclusive Fleet */}
            <FleetGrid />

            {/* How It Works */}
            <ProcessSteps steps={processSteps} title="Book Us Easily" />

            {/* FAQ Section */}
            <FAQSection items={eventFAQs} title="Frequently Asked Questions" className="bg-zinc-900" />

            {/* Bottom CTA */}
            <CTASection
                title={<strong>Make Your First Impression <span className="text-luxury-black">Last</span></strong>}
                description="Ensure every arrival is memorable. Our 24/7 team tailors transport for guests and VIPs."
                buttonText="Book Event Transport"
                showFeatures={true}
            />
        </main>
    );
}
