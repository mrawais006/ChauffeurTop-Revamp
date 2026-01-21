"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveVehicleSelection } from "@/lib/formPrePopulation";

const vehicles = {
    sedan: {
        title: "Executive Sedans",
        models: "Lexus ES | Mercedes-Benz E-Class",
        description: "Perfect for private airport transfers—arrive with quiet comfort and discretion.",
        image: "/fleet/vehicle_sedan.png"
    },
    suv: {
        title: "Luxury SUVs",
        models: "Audi Q7 | BMW X5",
        description: "Spacious and stylish—space for the whole family with a luxury SUV service.",
        image: "/fleet/vehicle_suv.png"
    },
    van: {
        title: "People Movers",
        models: "Mercedes-Benz V-Class",
        description: "Ideal for group limo hire and corporate events—professional and comfortable travel.",
        image: "/fleet/vehicle_van.png"
    },
    eco: {
        title: "Eco-Friendly",
        models: "Tesla Model S | Mercedes-Benz EQ7 | BMW i5",
        description: "Sustainable and modern, this is perfect for nature-minded travellers who seek efficiency.",
        image: "/fleet/eco_friendly.png"
    },
    premium: {
        title: "Premium Sedan",
        models: "Mercedes S-Class | BMW 7 Series | Audi A8",
        description: "Ultimate comfort for executives, VIPs, and special occasions, arrive in style with supreme luxury.",
        image: "/fleet/premium_sedan.png"
    }
};

type VehicleType = keyof typeof vehicles;

export function VehicleFleet() {
    const [activeTab, setActiveTab] = useState<VehicleType>("sedan");
    const router = useRouter();

    const getLabel = (type: VehicleType) => {
        switch (type) {
            case "sedan": return "Executive Sedans";
            case "suv": return "Luxury SUVs";
            case "van": return "People Movers";
            case "eco": return "Eco-Friendly";
            case "premium": return "Premium Sedan";
            default: return type;
        }
    };

    // Map vehicle types to vehicle categories used in booking form
    const getVehicleCategory = (type: VehicleType): string => {
        switch (type) {
            case "sedan": return "executive_sedan";
            case "suv": return "premium_suv";
            case "van": return "people_mover";
            case "eco": return "executive_sedan"; // Map eco to executive sedan
            case "premium": return "premium_sedan";
            default: return "executive_sedan";
        }
    };

    const handleGetQuote = () => {
        const category = getVehicleCategory(activeTab);
        saveVehicleSelection(category, '/');
        router.push('/booking');
    };

    return (
        <section className="py-24 bg-gradient-to-b from-luxury-black to-[#050510] relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold block mb-2">
                        Browse By Vehicle Type
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                        Choose the Ride That Matches Your Journey
                    </h2>
                    <p className="text-white/80 text-lg font-light mb-8 max-w-3xl mx-auto leading-relaxed">
                        You can now also book luxury car chauffeur Melbourne, exotic convertibles, minivans, and SUVs.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {(Object.keys(vehicles) as VehicleType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`px-6 py-2 rounded-full border transition-all uppercase text-xs tracking-wider ${activeTab === type
                                    ? "bg-luxury-gold text-black border-luxury-gold font-bold"
                                    : "border-white/20 text-white/60 hover:border-luxury-gold/50 hover:text-white"
                                    }`}
                            >
                                {getLabel(type)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row items-center gap-12"
                        >
                            <div className="md:w-3/5">
                                <motion.img
                                    src={vehicles[activeTab].image}
                                    alt={vehicles[activeTab].title}
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(197,160,89,0.15)] rounded-lg"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>

                            <div className="md:w-2/5 text-center md:text-left">
                                <h3 className="text-3xl font-serif text-luxury-gold mb-2">{vehicles[activeTab].title}</h3>
                                <p className="text-white/50 text-sm mb-6 uppercase tracking-wide">{vehicles[activeTab].models}</p>
                                <p className="text-white/80 text-lg font-light mb-8 leading-relaxed">
                                    {vehicles[activeTab].description}
                                </p>

                                <Button
                                    variant="gold"
                                    onClick={handleGetQuote}
                                    className="bg-gold-gradient text-black px-8 py-6 text-sm font-bold tracking-widest hover:scale-105 transition-transform"
                                >
                                    Get Quote
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
