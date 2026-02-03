'use client';

import { useState } from 'react';
import { vehicles } from '@/lib/vehicles';
import { countries, Country, formatPhoneForCountry } from '@/lib/countries';

interface ContactDetailsProps {
  onPhoneChange?: (value: string) => void;
  selectedVehicle?: string;
  defaultPassengers?: number;
}

export default function ContactDetails({ onPhoneChange, selectedVehicle, defaultPassengers }: ContactDetailsProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to Australia
  const [phoneValue, setPhoneValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [needsChildSeats, setNeedsChildSeats] = useState(false);
  
  // Get max passengers for selected vehicle
  const maxPassengers = selectedVehicle 
    ? vehicles.find(v => v.category === selectedVehicle)?.passengers || 20
    : 20;
  
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneForCountry(e.target.value, selectedCountry);
    setPhoneValue(formatted);
    // Send full number with dial code
    onPhoneChange?.(`${selectedCountry.dialCode}${formatted.replace(/\s/g, '')}`);
  };
  
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPhoneValue(''); // Reset phone when country changes
    setIsDropdownOpen(false);
    onPhoneChange?.(''); // Reset parent value
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-luxury-black border-b-2 border-luxury-gold/30 pb-3">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name - Senior Accessible */}
        <div>
          <label htmlFor="name" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            required
            className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
          />
        </div>

        {/* Email - Senior Accessible */}
        <div>
          <label htmlFor="email" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder=""
            required
            className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
          />
        </div>

        {/* Phone with Country Selector - Senior Accessible */}
        <div>
          <label htmlFor="phone" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="flex">
            {/* Country Selector Dropdown - Larger for seniors */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-luxury-gold/40 border-r-0 rounded-l-md text-luxury-black hover:border-luxury-gold transition-all min-h-[48px]"
              >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-base font-medium text-luxury-gold">{selectedCountry.dialCode}</span>
                <svg className={`w-4 h-4 text-luxury-black/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu - Senior Accessible */}
              {isDropdownOpen && (
                <div 
                  className="absolute z-50 top-full left-0 mt-1 w-80 bg-white border-2 border-luxury-gold/40 rounded-lg shadow-2xl"
                  style={{ maxHeight: '280px' }}
                >
                  {/* Search hint - sticky header */}
                  <div className="sticky top-0 bg-white border-b border-luxury-gold/20 px-4 py-3 z-10">
                    <p className="text-sm text-luxury-black/70 font-medium">Select your country</p>
                  </div>
                  
                  {/* Scrollable list - Larger touch targets */}
                  <div className="overflow-y-scroll custom-scrollbar" style={{ maxHeight: '230px' }}>
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-luxury-gold/20 transition-colors text-left border-b border-luxury-gold/10 min-h-[48px] ${
                          selectedCountry.code === country.code ? 'bg-luxury-gold/20 border-l-4 border-l-luxury-gold' : ''
                        }`}
                      >
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-base text-luxury-black flex-1">{country.name}</span>
                        <span className="text-sm text-luxury-gold font-bold bg-luxury-gold/15 px-3 py-1 rounded">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Phone Input - Senior Accessible */}
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phoneValue}
              placeholder=""
              required
              maxLength={selectedCountry.maxLength + 5} // Account for spaces
              onChange={handlePhoneInput}
              className="flex-1 px-4 py-3 bg-white border-2 border-luxury-gold/40 border-l-0 rounded-r-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
            />
          </div>
          <p className="mt-2 text-sm text-luxury-black/60">
            {selectedCountry.flag} {selectedCountry.name}: {selectedCountry.dialCode} {selectedCountry.placeholder}
            {selectedCountry.code === 'AU' && (
              <span className="block text-xs text-luxury-black/50 mt-1">
                No need to enter the leading 0 - it&apos;s included in +61
              </span>
            )}
          </p>
        </div>

        {/* Passengers - Senior Accessible */}
        <div>
          <label htmlFor="passengers" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Number of Passengers <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            min="1"
            max={maxPassengers}
            defaultValue={defaultPassengers || 1}
            required
            className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
          />
          {selectedVehicle && (
            <p className="mt-2 text-sm text-luxury-gold font-medium">
              Maximum {maxPassengers} passengers for selected vehicle
            </p>
          )}
        </div>
      </div>

      {/* Child Seats Checkbox */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="needs_child_seats"
            name="needs_child_seats"
            checked={needsChildSeats}
            onChange={(e) => setNeedsChildSeats(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-luxury-gold/40 text-luxury-gold focus:ring-luxury-gold focus:ring-2 cursor-pointer"
          />
          <label htmlFor="needs_child_seats" className="text-base text-luxury-black cursor-pointer">
            I need child seats for this trip
          </label>
        </div>
        
        {needsChildSeats && (
          <div className="ml-8">
            <label htmlFor="child_seat_details" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
              Child Seat Details
            </label>
            <textarea
              id="child_seat_details"
              name="child_seat_details"
              rows={3}
              placeholder="Please specify ages of children or seat types needed (e.g., infant capsule, toddler seat, booster)"
              className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-gray-400 focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all resize-none"
            />
          </div>
        )}
      </div>
      
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
