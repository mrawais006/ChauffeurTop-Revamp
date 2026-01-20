"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function FloatingContactButton() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    
    // Hide on booking page for mobile
    const isBookingPage = pathname === '/booking';
    
    // Only show on mobile, hide completely on desktop
    if (isBookingPage) {
        return null;
    }

    return (
        <div className="md:hidden fixed bottom-20 right-4 z-[101] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="mb-4 bg-white rounded-xl shadow-2xl p-4 w-72 origin-bottom-right"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Call Option */}
                            <a href="tel:0430240945" className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-[#2B303A] flex items-center justify-center shrink-0 group-hover:bg-[#2B303A]/90 transition-colors">
                                    <Phone className="text-white w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2B303A] font-bold text-base leading-tight">Call us now</span>
                                    <span className="text-gray-500 text-sm">Immediate assistance</span>
                                </div>
                            </a>

                            {/* WhatsApp Option */}
                            <a
                                href="https://wa.me/61430240945"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#20bd5a] transition-colors">
                                    {/* Whatsapp generally needs a custom SVG or specific icon, using Image for accuracy if icon not available, but Lucide doesn't have Whatsapp. Using a path or reliable SVG. */}
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#2B303A] font-bold text-base leading-tight">WhatsApp us</span>
                                    <span className="text-gray-500 text-sm">Quick chat support</span>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <div className="relative">
                {/* Ripple Effect (Only when closed to attract attention, or always? User said 'ripples will come out from it') */}
                {!isOpen && (
                    <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4A975] opacity-75"></span>
                        <span className="absolute inline-flex rounded-full h-full w-full bg-[#C4A975]/50 animate-pulse delay-75"></span>
                    </>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative z-10 w-16 h-16 rounded-full bg-[#C4A975] hover:bg-[#b09665] flex items-center justify-center text-white shadow-lg shadow-black/20 transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <X size={32} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0
                                }}
                                exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Phone size={28} strokeWidth={2.5} fill="currentColor" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );
}
