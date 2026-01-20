"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import Link from "next/link";

interface CTASectionProps {
    title?: ReactNode;
    description?: string;
    buttonText?: string;
    showFeatures?: boolean;
}

export function CTASection({
    title = <strong>Book Your Premier Chauffeur Ride In Seconds</strong>,
    description = "Enjoy transparent, fixed pricing with no surprises. Simply enter your details and receive an immediate quote.",
    buttonText = "Get Quote",
    showFeatures = true
}: CTASectionProps) {
    return (
        <section className="py-24 relative bg-luxury-gold overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-serif text-luxury-black mb-6">
                    {title}
                </h2>
                <p className="text-luxury-black/80 text-lg max-w-2xl mx-auto mb-10 font-medium">
                    {description}
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/booking">
                        <Button size="lg" className="bg-luxury-black text-luxury-gold hover:bg-luxury-black/90 text-lg px-10 py-8 rounded-sm font-bold tracking-widest shadow-2xl">
                            {buttonText}
                        </Button>
                    </Link>
                    <div className="flex flex-col justify-center text-luxury-black font-semibold text-sm">
                        <span>Need to talk now?</span>
                        <a href="tel:0430240945" className="text-xl font-bold hover:text-white transition-colors">Call (04) 3024 0945</a>
                    </div>
                </div>

                {showFeatures && (
                    <div className="flex justify-center gap-8 mt-12 text-luxury-black/70 text-sm font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2">✔ Instant Pricing</span>
                        <span className="flex items-center gap-2">✔ Transparent Rates</span>
                        <span className="flex items-center gap-2">✔ 24/7 Availability</span>
                    </div>
                )}
            </div>
        </section>
    );
}
