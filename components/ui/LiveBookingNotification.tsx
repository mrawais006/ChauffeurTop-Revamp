"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface Notification {
  name: string;
  location: string;
  service: string;
  timeAgo: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { name: "Sarah", location: "Melbourne", service: "airport transfer", timeAgo: "2 minutes ago" },
  { name: "Michael", location: "South Yarra", service: "corporate transfer", timeAgo: "5 minutes ago" },
  { name: "Emma", location: "Toorak", service: "airport pickup", timeAgo: "8 minutes ago" },
  { name: "David", location: "Brighton", service: "family transfer", timeAgo: "12 minutes ago" },
  { name: "Lisa", location: "St Kilda", service: "airport transfer", timeAgo: "15 minutes ago" },
  { name: "James", location: "CBD", service: "corporate chauffeur", timeAgo: "18 minutes ago" },
  { name: "Sophie", location: "Richmond", service: "airport transfer", timeAgo: "22 minutes ago" },
  { name: "Chris", location: "Docklands", service: "special event", timeAgo: "25 minutes ago" },
];

interface LiveBookingNotificationProps {
  intervalMs?: number;
  durationMs?: number;
}

export function LiveBookingNotification({
  intervalMs = 35000, // Show every 35 seconds
  durationMs = 5000,   // Display for 5 seconds
}: LiveBookingNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 10000); // 10 second delay before first

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Set up interval for subsequent notifications
    const interval = setInterval(() => {
      showNotification();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isVisible, intervalMs]);

  const showNotification = () => {
    const notification = MOCK_NOTIFICATIONS[notificationIndex % MOCK_NOTIFICATIONS.length];
    setCurrentNotification(notification);
    setIsVisible(true);
    setNotificationIndex((prev) => prev + 1);

    // Hide after duration
    setTimeout(() => {
      setIsVisible(false);
    }, durationMs);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 md:bottom-8 left-4 z-40 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 pr-10">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {currentNotification.name} from {currentNotification.location}
                </p>
                <p className="text-sm text-gray-600">
                  just booked a {currentNotification.service}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {currentNotification.timeAgo}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
