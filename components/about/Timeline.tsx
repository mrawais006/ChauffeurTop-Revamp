"use client";

import React from "react";
import { motion } from "framer-motion";

const timelineData = [
    {
        year: "2014",
        title: "Inception",
        description: "ChauffeurTop was founded with a vision of premium chauffeur services.",
    },
    {
        year: "2015",
        title: "Digital Expansion",
        description: "Launches an online booking system for seamless, real-time reservations.",
    },
    {
        year: "2018",
        title: "Corporate Growth",
        description: "Introduces fully-tailored Corporate Travels solutions for business clients.",
    },
    {
        year: "2020",
        title: "Event Excellence",
        description: "Enhances special event services for high-profile occasions.",
    },
    {
        year: "2023",
        title: "Milestone Achieved",
        description: "Reaches a 1 million-mile driver with a record of zero late pick-ups.",
    },
    {
        year: "2024",
        title: "A Decade of Luxury",
        description: "Celebrates 11 years of luxury chauffeur services across Melbourne.",
    },
];

const Timeline = () => {
    return (
        <section className="py-24 md:py-40 bg-luxury-black text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-32 animate-fade-in-up">
                    <h2 className="text-4xl md:text-6xl font-serif font-medium mb-6">
                        Our Journey
                    </h2>
                    <div className="w-24 h-[1px] bg-luxury-gold mx-auto" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-zinc-800 hidden md:block" />

                    {/* Mobile Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-zinc-800 md:hidden" />

                    <div className="space-y-20 md:space-y-0">
                        {timelineData.map((item, index) => (
                            <TimelineItem key={item.year} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const TimelineItem = ({ item, index }: { item: any, index: number }) => {
    const isLeft = index % 2 !== 0;

    return (
        <div className={`relative z-10 md:grid md:grid-cols-2 w-full md:mb-0`}>

            {/* Mobile View */}
            <div className="md:hidden pl-20 relative">
                <div className="absolute left-6 top-3 transform -translate-x-1/2 w-3 h-3 rounded-full bg-luxury-black border border-luxury-gold z-10" />
                <div className="text-luxury-gold font-serif text-xl mb-1">{item.year}</div>
                <h3 className="text-2xl font-medium text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{item.description}</p>
            </div>

            {/* Desktop Left */}
            <div className={`hidden md:flex justify-end items-center pr-24 relative ${isLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {isLeft && (
                    <>
                        <div className="text-right">
                            <div className="text-luxury-gold text-2xl mb-2 font-serif tracking-widest">{item.year}</div>
                            <h3 className="text-3xl font-serif text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed max-w-sm ml-auto">{item.description}</p>
                        </div>
                        {/* Connector Line */}
                        <div className="absolute right-0 top-6 w-24 h-[1px] bg-zinc-800" />
                    </>
                )}
            </div>

            {/* Center Dot */}
            <div className={`hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center z-20`}>
                <div className="w-3 h-3 rounded-full bg-luxury-gold box-content border-4 border-luxury-black shadow-[0_0_10px_rgba(196,169,117,0.5)]" />
            </div>

            {/* Desktop Right */}
            <div className={`hidden md:flex justify-start items-center pl-24 relative ${!isLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {!isLeft && (
                    <>
                        {/* Connector Line */}
                        <div className="absolute left-0 top-6 w-24 h-[1px] bg-zinc-800" />
                        <div className="text-left">
                            <div className="text-luxury-gold text-2xl mb-2 font-serif tracking-widest">{item.year}</div>
                            <h3 className="text-3xl font-serif text-white mb-4">{item.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed max-w-sm">{item.description}</p>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default Timeline;
