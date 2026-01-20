"use client";

import { BookingWidget } from "./BookingWidget";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, UserCheck, Plane } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/hero_bg.png')" }}
            >
                {/* Lighter overlay for cinematic feel */}
                <div className="absolute inset-0 bg-black/40"></div>
                {/* Subtle gradient from bottom to blend the footer transition */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-black to-transparent"></div>
            </div>

            <div className="container mx-auto px-3 sm:px-4 relative z-10 flex-grow flex flex-col pt-24 sm:pt-28 md:pt-32 pb-4">
                {/* Heading Section */}
                <div className="text-center mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif font-bold text-xl sm:text-2xl md:text-5xl lg:text-6xl leading-tight text-white drop-shadow-2xl mb-2 sm:mb-3 px-1"
                    >
                        Melbourne’s Premier Chauffeur Service
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white/95 text-xs sm:text-sm md:text-lg font-medium tracking-wide max-w-4xl mx-auto drop-shadow-lg px-2 sm:px-4"
                    >
                        Premium Melbourne Chauffeur Service & Executive Car Service Airport Across Victoria
                    </motion.p>
                </div>

                {/* Widget Container */}
                <div className="flex items-center justify-center flex-grow mb-3 sm:mb-6 md:mb-8">
                    {/* Widget - Centered on all screens */}
                    <div className="w-full max-w-6xl px-0 sm:px-2 md:px-4 z-30">
                        <BookingWidget />
                    </div>
                </div>

                {/* Rating Section */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center text-center z-10 pb-20 sm:pb-24 md:pb-20">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-luxury-gold text-sm sm:text-lg md:text-xl mb-1 sm:mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="drop-shadow-md">★</span>
                        ))}
                    </div>
                    <p className="text-white font-semibold text-[11px] sm:text-sm md:text-base drop-shadow-lg mb-1 sm:mb-2">
                        4.9/5 Rating from 10,000+ Happy Clients
                    </p>
                    <div className="h-[1px] sm:h-[2px] w-16 sm:w-24 bg-luxury-gold/50 my-1 sm:my-2"></div>
                    <p className="text-white/90 font-serif italic text-[11px] sm:text-sm md:text-xl drop-shadow-lg">
                        Australia’s Most Trusted Executive Car Service
                    </p>
                </div>
            </div>

            {/* Bottom Section: Trust Indicators - Absolute Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-black/80 backdrop-blur-lg">
                <div className="container mx-auto px-2 sm:px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6 py-3 sm:py-5 md:py-6">
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
                                className="flex flex-col md:flex-row items-center justify-center gap-1 sm:gap-2 text-white/95 hover:text-luxury-gold transition-colors duration-300 group"
                            >
                                <item.icon className="text-luxury-gold w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] sm:text-[11px] md:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-center leading-tight">
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
