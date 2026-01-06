"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Clock, User, Mail, Phone, Car, Briefcase, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { submitBookingForm } from "@/actions/booking";
import type { BookingFormData, ReturnTripStructure } from "@/types/booking";
import { toast } from "sonner";
import { detectCityFromLocations, getCityTimezone } from "@/utils/cityDetection";

const vehicleDetails: Record<string, { name: string; image: string; description: string; passengers: number; luggage: number }> = {
    "executive-sedan": {
        name: "Executive Sedan",
        image: "/fleet/vehicle_sedan.png",
        description: "Mercedes-Benz E-Class or similar",
        passengers: 3,
        luggage: 2
    },
    "executive-suv": {
        name: "Executive SUV",
        image: "/fleet/vehicle_suv.png",
        description: "Mercedes-Benz GLE or similar",
        passengers: 4,
        luggage: 4
    },
    "people-mover": {
        name: "People Mover",
        image: "/fleet/vehicle_van.png",
        description: "Mercedes-Benz V-Class or similar",
        passengers: 7,
        luggage: 6
    },
    "eco-friendly": {
        name: "Eco-Friendly",
        image: "/fleet/eco_friendly.png",
        description: "Tesla Model S or similar",
        passengers: 3,
        luggage: 2
    },
    "premium-sedan": {
        name: "Premium Sedan",
        image: "/fleet/premium_sedan.png",
        description: "Mercedes-Benz S-Class or similar",
        passengers: 3,
        luggage: 3
    }
};

const countries = [
    { iso: "au", code: "+61", name: "Australia" },
    { iso: "us", code: "+1", name: "United States" },
    { iso: "gb", code: "+44", name: "United Kingdom" },
    { iso: "ca", code: "+1", name: "Canada" },
    { iso: "nz", code: "+64", name: "New Zealand" },
    { iso: "in", code: "+91", name: "India" },
    { iso: "sg", code: "+65", name: "Singapore" },
    { iso: "ae", code: "+971", name: "United Arab Emirates" },
    // Add more countries as needed
];

export function BookingWidget() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [step4Interacted, setStep4Interacted] = useState(false); // Track if user has interacted with Step 4

    // Step 1: Location & DateTime
    const [pickupLocation, setPickupLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [timeHour, setTimeHour] = useState("");
    const [timeMinute, setTimeMinute] = useState("");
    const [timeAmPm, setTimeAmPm] = useState("");

    // Step 2: Service & Vehicle
    const [serviceType, setServiceType] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");

    // Step 3: Passenger Details
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [passengers, setPassengers] = useState("");
    const [selectedCountry, setSelectedCountry] = useState({ iso: "au", code: "+61", name: "Australia" });
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    // Step 4: Additional Details
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [returnTrip, setReturnTrip] = useState(false);
    const [returnPickupLocation, setReturnPickupLocation] = useState("");
    const [returnDestination, setReturnDestination] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [returnTimeHour, setReturnTimeHour] = useState("");
    const [returnTimeMinute, setReturnTimeMinute] = useState("");
    const [returnTimeAmPm, setReturnTimeAmPm] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeVehicle = selectedVehicle ? vehicleDetails[selectedVehicle] : null;
    const maxPassengers = activeVehicle ? activeVehicle.passengers : 7;

    // Validation for each step
    const isStep1Valid = pickupLocation && destination && date && timeHour && timeMinute && timeAmPm;
    const isStep2Valid = serviceType && selectedVehicle;
    const isStep3Valid = fullName && phoneNumber && passengers;
    const isStep4Valid = !returnTrip || (returnPickupLocation && returnDestination && returnDate && returnTimeHour && returnTimeMinute && returnTimeAmPm);

    const handleNext = () => {
        if (step < 4) {
            const nextStep = step + 1;
            setStep(nextStep);
            // Reset step 4 interaction flag when entering step 4
            if (nextStep === 4) {
                setStep4Interacted(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Only allow submission if we're on step 4
        if (step !== 4) {
            console.log('Form submission prevented: not on step 4');
            return;
        }

        // CRITICAL: Prevent submission until user has interacted with Step 4
        if (!step4Interacted) {
            console.log('Form submission prevented: user has not interacted with Step 4 yet');
            toast.error('Please review the form before submitting');
            return;
        }

        // Validate step 4 requirements
        if (!isStep4Valid) {
            console.log('Form submission prevented: step 4 validation failed');
            return;
        }

        setLoading(true);

        try {
            // Get vehicle details
            const vehicle = activeVehicle;
            if (!vehicle) {
                toast.error('Please select a vehicle');
                setLoading(false);
                return;
            }

            // Format time
            const time = `${timeHour}:${timeMinute} ${timeAmPm}`;

            // Prepare destinations based on return trip
            let destinations: string[] | ReturnTripStructure;

            if (returnTrip) {
                // Return trip structure
                const returnTime = `${returnTimeHour}:${returnTimeMinute} ${returnTimeAmPm}`;
                destinations = {
                    type: 'return_trip',
                    outbound: {
                        pickup: pickupLocation,
                        destinations: [destination],
                        date: date,
                        time: time,
                        cityDateTime: `${date}T${timeHour.padStart(2, '0')}:${timeMinute}:00`
                    },
                    return: {
                        pickup: returnPickupLocation,
                        destination: returnDestination,
                        date: returnDate,
                        time: returnTime,
                        cityDateTime: `${returnDate}T${returnTimeHour.padStart(2, '0')}:${returnTimeMinute}:00`
                    }
                };
            } else {
                // Simple array for one-way
                destinations = [destination];
            }

            // Detect city and timezone
            const city = detectCityFromLocations(pickupLocation, returnTrip ? [destination, returnDestination] : [destination]);
            const timezone = getCityTimezone(city);
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Format melbourne_datetime
            const melbourne_datetime = `${date}T${timeHour.padStart(2, '0')}:${timeMinute}:00`;

            // Prepare booking data
            const bookingData: BookingFormData = {
                name: fullName,
                email: email || null,
                phone: phoneNumber,
                passengers: parseInt(passengers),
                vehicle_type: selectedVehicle,
                vehicle_name: vehicle.name,
                vehicle_model: vehicle.description,
                pickup_location: pickupLocation,
                destinations: destinations,
                date: date,
                time: time,
                service_type: serviceType,
                flight_number: '',
                terminal_type: '',
                driver_instructions: specialInstructions || '',
                melbourne_datetime: melbourne_datetime,
                timezone: timezone,
                user_timezone: userTimezone,
                city: city
            };

            // Submit to backend
            const result = await submitBookingForm(bookingData);

            if (result.success) {
                toast.success('Quote request submitted successfully! 🎉', {
                    description: 'We\'ll get back to you shortly with a quote.'
                });

                // Reset form
                setStep(1);
                setPickupLocation('');
                setDestination('');
                setDate('');
                setTimeHour('');
                setTimeMinute('');
                setTimeAmPm('');
                setServiceType('');
                setSelectedVehicle('');
                setFullName('');
                setEmail('');
                setPhoneNumber('');
                setPassengers('');
                setSpecialInstructions('');
                setReturnTrip(false);
                setReturnPickupLocation('');
                setReturnDestination('');
                setReturnDate('');
                setReturnTimeHour('');
                setReturnTimeMinute('');
                setReturnTimeAmPm('');
                setStep4Interacted(false); // Reset interaction flag
            } else {
                toast.error('Failed to submit quote request', {
                    description: result.error || 'Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            toast.error('An error occurred', {
                description: 'Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCountrySelect = (country: typeof countries[0]) => {
        setSelectedCountry(country);
        setPhoneNumber(country.code + " ");
        setIsCountryDropdownOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md p-4 md:p-5 rounded-lg shadow-2xl border border-white/10 w-full max-w-[440px] md:max-w-[440px] lg:max-w-[440px] mx-auto"
        >
            <h3 className="font-serif text-sm text-white mb-2 border-b border-white/10 pb-2 tracking-wide">
                Get Your Instant Chauffeur Quote
            </h3>

            {/* Progress Dots */}
            <div className="flex justify-center gap-1.5 mb-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            step === i ? "w-6 bg-luxury-gold" : "w-1.5 bg-white/20"
                        )}
                    />
                ))}
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-2"
                suppressHydrationWarning
                onKeyDown={(e) => {
                    // Prevent Enter key from submitting the form on any field
                    if (e.key === 'Enter' && (
                        e.target instanceof HTMLInputElement ||
                        e.target instanceof HTMLSelectElement ||
                        e.target instanceof HTMLTextAreaElement
                    )) {
                        e.preventDefault();
                        console.log('Enter key prevented on form field');
                    }
                }}
            >
                <AnimatePresence mode="wait">
                    {/* STEP 1: Location & DateTime */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Pickup Location</label>
                                <Input
                                    placeholder="Enter pickup address"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Destination</label>
                                <Input
                                    placeholder="Enter destination"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Date</label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Time</label>
                                <div className="flex gap-1">
                                    <select
                                        value={timeHour}
                                        onChange={(e) => setTimeHour(e.target.value)}
                                        className="flex-1 h-8 px-2 bg-white/5 border border-white/10 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                    >
                                        <option value="" disabled className="bg-gray-900">Hr</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <option key={h} value={h} className="bg-gray-900">{h}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={timeMinute}
                                        onChange={(e) => setTimeMinute(e.target.value)}
                                        disabled={!timeHour}
                                        className="flex-1 h-8 px-2 bg-white/5 border border-white/10 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                                    >
                                        <option value="" disabled className="bg-gray-900">Min</option>
                                        {["00", "15", "30", "45"].map((m) => (
                                            <option key={m} value={m} className="bg-gray-900">{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={timeAmPm}
                                        onChange={(e) => setTimeAmPm(e.target.value)}
                                        disabled={!timeHour}
                                        className="flex-1 h-8 px-2 bg-white/5 border border-white/10 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none disabled:opacity-50"
                                    >
                                        <option value="" disabled className="bg-gray-900">--</option>
                                        <option value="AM" className="bg-gray-900">AM</option>
                                        <option value="PM" className="bg-gray-900">PM</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Service & Vehicle */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Service Type</label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                    className="w-full h-8 px-2 bg-white/5 border border-white/10 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                >
                                    <option value="" disabled className="bg-gray-900">Select service</option>
                                    <option value="one-way" className="bg-gray-900">One-way Transfer</option>
                                    <option value="hourly" className="bg-gray-900">Hourly Hire</option>
                                    <option value="airport" className="bg-gray-900">Airport Transfer</option>
                                    <option value="wedding" className="bg-gray-900">Wedding Service</option>
                                    <option value="special-event" className="bg-gray-900">Special Event</option>
                                    <option value="corporate" className="bg-gray-900">Corporate Service</option>
                                </select>
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Select Vehicle</label>
                                <select
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                    className="w-full h-8 px-2 bg-white/5 border border-white/10 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                >
                                    <option value="" disabled className="bg-gray-900">Choose vehicle</option>
                                    <option value="executive-sedan" className="bg-gray-900">Executive Sedan (3)</option>
                                    <option value="executive-suv" className="bg-gray-900">Executive SUV (4)</option>
                                    <option value="people-mover" className="bg-gray-900">People Mover (7)</option>
                                    <option value="eco-friendly" className="bg-gray-900">Eco-Friendly (3)</option>
                                    <option value="premium-sedan" className="bg-gray-900">Premium Sedan (3)</option>
                                </select>
                            </div>
                            {activeVehicle && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/5 border border-white/10 rounded-lg p-2 mt-2"
                                >
                                    <div className="relative h-16 mb-1">
                                        <Image
                                            src={activeVehicle.image}
                                            alt={activeVehicle.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white text-[10px] font-bold">{activeVehicle.name}</p>
                                        <p className="text-white/60 text-[8px]">{activeVehicle.description}</p>
                                        <div className="flex justify-center gap-3 mt-1">
                                            <span className="text-[9px] text-luxury-gold flex items-center gap-1">
                                                <User className="w-2.5 h-2.5" /> {activeVehicle.passengers}
                                            </span>
                                            <span className="text-[9px] text-luxury-gold flex items-center gap-1">
                                                <Briefcase className="w-2.5 h-2.5" /> {activeVehicle.luggage}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 3: Passenger Details */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Full Name</label>
                                <Input
                                    placeholder="Your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Email (Optional)</label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Phone Number</label>
                                <div className="flex gap-1">
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            className="h-8 w-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            <img
                                                src={`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`}
                                                alt={selectedCountry.name}
                                                className="w-5 h-auto rounded-sm"
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {isCountryDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute top-full left-0 mt-1 w-64 bg-black border border-white/20 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto"
                                                >
                                                    {countries.map((country) => (
                                                        <button
                                                            key={country.iso}
                                                            type="button"
                                                            onClick={() => handleCountrySelect(country)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0"
                                                        >
                                                            <img
                                                                src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                                                                alt={country.name}
                                                                className="w-5 h-auto rounded-sm"
                                                            />
                                                            <span className="text-white text-xs flex-1">{country.name}</span>
                                                            <span className="text-luxury-gold text-xs">{country.code}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                    />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Passengers {activeVehicle && `(Max: ${activeVehicle.passengers})`}</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={maxPassengers}
                                    placeholder="Number of passengers"
                                    value={passengers}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (e.target.value === "" || (val >= 1 && val <= maxPassengers)) {
                                            setPassengers(e.target.value);
                                        }
                                    }}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Additional Details */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                            <div className="space-y-0.5">
                                <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Special Instructions</label>
                                <textarea
                                    placeholder="Any special requirements..."
                                    value={specialInstructions}
                                    onChange={(e) => {
                                        setSpecialInstructions(e.target.value);
                                        setStep4Interacted(true); // Mark as interacted
                                    }}
                                    className="w-full h-16 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-xs placeholder:text-white/30 focus:border-luxury-gold focus:outline-none resize-none"
                                />
                            </div>

                            {/* Return Trip Toggle */}
                            <div
                                onClick={() => {
                                    setReturnTrip(!returnTrip);
                                    setStep4Interacted(true); // Mark as interacted
                                }}
                                className={cn(
                                    "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all",
                                    returnTrip ? "bg-luxury-gold/10 border-luxury-gold/30" : "bg-white/5 border-white/10"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowRightLeft className={cn("w-3 h-3", returnTrip ? "text-luxury-gold" : "text-white/50")} />
                                    <span className={cn("text-[10px] font-bold", returnTrip ? "text-luxury-gold" : "text-white")}>
                                        Return Trip
                                    </span>
                                </div>
                                <div className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    returnTrip ? "border-luxury-gold bg-luxury-gold" : "border-white/20"
                                )}>
                                    {returnTrip && <CheckCircle2 className="w-3 h-3 text-black" />}
                                </div>
                            </div>

                            {/* Return Trip Fields */}
                            <AnimatePresence>
                                {returnTrip && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <div className="space-y-0.5">
                                            <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Return Pickup</label>
                                            <Input
                                                placeholder="Return pickup location"
                                                value={returnPickupLocation}
                                                onChange={(e) => setReturnPickupLocation(e.target.value)}
                                                className="bg-white/5 border-luxury-gold/30 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-0.5">
                                            <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Return Destination</label>
                                            <Input
                                                placeholder="Return destination"
                                                value={returnDestination}
                                                onChange={(e) => setReturnDestination(e.target.value)}
                                                className="bg-white/5 border-luxury-gold/30 text-white placeholder:text-white/30 focus:border-luxury-gold h-8 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-0.5">
                                            <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Return Date</label>
                                            <Input
                                                type="date"
                                                value={returnDate}
                                                onChange={(e) => setReturnDate(e.target.value)}
                                                className="bg-white/5 border-luxury-gold/30 text-white focus:border-luxury-gold h-8 text-xs [color-scheme:dark]"
                                            />
                                        </div>
                                        <div className="space-y-0.5">
                                            <label className="text-[9px] text-luxury-gold uppercase tracking-wider font-bold ml-1">Return Time</label>
                                            <div className="flex gap-1">
                                                <select
                                                    value={returnTimeHour}
                                                    onChange={(e) => setReturnTimeHour(e.target.value)}
                                                    className="flex-1 h-8 px-2 bg-white/5 border border-luxury-gold/30 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                                >
                                                    <option value="" disabled className="bg-gray-900">Hr</option>
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                                        <option key={h} value={h} className="bg-gray-900">{h}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={returnTimeMinute}
                                                    onChange={(e) => setReturnTimeMinute(e.target.value)}
                                                    className="flex-1 h-8 px-2 bg-white/5 border border-luxury-gold/30 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                                >
                                                    <option value="" disabled className="bg-gray-900">Min</option>
                                                    {["00", "15", "30", "45"].map((m) => (
                                                        <option key={m} value={m} className="bg-gray-900">{m}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={returnTimeAmPm}
                                                    onChange={(e) => setReturnTimeAmPm(e.target.value)}
                                                    className="flex-1 h-8 px-2 bg-white/5 border border-luxury-gold/30 rounded-md text-white text-xs focus:border-luxury-gold focus:outline-none"
                                                >
                                                    <option value="" disabled className="bg-gray-900">--</option>
                                                    <option value="AM" className="bg-gray-900">AM</option>
                                                    <option value="PM" className="bg-gray-900">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-2 pt-2">
                    {step > 1 && (
                        <Button
                            type="button"
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1 h-9 text-xs font-bold bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            BACK
                        </Button>
                    )}
                    {step < 4 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !isStep1Valid) ||
                                (step === 2 && !isStep2Valid) ||
                                (step === 3 && !isStep3Valid)
                            }
                            className={cn(
                                "h-9 text-xs font-bold tracking-widest bg-luxury-gold hover:bg-white hover:text-luxury-black transition-colors text-black shadow-lg rounded-sm",
                                step === 1 ? "w-full" : "flex-1"
                            )}
                        >
                            NEXT
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            onClick={(e) => {
                                console.log('Submit button clicked');
                                setStep4Interacted(true); // Mark as interacted when button is clicked
                                // Form will handle submission via onSubmit
                            }}
                            disabled={!isStep4Valid || loading}
                            className={cn(
                                "flex-1 h-9 text-xs font-bold tracking-widest bg-luxury-gold hover:bg-white hover:text-luxury-black transition-colors text-black shadow-lg rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {loading ? 'SUBMITTING...' : 'GET QUOTE'}
                        </Button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
