"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import AddressAutocomplete from "@/components/maps/AddressAutocomplete";
import { saveWidgetData } from "@/lib/formPrePopulation";

export function BookingWidget() {
    const router = useRouter();

    // Basic fields for horizontal widget
    const [pickupLocation, setPickupLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [passengers, setPassengers] = useState("1");
    
    // Ref for time input
    const timeInputRef = useRef<HTMLInputElement>(null);

    // Validation
    const isValid = pickupLocation && destination && date && time;

    // Open time picker when clicking anywhere on the time field
    const handleTimeClick = () => {
        if (timeInputRef.current) {
            try {
                timeInputRef.current.showPicker();
            } catch (error) {
                timeInputRef.current.focus();
                timeInputRef.current.click();
            }
        }
    };
    
    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleGetQuote = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) return;

        // Save to sessionStorage instead of URL params
        saveWidgetData({
            pickup: pickupLocation,
            destination: destination,
            date: date,
            time: time,
            passengers: parseInt(passengers, 10) || 1,
        });

        // Navigate to booking page (data is now in sessionStorage)
        router.push('/booking');
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

                        {/* Row 2: Date, Time, Passengers, Button */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 items-end">
                            {/* Date */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    min={getMinDate()}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full min-h-[44px] sm:min-h-[48px] px-2 sm:px-3 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 [color-scheme:dark] transition-all"
                                />
                            </div>

                            {/* Time - Native time picker for consistency */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Time
                                </label>
                                <div 
                                    className="relative cursor-pointer"
                                    onClick={handleTimeClick}
                                >
                                    <input
                                        ref={timeInputRef}
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full min-h-[44px] sm:min-h-[48px] px-2 sm:px-3 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 transition-all cursor-pointer [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1 text-[10px] sm:text-[11px] md:text-xs text-luxury-gold uppercase tracking-wider font-bold">
                                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    Passengers
                                </label>
                                <select
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="w-full min-h-[44px] sm:min-h-[48px] px-2 sm:px-3 bg-white/10 border-2 border-luxury-gold/40 rounded-lg text-white text-xs sm:text-sm focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white/20 transition-all"
                                >
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num} className="bg-luxury-black text-white">
                                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Get Quote Button - spans 2 columns on small */}
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
