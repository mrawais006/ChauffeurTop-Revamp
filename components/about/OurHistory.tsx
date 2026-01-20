"use client";

import React from "react";

const OurHistory = () => {
    return (
        <section className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 relative">
                {/* Decorative Background Text */}
                <div className="absolute -top-20 -left-20 text-[200px] md:text-[300px] font-serif font-bold text-gray-50 opacity-50 pointer-events-none select-none z-0 leading-none">
                    2014
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Image Area - Left Side */}
                    <div className="relative min-h-[400px] md:h-[500px] w-full shadow-2xl rounded-sm overflow-hidden z-10 order-1">
                        <img
                            src="/about/about_hero_history_prestige.png"
                            alt="ChauffeurTop History"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Content Card - Right Side */}
                    <div className="w-full bg-white p-6 md:p-12 shadow-xl border-t-4 border-luxury-gold z-20 order-2">
                        <div className="animate-fade-in-up">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-8">
                                Our History
                            </h2>

                            <div className="space-y-6 text-black text-lg leading-relaxed">
                                <p>
                                    In 2014, we noticed a gap in Melbourne’s transport industry. People weren't just looking for a ride from A to B; they were looking for time to themselves. Time to prepare for a board meeting, time to relax after a long-haul flight, and time to feel safe with their families. From that vision, we turned Melbourne’s roads into a sanctuary of comfort and reliability. A decade later, with 11 years of Victoria-wide expertise, our premium fleet and professional drivers ensure a 'Perfect Arrival,' setting the standard for exceptional travel experiences.
                                </p>

                                <div className="pt-4 flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-gray-300" />
                                    <span className="uppercase text-xs tracking-[0.3em] text-gray-500 font-semibold">EST. 2014</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurHistory;
