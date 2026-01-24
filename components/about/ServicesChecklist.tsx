"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
    "On-time service, every time",
    "Luxury chauffeur-driven car hire across Melbourne",
    "Executive meet-and-greet at airports, ferry terminals, and stations",
    "Corporate travel and special events",
    "Tailored winery tours and private day trips",
    "Scenic sightseeing tours across Victoria",
    "Chauffeur services for weddings",
];

const ServicesChecklist = () => {
    return (
        <section className="px-16 py-20 md:py-32 bg-white text-luxury-black overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Title and Checklist */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-luxury-black leading-tight">
                            You Deserve The Finest Chauffeur Solution In Melbourne
                        </h2>
                        <p className="text-lg text-gray-600 mb-10">
                            Give yourself the best that you deserve. Choose luxury Chauffeur
                            Services in Melbourne for:
                        </p>

                        <ul className="space-y-4 mb-10">
                            {services.map((service, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold-dark">
                                        <Check size={14} strokeWidth={3} />
                                    </span>
                                    <span className="text-lg text-gray-800 font-medium">{service}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/booking"
                            className="inline-block bg-luxury-black text-white px-8 py-4 rounded-full font-semibold tracking-wide hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
                        >
                            Enquire Now
                        </Link>
                    </motion.div>

                    {/* Right Column: Additional Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 shadow-lg"
                    >
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-luxury-black">Did you know?</h3>
                            <p className="text-gray-600 italic mb-4">
                                Many people spell chauffeur the way it sounds, “chauffeaur”, or write limousine as limosine or limozine?
                            </p>
                            <div className="w-16 h-1 bg-luxury-gold/30 rounded-full" />
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">
                            Spelling doesn’t matter when you’re choosing quality.
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            What truly matters is finding Melbourne’s leading chauffeur car service, ChauffeurTop.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            With fully qualified VHA-accredited chauffeurs, we service all of Victoria with a premium fleet ranging from the Mercedes-Benz E-Class and BMW 5 Series to the prestigious Mercedes S-Class and more.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ServicesChecklist;
