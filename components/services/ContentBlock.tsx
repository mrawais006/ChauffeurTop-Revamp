"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ContentBlockProps {
    title: string;
    content: string;
    imageSrc: string;
    imageAlt: string;
    isReversed?: boolean;
}

export function ContentBlock({ title, content, imageSrc, imageAlt, isReversed = false }: ContentBlockProps) {
    return (
        <section className="px-16 py-20 md:py-32 overflow-hidden bg-luxury-black">
            <div className="container mx-auto px-4">
                <div className={cn(
                    "flex flex-col lg:flex-row items-center gap-12 lg:gap-20",
                    isReversed ? "lg:flex-row-reverse" : ""
                )}>
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-white">
                            {title}
                        </h2>
                        <div className="w-20 h-1 bg-luxury-gold" />
                        <div className="text-white/70 text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
                            {content}
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 group">
                            <div className="absolute inset-0 bg-luxury-gold/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
