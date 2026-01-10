"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InformationSection() {
    return (
        <section className="py-24 px-4 md:px-16 relative overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20 bg-fixed"
                style={{ backgroundImage: "url('/city_night_luxury_bg.png')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/50 to-luxury-black/0"></div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2">
                    <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold block mb-4">
                        Explore Melbourne in Style
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                        <strong>Enjoy The Luxury Of <br />
                            <span className="text-gold-gradient">VIP Chauffeured Cars</span></strong>
                    </h2>

                    <div className="space-y-6 text-white/70 font-light text-lg leading-relaxed">
                        <p>
                            Explore everything Melbourne has to offer in comfort and style. As the capital of Victoria, Melbourne is a vibrant city renowned for its rich culture, diverse sports, exceptional dining, and a wide range of entertainment options.
                        </p>
                        <p>
                            Enjoy hidden laneways and rooftop bars, visit Federation Square, browse boutiques and eateries, and take in the iconic MCG. Experience St Kilda, the Royal Botanic Gardens, and the excitement of the Spring Racing Carnival.
                        </p>
                        <p>
                            With our luxury chauffeur Melbourne service, you can enjoy all of Melbourne’s highlights while staying comfortable and relaxed throughout your journey.
                        </p>
                    </div>

                    <Link href="/services/luxury-tours">
                        <Button variant="gold" className="mt-8 bg-luxury-gold hover:bg-white text-black px-8 py-6 rounded-sm font-bold tracking-widest">
                            BOOK YOUR TOUR NOW
                        </Button>
                    </Link>
                </div>

                <div className="w-full md:w-1/2 relative px-4 md:px-0">
                    <div className="border border-luxury-gold/30 p-2 md:p-4 rounded-sm rotate-0 md:rotate-2 hover:rotate-0 transition-transform duration-500 w-full max-w-full">
                        <div
                            className="bg-cover bg-center h-[300px] md:h-[400px] w-full rounded-sm grayscale hover:grayscale-0 transition-all duration-500 bg-no-repeat"
                            style={{ backgroundImage: "url('/hero_bg.png')" }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
