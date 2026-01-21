"use client";

import Image from "next/image";
import { Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface FleetItem {
  name: string;
  description: string;
  passengers: number;
  luggage: number;
  image: string;
}

interface LandingFleetGridProps {
  onCTAClick: () => void;
}

const defaultFleet: FleetItem[] = [
  {
    name: "Executive Sedans",
    description: "Ideal for 1-3 passengers, combining elegance with comfort for business and leisure.",
    passengers: 3,
    luggage: 2,
    image: "/fleet/vehicle_sedan.png"
  },
  {
    name: "Premium Sedans",
    description: "Ultimate luxury for VIP travel. BMW 7 Series, Audi A8, Mercedes S-Class quality.",
    passengers: 3,
    luggage: 2,
    image: "/fleet/premium_sedan.png"
  },
  {
    name: "Premium SUVs",
    description: "Spacious and powerful, perfect for small groups or extra luggage requirements.",
    passengers: 3,
    luggage: 5,
    image: "/fleet/vehicle_suv.png"
  },
  {
    name: "People Movers",
    description: "Ideal for groups up to 7 passengers. Perfect for families or small corporate groups.",
    passengers: 7,
    luggage: 6,
    image: "/fleet/vehicle_van.png"
  }
];

export function LandingFleetGrid({ onCTAClick }: LandingFleetGridProps) {
  return (
    <section className="py-16 bg-luxury-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Our Premium <span className="text-luxury-gold">Fleet</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Pristine Mercedes, BMW, and Audi vehicles maintained to the highest standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultFleet.map((vehicle, index) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden hover:border-luxury-gold/50 transition-all duration-300"
            >
              <div className="aspect-[16/10] relative bg-zinc-800">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{vehicle.name}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-luxury-gold" />
                    <span>{vehicle.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} className="text-luxury-gold" />
                    <span>{vehicle.luggage}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Single CTA at bottom */}
        <div className="text-center mt-10">
          <button
            onClick={onCTAClick}
            className="bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold text-lg px-10 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Quote for Any Vehicle
          </button>
        </div>
      </div>
    </section>
  );
}
