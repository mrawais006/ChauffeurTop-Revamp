"use client";

import { motion } from "framer-motion";

interface Step {
    title: string;
    description: string;
}

interface ProcessStepsProps {
    steps: Step[];
    title?: string;
}

export function ProcessSteps({ steps, title = "How It Works" }: ProcessStepsProps) {
    return (
        <section className="py-32 bg-white overflow-hidden mb-6">
            <div className="container mx-auto px-4">
                <div className="text-center mb-24">
                    <span className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block pt-6">
                        Seamless Experience
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif text-black mb-8 relative inline-block">
                        <strong> {title}</strong>
                        {/* Decorative Underline */}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent opacity-60"></span>
                    </h2>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* The Golden Timeline Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-0 w-full h-px bg-zinc-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-gold to-transparent opacity-30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                                className="group relative flex flex-col items-center text-center"
                            >
                                {/* The Diamond Marker */}
                                <div className="relative shrink-0 mb-10 z-10">
                                    <div className="w-8 h-8 md:w-8 md:h-8 bg-white border-2 border-luxury-gold rotate-45 transform transition-transform duration-700 group-hover:rotate-[225deg] shadow-lg group-hover:shadow-[0_0_20px_rgba(196,169,117,0.4)] flex items-center justify-center">
                                        <div className="w-2 h-2 bg-luxury-gold rounded-full" />
                                    </div>

                                    {/* Number Display (Hanging below the diamond) */}
                                    <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
                                        <span className="text-6xl font-serif font-bold text-luxury-gold opacity-100 block drop-shadow-sm">
                                            0{index + 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Content (Pushed down to make space for the large number) */}
                                <div className="pt-16 px-4">
                                    <h3 className="text-2xl font-serif text-black mb-4 tracking-wide group-hover:text-luxury-gold transition-colors duration-300">
                                        <strong>{step.title}</strong>
                                    </h3>
                                    <p className="text-black font-semibold leading-loose text-lg">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Vertical Line for Mobile */}
                                {index !== steps.length - 1 && (
                                    <div className="md:hidden absolute bottom-[-4rem] left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-luxury-gold/50 to-transparent" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
