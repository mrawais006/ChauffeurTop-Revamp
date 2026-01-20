"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import AddressAutocomplete from "@/components/maps/AddressAutocomplete";

export function BookingWidget() {
    const router = useRouter();

    // Basic fields for horizontal widget
    const [pickupLocation, setPickupLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [timeHour, setTimeHour] = useState("");
    const [timeMinute, setTimeMinute] = useState("");
    const [timeAmPm, setTimeAmPm] = useState("");

    // Validation
    const isValid = pickupLocation && destination && date && timeHour && timeMinute && timeAmPm;

    const handleGetQuote = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) return;

        // Build URL with query parameters
        const params = new URLSearchParams({
            pickup: pickupLocation,
            destination: destination,
            date: date,
            time: `${timeHour}:${timeMinute} ${timeAmPm}`
        });

        // Navigate to booking page with pre-filled data
        router.push(`/booking?${params.toString()}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full"
        >
            <form onSubmit={handleGetQuote} className="w-full">
                {/* Glassmorphism Widget */}
                <div className="bg-black/80 backdrop-blur-xl border-2 border-luxury-gold/60 rounded-xl shadow-2xl p-3 sm:p-4 md:p-5">
                    {/* Responsive Grid Layout - 2 rows on desktop for better spacing */}
                    <div className="flex flex-col gap-3 md:gap-4">
                        {/* Row 1: Location inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {/* Pickup Location */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    From
                                </label>
                                <AddressAutocomplete
                                    placeholder="Pickup location"
                                    defaultValue={pickupLocation}
                                    onAddressSelect={setPickupLocation}
                                    className="min-h-[44px] sm:min-h-[48px] bg-white/10 border-2 border-luxury-gold/40 text-white placeholder:text-white/50 focus:border-luxury-gold focus:bg-white/20 rounded-lg transition-all text-sm"
                                />
                            </div>

                            {/* Destination */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    To
                                </label>
                                <AddressAutocomplete
                                    placeholder="Destination"
                                    defaultValue={destination}
                                    onAddressSelect={setDestination}
                                    className="min-h-[44px] sm:min-h-[48px] bg-white/10 border-2 border-luxury-gold/40 text-white placeholder:text-white/50 focus:border-luxury-gold focus:bg-white/20 rounded-lg transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Row 2: Date, Time, Button */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-end">
                            {/* Date */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full min-h-[44px] sm:min-h-[48px] px-2 sm:px-3 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 [color-scheme:dark] transition-all"
                                />
                            </div>

                            {/* Time */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Time
                                </label>
                                <div className="flex gap-1">
                                    <select
                                        value={timeHour}
                                        onChange={(e) => setTimeHour(e.target.value)}
                                        className="flex-1 min-h-[44px] sm:min-h-[48px] px-1 sm:px-2 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 transition-all"
                                    >
                                        <option value="" className="bg-luxury-black text-white">Hr</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <option key={h} value={h} className="bg-luxury-black text-white">{h}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={timeMinute}
                                        onChange={(e) => setTimeMinute(e.target.value)}
                                        className="flex-1 min-h-[44px] sm:min-h-[48px] px-1 sm:px-2 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 transition-all"
                                    >
                                        <option value="" className="bg-luxury-black text-white">Min</option>
                                        {["00", "15", "30", "45"].map((m) => (
                                            <option key={m} value={m} className="bg-luxury-black text-white">{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={timeAmPm}
                                        onChange={(e) => setTimeAmPm(e.target.value)}
                                        className="flex-1 min-h-[44px] sm:min-h-[48px] px-1 sm:px-2 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 transition-all"
                                    >
                                        <option value="" className="bg-luxury-black text-white">--</option>
                                        <option value="AM" className="bg-luxury-black text-white">AM</option>
                                        <option value="PM" className="bg-luxury-black text-white">PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Get Quote Button - spans 2 columns on small, 2 on large */}
                            <div className="col-span-2">
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    className="w-full min-h-[48px] sm:min-h-[52px] text-sm sm:text-base font-bold tracking-wide bg-luxury-gold hover:bg-white transition-all text-luxury-black shadow-lg rounded-lg disabled:opacity-60 disabled:cursor-not-allowed uppercase"
                                >
                                    Get Quote
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
