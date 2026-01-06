"use client";

import { BookingWidget } from "./BookingWidget";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, UserCheck, Plane } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative h-[100dvh] flex flex-col justify-between overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/hero_bg.png')" }}
            >
                {/* Lighter overlay for cinematic feel */}
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Subtle gradient from bottom to blend the footer transition */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-black to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col h-full pt-28 md:pt-20 pb-2">
                {/* Top Section: Heading - Auto Height */}
                <div className="text-center mb-1 flex-shrink-0">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif font-bold text-xl md:text-4xl lg:text-5xl leading-tight text-white drop-shadow-xl mb-1"
                    >
                        Melbourne’s Premier Chauffeur Service
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white/90 text-[10px] md:text-base font-medium tracking-wide max-w-4xl mx-auto drop-shadow-md px-2"
                    >
                        Premium Melbourne Chauffeur Service & Executive Car Service Airport Across Victoria
                    </motion.p>
                </div>

                {/* Middle Section: Widget Container - Flex Grow to take available space */}
                <div className="flex-grow flex items-center justify-center md:items-center md:justify-end relative min-h-[260px]">
                    {/* Widget - Right Aligned on Desktop, Centered and Scaled Down on Mobile */}
                    <div className="w-full lg:w-[330px] md:w-[613px] pt-10 md:pt-[54px] md:mr-16 lg:mr-32 origin-center z-30 scale-[0.85] md:scale-100">
                        <BookingWidget />
                    </div>
                </div>

                {/* Rating Section - Bottom - Auto Height */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center text-center z-10 pb-24 md:pb-16 scale-[0.8] md:scale-100 origin-bottom">
                    <div className="flex items-center gap-1 text-luxury-gold text-base mb-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="drop-shadow-md">★</span>
                        ))}
                    </div>
                    <p className="text-white font-medium text-[10px] md:text-sm drop-shadow-md mb-0.5">
                        4.9/5 Rating from 10,000+ Happy Clients
                    </p>
                    <div className="h-[1px] w-20 bg-white/30 my-1"></div>
                    <p className="text-white/80 font-serif italic text-xs md:text-lg drop-shadow-md">
                        Australia’s Most Trusted Executive Car Service
                    </p>
                </div>
            </div>

            {/* Bottom Section: Trust Indicators - Absolute Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/60 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 py-4 md:py-6">
                        {[
                            { icon: UserCheck, text: "Fully Licensed Chauffeurs" },
                            { icon: ShieldCheck, text: "Commercially Insured Fleet" },
                            { icon: Plane, text: "Meet & Greet Airport Service" },
                            { icon: Clock, text: "On-Time Guarantee" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                className="flex items-center justify-center gap-2 text-white/90"
                            >
                                <item.icon className="text-luxury-gold w-4 h-4 md:w-5 md:h-5 shrink-0" />
                                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-center md:text-left">
                                    {item.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
