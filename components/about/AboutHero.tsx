"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutHero = () => {
    return (
        <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/about/about_hero_luxury_melbourne.png"
                    alt="Melbourne Luxury Chauffeur"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h2 className="text-luxury-gold uppercase tracking-[0.2em] text-sm md:text-base font-semibold">
                        12 Years. 1 Million Miles. One Promise: Punctuality
                    </h2>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">
                        About Us
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
                        Melbourne’s Luxury Chauffeur Services
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutHero;
