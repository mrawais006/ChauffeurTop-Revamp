"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Plane, User, Mail, Phone, Info, ArrowRightLeft, Briefcase, Car, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import Image from "next/image"; // Added import

// Detailed vehicle data for the preview card
const vehicleDetails: Record<string, { name: string; image: string; description: string; passengers: number; luggage: number }> = {
    "executive-sedan": {
        name: "Executive Sedan",
        image: "/fleet/vehicle_sedan.png",
        description: "Mercedes-Benz E-Class, BMW 5 Series, Audi A6 or similar",
        passengers: 3,
        luggage: 2
    },
    "executive-suv": {
        name: "Executive SUV",
        image: "/fleet/vehicle_suv.png",
        description: "Mercedes-Benz GLE, BMW X7, Audi Q7 or similar",
        passengers: 4,
        luggage: 4
    },
    "people-mover": {
        name: "People Mover",
        image: "/fleet/vehicle_van.png",
        description: "Mercedes-Benz V-Class, Volkswagen Multivan or similar",
        passengers: 7,
        luggage: 6
    },
    "eco-friendly": {
        name: "Eco-Friendly",
        image: "/fleet/eco_friendly.png",
        description: "Tesla Model S, Model X, or similar electric vehicle",
        passengers: 3,
        luggage: 2
    },
    "premium-sedan": {
        name: "Premium Sedan",
        image: "/fleet/premium_sedan.png",
        description: "Mercedes-Benz S-Class, BMW 7 Series, Audi A8 or similar",
        passengers: 3,
        luggage: 3
    }
};

export function BookingPageForm() {
    const [returnTrip, setReturnTrip] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(""); // Default to empty to show placeholder
    const [serviceType, setServiceType] = useState("airport");
    const [extraDestinations, setExtraDestinations] = useState<number[]>([]);
    const [timeHour, setTimeHour] = useState("");
    const [timeMinute, setTimeMinute] = useState("");
    const [timeAmPm, setTimeAmPm] = useState("");
    const [returnTimeHour, setReturnTimeHour] = useState("");
    const [returnTimeMinute, setReturnTimeMinute] = useState("");
    const [returnTimeAmPm, setReturnTimeAmPm] = useState("");
    const [selectedCountry, setSelectedCountry] = useState({ iso: "au", code: "+61", name: "Australia" });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    // New State Variables for Validation
    const [pickupLocation, setPickupLocation] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [passengers, setPassengers] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");

    // Return Trip Specifics
    const [returnPickupLocation, setReturnPickupLocation] = useState("");
    const [returnDestination, setReturnDestination] = useState("");
    const [returnDate, setReturnDate] = useState("");

    // Explicitly type the ref for TS
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Comprehensive country list with ISO values for flags
    const countries = [
        { iso: "af", code: "+93", name: "Afghanistan" },
        { iso: "al", code: "+355", name: "Albania" },
        { iso: "dz", code: "+213", name: "Algeria" },
        { iso: "as", code: "+1", name: "American Samoa" },
        { iso: "ad", code: "+376", name: "Andorra" },
        { iso: "ao", code: "+244", name: "Angola" },
        { iso: "ai", code: "+1", name: "Anguilla" },
        { iso: "aq", code: "+672", name: "Antarctica" },
        { iso: "ag", code: "+1", name: "Antigua and Barbuda" },
        { iso: "ar", code: "+54", name: "Argentina" },
        { iso: "am", code: "+374", name: "Armenia" },
        { iso: "aw", code: "+297", name: "Aruba" },
        { iso: "au", code: "+61", name: "Australia" },
        { iso: "at", code: "+43", name: "Austria" },
        { iso: "az", code: "+994", name: "Azerbaijan" },
        { iso: "bs", code: "+1", name: "Bahamas" },
        { iso: "bh", code: "+973", name: "Bahrain" },
        { iso: "bd", code: "+880", name: "Bangladesh" },
        { iso: "bb", code: "+1", name: "Barbados" },
        { iso: "by", code: "+375", name: "Belarus" },
        { iso: "be", code: "+32", name: "Belgium" },
        { iso: "bz", code: "+501", name: "Belize" },
        { iso: "bj", code: "+229", name: "Benin" },
        { iso: "bm", code: "+1", name: "Bermuda" },
        { iso: "bt", code: "+975", name: "Bhutan" },
        { iso: "bo", code: "+591", name: "Bolivia" },
        { iso: "ba", code: "+387", name: "Bosnia and Herzegovina" },
        { iso: "bw", code: "+267", name: "Botswana" },
        { iso: "br", code: "+55", name: "Brazil" },
        { iso: "io", code: "+246", name: "British Indian Ocean Territory" },
        { iso: "vg", code: "+1", name: "British Virgin Islands" },
        { iso: "bn", code: "+673", name: "Brunei" },
        { iso: "bg", code: "+359", name: "Bulgaria" },
        { iso: "bf", code: "+226", name: "Burkina Faso" },
        { iso: "bi", code: "+257", name: "Burundi" },
        { iso: "kh", code: "+855", name: "Cambodia" },
        { iso: "cm", code: "+237", name: "Cameroon" },
        { iso: "ca", code: "+1", name: "Canada" },
        { iso: "cv", code: "+238", name: "Cape Verde" },
        { iso: "ky", code: "+1", name: "Cayman Islands" },
        { iso: "cf", code: "+236", name: "Central African Republic" },
        { iso: "td", code: "+235", name: "Chad" },
        { iso: "cl", code: "+56", name: "Chile" },
        { iso: "cn", code: "+86", name: "China" },
        { iso: "cx", code: "+61", name: "Christmas Island" },
        { iso: "cc", code: "+61", name: "Cocos (Keeling) Islands" },
        { iso: "co", code: "+57", name: "Colombia" },
        { iso: "km", code: "+269", name: "Comoros" },
        { iso: "ck", code: "+682", name: "Cook Islands" },
        { iso: "cr", code: "+506", name: "Costa Rica" },
        { iso: "hr", code: "+385", name: "Croatia" },
        { iso: "cu", code: "+53", name: "Cuba" },
        { iso: "cw", code: "+599", name: "Curaçao" },
        { iso: "cy", code: "+357", name: "Cyprus" },
        { iso: "cz", code: "+420", name: "Czech Republic" },
        { iso: "cd", code: "+243", name: "DR Congo" },
        { iso: "dk", code: "+45", name: "Denmark" },
        { iso: "dj", code: "+253", name: "Djibouti" },
        { iso: "dm", code: "+1", name: "Dominica" },
        { iso: "do", code: "+1", name: "Dominican Republic" },
        { iso: "tl", code: "+670", name: "East Timor" },
        { iso: "ec", code: "+593", name: "Ecuador" },
        { iso: "eg", code: "+20", name: "Egypt" },
        { iso: "sv", code: "+503", name: "El Salvador" },
        { iso: "gq", code: "+240", name: "Equatorial Guinea" },
        { iso: "er", code: "+291", name: "Eritrea" },
        { iso: "ee", code: "+372", name: "Estonia" },
        { iso: "sz", code: "+268", name: "Eswatini" },
        { iso: "et", code: "+251", name: "Ethiopia" },
        { iso: "fk", code: "+500", name: "Falkland Islands" },
        { iso: "fo", code: "+298", name: "Faroe Islands" },
        { iso: "fj", code: "+679", name: "Fiji" },
        { iso: "fi", code: "+358", name: "Finland" },
        { iso: "fr", code: "+33", name: "France" },
        { iso: "gf", code: "+594", name: "French Guiana" },
        { iso: "pf", code: "+689", name: "French Polynesia" },
        { iso: "ga", code: "+241", name: "Gabon" },
        { iso: "gm", code: "+220", name: "Gambia" },
        { iso: "ge", code: "+995", name: "Georgia" },
        { iso: "de", code: "+49", name: "Germany" },
        { iso: "gh", code: "+233", name: "Ghana" },
        { iso: "gi", code: "+350", name: "Gibraltar" },
        { iso: "gr", code: "+30", name: "Greece" },
        { iso: "gl", code: "+299", name: "Greenland" },
        { iso: "gd", code: "+1", name: "Grenada" },
        { iso: "gp", code: "+590", name: "Guadeloupe" },
        { iso: "gu", code: "+1", name: "Guam" },
        { iso: "gt", code: "+502", name: "Guatemala" },
        { iso: "gg", code: "+44", name: "Guernsey" },
        { iso: "gn", code: "+224", name: "Guinea" },
        { iso: "gw", code: "+245", name: "Guinea-Bissau" },
        { iso: "gy", code: "+592", name: "Guyana" },
        { iso: "ht", code: "+509", name: "Haiti" },
        { iso: "hn", code: "+504", name: "Honduras" },
        { iso: "hk", code: "+852", name: "Hong Kong" },
        { iso: "hu", code: "+36", name: "Hungary" },
        { iso: "is", code: "+354", name: "Iceland" },
        { iso: "in", code: "+91", name: "India" },
        { iso: "id", code: "+62", name: "Indonesia" },
        { iso: "ir", code: "+98", name: "Iran" },
        { iso: "iq", code: "+964", name: "Iraq" },
        { iso: "ie", code: "+353", name: "Ireland" },
        { iso: "im", code: "+44", name: "Isle of Man" },
        { iso: "il", code: "+972", name: "Israel" },
        { iso: "it", code: "+39", name: "Italy" },
        { iso: "ci", code: "+225", name: "Ivory Coast" },
        { iso: "jm", code: "+1", name: "Jamaica" },
        { iso: "jp", code: "+81", name: "Japan" },
        { iso: "je", code: "+44", name: "Jersey" },
        { iso: "jo", code: "+962", name: "Jordan" },
        { iso: "kz", code: "+7", name: "Kazakhstan" },
        { iso: "ke", code: "+254", name: "Kenya" },
        { iso: "ki", code: "+686", name: "Kiribati" },
        { iso: "xk", code: "+383", name: "Kosovo" },
        { iso: "kw", code: "+965", name: "Kuwait" },
        { iso: "kg", code: "+996", name: "Kyrgyzstan" },
        { iso: "la", code: "+856", name: "Laos" },
        { iso: "lv", code: "+371", name: "Latvia" },
        { iso: "lb", code: "+961", name: "Lebanon" },
        { iso: "ls", code: "+266", name: "Lesotho" },
        { iso: "lr", code: "+231", name: "Liberia" },
        { iso: "ly", code: "+218", name: "Libya" },
        { iso: "li", code: "+423", name: "Liechtenstein" },
        { iso: "lt", code: "+370", name: "Lithuania" },
        { iso: "lu", code: "+352", name: "Luxembourg" },
        { iso: "mo", code: "+853", name: "Macau" },
        { iso: "mg", code: "+261", name: "Madagascar" },
        { iso: "mw", code: "+265", name: "Malawi" },
        { iso: "my", code: "+60", name: "Malaysia" },
        { iso: "mv", code: "+960", name: "Maldives" },
        { iso: "ml", code: "+223", name: "Mali" },
        { iso: "mt", code: "+356", name: "Malta" },
        { iso: "mh", code: "+692", name: "Marshall Islands" },
        { iso: "mq", code: "+596", name: "Martinique" },
        { iso: "mr", code: "+222", name: "Mauritania" },
        { iso: "mu", code: "+230", name: "Mauritius" },
        { iso: "yt", code: "+262", name: "Mayotte" },
        { iso: "mx", code: "+52", name: "Mexico" },
        { iso: "fm", code: "+691", name: "Micronesia" },
        { iso: "md", code: "+373", name: "Moldova" },
        { iso: "mc", code: "+377", name: "Monaco" },
        { iso: "mn", code: "+976", name: "Mongolia" },
        { iso: "me", code: "+382", name: "Montenegro" },
        { iso: "ms", code: "+1", name: "Montserrat" },
        { iso: "ma", code: "+212", name: "Morocco" },
        { iso: "mz", code: "+258", name: "Mozambique" },
        { iso: "mm", code: "+95", name: "Myanmar" },
        { iso: "na", code: "+264", name: "Namibia" },
        { iso: "nr", code: "+674", name: "Nauru" },
        { iso: "np", code: "+977", name: "Nepal" },
        { iso: "nl", code: "+31", name: "Netherlands" },
        { iso: "nc", code: "+687", name: "New Caledonia" },
        { iso: "nz", code: "+64", name: "New Zealand" },
        { iso: "ni", code: "+505", name: "Nicaragua" },
        { iso: "ne", code: "+227", name: "Niger" },
        { iso: "ng", code: "+234", name: "Nigeria" },
        { iso: "nu", code: "+683", name: "Niue" },
        { iso: "nf", code: "+672", name: "Norfolk Island" },
        { iso: "kp", code: "+850", name: "North Korea" },
        { iso: "mk", code: "+389", name: "North Macedonia" },
        { iso: "mp", code: "+1", name: "Northern Mariana Islands" },
        { iso: "no", code: "+47", name: "Norway" },
        { iso: "om", code: "+968", name: "Oman" },
        { iso: "pk", code: "+92", name: "Pakistan" },
        { iso: "pw", code: "+680", name: "Palau" },
        { iso: "ps", code: "+970", name: "Palestine" },
        { iso: "pa", code: "+507", name: "Panama" },
        { iso: "pg", code: "+675", name: "Papua New Guinea" },
        { iso: "py", code: "+595", name: "Paraguay" },
        { iso: "pe", code: "+51", name: "Peru" },
        { iso: "ph", code: "+63", name: "Philippines" },
        { iso: "pn", code: "+64", name: "Pitcairn Islands" },
        { iso: "pl", code: "+48", name: "Poland" },
        { iso: "pt", code: "+351", name: "Portugal" },
        { iso: "pr", code: "+1", name: "Puerto Rico" },
        { iso: "qa", code: "+974", name: "Qatar" },
        { iso: "cg", code: "+242", name: "Republic of the Congo" },
        { iso: "re", code: "+262", name: "Réunion" },
        { iso: "ro", code: "+40", name: "Romania" },
        { iso: "ru", code: "+7", name: "Russia" },
        { iso: "rw", code: "+250", name: "Rwanda" },
        { iso: "bl", code: "+590", name: "Saint Barthélemy" },
        { iso: "sh", code: "+290", name: "Saint Helena" },
        { iso: "kn", code: "+1", name: "Saint Kitts and Nevis" },
        { iso: "lc", code: "+1", name: "Saint Lucia" },
        { iso: "mf", code: "+590", name: "Saint Martin" },
        { iso: "pm", code: "+508", name: "Saint Pierre and Miquelon" },
        { iso: "vc", code: "+1", name: "Saint Vincent and the Grenadines" },
        { iso: "ws", code: "+685", name: "Samoa" },
        { iso: "sm", code: "+378", name: "San Marino" },
        { iso: "st", code: "+239", name: "São Tomé and Príncipe" },
        { iso: "sa", code: "+966", name: "Saudi Arabia" },
        { iso: "sn", code: "+221", name: "Senegal" },
        { iso: "rs", code: "+381", name: "Serbia" },
        { iso: "sc", code: "+248", name: "Seychelles" },
        { iso: "sl", code: "+232", name: "Sierra Leone" },
        { iso: "sg", code: "+65", name: "Singapore" },
        { iso: "sx", code: "+1", name: "Sint Maarten" },
        { iso: "sk", code: "+421", name: "Slovakia" },
        { iso: "si", code: "+386", name: "Slovenia" },
        { iso: "sb", code: "+677", name: "Solomon Islands" },
        { iso: "so", code: "+252", name: "Somalia" },
        { iso: "za", code: "+27", name: "South Africa" },
        { iso: "gs", code: "+500", name: "South Georgia & South Sandwich Islands" },
        { iso: "kr", code: "+82", name: "South Korea" },
        { iso: "ss", code: "+211", name: "South Sudan" },
        { iso: "es", code: "+34", name: "Spain" },
        { iso: "lk", code: "+94", name: "Sri Lanka" },
        { iso: "sd", code: "+249", name: "Sudan" },
        { iso: "sr", code: "+597", name: "Suriname" },
        { iso: "sj", code: "+47", name: "Svalbard and Jan Mayen" },
        { iso: "se", code: "+46", name: "Sweden" },
        { iso: "ch", code: "+41", name: "Switzerland" },
        { iso: "sy", code: "+963", name: "Syria" },
        { iso: "tw", code: "+886", name: "Taiwan" },
        { iso: "tj", code: "+992", name: "Tajikistan" },
        { iso: "tz", code: "+255", name: "Tanzania" },
        { iso: "th", code: "+66", name: "Thailand" },
        { iso: "tg", code: "+228", name: "Togo" },
        { iso: "tk", code: "+690", name: "Tokelau" },
        { iso: "to", code: "+676", name: "Tonga" },
        { iso: "tt", code: "+1", name: "Trinidad and Tobago" },
        { iso: "tn", code: "+216", name: "Tunisia" },
        { iso: "tr", code: "+90", name: "Turkey" },
        { iso: "tm", code: "+993", name: "Turkmenistan" },
        { iso: "tc", code: "+1", name: "Turks and Caicos Islands" },
        { iso: "tv", code: "+688", name: "Tuvalu" },
        { iso: "ug", code: "+256", name: "Uganda" },
        { iso: "ua", code: "+380", name: "Ukraine" },
        { iso: "ae", code: "+971", name: "United Arab Emirates" },
        { iso: "gb", code: "+44", name: "United Kingdom" },
        { iso: "us", code: "+1", name: "United States" },
        { iso: "uy", code: "+598", name: "Uruguay" },
        { iso: "uz", code: "+998", name: "Uzbekistan" },
        { iso: "vu", code: "+678", name: "Vanuatu" },
        { iso: "va", code: "+39", name: "Vatican City" },
        { iso: "ve", code: "+58", name: "Venezuela" },
        { iso: "vn", code: "+84", name: "Vietnam" },
        { iso: "wf", code: "+681", name: "Wallis and Futuna" },
        { iso: "eh", code: "+212", name: "Western Sahara" },
        { iso: "ye", code: "+967", name: "Yemen" },
        { iso: "zm", code: "+260", name: "Zambia" },
        { iso: "zw", code: "+263", name: "Zimbabwe" }
    ];

    const handleCountrySelect = (country: typeof countries[0]) => {
        setSelectedCountry(country);
        setPhoneNumber(country.code + " ");
        setIsCountryDropdownOpen(false);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct form data matching the old form structure
        const formData = {
            service_type: serviceType,
            vehicle: selectedVehicle,
            pickup_location: pickupLocation,
            destination: destination,
            date: date,
            time: `${timeHour}:${timeMinute} ${timeAmPm}`,
            full_name: fullName,
            email: email,
            phone: phoneNumber,
            passengers: passengers,
            special_instructions: specialInstructions,
            // Return trip fields (only if return trip is enabled)
            ...(returnTrip && {
                needs_return_trip: true,
                return_pickup: returnPickupLocation,
                return_destination: returnDestination,
                return_date: returnDate,
                return_time: `${returnTimeHour}:${returnTimeMinute} ${returnTimeAmPm}`,
            })
        };

        console.log('Form Data:', formData);

        // TODO: Send formData to your backend API
        // Example:
        // const response = await fetch('/api/booking', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    };

    const activeVehicle = selectedVehicle ? vehicleDetails[selectedVehicle] : null;

    // Calculate max passengers based on vehicle capacity
    const maxPassengers = activeVehicle ? activeVehicle.passengers : 7;

    const isFormValid =
        serviceType &&
        selectedVehicle &&
        pickupLocation &&
        destination &&
        date &&
        timeHour &&
        timeMinute &&
        timeAmPm &&
        fullName &&
        phoneNumber &&
        passengers &&
        (!returnTrip || (returnPickupLocation && returnDestination && returnDate && returnTimeHour && returnTimeMinute && returnTimeAmPm));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-3xl mx-auto"
        >
            {/* Main Glass Card */}
            <div className="bg-black/0 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative">
                {/* Glossy Top Highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Header */}
                <div className="p-8 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-3xl font-serif text-white tracking-tight">Trip Details</h2>
                        <span className="px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest">
                            Instant Quote
                        </span>
                    </div>
                </div>

                <form onSubmit={handleFormSubmit} className="p-8 space-y-8">

                    {/* 1. Service Type & Vehicle Selection */}
                    <div className="space-y-6">
                        <label className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2">
                            1. Select Service & Vehicle
                        </label>

                        {/* Service Type Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-white/50 ml-1">Service Type *</label>
                            <Select
                                name="service_type"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                            >
                                <option value="" disabled className="bg-luxury-black">Select service type</option>
                                <option value="one-way" className="bg-luxury-black">One-way Transfer</option>
                                <option value="hourly" className="bg-luxury-black">Hourly Hire</option>
                                <option value="airport" className="bg-luxury-black">Airport Transfer</option>
                                <option value="wedding" className="bg-luxury-black">Wedding Service</option>
                                <option value="special-event" className="bg-luxury-black">Special Event</option>
                                <option value="corporate" className="bg-luxury-black">Corporate Service</option>
                                <option value="winery" className="bg-luxury-black">Winery Tours</option>
                                <option value="one-day-tour" className="bg-luxury-black">One Day Tours</option>
                            </Select>
                        </div>

                        {/* Vehicle Selection Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-white/50 ml-1">Select Vehicle *</label>
                            <Select
                                name="vehicle"
                                value={selectedVehicle}
                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                            >
                                <option value="" disabled className="bg-luxury-black">Choose a vehicle</option>
                                <option value="executive-sedan" className="bg-luxury-black">Executive Sedan - 3 passengers</option>
                                <option value="executive-suv" className="bg-luxury-black">Executive SUV - 4 passengers</option>
                                <option value="people-mover" className="bg-luxury-black">People Mover - 7 passengers</option>
                                <option value="eco-friendly" className="bg-luxury-black">Eco-Friendly - 3 passengers</option>
                                <option value="premium-sedan" className="bg-luxury-black">Premium Sedan - 3 passengers</option>
                            </Select>
                        </div>

                        {/* Selected Vehicle Card Preview */}
                        <AnimatePresence mode="wait">
                            {activeVehicle && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6"
                                >
                                    {/* Vehicle Image */}
                                    <div className="w-full md:w-1/2 relative h-32 md:h-40">
                                        <Image
                                            src={activeVehicle.image}
                                            alt={activeVehicle.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="w-full md:w-1/2 space-y-2">
                                        <h3 className="text-xl font-bold text-white">{activeVehicle.name}</h3>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            {activeVehicle.description}
                                        </p>
                                        <div className="flex items-center gap-6 pt-2">
                                            <div className="flex items-center gap-2 text-luxury-gold">
                                                <User className="w-4 h-4" />
                                                <span className="text-sm font-medium text-white">Passengers: <span className="font-bold">{activeVehicle.passengers}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-luxury-gold">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="text-sm font-medium text-white">Luggage: <span className="font-bold">{activeVehicle.luggage}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 2. Journey Details */}
                    <div className="space-y-6">
                        <label className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2">
                            2. Journey Details
                        </label>

                        {/* Addresses */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-white/50 ml-1">Pickup Location *</label>
                                <Input
                                    name="pickup_location"
                                    placeholder="Enter your pickup address"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-white/50 ml-1">Destination *</label>
                                <Input
                                    name="destination"
                                    placeholder="Enter your destination address"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                />
                            </div>

                            {/* Extra Destinations */}
                            <AnimatePresence>
                                {extraDestinations.map((id, index) => (
                                    <motion.div
                                        key={id}
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="space-y-1.5 overflow-hidden"
                                    >
                                        <label className="text-sm font-bold text-white ml-1">Additional Destination {index + 1}</label>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Enter destination address"
                                                className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setExtraDestinations(prev => prev.filter(x => x !== id))}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <div className="flex justify-end pt-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExtraDestinations(prev => [...prev, Date.now()])}
                                    className="text-white/70 hover:text-white hover:bg-white/10 h-auto py-2 px-3 font-medium text-sm border border-white/10 rounded-md transition-colors"
                                >
                                    + Add another destination
                                </Button>
                            </div>
                        </div>

                        {/* Date & Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-white/50 ml-1">Time *</label>
                                <div className="flex gap-2">
                                    <Select style={{ width: "90px" }}
                                        value={timeHour}
                                        onChange={(e) => setTimeHour(e.target.value)}
                                        className="h-12 flex-1 min-w-[140px] bg-white/5 border-white/10 text-white text-sm text-center focus:border-luxury-gold rounded-lg"
                                    >
                                        <option value="" disabled className="bg-luxury-black text-white/50">Hour</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                            <option key={h} value={h} className="bg-luxury-black text-white">{h}</option>
                                        ))}
                                    </Select>
                                    <Select style={{ width: "90px" }}
                                        value={timeMinute}
                                        onChange={(e) => setTimeMinute(e.target.value)}
                                        disabled={!timeHour}
                                        className="h-12 flex-1 min-w-[140px] bg-white/5 border-white/10 text-white text-sm text-center focus:border-luxury-gold rounded-lg disabled:opacity-50"
                                    >
                                        <option value="" disabled className="bg-luxury-black text-white/50">Minute</option>
                                        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                                            <option key={m} value={m} className="bg-luxury-black text-white">{m}</option>
                                        ))}
                                    </Select>
                                    <Select style={{ width: "90px" }}
                                        value={timeAmPm}
                                        onChange={(e) => setTimeAmPm(e.target.value)}
                                        disabled={!timeHour}
                                        className="h-12 flex-1 min-w-[140px] bg-white/5 border-white/10 text-white text-sm text-center focus:border-luxury-gold rounded-lg disabled:opacity-50"
                                    >
                                        <option value="" disabled className="bg-luxury-black text-white/50">AM/PM</option>
                                        <option className="bg-luxury-black text-white" value="AM">AM</option>
                                        <option className="bg-luxury-black text-white" value="PM">PM</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs text-white/50 ml-1">Date *</label>
                                <Input
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    onClick={(e) => e.currentTarget.showPicker()}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Return Trip - Feature Box */}
                    <div
                        className={cn(
                            "relative overflow-hidden rounded-xl border-2 transition-all duration-500 group",
                            returnTrip
                                ? "bg-luxury-gold/5 border-luxury-gold shadow-[0_0_30px_-10px_rgba(196,169,117,0.3)]"
                                : "bg-white/5 border-dashed border-white/20 hover:border-luxury-gold/50 hover:bg-white/10"
                        )}
                    >
                        <div
                            onClick={() => setReturnTrip(!returnTrip)}
                            className="p-4 flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                                    returnTrip ? "bg-luxury-gold text-black rotate-0" : "bg-white/10 text-white/50 -rotate-180"
                                )}>
                                    <ArrowRightLeft className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className={cn("font-bold text-lg transition-colors", returnTrip ? "text-luxury-gold" : "text-white")}>
                                        Need a return trip?
                                    </h4>
                                    <p className="text-xs text-white/50">Add a return journey to your booking</p>
                                </div>
                            </div>
                            <div className="pr-2">
                                <div className={cn(
                                    "w-6 h-6 rounded-full border border-current flex items-center justify-center transition-colors",
                                    returnTrip ? "text-luxury-gold border-luxury-gold" : "text-white/20 border-white/20"
                                )}>
                                    {returnTrip && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {returnTrip && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 pt-0 border-t border-luxury-gold/10 mt-2 space-y-4">
                                        {/* Return Pickup Location */}
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-white ml-1">Return Pickup Location *</label>
                                            <Input
                                                name="return_pickup"
                                                placeholder="Enter return pickup address"
                                                value={returnPickupLocation}
                                                onChange={(e) => setReturnPickupLocation(e.target.value)}
                                                className="h-12 bg-white/5 border-luxury-gold/30 text-white focus:border-luxury-gold rounded-lg"
                                            />
                                        </div>

                                        {/* Return Destination */}
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-white ml-1">Return Destination *</label>
                                            <Input
                                                name="return_destination"
                                                placeholder="Enter return destination address"
                                                value={returnDestination}
                                                onChange={(e) => setReturnDestination(e.target.value)}
                                                className="h-12 bg-white/5 border-luxury-gold/30 text-white focus:border-luxury-gold rounded-lg"
                                            />
                                        </div>

                                        {/* Return Date & Time - Side by Side */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-white ml-1">Return Date *</label>
                                                <Input
                                                    name="return_date"
                                                    type="date"
                                                    value={returnDate}
                                                    onChange={(e) => setReturnDate(e.target.value)}
                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                    className="h-12 bg-white/5 border-luxury-gold/30 text-white focus:border-luxury-gold rounded-lg [color-scheme:dark]"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-white ml-1">Return Time *</label>
                                                <div className="flex gap-2">
                                                    <Select
                                                        style={{ width: "90px" }}
                                                        value={returnTimeHour}
                                                        onChange={(e) => setReturnTimeHour(e.target.value)}
                                                        className="h-12 flex-1 bg-white/5 border-luxury-gold/30 text-white text-sm text-center focus:border-luxury-gold rounded-lg"
                                                    >
                                                        <option value="" disabled className="bg-luxury-black text-white/50">Hour</option>
                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                                            <option key={h} value={h} className="bg-luxury-black text-white">{h}</option>
                                                        ))}
                                                    </Select>
                                                    <Select
                                                        style={{ width: "90px" }}
                                                        value={returnTimeMinute}
                                                        onChange={(e) => setReturnTimeMinute(e.target.value)}
                                                        disabled={!returnTimeHour}
                                                        className="h-12 flex-1 bg-white/5 border-luxury-gold/30 text-white text-sm text-center focus:border-luxury-gold rounded-lg disabled:opacity-50"
                                                    >
                                                        <option value="" disabled className="bg-luxury-black text-white/50">Minute</option>
                                                        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                                                            <option key={m} value={m} className="bg-luxury-black text-white">{m}</option>
                                                        ))}
                                                    </Select>
                                                    <Select
                                                        style={{ width: "90px" }}
                                                        value={returnTimeAmPm}
                                                        onChange={(e) => setReturnTimeAmPm(e.target.value)}
                                                        disabled={!returnTimeHour}
                                                        className="h-12 flex-1 bg-white/5 border-luxury-gold/30 text-white text-sm text-center focus:border-luxury-gold rounded-lg disabled:opacity-50"
                                                    >
                                                        <option value="" disabled className="bg-luxury-black text-white/50">AM/PM</option>
                                                        <option className="bg-luxury-black text-white" value="AM">AM</option>
                                                        <option className="bg-luxury-black text-white" value="PM">PM</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 3. Passenger Details */}
                    <div className="space-y-6">
                        <label className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2">
                            3. Passenger Info
                        </label>

                        {/* Row 1: Full Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-white ml-1">Full Name *</label>
                                <Input
                                    name="full_name"
                                    placeholder="Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-white ml-1">Email</label>
                                <Input
                                    name="email"
                                    placeholder="Your Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Row 2: Phone & Passengers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-white ml-1">Phone *</label>
                                <div className="flex gap-2">
                                    {/* Custom Country Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            className="h-12 w-[72px] bg-white/5 border border-white/10 text-white focus:border-luxury-gold rounded-lg flex items-center justify-center gap-1 hover:bg-white/10 transition-colors"
                                        >
                                            <img
                                                src={`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`}
                                                alt={selectedCountry.name}
                                                className="w-6 h-auto object-cover rounded-sm"
                                            />
                                            <svg
                                                className={`w-3 h-3 text-white/50 transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {isCountryDropdownOpen && (
                                                <>
                                                    <style jsx global>{`
                                                        .country-scroll {
                                                            scrollbar-width: thin;
                                                            scrollbar-color: #C4A975 rgba(255, 255, 255, 0.05); /* Firefox */
                                                        }
                                                        /* Webkit (Chrome, Safari, etc.) */
                                                        .country-scroll::-webkit-scrollbar {
                                                            width: 8px;
                                                        }
                                                        .country-scroll::-webkit-scrollbar-track {
                                                            background: rgba(255, 255, 255, 0.05);
                                                        }
                                                        .country-scroll::-webkit-scrollbar-thumb {
                                                            background-color: #C4A975;
                                                            border-radius: 4px;
                                                        }
                                                        .country-scroll::-webkit-scrollbar-thumb:hover {
                                                            background-color: #D4B985;
                                                        }
                                                    `}</style>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        style={{ maxHeight: '350px', overflowY: 'scroll' }}
                                                        className="absolute top-full left-0 mt-2 w-80 bg-black border border-white/20 rounded-lg shadow-2xl z-[100]"
                                                    >
                                                        <div className="py-2">
                                                            {countries.map((country) => (
                                                                <button
                                                                    key={country.iso}
                                                                    type="button"
                                                                    onClick={() => handleCountrySelect(country)}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0"
                                                                >
                                                                    <div className="w-8 shrink-0">
                                                                        <img
                                                                            src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                                                                            alt={country.name}
                                                                            className="w-full h-auto object-cover rounded shadow-sm"
                                                                        />
                                                                    </div>
                                                                    <span className="text-white text-sm font-medium flex-1 leading-tight">{country.name}</span>
                                                                    <span className="text-luxury-gold text-sm font-mono shrink-0">{country.code}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Input
                                        name="phone"
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="h-12 flex-1 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-white ml-1">Passengers {activeVehicle && `(Max: ${activeVehicle.passengers})`} *</label>
                                <Input
                                    name="passengers"
                                    type="number"
                                    min="1"
                                    max={maxPassengers}
                                    placeholder="No. of passengers"
                                    value={passengers}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (e.target.value === "" || (val >= 1 && val <= maxPassengers)) {
                                            setPassengers(e.target.value);
                                        }
                                    }}
                                    className="h-12 bg-white/5 border-white/10 text-white focus:border-luxury-gold rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-white ml-1">Special Instructions for Driver</label>
                            <textarea
                                name="special_instructions"
                                className="w-full h-24 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus-visible:outline-none focus-visible:border-luxury-gold focus-visible:ring-1 focus-visible:ring-luxury-gold placeholder:text-white/30 resize-none"
                                placeholder="Any special requirements or instructions..."
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button
                            type="submit"
                            variant={null as any}
                            size="lg"
                            disabled={!isFormValid}
                            style={{
                                backgroundColor: '#C4A975',
                                color: '#011647',
                                opacity: isFormValid ? 1 : 0.5,
                                borderRadius: '8px'
                            }}
                            className={`px-16 py-4 h-auto font-bold text-base tracking-wide shadow-lg transition-all ${isFormValid ? "hover:!bg-[#D4B985] cursor-pointer hover:shadow-xl" : "cursor-not-allowed"
                                }`}
                        >
                            Book Now
                        </Button>
                    </div>

                </form>
            </div>
        </motion.div >
    );
}
