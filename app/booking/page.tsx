import BookingForm from "@/components/booking/BookingForm";
import { ServiceHero } from "@/components/services/ServiceHero";
import { Phone, Mail, ShieldCheck, Gem, Clock, Star } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";

export default function BookingPage() {
    return (
        <main className="min-h-screen w-full relative flex flex-col items-center pt-32 pb-20 font-sans selection:bg-luxury-gold selection:text-black">

            {/* 1. Global Background Image */}
            <div
                className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/booking/hero.png')",
                    backgroundAttachment: "fixed", // Optional: Parallax feel
                }}
            >
                {/* Heavy overlay to ensure form readability */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />
            </div>

            {/* 2. Main Content Container */}
            <div className="mt-16 relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center gap-12">

                {/* Hero Headings (Centered as per screenshot) */}
                <div className="text-center max-w-3xl space-y-6">
                    <span className="text-luxury-gold text-sm md:text-base font-bold uppercase tracking-[0.2em] animate-fade-in-up">
                        Request Your Personalized Quote
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight drop-shadow-lg">
                        <strong>Luxury Awaits Your Call</strong>
                    </h1>
                    <div className="bg-white/10 backdrop-blur-sm border border-luxury-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
                        <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed mb-3">
                            Share your travel details below, and our concierge team will craft a tailored quote for your premium chauffeur experience.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-luxury-gold/90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">Available 7:00 AM - 10:00 PM</span>
                            <span className="text-white/60">|</span>
                            <span className="text-white/70">After-hours requests answered next business day</span>
                        </div>
                    </div>
                </div>

                {/* The Booking Form (Centered) */}
                <div className="w-full max-w-4xl">
                    <BookingForm />
                </div>

                {/* Footer Trust Indicators (Optional but nice to have below form) */}
                <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full max-w-4xl mt-8 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-luxury-gold" />
                        <p className="text-sm text-white font-medium uppercase tracking-wide">Secure Payment</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Gem className="w-6 h-6 text-luxury-gold" />
                        <p className="text-sm text-white font-medium uppercase tracking-wide">Premium Fleet</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Clock className="w-6 h-6 text-luxury-gold" />
                        <p className="text-sm text-white font-medium uppercase tracking-wide">Punctuality Guarantee</p>
                    </div>
                </div>

            </div>

            {/* 3. CTA Section */}
            <div className="relative z-10 w-full mt-24">
                <CTASection
                    title={
                        <>
                            Need Any  <span className="italic">Assistance?</span>
                        </>
                    }
                    description="Book your premium chauffeur service today and travel in unmatched comfort and style."
                    buttonText="COMPLETE YOUR BOOKING"
                />
            </div>
        </main>
    );
}
