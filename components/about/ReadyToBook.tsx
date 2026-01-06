"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

const ReadyToBook = () => {
    return (
        <section className="py-24 relative bg-luxury-gold overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-black mb-6">
                    Ready To Book Your Next Ride With Us?
                </h2>

                <p className="text-luxury-black/80 text-lg max-w-2xl mx-auto mb-10 font-medium">
                    Experience the ultimate in comfort and reliability. Whether it's a simple transfer or a full day hire, we are ready to serve you.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/booking"
                        style={{

                            height: "50px"
                        }}
                        className="bg-luxury-black text-luxury-gold hover:bg-luxury-black/90 text-lg px-10 py-8 rounded-sm font-bold tracking-widest shadow-2xl inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-1"
                    >
                        BOOK ONLINE
                        <ArrowRight size={20} />
                    </Link>

                    <div className="flex flex-col justify-center text-luxury-black font-semibold text-sm">
                        <span className="mb-1">Need to talk now?</span>
                        <a
                            href="tel:0430240945"
                            className="text-xl font-bold hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <Phone size={20} className="stroke-[2.5]" />
                            Talk To Us
                        </a>
                    </div>
                </div>

                <div className="flex justify-center gap-8 mt-12 text-luxury-black/70 text-sm font-bold uppercase tracking-wider flex-wrap">
                    <span className="flex items-center gap-2">✔ Instant Confirmation</span>
                    <span className="flex items-center gap-2">✔ Secure Booking</span>
                    <span className="flex items-center gap-2">✔ Premium Fleet</span>
                </div>
            </div>
        </section>
    );
};

export default ReadyToBook;
