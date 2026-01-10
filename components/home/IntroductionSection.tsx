"use client";

import { CheckCircle2, MapPin, Clock, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function IntroductionSection() {
    return (
        <section className="py-20 relative overflow-hidden bg-white text-black">
            {/* Subtle background texture/gradient for depth */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50 to-transparent opacity-60"></div>

            <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            {/* Kicker - Removed duplicate text to avoid repetition with new icon heading, or changed to generic kicker */}
                            <span className="text-luxury-gold uppercase tracking-[0.25em] text-xs font-bold flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-luxury-gold"></span>
                                Premium Chauffeurs
                            </span>

                            {/* Main Heading - Reduced Size but Bold */}
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-[1.1] tracking-tight">
                                We’re Ready To <br />
                                <span className="text-luxury-gold italic pr-2">Serve You.</span>
                            </h2>
                        </div>

                        <div className="space-y-4 text-base md:text-lg font-light leading-relaxed text-black/80 max-w-xl">
                            <p>
                                When you travel with us, you choose <span className="font-semibold text-black">experience</span>, <span className="font-semibold text-black">discretion</span>, and <span className="font-semibold text-black">excellence</span>.
                            </p>
                            <p className="text-sm md:text-base text-black/60 border-l-4 border-luxury-gold/30 pl-4">
                                For generations, we have delivered chauffeur Melbourne services the way they were meant to be: <span className="italic text-black font-medium">polished, reliable, and quietly luxurious.</span>
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link href="/about">
                                <Button className="bg-black text-white hover:bg-luxury-gold hover:text-black border-2 border-transparent hover:border-black uppercase text-xs font-bold tracking-[0.15em] px-8 py-4 rounded-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Read More About Us
                                </Button>
                            </Link>
                        </div>

                        {/* Animated Features List - Now with Heading */}
                        <div className="pt-8 border-t border-gray-100 mt-8">
                            <h3 className="text-lg font-serif font-bold text-black mb-6">
                                Melbourne’s Most Trusted Chauffeur Service
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                {/* GPS Animation */}
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-luxury-gold/10 transition-colors">
                                        <motion.div
                                            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                            className="absolute inset-0 bg-luxury-gold/20 rounded-full"
                                        />
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold relative z-10">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide">GPS Tracked</span>
                                </div>

                                {/* Clock Animation */}
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-luxury-gold/10 transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold">
                                            <circle cx="12" cy="12" r="10" />
                                            <motion.line
                                                x1="12" y1="12" x2="12" y2="6"
                                                style={{ originX: "50%", originY: "50%" }}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            />
                                            <motion.line
                                                x1="12" y1="12" x2="16" y2="12"
                                                style={{ originX: "50%", originY: "50%" }}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Available 24/7</span>
                                </div>

                                {/* Experience Animation */}
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-luxury-gold/10 transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold">
                                            <motion.path
                                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Expert Chauffeurs</span>
                                </div>

                                {/* Reliable Animation */}
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-luxury-gold/10 transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-gold">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <motion.path
                                                d="M9 12l2 2 4-4"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Reliable & Safe</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative pl-6 lg:pl-0 pt-10 lg:pt-0">
                        <div className="relative rounded-lg overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-luxury-gold/5 mix-blend-multiply z-10 pointer-events-none"></div>
                            <img
                                src="/chauffeur_soft.png"
                                alt="Professional Chauffeur Service Melbourne"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-[1.5s] ease-out min-h-[400px] max-h-[600px]"
                            />


                        </div>
                        {/* Decorative Back Splash */}
                        <div className="absolute -z-10 top-0 right-0 w-3/4 h-full bg-gray-50 -mr-20 rounded-l-[4rem] hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
