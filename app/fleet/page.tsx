"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { FleetGrid } from "@/components/services/FleetGrid";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FleetPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Our Premium Fleet"
                subtitle="Prestige, Luxury, Comfort"
                description="Prestige, luxury, and meticulously appointed vehicles designed to keep you moving in absolute comfort and style."
                backgroundImage="/about/luxury_fleet_row_melbourne.png"
            />

            {/* The Gold Standard */}
            <section className="py-24 bg-white text-black">
                <div className="container mx-auto px-16 flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <span className="text-luxury-gold uppercase tracking-widest font-bold text-sm">The Gold Standard</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-black"><strong>Of Melbourne Chauffeur Services</strong></h2>
                        <p className="text-zinc-600 text-lg leading-relaxed">
                            Our premium fleet is designed to deliver a refined travel experience across every journey. From executive sedans to luxury SUVs, each vehicle is selected to suit airport transfers, corporate engagements, private events, and luxury tours, always with comfort, discretion, and reliability at the forefront.
                        </p>
                        <p className="text-zinc-600 text-lg leading-relaxed">
                            Every car is immaculately maintained, thoughtfully appointed, and operated by experienced professional chauffeurs who prioritise your safety, privacy, and time. Wherever you’re headed, enjoy a smooth, dependable ride that reflects true Melbourne chauffeur excellence.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-luxury-gold/30">
                                    <Car className="text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="text-black font-bold mb-1">Immaculate Presentation</h4>
                                    <p className="text-zinc-500 text-sm">Every vehicle is professionally detailed daily and rigorously inspected.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-luxury-gold/30">
                                    <Shield className="text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="text-black font-bold mb-1">Professional Chauffeurs</h4>
                                    <p className="text-zinc-500 text-sm">Fully licensed, background-checked, and trained in high-end hospitality.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-luxury-gold/30">
                                    <Star className="text-luxury-gold" />
                                </div>
                                <div>
                                    <h4 className="text-black font-bold mb-1">Premium Amenities</h4>
                                    <p className="text-zinc-500 text-sm">Complimentary Wi-Fi, chilled bottled water, and phone charging facilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-[600px] relative rounded-sm overflow-hidden group shadow-2xl">
                        <Image
                            src="/fleet/gold_standard_fleet_v2.png"
                            alt="Experience Excellence"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10" />
                        <div className="absolute bottom-10 left-10 right-10 z-20">
                            <h3 className="text-3xl font-serif text-white mb-2">Experience Excellence</h3>
                            <p className="text-white/80">Travel with the peace of mind that comes from a 10-year safety record.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fleet Grid - Using the Reusable Component (Data matches provided text) */}
            <div id="fleet-grid">
                <FleetGrid />
            </div>

            {/* Bottom CTA */}
            <section className="py-24 relative bg-luxury-gold overflow-hidden text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif text-luxury-black mb-6"><strong>Ready to Ride in <span className="text-white">Luxury?</span></strong></h2>
                    <p className="text-luxury-black/80 text-xl mb-8">Book your premium chauffeur service today.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/booking">
                            <Button size="lg" className="bg-luxury-black text-luxury-gold hover:bg-luxury-black/90 font-bold px-10 py-6 text-lg rounded-sm shadow-xl">Book Now</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
