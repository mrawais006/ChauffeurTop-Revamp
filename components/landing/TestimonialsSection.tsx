"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ReviewStars } from "@/components/ui/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  author_name: string;
  profile_photo_url: string | null;
  rating: number;
  text: string;
  relative_time_description: string;
  initial?: string;
}

interface TestimonialsSectionProps {
  title: string;
  serviceType: "airport" | "corporate" | "family";
}

// Service-specific testimonials
const AIRPORT_TESTIMONIALS: Testimonial[] = [
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
  }
];

const CORPORATE_TESTIMONIALS: Testimonial[] = [
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

const FAMILY_TESTIMONIALS: Testimonial[] = [
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
    id: "r1",
    author_name: "Shaun Groenewegen",
    profile_photo_url: null,
    rating: 5,
    text: "Moss is amazing, personal service. I made a mistake on my booking, he was prompt in assisting to change. Moss was early for a 4am pick up to the airport. His car is immaculate and will definitely use moss and his service for future requirements.",
    relative_time_description: "a week ago",
    initial: "S"
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

export function TestimonialsSection({ title, serviceType }: TestimonialsSectionProps) {
  let testimonials: Testimonial[] = [];
  
  switch (serviceType) {
    case "airport":
      testimonials = AIRPORT_TESTIMONIALS;
      break;
    case "corporate":
      testimonials = CORPORATE_TESTIMONIALS;
      break;
    case "family":
      testimonials = FAMILY_TESTIMONIALS;
      break;
  }

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            {title}
          </h2>
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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-white/10 bg-luxury-black shadow-2xl rounded-lg p-8 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
            >
              <ReviewStars
                className="text-luxury-gold mb-6"
                rating={testimonial.rating}
              />

              <div className="text-lg text-white/90 font-light leading-relaxed mb-8 flex-grow">
                <blockquote>
                  "{testimonial.text.length > 200 ? testimonial.text.substring(0, 200) + "..." : testimonial.text}"
                </blockquote>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
                <Avatar className="size-12 border border-white/20">
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
                  <span className="block text-lg font-semibold text-white">
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
