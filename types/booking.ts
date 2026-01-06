export interface FormDestination {
  address: string;
}

export interface BookingFormData {
  // Contact Info
  name: string;
  email: string | null;
  phone: string;
  passengers: number;
  
  // Vehicle
  vehicle_type: string;
  vehicle_name: string;
  vehicle_model: string;
  
  // Location & Time
  pickup_location: string;
  destinations: string[] | ReturnTripStructure;
  date: string;
  time: string;
  
  // Service Details
  service_type: string;
  flight_number: string;
  terminal_type: string;
  driver_instructions: string;
  
  // Timezone & Location
  melbourne_datetime: string;
  timezone: string;
  user_timezone: string;
  city: string;
}

export interface ReturnTripStructure {
  type: 'return_trip';
  outbound: {
    pickup: string;
    destinations: string[];
    date: string;
    time: string;
    cityDateTime: string;
  };
  return: {
    pickup: string;
    destination: string;
    date: string;
    time: string;
    cityDateTime: string;
  };
}

export interface BookingSubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

