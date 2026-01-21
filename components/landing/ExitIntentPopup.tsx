"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Mail, CheckCircle } from "lucide-react";
import { subscribeEmail } from "@/actions/emailSubscription";

interface ExitIntentPopupProps {
  onEmailCapture?: (email: string) => void;
  discountPercent?: number;
  source?: string;
}

export function ExitIntentPopup({
  onEmailCapture,
  discountPercent = 10,
  source = "exit_popup",
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if popup has been shown before in this session
  useEffect(() => {
    const shown = sessionStorage.getItem("exitIntentShown");
    if (shown) {
      setHasShown(true);
    }
  }, []);

  // Desktop: Mouse leave detection
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (hasShown) return;
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    },
    [hasShown]
  );

  // Scroll-based trigger: Show popup when user scrolls 50% of page
  useEffect(() => {
    if (hasShown) return;

    const handleScroll = () => {
      if (hasShown) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      // Trigger at 50% scroll depth
      if (scrollPercent >= 50) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  // Desktop: Add mouse leave listener
  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await subscribeEmail(email, source);

      if (result.success) {
        setDiscountCode(result.discountCode || null);
        setIsSubmitted(true);
        
        if (onEmailCapture) {
          onEmailCapture(email);
        }

        // Close after 5 seconds to let user see the discount code
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Gold Header */}
              <div className="bg-luxury-gold p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Gift className="w-8 h-8 text-luxury-black" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-luxury-black">
                  First Time Customer Luxury Offer
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isSubmitted ? (
                  <>
                    <p className="text-center text-gray-700 mb-6">
                      Get <span className="font-bold text-luxury-gold">{discountPercent}% OFF</span> your
                      first booking when you subscribe to our exclusive offers.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                          }}
                          placeholder="Enter your email"
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:border-luxury-gold focus:outline-none transition-colors"
                        />
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Claiming..." : `Claim My ${discountPercent}% Discount`}
                      </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      No spam. Unsubscribe anytime.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      You're In!
                    </h3>
                    {discountCode && (
                      <div className="bg-luxury-gold/10 border-2 border-luxury-gold rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Your exclusive discount code:</p>
                        <p className="text-2xl font-bold text-luxury-gold tracking-wider">{discountCode}</p>
                      </div>
                    )}
                    <p className="text-gray-600 text-sm">
                      Use this code at checkout for {discountPercent}% off your first booking!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
