"use client";

import * as React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReviewStars } from "@/components/ui/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data
const MOCK_REVIEWS = [
    {
        id: "r1",
        author_name: "Shaun Groenewegen",
        profile_photo_url: null,
        rating: 5,
        text: "Moss is amazing, personal service. I made a mistake on my booking, he was prompt in assisting to change. Moss was early for a 4am pick up to the airport. His car is immaculate and will definitely use moss and his service for future requirements.",
        relative_time_description: "a week ago",
        initial: "S"
    },
    {
        id: "r2",
        author_name: "Alistair Mattingley",
        profile_photo_url: null,
        rating: 5,
        text: "Moss arrived before the time he was booked and very professional. Drive into the airport and drop off was extremely relaxing. Was a great experience and would recommend Moss for the next time I need the service.",
        relative_time_description: "2 weeks ago",
        initial: "A"
    },
    {
        id: "r3",
        author_name: "Jo S",
        profile_photo_url: null,
        rating: 5,
        text: "When I was thinking about the cost of long term parking near Xmas time at the airport I decided to look up a private transfer instead. I found the costs actually quite comparable and I didn't need to muck around with bus transfers with my kids. Thank you for a great convenient service Moss!",
        relative_time_description: "a week ago",
        initial: "J"
    },
    {
        id: "r4",
        author_name: "Holly",
        profile_photo_url: null,
        rating: 5,
        text: "My go-to airport transfer service. Great communication, immaculate car, and Moss was fantastic. Highly recommend.",
        relative_time_description: "a week ago",
        initial: "H"
    },
    {
        id: "r5",
        author_name: "Mina Kim",
        profile_photo_url: null,
        rating: 5,
        text: "I've used their service and they provide excellent and efficient communication. I feel the trustworthy from their service. Responsive to my request! The only thing I can do is to give 5 stars to them ❤️ 😊",
        relative_time_description: "a week ago",
        initial: "M"
    }
];

export function ReviewsSection() {
    const [reviews, setReviews] = useState<any[]>(MOCK_REVIEWS);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews');
                const data = await res.json();
                if (data.result && data.result.reviews && data.result.reviews.length > 0) {
                    const mapped = data.result.reviews.map((r: any, idx: number) => ({
                        ...r,
                        id: r.id || `g-review-${idx}`
                    }));
                    setReviews(mapped);
                }
            } catch (error) {
                console.error("Failed to load live reviews.", error);
            }
        };
        fetchReviews();
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header Overlay */}
                <div className="text-center mb-16 relative z-10 px-4">
                    <h2 className="text-4xl md:text-6xl font-serif text-black mb-4">
                        <strong>What our clients say</strong>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
                        Discover why Melbourne's elite trust ChauffeurTop for their most important journeys.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                            alt="Google"
                            width={16}
                            height={16}
                        />
                        <span>5-Star Google Reviews</span>
                    </div>
                </div>

                {/* Static Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {reviews.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="border border-stone-800 bg-[#0F1014] shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center h-full hover:-translate-y-2 transition-transform duration-300"
                        >
                            <ReviewStars
                                className="text-luxury-gold mb-6"
                                rating={testimonial.rating}
                            />

                            <div className="w-full text-lg md:text-xl text-white/90 font-light italic leading-relaxed mb-8 flex-grow flex items-center justify-center">
                                <blockquote cite="#">
                                    "{testimonial.text.length > 200 ? testimonial.text.substring(0, 200) + "..." : testimonial.text}"
                                </blockquote>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/10 w-full justify-center mt-auto">
                                <Avatar className="size-12 border border-stone-700">
                                    {testimonial.profile_photo_url ? (
                                        <AvatarImage
                                            src={testimonial.profile_photo_url}
                                            alt={`Portrait of ${testimonial.author_name}`}
                                        />
                                    ) : null}
                                    <AvatarFallback className="bg-luxury-gold text-black font-bold">
                                        {testimonial.author_name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <span className="block text-lg font-semibold tracking-tight text-white">
                                        {testimonial.author_name}
                                    </span>
                                    <span className="block text-sm text-gray-400">
                                        {testimonial.relative_time_description}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
