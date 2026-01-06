"use client";

import React from "react";
import { Star, Shield, Clock } from "lucide-react";

const WhyChooseUs = () => {
    return (
        <section className="px-16 py-24 md:py-32 bg-luxury-black text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-luxury-black to-black opacity-60" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <span className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
                        The ChauffeurTop Standard
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
                        Why Choose Us
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent mx-auto opacity-70" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <FeatureCard
                        icon={<Star className="w-8 h-8 text-luxury-gold" />}
                        title="Personal Care"
                        description="Every journey is personal. We deliver each ride with genuine care, ensuring your comfort is our absolute priority from start to finish."
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-luxury-gold" />}
                        title="Trusted Service"
                        description="Reliability you can count on. From booking to arrival, we manage every detail with precision, making us Melbourne's trusted choice."
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8 text-luxury-gold" />}
                        title="Luxury Standard"
                        description="We set the benchmark for quality. Our fleet is immaculate, our drivers are professionals, and our service is nothing short of exceptional."
                    />
                </div>

                {/* Premium Quote Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl text-center group hover:bg-white/10 transition-colors duration-500">
                        {/* Decorative Quote Mark */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-luxury-black border border-luxury-gold/30 p-3 rounded-full">
                            <svg className="w-6 h-6 text-luxury-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21L14.017 18C14.017 16.896 14.353 16.03 15.025 15.404C15.698 14.778 16.485 14.472 17.387 14.486L17.487 14.486L17.487 8.014C16.326 8.014 15.358 8.423 14.582 9.24C13.806 10.057 13.418 11.233 13.418 12.766L13.418 21L14.017 21ZM6.017 21L6.017 18C6.017 16.896 6.353 16.03 7.025 15.404C7.698 14.778 8.485 14.472 9.387 14.486L9.487 14.486L9.487 8.014C8.326 8.014 7.358 8.423 6.582 9.24C5.806 10.057 5.418 11.233 5.418 12.766L5.418 21L6.017 21Z" />
                            </svg>
                        </div>

                        <p className="text-xl md:text-2xl font-serif text-gray-200 leading-relaxed pt-4 italic">
                            "We believe how you travel matters. That’s why we offer a higher
                            standard of service built on luxury, reliability, and transparency."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="group relative p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-luxury-gold/30 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-luxury-gold/5 hover:-translate-y-1">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-luxury-black/50 border border-white/10 group-hover:scale-110 group-hover:border-luxury-gold/50 transition-all duration-500 shadow-lg">
            {icon}
        </div>

        <h3 className="text-xl font-serif font-semibold mb-4 text-white group-hover:text-luxury-gold transition-colors duration-300">
            {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
        </p>

        {/* Hover Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
);

export default WhyChooseUs;
