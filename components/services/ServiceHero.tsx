"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceHeroProps {
    title: string;
    subtitle: string;
    description?: string;
    backgroundImage: string;
    onBookNow?: () => void;
    overlay?: boolean;
    backgroundClassName?: string;
}

export function ServiceHero({ title, subtitle, description, backgroundImage, onBookNow, overlay = true, backgroundClassName = "" }: ServiceHeroProps) {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${backgroundClassName}`}
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            >
                {overlay && (
                    <>
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm md:text-base mb-4 block">
                        {subtitle}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
                        <strong>{title}</strong>
                    </h1>
                    {description && (
                        <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            {description}
                        </p>
                    )}

                    <div className="flex flex-row items-center justify-center gap-4">
                        <Link href="/booking">
                            <Button
                                variant="gold"
                                size="lg"
                                className="bg-luxury-gold text-black hover:bg-white hover:text-luxury-black font-bold text-lg min-w-[200px]"
                            >
                                Get Quote
                            </Button>
                        </Link>
                        <a href="tel:+61430240945">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/20 text-white hover:bg-white/10 font-medium text-lg min-w-[200px]"
                            >
                                Call Now
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
