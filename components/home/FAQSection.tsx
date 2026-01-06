"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "Can I Make Last-Minute Or Same-Day Bookings?",
        answer: "Yes, we offer 24/7 service and accommodate last-minute requests. We recommend booking in advance for guaranteed vehicle availability."
    },
    {
        question: "Do You Offer Child Seats or Additional Luggage Space?",
        answer: "Yes, we provide high-quality child seats upon request. Our People Movers offer generous space for up to 7 passengers and four luggage items."
    },
    {
        question: "Is The Price I See The Final Price?",
        answer: "The quote you receive is the final price. We operate on a Fixed Pricing model with no hidden fees, tolls, or credit card surcharges."
    },
    {
        question: "Are There Safety Measures In Place?",
        answer: "Yes, we uphold the highest safety standards. All vehicles are meticulously cleaned and maintained before every transfer for your health and safety."
    },
    {
        question: "What Happens If My Flight Is Delayed?",
        answer: "We provide complimentary flight tracking for all chauffeur Melbourne Airport transfers, so your chauffeur will adjust the pickup time and meet you punctually at no extra cost."
    }
];

export interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items?: FAQItem[];
    title?: string;
    className?: string;
}

export function FAQSection({ items, title = "Frequently Asked Questions", className = "bg-luxury-black" }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const displayFaqs = items || faqs;

    return (
        <section className={`py-24 ${className}`}>
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold block mb-4">
                        Common Questions
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-white">
                        {title}
                    </h2>
                </div>

                <div className="space-y-4">
                    {displayFaqs.map((faq, index) => (
                        <div key={index} className="border border-white/10 rounded-sm overflow-hidden bg-white/5 hover:border-luxury-gold/30 transition-colors">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className={`text-lg transition-colors ${openIndex === index ? "text-luxury-gold" : "text-white"}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? <Minus className="text-luxury-gold" /> : <Plus className="text-white/50" />}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-white/70 font-light leading-relaxed border-t border-white/5 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
