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
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-white border-b border-white/10 pb-2">Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-luxury-gold focus:outline-none transition-all cursor-pointer"
            />
          </div>
          {dateError && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400 font-medium">{dateError}</p>
            </div>
          )}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-luxury-gold focus:outline-none transition-all cursor-pointer"
            />
          </div>
          {timeError && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" />
              <p className="text-xs text-luxury-gold font-medium">{timeError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning for within 2 hours */}
      {showWarning && (
        <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
          <p className="text-sm text-white">
            <strong className="text-luxury-gold">⚠️ Urgent Booking:</strong> For bookings within 2 hours, please call us directly at{' '}
            <a href={`tel:${BUSINESS_CONFIG.PHONE}`} className="font-bold underline text-luxury-gold hover:text-white transition-colors">
              {BUSINESS_CONFIG.PHONE_DISPLAY}
            </a>
            {' '}for immediate confirmation.
          </p>
        </div>
      )}

      <p className="text-xs text-white/50">
        Times are in Melbourne local time (AEST/AEDT)
      </p>
    </div>
  );
}

