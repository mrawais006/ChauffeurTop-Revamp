"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Service Data with allocated images
const services = [
    {
        id: "airport",
        title: "Airport Transfers",
        description: "On-time, stress-free Melbourne airport chauffeur pickups and drop-offs, with precise flight tracking and friendly meet-and-greet service.",
        image: "/services/airport_transfer.png",
        href: "/services/airport-transfers"
    },
    {
        id: "corporate",
        title: "Corporate Travel",
        description: "Professional and reliable chauffeur services for executive tours and business travel, ensuring a comfortable experience.",
        image: "/services/corporate_travel.png",
        href: "/services/corporate-travel"
    },
    {
        id: "family",
        title: "Family Travel",
        description: "Spacious, luxurious, and comfortable transport designed for safe, relaxed, and enjoyable family journeys.",
        image: "/services/family_travel.png",
        href: "/services/family-travel"
    },
    {
        id: "conference",
        title: "Conference & Special Events",
        description: "Seamless transport management for conferences and special occasions, tailored to schedule.",
        image: "/services/conference_event.png",
        href: "/services/conference-events"
    },
    {
        id: "tours",
        title: "Luxury Tours",
        description: "Private chauffeur Melbourne offers luxury tours with comfort, premier style, and expert local guidance.",
        image: "/services/luxury_tour.png",
        href: "/services/luxury-tours"
    },
    {
        id: "cruise",
        title: "Cruise Ship Transfers",
        description: "Reliable and seamless transfers to and from cruise terminals, timed perfectly to your schedule.",
        image: "/services/cruise_ship.png",
        href: "/services/cruise-ship-transfers"
    },
    {
        id: "students",
        title: "International Students Transfers",
        description: "Safe and dependable transportation for international students, providing peace of mind for families.",
        image: "/services/student_transfer.png",
        href: "/services/student-transfers"
    },
    {
        id: "wedding",
        title: "Wedding Limos",
        description: "Celebrate your wedding in style. Our drivers ensure a smooth ride, so you can arrive relaxed to enjoy every moment of your special day.",
        image: "/services/wedding_limo.png",
        href: "/services/wedding-limos"
    },
    {
        id: "nightout",
        title: "Night Out",
        description: "Make your night a memorable experience with our luxurious chauffeured service. Our drivers ensure that you travel safely and comfortably.",
        image: "/services/night_out.png",
        href: "/services/night-out"
    }
];

// Duplicate services to create a seamless loop
const duplicatedServices = [...services, ...services];

export function ServicesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const x = useMotionValue(0);

    // State to control animation
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Measure content width once mounted
    useEffect(() => {
        if (containerRef.current) {
            // The container holds 2 sets of services. One loop is half the total scrollWidth.
            setContentWidth(containerRef.current.scrollWidth / 2);
        }
    }, []);

    // Animation Loop - Only run on desktop
    useAnimationFrame((time, delta) => {
        // Disable auto-scroll on mobile
        if (!isMobile && !isDragging && !isHovering && contentWidth > 0) {
            // Faster speed for better responsiveness
            const moveBy = (delta / 1000) * 150; // Increased from 100 to 150px per second

            let newX = x.get() - moveBy;

            // Wrap Logic: If we've scrolled past the first set, jump back to 0 (which is visually identical)
            if (newX <= -contentWidth) {
                newX = 0;
            }
            // If dragging moved us way positive (right), wrap there too
            if (newX > 0) {
                newX = -contentWidth;
            }

            x.set(newX);
        }
    });

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 mb-16">
                <div className="text-center max-w-4xl mx-auto">
                    <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold block mb-4">
                        Our Chauffeur Services
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-black mb-6 leading-tight">
                        Hire Luxury Chauffeured Cars In Melbourne
                    </h2>
                    <p className="text-black leading-relaxed text-lg max-w-2xl mx-auto">
                        Looking for Airport Chauffeur Service Near Me? Whether you’re heading to the airport, moving between important business meetings, travelling with family, or simply seeking dependable, comfortable transport for everyday journeys, we’re here to serve you.
                    </p>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                className="relative w-full cursor-grab active:cursor-grabbing"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <motion.div
                    ref={containerRef}
                    className="flex gap-6 w-max"
                    style={{ x }} // Bind motion value directly
                    drag="x"
                    dragMomentum={false} // Stop immediately on release so our loop takes over seamlessly
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                >
                    {duplicatedServices.map((service, index) => (
                        <Link 
                            key={`${service.id}-${index}`}
                            href={service.href || '/services'}
                            className="relative w-[300px] h-[450px] lg:w-[calc(100vw/5.2)] flex-shrink-0 rounded-md overflow-hidden group shadow-lg select-none block"
                        >
                            {/* Background Image */}
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                            />

                            {/* Light Overlay - General darkening */}
                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                            {/* Gradient Overlay - Deeper at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                            {/* Content Container */}
                            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full">
                                <motion.div
                                    className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <h3 className="text-2xl font-serif font-semibold text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                                        <div className="overflow-hidden">
                                            <p className="text-white/80 text-sm leading-relaxed mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Decorative line */}
                                    <div className="w-12 h-[1px] bg-luxury-gold mt-4 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 delay-75"></div>
                                </motion.div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>

            {/* Fade Gradients at edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        </section>
    );
}
