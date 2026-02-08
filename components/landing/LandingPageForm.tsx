'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { submitBookingForm } from '@/actions/booking';
import { vehicles } from '@/lib/vehicles';
import { detectCityFromLocations, getCityTimezone } from '@/utils/cityDetection';
import { toCityISOString, getUserTimezone } from '@/lib/timezoneUtils';
import type { FormDestination, BookingFormData, ReturnTripStructure } from '@/types/booking';

// Import sub-components
import VehicleSelect from '../booking/VehicleSelect';
import ContactDetails from '../booking/ContactDetails';
import LocationDetails from '../booking/LocationDetails';
import DateTimeSelect from '../booking/DateTimeSelect';
import ReturnTripToggle from '../booking/ReturnTripToggle';
import ReturnTripDetails from '../booking/ReturnTripDetails';
import AirportDetails from '../booking/AirportDetails';
import DriverInstructions from '../booking/DriverInstructions';

interface LandingPageFormProps {
  preSelectedService: string; // e.g., "Airport Transfer", "Corporate Transfer", "Family Travel"
  source?: string; // e.g., "landing_airport", "landing_corporate", "landing_family"
}

export default function LandingPageForm({ preSelectedService, source = 'landing_page' }: LandingPageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state - service type is pre-selected and locked
  const serviceType = preSelectedService;
  const [vehicle, setVehicle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickup, setPickup] = useState('');
  const [destinations, setDestinations] = useState<FormDestination[]>([{ address: '' }]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  
  // Airport details
  const [flightNumber, setFlightNumber] = useState('');
  const [terminalType, setTerminalType] = useState('');
  
  // Return trip state
  const [needsReturnTrip, setNeedsReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState('');
  const [returnPickup, setReturnPickup] = useState('');
  const [returnDestination, setReturnDestination] = useState('');

  // Max 4 destinations
  const canAddMoreDestinations = destinations.length < 4;

  // Location handlers
  const handlePickupChange = (value: string) => {
    setPickup(value);
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...destinations];
    newDestinations[index] = { address: value };
    setDestinations(newDestinations);
  };

  const addDestination = () => {
    if (canAddMoreDestinations) {
      setDestinations([...destinations, { address: '' }]);
    }
  };

  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      const newDestinations = destinations.filter((_, i) => i !== index);
      setDestinations(newDestinations);
    }
  };

  // Auto-populate return trip fields
  useEffect(() => {
    if (needsReturnTrip && destinations.length > 0) {
      const lastDestination = destinations[destinations.length - 1]?.address;
      if (lastDestination) {
        setReturnPickup(lastDestination);
      }
    }
  }, [needsReturnTrip, destinations]);

  useEffect(() => {
    if (needsReturnTrip && pickup) {
      setReturnDestination(pickup);
    }
  }, [needsReturnTrip, pickup]);

  // Reset return fields when toggle is off
  useEffect(() => {
    if (!needsReturnTrip) {
      setReturnDate(undefined);
      setReturnTime('');
      setReturnPickup('');
      setReturnDestination('');
    }
  }, [needsReturnTrip]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent double-submission
    if (loading) return;
    setLoading(true);
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Validate return trip if enabled
      if (needsReturnTrip) {
        if (!returnDate || !returnTime || !returnPickup || !returnDestination) {
          setErrors({ general: 'Please complete all return trip details' });
          setLoading(false);
          return;
        }
      }

      // Get vehicle details
      const selectedVehicle = vehicles.find(v => v.category === vehicle);
      
      // Prepare destinations array
      const destinationsArray = destinations
        .map(d => d.address?.trim())
        .filter((address): address is string => typeof address === 'string' && address !== '');

      // Detect city and timezone
      const detectedCity = detectCityFromLocations(pickup, destinationsArray);
      const cityTimezone = getCityTimezone(detectedCity);
      const userTimezone = getUserTimezone();

      // Format date/time
      const cityDateTime = date && time ? toCityISOString(date, time, cityTimezone) : '';
      const dateString = date ? 
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` 
        : '';

      // Prepare destinations field
      let destinationsField: string[] | ReturnTripStructure;

      if (needsReturnTrip && returnDate && returnTime && returnPickup && returnDestination) {
        // Return trip structure
        const returnDateString = returnDate ? 
          `${returnDate.getFullYear()}-${String(returnDate.getMonth() + 1).padStart(2, '0')}-${String(returnDate.getDate()).padStart(2, '0')}` 
          : '';
        const returnCityDateTime = toCityISOString(returnDate, returnTime, cityTimezone);

        destinationsField = {
          type: 'return_trip',
          outbound: {
            pickup: pickup,
            destinations: destinationsArray,
            date: dateString,
            time: time,
            cityDateTime: cityDateTime,
          },
          return: {
            pickup: returnPickup,
            destination: returnDestination,
            date: returnDateString,
            time: returnTime,
            cityDateTime: returnCityDateTime,
          },
        };
      } else {
        // Simple array for one-way trips
        destinationsField = destinationsArray;
      }

      // Create booking data object
      const bookingData: BookingFormData = {
        name: formData.get('name') as string,
        email: (formData.get('email') as string) || null,
        phone: phoneNumber,
        passengers: Number(formData.get('passengers') || '1'),
        vehicle_type: vehicle,
        vehicle_name: selectedVehicle?.name || '',
        vehicle_model: selectedVehicle?.models || '',
        pickup_location: pickup,
        dropoff_location: destinationsArray[0] || '',
        destinations: destinationsField,
        date: dateString,
        time: time,
        service_type: serviceType, // Using pre-selected service type
        flight_number: flightNumber,
        terminal_type: terminalType,
        driver_instructions: (formData.get('driver_instructions') as string) || '',
        melbourne_datetime: cityDateTime,
        timezone: cityTimezone,
        user_timezone: userTimezone,
        city: detectedCity,
      };

      console.log('Submitting booking:', bookingData);

      // Submit to server action
      const result = await submitBookingForm(bookingData);

      if (result.success) {
        // Track conversion (client-side)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-16829926476/mhTJCNyb2akaEMyYkdk-',
            'transaction_id': ''
          });
        }

        // Navigate to thank you page
        router.push('/thank-you');
      } else {
        // Show errors
        const newErrors: Record<string, string> = {};
        
        if (result.fieldErrors) {
          Object.assign(newErrors, result.fieldErrors);
        }
        
        if (result.error) {
          newErrors.general = result.error;
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ general: 'Failed to submit booking. Please try again or contact us directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="quote-form" className="scroll-mt-20">
      {/* Form Headline */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">
          Get Your Fixed Price Quote in Minutes
        </h2>
        <p className="text-gray-600 text-lg">
          No hidden fees. No surprises. Just transparent pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-gradient-to-br from-white via-white to-gray-50/80 p-6 md:p-10 lg:p-14 rounded-xl shadow-2xl border-2 border-luxury-gold/50 backdrop-blur-sm">
        
        {/* Service Type is HIDDEN - Pre-selected */}
        <input type="hidden" name="service_type" value={serviceType} />

        {/* Airport Details (if Airport Transfer pre-selected) */}
        {serviceType === 'Airport Transfer' && (
          <AirportDetails
            flightNumber={flightNumber}
            terminalType={terminalType}
            onFlightNumberChange={setFlightNumber}
            onTerminalTypeChange={setTerminalType}
          />
        )}

        {/* Vehicle Selection */}
        <VehicleSelect value={vehicle} onChange={setVehicle} />

        {/* Contact Details */}
        <ContactDetails onPhoneChange={setPhoneNumber} selectedVehicle={vehicle} />

        {/* Location Details */}
        <LocationDetails
          pickup={pickup}
          destinations={destinations}
          onPickupChange={handlePickupChange}
          onDestinationChange={handleDestinationChange}
          onAddDestination={addDestination}
          onRemoveDestination={removeDestination}
          canAddMoreDestinations={canAddMoreDestinations}
        />

        {/* Date & Time */}
        <DateTimeSelect
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
        />

        {/* Return Trip Toggle */}
        {destinations.length > 0 && destinations[0]?.address && (
          <ReturnTripToggle 
            needsReturnTrip={needsReturnTrip}
            onToggle={setNeedsReturnTrip}
          />
        )}

        {/* Return Trip Details */}
        {needsReturnTrip && (
          <ReturnTripDetails
            returnDate={returnDate}
            returnTime={returnTime}
            returnPickup={returnPickup}
            returnDestination={returnDestination}
            onReturnDateChange={setReturnDate}
            onReturnTimeChange={setReturnTime}
            onReturnPickupChange={setReturnPickup}
            onReturnDestinationChange={setReturnDestination}
          />
        )}

        {/* Driver Instructions */}
        <DriverInstructions />

        {/* Error Messages */}
        {errors.general && (
          <div className="flex items-start gap-3 p-5 bg-red-500/20 border-2 border-red-500/40 rounded-lg animate-in fade-in duration-200">
            <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base text-red-700 font-bold">{errors.general}</p>
              <p className="text-sm text-red-700/80 mt-2">Please review the form and try again.</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-luxury-gold text-white hover:bg-luxury-gold-dark font-bold uppercase tracking-widest py-5 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl text-lg min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-luxury-gold focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 focus:ring-offset-white"
        >
          {loading ? 'Getting Quote...' : 'Get Instant Quote'}
        </button>

        <p className="text-sm text-center text-luxury-black/60 leading-relaxed">
          By submitting this form, you agree to our terms and conditions. 
          Our team will review your request and send you a personalised quote shortly.
        </p>
      </form>
    </div>
  );
}
