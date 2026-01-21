'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Sparkles } from 'lucide-react';
import { submitBookingForm } from '@/actions/booking';
import { vehicles } from '@/lib/vehicles';
import { detectCityFromLocations, getCityTimezone } from '@/utils/cityDetection';
import { toCityISOString, getUserTimezone } from '@/lib/timezoneUtils';
import { getFormData, clearFormData, getLeadSourceData } from '@/lib/formPrePopulation';
import type { FormDestination, BookingFormData, ReturnTripStructure } from '@/types/booking';

// Import all sub-components
import ServiceTypeSelect from './ServiceTypeSelect';
import VehicleSelect from './VehicleSelect';
import ContactDetails from './ContactDetails';
import LocationDetails from './LocationDetails';
import DateTimeSelect from './DateTimeSelect';
import ReturnTripToggle from './ReturnTripToggle';
import ReturnTripDetails from './ReturnTripDetails';
import AirportDetails from './AirportDetails';
import DriverInstructions from './DriverInstructions';

interface PrePopulatedFields {
  pickup?: boolean;
  destination?: boolean;
  date?: boolean;
  time?: boolean;
  passengers?: boolean;
  vehicle?: boolean;
  service?: boolean;
}

export default function BookingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Track which fields were pre-populated
  const [prePopulated, setPrePopulated] = useState<PrePopulatedFields>({});

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickup, setPickup] = useState('');
  const [destinations, setDestinations] = useState<FormDestination[]>([{ address: '' }]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [passengersValue, setPassengersValue] = useState<number | undefined>();
  
  // Airport details
  const [flightNumber, setFlightNumber] = useState('');
  const [terminalType, setTerminalType] = useState('');
  
  // Return trip state
  const [needsReturnTrip, setNeedsReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState('');
  const [returnPickup, setReturnPickup] = useState('');
  const [returnDestination, setReturnDestination] = useState('');

  // Load pre-populated data from sessionStorage on mount
  useEffect(() => {
    const formData = getFormData();
    if (!formData) return;

    const newPrePopulated: PrePopulatedFields = {};

    // Pre-populate pickup
    if (formData.pickup) {
      setPickup(formData.pickup);
      newPrePopulated.pickup = true;
    }

    // Pre-populate destination
    if (formData.destination) {
      setDestinations([{ address: formData.destination }]);
      newPrePopulated.destination = true;
    }

    // Pre-populate date
    if (formData.date) {
      const parsedDate = new Date(formData.date);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        newPrePopulated.date = true;
      }
    }

    // Pre-populate time
    if (formData.time) {
      setTime(formData.time);
      newPrePopulated.time = true;
    }

    // Pre-populate passengers
    if (formData.passengers) {
      setPassengersValue(formData.passengers);
      newPrePopulated.passengers = true;
    }

    // Pre-populate vehicle type
    if (formData.vehicle_type) {
      setVehicle(formData.vehicle_type);
      newPrePopulated.vehicle = true;
    }

    // Pre-populate service type
    if (formData.service_type) {
      setServiceType(formData.service_type);
      newPrePopulated.service = true;
    }

    setPrePopulated(newPrePopulated);
  }, []);

  // Max 4 destinations
  const canAddMoreDestinations = destinations.length < 4;

  // Location handlers
  const handlePickupChange = (value: string) => {
    setPickup(value);
    // Clear pre-populated indicator when user changes value
    if (prePopulated.pickup) {
      setPrePopulated(prev => ({ ...prev, pickup: false }));
    }
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...destinations];
    newDestinations[index] = { address: value };
    setDestinations(newDestinations);
    // Clear pre-populated indicator
    if (index === 0 && prePopulated.destination) {
      setPrePopulated(prev => ({ ...prev, destination: false }));
    }
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

  // Handle vehicle change
  const handleVehicleChange = (value: string) => {
    setVehicle(value);
    if (prePopulated.vehicle) {
      setPrePopulated(prev => ({ ...prev, vehicle: false }));
    }
  };

  // Handle service type change
  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    if (prePopulated.service) {
      setPrePopulated(prev => ({ ...prev, service: false }));
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
    
    // Prevent double-submission - immediately disable
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

      // Get lead source data from sessionStorage
      const leadSourceData = getLeadSourceData();

      // Create booking data object
      const bookingData: BookingFormData = {
        name: formData.get('name') as string,
        email: (formData.get('email') as string) || null,
        phone: phoneNumber,
        passengers: passengersValue || Number(formData.get('passengers') || '1'),
        vehicle_type: vehicle,
        vehicle_name: selectedVehicle?.name || '',
        vehicle_model: selectedVehicle?.models || '',
        pickup_location: pickup,
        dropoff_location: destinationsArray[0] || '',
        destinations: destinationsField,
        date: dateString,
        time: time,
        service_type: serviceType,
        flight_number: flightNumber,
        terminal_type: terminalType,
        driver_instructions: (formData.get('driver_instructions') as string) || '',
        melbourne_datetime: cityDateTime,
        timezone: cityTimezone,
        user_timezone: userTimezone,
        city: detectedCity,
        // Include lead source data
        lead_source: leadSourceData.source,
        lead_source_page: leadSourceData.source_page,
        utm_source: leadSourceData.utm_source,
        utm_medium: leadSourceData.utm_medium,
        utm_campaign: leadSourceData.utm_campaign,
        utm_content: leadSourceData.utm_content,
        utm_term: leadSourceData.utm_term,
        gclid: leadSourceData.gclid,
      };

      console.log('Submitting booking:', bookingData);

      // Submit to server action
      const result = await submitBookingForm(bookingData);

      if (result.success) {
        // Clear sessionStorage on successful submission
        clearFormData();

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
        // Show errors (both field-specific and general)
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

  // Check if any fields are pre-populated
  const hasPrePopulatedFields = Object.values(prePopulated).some(v => v);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-gradient-to-br from-white via-white to-gray-50/80 p-6 md:p-10 lg:p-14 rounded-xl shadow-2xl border-2 border-luxury-gold/50 backdrop-blur-sm">
      
      {/* Pre-populated indicator */}
      {hasPrePopulatedFields && (
        <div className="flex items-center gap-2 p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
          <Sparkles className="w-5 h-5 text-luxury-gold" />
          <p className="text-sm text-luxury-black">
            Some fields have been pre-filled. You can modify them if needed.
          </p>
        </div>
      )}

      {/* Service Type */}
      <div className={prePopulated.service ? 'ring-2 ring-luxury-gold/50 rounded-lg p-1 -m-1' : ''}>
        <ServiceTypeSelect value={serviceType} onChange={handleServiceTypeChange} />
        {prePopulated.service && (
          <p className="text-xs text-luxury-gold mt-1 ml-1">Pre-selected</p>
        )}
      </div>

      {/* Airport Details (if Airport Transfer selected) */}
      {serviceType === 'Airport Transfer' && (
        <AirportDetails
          flightNumber={flightNumber}
          terminalType={terminalType}
          onFlightNumberChange={setFlightNumber}
          onTerminalTypeChange={setTerminalType}
        />
      )}

      {/* Vehicle Selection */}
      <div className={prePopulated.vehicle ? 'ring-2 ring-luxury-gold/50 rounded-lg p-1 -m-1' : ''}>
        <VehicleSelect value={vehicle} onChange={handleVehicleChange} />
        {prePopulated.vehicle && (
          <p className="text-xs text-luxury-gold mt-1 ml-1">Pre-selected</p>
        )}
      </div>

      {/* Contact Details */}
      <ContactDetails 
        onPhoneChange={setPhoneNumber} 
        selectedVehicle={vehicle}
        defaultPassengers={passengersValue}
      />

      {/* Location Details */}
      <LocationDetails
        pickup={pickup}
        destinations={destinations}
        onPickupChange={handlePickupChange}
        onDestinationChange={handleDestinationChange}
        onAddDestination={addDestination}
        onRemoveDestination={removeDestination}
        canAddMoreDestinations={canAddMoreDestinations}
        pickupPrePopulated={prePopulated.pickup}
        destinationPrePopulated={prePopulated.destination}
      />

      {/* Date & Time */}
      <DateTimeSelect
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
      />

      {/* Return Trip Toggle - Always visible */}
      <ReturnTripToggle 
        needsReturnTrip={needsReturnTrip}
        onToggle={setNeedsReturnTrip}
      />

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

      {/* Error Messages - Senior Accessible */}
      {errors.general && (
        <div className="flex items-start gap-3 p-5 bg-red-500/20 border-2 border-red-500/40 rounded-lg animate-in fade-in duration-200">
          <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-base text-red-700 font-bold">{errors.general}</p>
            <p className="text-sm text-red-700/80 mt-2">Please review the form and try again.</p>
          </div>
        </div>
      )}

      {/* Submit Button - Senior Accessible (48px minimum) */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-luxury-gold text-white hover:bg-luxury-gold-dark font-bold uppercase tracking-widest py-5 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl text-lg min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-luxury-gold focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 focus:ring-offset-white"
      >
        {loading ? 'Getting Quote...' : 'Get Quote'}
      </button>

      <p className="text-sm text-center text-luxury-black/60 leading-relaxed">
        By submitting this form, you agree to our terms and conditions. 
        Your booking will be confirmed upon review by our team.
      </p>
    </form>
  );
}
