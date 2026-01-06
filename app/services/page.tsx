"use client";

import { ServiceHero } from "@/components/services/ServiceHero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const services = [
    {
        title: "Airport Transfers",
        description: "Arrive on time with our reliable airport chauffeur service. We monitor flights in real-time, assist with luggage, and ensure smooth transfers.",
        image: "/services/airport_transfer.png",
        link: "/services/airport-transfers"
    },
    {
        title: "Corporate Travel",
        description: "Make a lasting impression with an executive corporate chauffeur Melbourne designed for professionals who value efficiency.",
        image: "/services/corporate_travel.png",
        link: "/services/corporate-travel"
    },
    {
        title: "Family Travel",
        description: "Travelling with family should feel comfortable. Our family-friendly chauffeur service features spacious vehicles.",
        image: "/services/family_travel.png",
        link: "/services/family-travel"
    },
    {
        title: "Luxury Tours",
        description: "Experience the city like never before with our luxury tours in Melbourne. Travel in comfort and style.",
        image: "/services/luxury_tour.png",
        link: "/services/luxury-tours"
    },
    {
        title: "Cruise Transfers",
        description: "Start or end your cruise journey in absolute style and comfort. Seamless pick-up and drop-off at the terminal.",
        image: "/services/cruise_ship.png",
        link: "/services/cruise-ship-transfers"
    },
    {
        title: "Special Events & Conferences",
        description: "Luxury chauffeur services for special events and conferences in Melbourne, ensuring punctual arrivals.",
        image: "/services/conference_event.png",
        link: "/services/conference-events"
    },
    {
        title: "International Students",
        description: "Make your move stress-free with our International Student Transfers, reliable, comfortable, and timely.",
        image: "/services/student_transfer.png",
        link: "/services/student-transfers"
    },
    {
        title: "Wedding Chauffeur",
        description: "Make your special day unforgettable with our premium wedding car hire. Elegant, timely, and sophisticated.",
        image: "/services/wedding_limo.png",
        link: "/services/wedding-limos"
    },
    {
        title: "VIP Night Out",
        description: "Enjoy our signature service like a true VIP with our Melbourne VIP Chauffeur. Experience comfort, style, and luxury.",
        image: "/services/night_out.png",
        link: "/services/night-out"
    }
];

export default function ServicesPage() {
    return (
        <main className="bg-luxury-black min-h-screen text-white">
            <ServiceHero
                title="Our Premium Chauffeur Services"
                subtitle="Excellence in Motion"
                description="Experience the ChauffeurTop Standard of Excellence. 10+ years of 5-star rated service."
                backgroundImage="/city_night_luxury_bg.png"
            />

            {/* Service Grid */}
            <section className="px-16 py-24 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[400px] overflow-hidden rounded-sm border border-white/10"
                        >
                            {/* Background Image */}
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors">
                                    {service.title}
                                </h3>
                                <div className="h-1 w-12 bg-luxury-gold mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <p className="text-white/80 line-clamp-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    {service.description}
                                </p>
                                <Link href={service.link}>
                                    <Button variant="outline" className="border-white/30 text-white hover:bg-luxury-gold hover:text-black hover:border-luxury-gold transition-all opacity-0 group-hover:opacity-100 delay-200">
                                        View Service
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
