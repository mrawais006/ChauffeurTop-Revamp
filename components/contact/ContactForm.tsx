"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, MapPin, Clock, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/actions/contact";
import type { ContactFormData } from "@/types/contact";

const ContactForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const contactData = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Phone",
            content: "(04) 3024 0945",
            link: "tel:0430240945"
        },
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email",
            content: "info@chauffeurtop.com.au",
            link: "mailto:info@chauffeurtop.com.au"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Location",
            content: "3/199 Greenvale Dr, Greenvale, VIC 3059"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Hours",
            content: "24/7 Service Available"
        }
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Prevent double-submission - immediately disable
        if (loading) return;
        setLoading(true);
        setErrors({});

        const form = e.currentTarget;
        const formData = new FormData(form);

        const contactData: ContactFormData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        try {
            const result = await submitContactForm(contactData);

            if (result.success) {
                // Success - navigate to thank you page
                router.push('/thank-you');
            } else {
                // Show errors (both field-specific and general)
                const newErrors: Record<string, string> = {};
                
                if (result.fieldErrors) {
                    Object.assign(newErrors, result.fieldErrors);
                }
                
                if (result.error) {
                    newErrors.general = result.error;
                }
                
                setErrors(newErrors);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ general: 'Failed to send message. Please try again or contact us directly.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white">

            {/* Top Section: Information Cards */}
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-black p-10 rounded-2xl border border-white/10 hover:border-luxury-gold/50 hover:shadow-[0_15px_40px_-5px_rgba(223,168,116,0.2)] hover:-translate-y-2 hover:bg-zinc-950 transition-all duration-500 ease-out group flex flex-col items-center text-center"
                        >
                            <div className="mb-6 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-luxury-gold group-hover:scale-110 transition-all duration-300 shadow-inner group-hover:shadow-none relative overflow-hidden">
                                {/* Normal State Icon (Gold) */}
                                <div className="text-luxury-gold group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                {/* Hover State Icon (Black) */}
                                <div className="text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 flex items-center justify-center">
                                    {item.icon}
                                </div>
                            </div>

                            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-widest mb-3 font-bold">{item.title}</h4>

                            {item.link ? (
                                <a href={item.link} className="text-white hover:text-luxury-gold font-medium text-lg transition-colors">
                                    {item.content}
                                </a>
                            ) : (
                                <p className="text-white font-medium text-lg">
                                    {item.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Background Image & Glass Form */}
            <div className="relative w-full min-h-[700px] overflow-hidden">

                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/contact/luxury_contact_bg.png')" }}
                >
                </div>

                <div className="px-4 md:px-16 lg:px-16 xl:px-16 2xl:px-16 container mx-auto px-4 py-20 relative z-10">
                    <div className="flex items-center justify-center">

                        {/* Centered Glass Form */}
                        <div className="w-full max-w-2xl bg-black/60 backdrop-blur-xl p-10 md:p-14 rounded-2xl shadow-2xl border-2 border-white/20 hover:border-luxury-gold/50 transition-all duration-500">

                                <h3 className="font-serif text-3xl text-white mb-8 text-center tracking-wide">
                                    Send us a <span className="text-luxury-gold">Message</span>
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs text-luxury-gold uppercase tracking-wider font-bold ml-1">Full Name</label>
                                        <input
                                            suppressHydrationWarning
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            disabled={loading}
                                            className={`w-full h-12 bg-white/5 border-2 rounded-lg px-4 text-white text-base placeholder:text-white/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                errors.name 
                                                    ? 'border-red-500/50 focus:border-red-500' 
                                                    : 'border-white/20 focus:border-luxury-gold focus:bg-white/10'
                                            }`}
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded animate-in fade-in duration-200">
                                                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                <p className="text-xs text-red-400 font-medium">{errors.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs text-luxury-gold uppercase tracking-wider font-bold ml-1">Email Address</label>
                                        <input
                                            suppressHydrationWarning
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            disabled={loading}
                                            className={`w-full h-12 bg-white/5 border-2 rounded-lg px-4 text-white text-base placeholder:text-white/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                errors.email 
                                                    ? 'border-red-500/50 focus:border-red-500' 
                                                    : 'border-white/20 focus:border-luxury-gold focus:bg-white/10'
                                            }`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && (
                                            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded animate-in fade-in duration-200">
                                                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                <p className="text-xs text-red-400 font-medium">{errors.email}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-xs text-luxury-gold uppercase tracking-wider font-bold ml-1">Subject</label>
                                        <input
                                            suppressHydrationWarning
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            disabled={loading}
                                            className={`w-full h-12 bg-white/5 border-2 rounded-lg px-4 text-white text-base placeholder:text-white/30 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                errors.subject 
                                                    ? 'border-red-500/50 focus:border-red-500' 
                                                    : 'border-white/20 focus:border-luxury-gold focus:bg-white/10'
                                            }`}
                                            placeholder="Enter subject"
                                        />
                                        {errors.subject && (
                                            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded animate-in fade-in duration-200">
                                                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                <p className="text-xs text-red-400 font-medium">{errors.subject}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs text-luxury-gold uppercase tracking-wider font-bold ml-1">Message</label>
                                        <textarea
                                            suppressHydrationWarning
                                            id="message"
                                            name="message"
                                            rows={5}
                                            required
                                            disabled={loading}
                                            className={`w-full bg-white/5 border-2 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                                                errors.message 
                                                    ? 'border-red-500/50 focus:border-red-500' 
                                                    : 'border-white/20 focus:border-luxury-gold focus:bg-white/10'
                                            }`}
                                            placeholder="How can we help you?"
                                        />
                                        {errors.message && (
                                            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded animate-in fade-in duration-200">
                                                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                <p className="text-xs text-red-400 font-medium">{errors.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* General Error */}
                                    {errors.general && (
                                        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in duration-200">
                                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-red-400 font-semibold">{errors.general}</p>
                                                <p className="text-xs text-red-400/70 mt-1">Please review the highlighted fields above.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-luxury-gold text-luxury-black hover:bg-white hover:text-black font-bold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-luxury-gold hover:scale-105"
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
