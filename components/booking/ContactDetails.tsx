'use client';

import { useState } from 'react';
import { vehicles } from '@/lib/vehicles';
import { countries, Country, formatPhoneForCountry } from '@/lib/countries';

interface ContactDetailsProps {
  onPhoneChange?: (value: string) => void;
  selectedVehicle?: string;
}

export default function ContactDetails({ onPhoneChange, selectedVehicle }: ContactDetailsProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to Australia
  const [phoneValue, setPhoneValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-white border-b border-white/10 pb-2">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Smith"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
          />
          <p className="mt-1 text-xs text-white/50">Optional - for booking confirmation</p>
        </div>

        {/* Phone with Country Selector */}
        <div>
          <label htmlFor="phone" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <div className="flex">
            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-3 bg-white/10 border border-white/10 border-r-0 rounded-l text-white hover:bg-white/15 transition-all h-full"
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-xs font-medium text-luxury-gold">{selectedCountry.dialCode}</span>
                <svg className={`w-3 h-3 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute z-50 top-full left-0 mt-1 w-72 bg-black border-2 border-luxury-gold/30 rounded-lg shadow-2xl"
                  style={{ maxHeight: '250px' }}
                >
                  {/* Search hint - sticky header */}
                  <div className="sticky top-0 bg-black border-b border-white/10 px-3 py-2 z-10">
                    <p className="text-xs text-white/50">Select your country</p>
                  </div>
                  
                  {/* Scrollable list */}
                  <div className="overflow-y-scroll custom-scrollbar" style={{ maxHeight: '200px' }}>
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-luxury-gold/20 transition-colors text-left border-b border-white/5 ${
                          selectedCountry.code === country.code ? 'bg-luxury-gold/20 border-l-2 border-l-luxury-gold' : ''
                        }`}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-sm text-white flex-1">{country.name}</span>
                        <span className="text-xs text-luxury-gold font-bold bg-luxury-gold/10 px-2 py-0.5 rounded">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Phone Input */}
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phoneValue}
              placeholder={selectedCountry.placeholder}
              required
              maxLength={selectedCountry.maxLength + 5} // Account for spaces
              onChange={handlePhoneInput}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-r text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
            />
          </div>
          <p className="mt-2 text-xs text-white/50">
            {selectedCountry.flag} {selectedCountry.name}: {selectedCountry.dialCode} {selectedCountry.placeholder}
          </p>
        </div>

        {/* Passengers */}
        <div>
          <label htmlFor="passengers" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Number of Passengers <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            min="1"
            max={maxPassengers}
            defaultValue="1"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
          />
          {selectedVehicle && (
            <p className="mt-1 text-xs text-luxury-gold">
              Maximum {maxPassengers} passengers for selected vehicle
            </p>
          )}
        </div>
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
