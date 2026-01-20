"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutContent = () => {
    return (
        <section className="px-16 py-24 md:py-32 bg-luxury-black text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

                    {/* Text Content - Left Side */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="inline-block border-b-2 border-luxury-gold pb-1 mb-2">
                            <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm">About Our Service</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                            Excellence in <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-white">Every Journey</span>
                        </h2>

                        <div className="space-y-6 text-gray-300 font-light text-lg leading-relaxed">
                            <p>
                                We believe in integrity, quality, and affordable luxury, providing
                                exceptional service without compromise. From city transfers to
                                country Victoria travel, we cover all Melbourne suburbs and beyond.
                            </p>

                            <p>
                                Based in Melbourne, ChauffeurTop is a VHA-accredited chauffeur
                                hire company delivering premium, reliable transport across
                                Victoria. Our professionally trained chauffeurs and modern luxury
                                fleet ensure safe, punctual, and discreet journeys for every
                                occasion.
                            </p>

                            <p>
                                With a versatile fleet designed to meet diverse needs,
                                ChauffeurTop offers flexibility, comfort, and a refined
                                experience every time. Travel with us and experience the
                                difference.
                            </p>
                        </div>

                        <Link
                            href="/booking"
                            className="inline-flex items-center gap-2 text-luxury-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors duration-300 group"
                        >
                            Book Your Ride
                            <span className="w-8 h-[1px] bg-luxury-gold group-hover:w-12 group-hover:bg-white transition-all duration-300" />
                        </Link>
                    </div>

                    {/* Image - Right Side */}
                    <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group h-[500px] md:h-[600px] w-full">
                            <img
                                src="/about/luxury_chauffeur_opening_door.png"
                                alt="Professional Chauffeur Opening Car Door"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-8 left-8 right-8 z-10">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl inline-block">
                                    <p className="text-luxury-gold uppercase text-xs tracking-widest font-bold mb-1">Premium Service</p>
                                    <h3 className="text-2xl text-white font-serif">A Warm Welcome</h3>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-luxury-gold/10 rounded-full blur-[100px] -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-900/10 rounded-full blur-[100px] -z-10" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutContent;
