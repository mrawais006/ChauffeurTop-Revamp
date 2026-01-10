"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Fleet", href: "/fleet" },
    { name: "Services", href: "/services", hasDropdown: true },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const servicesList = [
    { name: "Airport Transfers", href: "/services/airport-transfers" },
    { name: "Corporate Travel", href: "/services/corporate-travel" },
    { name: "Family Travel", href: "/services/family-travel" },
    { name: "Conference & Events", href: "/services/conference-events" },
    { name: "Luxury Tours", href: "/services/luxury-tours" },
    { name: "Cruise Transfers", href: "/services/cruise-ship-transfers" },
    { name: "Student Transfers", href: "/services/student-transfers" },
    { name: "Wedding Limos", href: "/services/wedding-limos" },
    { name: "Night Out", href: "/services/night-out" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mobile Dropdown State
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-[10001] transition-all duration-300 ease-in-out border-b border-transparent",
                scrolled
                    ? "bg-luxury-black/90 backdrop-blur-md border-white/10 py-4 shadow-lg"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-[10000] group">
                    <Image
                        src="/logo/logo-1.png"
                        alt="Chauffeur Top"
                        width={200}
                        height={60}
                        className=" object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {/* Desktop Menu Links */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            // Check if this link has a dropdown (Services)
                            link.hasDropdown ? (
                                <div key={link.name} className="relative group">
                                    <Link
                                        href={link.href}
                                        className="flex items-center text-white hover:text-luxury-gold transition-colors text-sm uppercase tracking-wide font-medium py-2"
                                    >
                                        {link.name}
                                        <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                                    </Link>

                                    {/* Desktop Dropdown Menu */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-64 bg-luxury-black/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pt-2 pb-2">
                                        {/* Little arrow indicator */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-luxury-black border-t border-l border-white/10 rotate-45"></div>

                                        <div className="flex flex-col">
                                            {servicesList.map((service) => (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className="px-6 py-3 text-white/80 hover:text-luxury-gold hover:bg-white/5 transition-all text-sm font-light border-b border-white/5 last:border-0"
                                                >
                                                    {service.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white hover:text-luxury-gold transition-colors text-sm uppercase tracking-wide font-medium"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <Link href="/booking">
                            <Button variant="gold" size="sm" className="bg-luxury-gold text-black hover:bg-white hover:text-luxury-black ml-4 font-bold rounded-sm">
                                Book Now
                            </Button>
                        </Link>
                    </nav>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white z-[10000] relative p-2 flex items-center justify-center w-12 h-12"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? (
                        <X size={28} className="text-luxury-gold absolute" />
                    ) : (
                        <Menu size={28} className="absolute" />
                    )}
                </button>

                {/* Mobile Nav Overlay - Using Portal to escape stacking context */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: "100%" }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: "100%" }}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-luxury-black/95 backdrop-blur-xl z-[9999] flex flex-col pt-24 px-8 overflow-y-auto"
                            >
                                <nav className="flex flex-col space-y-6">
                                    {navLinks.map((link) => (
                                        link.hasDropdown ? (
                                            <div key={link.name} className="flex flex-col">
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="text-2xl font-serif text-white hover:text-luxury-gold transition-colors"
                                                    >
                                                        {link.name}
                                                    </Link>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setMobileServicesOpen(!mobileServicesOpen);
                                                        }}
                                                        className="p-2"
                                                        aria-label="Toggle services menu"
                                                    >
                                                        <ChevronDown
                                                            className={cn(
                                                                "w-6 h-6 transition-transform duration-300",
                                                                mobileServicesOpen ? "rotate-180 text-luxury-gold" : "text-white/50"
                                                            )}
                                                        />
                                                    </button>
                                                </div>

                                                {/* Mobile Submenu */}
                                                <AnimatePresence>
                                                    {mobileServicesOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden flex flex-col mt-4 ml-4 space-y-4 border-l border-white/10 pl-4"
                                                        >
                                                            {servicesList.map(service => (
                                                                <Link
                                                                    key={service.name}
                                                                    href={service.href}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                    className="text-lg text-white/70 hover:text-luxury-gold transition-colors"
                                                                >
                                                                    {service.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-2xl font-serif text-white hover:text-luxury-gold transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        )
                                    ))}
                                </nav>

                                <div className="mt-12 w-full">
                                    <Link href="/booking">
                                        <Button
                                            variant="gold"
                                            size="lg"
                                            className="w-full bg-luxury-gold text-black hover:bg-white hover:text-luxury-black font-bold text-lg rounded-sm py-6"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Book Now
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>

            {/* Mobile Sticky Bottom Book Button - Only show when menu NOT open */}
            {mounted && !mobileMenuOpen && createPortal(
                <div className="md:hidden fixed bottom-14 right-2 z-[40]">
                    {/* Floating FAB style for mobile if preferred, but user had sticky bottom before. Keeping logic roughly same but cleaner. */}
                </div>,
                document.body
            )}

            {/* Keeping the sticky bottom bar request from previous files if it was there contextually, 
                but actually the user's previous code had a full width bottom bar. I'll restore that. */}
            {mounted && !mobileMenuOpen && createPortal(
                <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-luxury-black/90 backdrop-blur-lg border-t border-white/10 z-[100] flex items-center gap-4">
                    <Link href="/booking" className="flex-1">
                        <Button
                            variant="gold"
                            size="lg"
                            className="w-full bg-luxury-gold text-black hover:bg-white hover:text-luxury-black font-bold text-lg shadow-lg rounded-sm"
                        >
                            Book Now
                        </Button>
                    </Link>

                    {/* Spacer for Floating Contact Button (which is fixed at bottom-right) */}
                    <div className="w-16 shrink-0"></div>
                </div>,
                document.body
            )}
        </nav>
    );
}

