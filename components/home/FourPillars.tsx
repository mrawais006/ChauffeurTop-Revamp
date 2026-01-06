"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const pillars = [
    {
        id: "punctuality",
        title: "Punctuality Guarantee",
        subtitle: "Your Time Is Respected, Always.",
        description: "We operate on precision, not promises. If your chauffeur is not present at the scheduled time, your next ride is on us. No excuses. No explanations. Just accountability, because arriving late is never an option when it matters most."
    },
    {
        id: "vetted",
        title: "Vetted & Licensed Chauffeurs",
        subtitle: "Professionally Accredited. Personally Trusted.",
        description: "Every chauffeur is fully licensed and accredited under Australian hire-car regulations, including those of CPVV (Victoria) . Each driver undergoes thorough background checks and holds a valid commercial driver's license."
    },
    {
        id: "flight",
        title: "24/7 Real-Time Flight Monitoring",
        subtitle: "We Adjust, So You Don’t Have To.",
        description: "Flights don’t always run on schedule. We do. Our team monitors your flight in real-time, automatically adjusting pickup times. Whether you land ahead of schedule or hours later, your chauffeur will be waiting and on time."
    },
    {
        id: "reviews",
        title: "Verified Client Reviews",
        subtitle: "Trusted by Executives, Families & Global Travellers",
        description: "Our reputation is built on real journeys and real experiences. From corporate leaders to international visitors, clients across Victoria consistently trust us for the best chauffeur service Melbourne, because trust is earned one ride at a time."
    }
];

// Rich Gold Gradient Definition
const GoldGradientDef = () => (
    <svg width="0" height="0" className="absolute">
        <defs>
            <linearGradient id="luxuryGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C6A355" /> {/* Muted Gold */}
                <stop offset="30%" stopColor="#F9E8B2" /> {/* Light Highlight */}
                <stop offset="60%" stopColor="#BF953F" /> {/* Deep Gold */}
                <stop offset="100%" stopColor="#8C6215" /> {/* Golden Brown Shadow */}
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    </svg>
);

// High-Fidelity Custom Icons
const Icons = {
    punctuality: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Stopwatch Body */}
                <path d="M50 8 C26.8 8 8 26.8 8 50 C8 73.2 26.8 92 50 92 C73.2 92 92 73.2 92 50 C92 26.8 73.2 8 50 8 Z M50 86 C30.1 86 14 69.9 14 50 C14 30.1 30.1 14 50 14 C69.9 14 86 30.1 86 50 C86 69.9 69.9 86 50 86 Z" fill="url(#luxuryGoldGradient)" />
                {/* Top Button */}
                <rect x="46" y="2" width="8" height="6" fill="url(#luxuryGoldGradient)" />
                {/* Angled Buttons */}
                <path d="M78 22 L84 16 L88 20 L82 26 Z" fill="url(#luxuryGoldGradient)" />
                {/* Clock Hands & Checkmark Hybrid */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Checkmark integrated into clock face */}
                    <path d="M35 50 L45 60 L68 35" fill="none" stroke="url(#luxuryGoldGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
                </motion.g>
                {/* Decorative Ticks */}
                <circle cx="50" cy="20" r="2" fill="url(#luxuryGoldGradient)" opacity="0.6" />
                <circle cx="50" cy="80" r="2" fill="url(#luxuryGoldGradient)" opacity="0.6" />
                <circle cx="20" cy="50" r="2" fill="url(#luxuryGoldGradient)" opacity="0.6" />
                <circle cx="80" cy="50" r="2" fill="url(#luxuryGoldGradient)" opacity="0.6" />
            </svg>
        </div>
    ),
    vetted: () => (
        <div className="relative w-16 h-16 flex items-center justify-center -mt-2">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Chauffeur Cap */}
                {/* Crown */}
                <path d="M25 25 Q 20 10 50 5 Q 80 10 75 25 Z" fill="url(#luxuryGoldGradient)" />
                {/* Visor/Base */}
                <path d="M20 30 Q 50 40 80 30 L 78 28 Q 50 38 22 28 Z" fill="url(#luxuryGoldGradient)" />

                {/* Head/Face - Clean Silhouette */}
                <path d="M35 35 Q 32 60 50 65 Q 68 60 65 35 Z" fill="url(#luxuryGoldGradient)" />

                {/* Suit Shoulders & Collar */}
                <path d="M20 70 Q 35 65 50 75 Q 65 65 80 70 L 85 95 H 15 Z" fill="url(#luxuryGoldGradient)" />

                {/* Tie & Shirt V */}
                <path d="M50 75 L 45 70 L 50 90 L 55 70 Z" fill="#F9E8B2" opacity="0.8" />
            </svg>
        </div>
    ),
    flight: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Standard 24x24 ViewBox for 'Library' Icons to ensure correct scaling and visibility */}
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                {/* Material Design 'Flight' Icon Path */}
                <path
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                    fill="url(#luxuryGoldGradient)"
                    transform="rotate(45, 12, 12)"
                />
            </svg>
        </div>
    ),
    reviews: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* User Silhouette (Left) */}
                <path d="M30 60 C15 60 10 90 10 90 H50 C50 90 45 60 30 60 Z" fill="url(#luxuryGoldGradient)" opacity="0.8" />
                <circle cx="30" cy="40" r="15" fill="url(#luxuryGoldGradient)" opacity="0.9" />

                {/* Large Review Box/Bubble (Right overlap) */}
                <path d="M45 25 H85 C87.76 25 90 27.24 90 30 V60 C90 62.76 87.76 65 85 65 H80 L70 75 V65 H45 C42.24 65 40 62.76 40 60 V30 C40 27.24 42.24 25 45 25 Z" fill="url(#luxuryGoldGradient)" />

                {/* 5 Stars inside Bubble - White cutouts or lighter gold */}
                <g fill="#fff" opacity="0.9">
                    <path d="M50 45 L52 50 L57 50 L53 54 L54 59 L50 56 L46 59 L47 54 L43 50 L48 50 Z" transform="scale(0.8) translate(10, 10)" />
                    <path d="M65 45 L67 50 L72 50 L68 54 L69 59 L65 56 L61 59 L62 54 L58 50 L63 50 Z" transform="scale(0.8) translate(10, 10)" />
                    <path d="M80 45 L82 50 L87 50 L83 54 L84 59 L80 56 L76 59 L77 54 L73 50 L78 50 Z" transform="scale(0.8) translate(10, 10)" />
                </g>

                {/* "Verified" Check badge on User */}
                <circle cx="15" cy="80" r="8" fill="#000" stroke="url(#luxuryGoldGradient)" strokeWidth="2" />
                <path d="M11 80 L14 83 L19 78" fill="none" stroke="url(#luxuryGoldGradient)" strokeWidth="2" />
            </svg>
        </div>
    )
};

export function FourPillars() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <GoldGradientDef />
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/city_night_luxury_bg.png')" }}
            >
                <div className="absolute inset-0 bg-luxury-black/90"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold block mb-2">
                        Why Locals Choose Us
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                        As The Most Trusted Chauffeur Service?
                    </h2>
                    <p className="text-white/70 max-w-3xl mx-auto font-light leading-relaxed text-lg">
                        Luxury means nothing without reliability. That’s why every part of our service is built on principles that have long defined professional chauffeuring: punctuality, safety, transparency, and accountability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, index) => {
                        const IconComponent = Icons[pillar.id as keyof typeof Icons];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="bg-white/5 border border-white/10 p-8 text-center hover:bg-white/10 hover:border-luxury-gold/50 transition-all duration-300 group rounded-sm flex flex-col h-full"
                            >
                                <div className="mb-6 inline-flex p-4 rounded-full bg-black/40 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-luxury-gold/20 mx-auto">
                                    <IconComponent />
                                </div>
                                <h3 className="text-xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors">
                                    {pillar.title}
                                </h3>
                                <div className="text-luxury-gold/80 text-xs uppercase tracking-wider font-medium mb-4 min-h-[1.5em]">
                                    {pillar.subtitle}
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed flex-grow">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center max-w-3xl mx-auto border-t border-white/10 pt-10">
                    <p className="text-white/70 font-light italic text-lg">
                        "No hidden charges. No last-minute surprises. Just refined service delivered the way it always has been, professionally, reliably, and with quiet confidence."
                    </p>
                </div>
            </div>
        </section>
    );
}
