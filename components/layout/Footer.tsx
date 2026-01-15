"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { PaymentIcons } from "./PaymentIcons";

export function Footer() {
    return (
        <footer className="relative bg-luxury-black pt-24 pb-12 border-t border-white/5 overflow-hidden font-sans">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-luxury-black to-[#050510] z-0"></div>

            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent"></div>

            <div className="container mx-auto px-6 md:px-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
                    {/* Column 1: Brand Identity */}
                    <div className="space-y-8">
                        <Link href="/" className="inline-block group">
                            {/* User specified Logo */}
                            <Image
                                src="/logo/logo-1.png"
                                alt="Chauffeur Top"
                                width={240}
                                height={80}
                                className="h-14 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </Link>
                        <p className="text-white/60 text-sm leading-7 font-light">
                            Setting the benchmark in luxury transport. ChauffeurTop offers premium chauffeured services across Melbourne, ensuring every journey is punctual, private, and prestigious.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-luxury-gold hover:text-black hover:scale-105 transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xl font-serif text-white mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-luxury-gold"></span>
                        </h3>
                        <ul className="space-y-4 text-sm text-white/70 font-light">
                            {[
                                { name: "Home", href: "/" },
                                { name: "About Us", href: "/about" },
                                { name: "Our Fleet", href: "/fleet" },
                                { name: "Services", href: "/services" },
                                { name: "Get a Quote", href: "/booking" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-luxury-gold transition-colors flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="text-luxury-gold opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Premium Services */}
                    <div>
                        <h3 className="text-xl font-serif text-white mb-8 relative inline-block">
                            Our Services
                            <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-luxury-gold"></span>
                        </h3>
                        <ul className="space-y-4 text-sm text-white/70 font-light">
                            {[
                                { name: "Airport Transfers", href: "/services/airport-transfers" },
                                { name: "Corporate Travel", href: "/services/corporate-travel" },
                                { name: "Wedding Chauffeur", href: "/services/wedding-limos" },
                                { name: "Winery Tours", href: "/services/luxury-tours" }, 
                                { name: "Special Events", href: "/services/conference-events" }
                            ].map((service) => (
                                <li key={service.name}>
                                    <Link
                                        href={service.href}
                                        className="hover:text-luxury-gold transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-luxury-gold transition-colors"></span>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Concierge & Contact */}
                    <div className="flex flex-col h-full">
                        <div>
                            <h3 className="text-xl font-serif text-white mb-8 relative inline-block">
                                Contact Concierge
                                <span className="absolute -bottom-2 left-0 w-8 h-[2px] bg-luxury-gold"></span>
                            </h3>
                            <ul className="space-y-6 text-sm text-white/70 font-light">
                                <li className="flex items-start gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-luxury-gold/50 transition-colors shrink-0">
                                        <MapPin className="text-luxury-gold" size={16} />
                                    </div>
                                    <span className="leading-relaxed">123 Luxury Lane, Melbourne,<br />Victoria 3000, Australia</span>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-luxury-gold/50 transition-colors shrink-0">
                                        <Phone className="text-luxury-gold" size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-white/40 uppercase tracking-wide mb-1">24/7 Support</span>
                                        <a href="tel:0430240945" className="text-white hover:text-luxury-gold transition-colors text-lg font-medium">(04) 3024 0945</a>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4 group">
                                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-luxury-gold/50 transition-colors shrink-0">
                                        <Mail className="text-luxury-gold" size={16} />
                                    </div>
                                    <a href="mailto:admin@chauffeurtop.com.au" className="hover:text-luxury-gold transition-colors">admin@chauffeurtop.com.au</a>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-auto pt-8">
                            <PaymentIcons />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-light tracking-wide">
                    <p>&copy; {new Date().getFullYear()} ChauffeurTop. All rights reserved.</p>



                    <div className="flex gap-8">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>

                    </div>
                </div>
            </div>
        </footer>
    );
}
