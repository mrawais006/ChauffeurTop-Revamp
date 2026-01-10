"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface FleetItem {
    name: string;
    description: string;
    passengers: number;
    luggage: number;
    bags: number;
    image: string;
}

const defaultFleet: FleetItem[] = [
    {
        name: "Executive Sedans",
        description: "Ideal for 1-3 passengers, combining elegance with comfort for business and leisure.",
        passengers: 3,
        luggage: 2,
        bags: 2,
        image: "/fleet/vehicle_sedan.png"
    },
    {
        name: "Premium Sedans",
        description: "Ultimate luxury for VIP travel. BMW 7 Series, Audi A8, Mercedes S-Class quality.",
        passengers: 3,
        luggage: 2,
        bags: 2,
        image: "/fleet/premium_sedan.png"
    },
    {
        name: "Premium SUVs",
        description: "Spacious and powerful, perfect for small groups or extra luggage requirements.",
        passengers: 3,
        luggage: 5,
        bags: 3,
        image: "/fleet/vehicle_suv.png"
    },
    {
        name: "People Movers",
        description: "Seamless comfort for larger groups and families.",
        passengers: 6,
        luggage: 6,
        bags: 4,
        image: "/fleet/vehicle_van.png"
    },
    {
        name: "Minibuses & Coaches",
        description: "Luxury transport for medium to large groups and events.",
        passengers: 14,
        luggage: 10,
        bags: 10,
        image: "/fleet/luxury_minibus_black.png"
    }
];

export function FleetGrid() {
    return (
        <section className="py-24 bg-luxury-black relative">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-luxury-gold uppercase tracking-widest text-sm font-bold mb-3 block">
                        Our Exclusive Fleet
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">
                        Travel in <span className="text-luxury-gold">Black-Car Luxury</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {defaultFleet.map((vehicle, index) => (
                        <motion.div
                            key={vehicle.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-colors"
                        >
                            {/* Image Area */}
                            <div className="relative h-64 w-full bg-black overflow-hidden">
                                <Image
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-xl font-serif text-white">{vehicle.name}</h3>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 space-y-6">
                                <p className="text-white/60 text-sm leading-relaxed min-h-[40px]">
                                    {vehicle.description}
                                </p>

                                {/* Specs */}
                                <div className="flex items-center justify-between text-white/50 text-xs border-t border-white/10 pt-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <Users size={16} className="text-luxury-gold" />
                                        <span>{vehicle.passengers} Pax</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Briefcase size={16} className="text-luxury-gold" />
                                        <span>{vehicle.luggage} Suitcases</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <ShoppingBag size={16} className="text-luxury-gold" />
                                        <span>{vehicle.bags} Bags</span>
                                    </div>
                                </div>

                                <Link href={`/booking?vehicle=${encodeURIComponent(vehicle.name)}`}>
                                    <Button className="w-full bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all">
                                        Book This Vehicle
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
