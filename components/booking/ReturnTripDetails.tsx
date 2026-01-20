'use client';

import { useRef } from 'react';
import AddressAutocomplete from '@/components/maps/AddressAutocomplete';

interface ReturnTripDetailsProps {
  returnDate: Date | undefined;
  returnTime: string;
  returnPickup: string;
  returnDestination: string;
  onReturnDateChange: (date: Date | undefined) => void;
  onReturnTimeChange: (time: string) => void;
  onReturnPickupChange: (value: string) => void;
  onReturnDestinationChange: (value: string) => void;
}

export default function ReturnTripDetails({
  returnDate,
  returnTime,
  returnPickup,
  returnDestination,
  onReturnDateChange,
  onReturnTimeChange,
  onReturnPickupChange,
  onReturnDestinationChange,
}: ReturnTripDetailsProps) {
  // Refs for the input elements
  const returnDateInputRef = useRef<HTMLInputElement>(null);
  const returnTimeInputRef = useRef<HTMLInputElement>(null);

  const formatDateForInput = (d: Date | undefined) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinDate = () => {
    const today = new Date();
    return formatDateForInput(today);
  };

  // Open date picker when clicking anywhere on the return date field
  const handleReturnDateClick = () => {
    if (returnDateInputRef.current) {
      try {
        returnDateInputRef.current.showPicker();
      } catch (error) {
        returnDateInputRef.current.focus();
        returnDateInputRef.current.click();
      }
    }
  };

  // Open time picker when clicking anywhere on the return time field
  const handleReturnTimeClick = () => {
    if (returnTimeInputRef.current) {
      try {
        returnTimeInputRef.current.showPicker();
      } catch (error) {
        returnTimeInputRef.current.focus();
        returnTimeInputRef.current.click();
      }
    }
  };

  return (
    <div className="p-6 bg-luxury-gold/20 border-2 border-luxury-gold/40 rounded-lg space-y-4">
      <h3 className="text-lg font-serif text-luxury-gold">Return Trip Details</h3>
      
      {/* Return Pickup with Autocomplete */}
      <div>
        <label htmlFor="returnPickup" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
          Return Pickup Location <span className="text-red-400">*</span>
        </label>
        <AddressAutocomplete
          id="returnPickup"
          name="return_pickup"
          placeholder=""
          defaultValue={returnPickup}
          required
          onAddressSelect={onReturnPickupChange}
        />
      </div>

      {/* Return Destination with Autocomplete */}
      <div>
        <label htmlFor="returnDestination" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
          Return Destination <span className="text-red-400">*</span>
        </label>
        <AddressAutocomplete
          id="returnDestination"
          name="return_destination"
          placeholder=""
          defaultValue={returnDestination}
          required
          onAddressSelect={onReturnDestinationChange}
        />
      </div>

      {/* Return Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="returnDate" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Return Date <span className="text-red-400">*</span>
          </label>
          <div 
            className="relative cursor-pointer"
            onClick={handleReturnDateClick}
          >
            <input
              ref={returnDateInputRef}
              type="date"
              id="returnDate"
              value={formatDateForInput(returnDate)}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                onReturnDateChange(newDate);
              }}
              min={getMinDate()}
              required
              className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all cursor-pointer min-h-[48px] [color-scheme:light]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="returnTime" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Return Time <span className="text-red-400">*</span>
          </label>
          <div 
            className="relative cursor-pointer"
            onClick={handleReturnTimeClick}
          >
            <input
              ref={returnTimeInputRef}
              type="time"
              id="returnTime"
              value={returnTime}
              onChange={(e) => onReturnTimeChange(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all cursor-pointer min-h-[48px] [color-scheme:light]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

