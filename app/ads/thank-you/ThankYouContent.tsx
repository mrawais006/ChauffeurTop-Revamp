"use client";

import { LandingPageLayout } from "@/components/landing/LandingPageLayout";
import { CheckCircle2, Clock, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BUSINESS_CONFIG, contactHelpers } from "@/lib/constants";

export default function ThankYouContent() {
  return (
    <LandingPageLayout>
      <section className="py-20 md:py-32 bg-gradient-to-b from-luxury-black to-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Thank You!
            </h1>

            {/* Confirmation Message */}
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Your quote request has been received. Our team will contact you within{" "}
              <span className="text-luxury-gold font-bold">30 minutes</span> during business hours.
            </p>

            {/* What's Next */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-luxury-gold" />
                <h2 className="text-lg font-bold text-white">What Happens Next?</h2>
              </div>
              <ul className="text-left space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-luxury-gold font-bold">1.</span>
                  <span>Our team reviews your request and prepares a personalized quote</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-luxury-gold font-bold">2.</span>
                  <span>You'll receive your quote via email and SMS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-luxury-gold font-bold">3.</span>
                  <span>Simply confirm to lock in your booking</span>
                </li>
              </ul>
            </div>

            {/* Return Trip Upsell */}
            <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-6 mb-10">
              <h3 className="text-xl font-bold text-luxury-gold mb-3">
                Need a Return Trip?
              </h3>
              <p className="text-white/70 mb-4">
                Add a return trip to your booking and save <span className="text-luxury-gold font-bold">10%</span> on the total fare.
              </p>
              <a
                href="tel:0430240945"
                className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold px-6 py-3 rounded-md transition-all"
              >
                <Phone size={18} />
                Call to Add Return Trip
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Urgent Contact */}
            <div className="text-center">
              <p className="text-white/60 mb-4">Need immediate assistance?</p>
              <a
                href={contactHelpers.getPhoneUrl()}
                className="inline-flex items-center gap-2 text-luxury-gold hover:text-white transition-colors text-lg font-medium"
              >
                <Phone size={20} />
                Call {BUSINESS_CONFIG.PHONE_DISPLAY}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </LandingPageLayout>
  );
}
