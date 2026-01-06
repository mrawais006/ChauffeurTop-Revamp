"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "/images/hero-1.png",
    "/images/hero-2.png",
    "/images/hero-3.png",
    "/images/hero-4.png",
];

export function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Overlay Gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/90 via-luxury-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-luxury-black/40 z-10" />

                    <img
                        src={images[index]}
                        alt={`Luxury Hero ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
