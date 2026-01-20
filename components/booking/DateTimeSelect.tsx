'use client';

import { useState, useEffect, useRef } from 'react';
import { isWithinTwoHours, isPastDate, isPastTime, isDateToday } from '@/lib/timezoneUtils';
import { BUSINESS_CONFIG } from '@/lib/constants';
import { AlertCircle } from 'lucide-react';

interface DateTimeSelectProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export default function DateTimeSelect({
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeSelectProps) {
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // Refs for the input elements
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Validate date and time
  useEffect(() => {
    // Validate date
    if (date && isPastDate(date)) {
      setDateError('Please select a present or future date');
    } else {
      setDateError(null);
    }

    // Validate time
    if (date && time) {
      if (isPastTime(date, time)) {
        setTimeError('Please select a present or future time');
      } else if (isWithinTwoHours(date, time)) {
        setTimeError(`For bookings within 2 hours, please call ${BUSINESS_CONFIG.PHONE_DISPLAY}`);
        setShowWarning(true);
      } else {
        setTimeError(null);
        setShowWarning(false);
      }
    }
  }, [date, time]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (d: Date | undefined) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return formatDateForInput(today);
  };

  // Open date picker when clicking anywhere on the date field
  const handleDateClick = () => {
    if (dateInputRef.current) {
      try {
        // Modern browsers support showPicker()
        dateInputRef.current.showPicker();
      } catch (error) {
        // Fallback for older browsers
        dateInputRef.current.focus();
        dateInputRef.current.click();
      }
    }
  };

  // Open time picker when clicking anywhere on the time field
  const handleTimeClick = () => {
    if (timeInputRef.current) {
      try {
        // Modern browsers support showPicker()
        timeInputRef.current.showPicker();
      } catch (error) {
        // Fallback for older browsers
        timeInputRef.current.focus();
        timeInputRef.current.click();
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-luxury-black border-b-2 border-luxury-gold/30 pb-3">Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date - Senior Accessible */}
        <div>
          <label htmlFor="date" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Pickup Date <span className="text-red-400">*</span>
          </label>
          <div 
            className="relative cursor-pointer"
            onClick={handleDateClick}
          >
            <input
              ref={dateInputRef}
              type="date"
              id="date"
              value={formatDateForInput(date)}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                onDateChange(newDate);
              }}
              min={getMinDate()}
              required
              className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all cursor-pointer min-h-[48px] [color-scheme:light]"
            />
          </div>
          {dateError && (
            <div className="flex items-center gap-2 mt-3 px-4 py-3 bg-red-500/20 border-2 border-red-500/40 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{dateError}</p>
            </div>
          )}
        </div>

        {/* Time - Senior Accessible */}
        <div>
          <label htmlFor="time" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Pickup Time <span className="text-red-400">*</span>
          </label>
          <div 
            className="relative cursor-pointer"
            onClick={handleTimeClick}
          >
            <input
              ref={timeInputRef}
              type="time"
              id="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all cursor-pointer min-h-[48px] [color-scheme:light]"
            />
          </div>
          {timeError && (
            <div className="flex items-center gap-2 mt-3 px-4 py-3 bg-amber-500/20 border-2 border-amber-500/40 rounded-md">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <p className="text-sm text-amber-700 font-medium">{timeError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning for within 2 hours - Senior Accessible */}
      {showWarning && (
        <div className="p-5 bg-luxury-gold/20 border-2 border-luxury-gold/40 rounded-lg">
          <p className="text-base text-luxury-black leading-relaxed">
            <strong className="text-luxury-gold text-lg">⚠️ Urgent Booking:</strong> For bookings within 2 hours, please call us directly at{' '}
            <a href={`tel:${BUSINESS_CONFIG.PHONE}`} className="font-bold underline text-luxury-gold hover:text-luxury-gold-dark transition-colors text-lg">
              {BUSINESS_CONFIG.PHONE_DISPLAY}
            </a>
            {' '}for immediate confirmation.
          </p>
        </div>
      )}

      <p className="text-sm text-luxury-black/60">
        Times are in Melbourne local time (AEST/AEDT)
      </p>
    </div>
  );
}

