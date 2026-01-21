"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Mail } from "lucide-react";

interface ExitIntentPopupProps {
  onEmailCapture?: (email: string) => void;
  discountPercent?: number;
}

export function ExitIntentPopup({
  onEmailCapture,
  discountPercent = 10,
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Mobile: Inactivity detection (30 seconds)
  useEffect(() => {
    if (hasShown) return;

    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!hasShown) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem("exitIntentShown", "true");
        }
      }, 30000); // 30 seconds of inactivity
    };

    // Events to track user activity
    const events = ["mousedown", "touchstart", "scroll", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (onEmailCapture) {
      onEmailCapture(email);
    }

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Close after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
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
                  Wait! Don't Leave Yet
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
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                        />
                      </div>

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
                      <Gift className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      You're In!
                    </h3>
                    <p className="text-gray-600">
                      Check your email for your exclusive {discountPercent}% discount code.
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
