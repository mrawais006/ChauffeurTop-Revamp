"use client";

import React from "react";
import { MapPin } from "lucide-react";

const ServiceAreas = () => {
    const areas = [
        "Melbourne CBD", "St Kilda", "South Yarra", "Richmond",
        "Brighton", "Docklands", "Toorak", "Prahran",
        "Southbank", "Carlton", "Fitzroy", "Hawthorn",
        "Kew", "Malvern", "Albert Park", "Port Melbourne"
    ];

    return (
        <section className="py-24 bg-luxury-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-4 block">Where We Operate</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Service Areas</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
                        We provide premium chauffeur services across Melbourne and surrounding areas.
                        From the heart of the CBD to the coastal suburbs, we ensure a seamless journey wherever you need to go.
                    </p>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-3xl">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <MapPin className="text-luxury-gold w-6 h-6" />
                            <h3 className="text-2xl font-serif font-bold">Melbourne Metropolitan</h3>
                        </div>

                        <p className="text-gray-400 mb-8">
                            Complete coverage across Melbourne metropolitan area and surrounding suburbs.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                            {areas.map((area, index) => (
                                <span
                                    key={index}
                                    className="px-6 py-3 rounded-full bg-white/10 border border-white/10 text-gray-200 text-sm md:text-base font-medium hover:bg-luxury-gold hover:text-black hover:border-luxury-gold transition-all duration-300 cursor-default"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceAreas;
