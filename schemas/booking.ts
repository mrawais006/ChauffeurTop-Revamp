import { z } from 'zod';

export const bookingSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .min(6, 'Phone number must be at least 6 characters')
    .refine((val) => val !== '+' && val.trim() !== '', {
      message: 'Please enter a complete phone number',
    }),
  
  passengers: z
    .number()
    .min(1, 'At least 1 passenger required')
    .max(20, 'Maximum 20 passengers'),
  
  vehicle_type: z.string().min(1, 'Please select a vehicle'),
  
  pickup_location: z.string().min(1, 'Pickup location is required'),
  
  destinations: z
    .array(z.string().min(1))
    .min(1, 'At least one destination is required'),
  
  date: z.string().min(1, 'Date is required'),
  
  time: z.string().min(1, 'Time is required'),
  
  service_type: z.string().min(1, 'Service type is required'),
  
  flight_number: z.string().optional(),
  
  terminal_type: z.string().optional(),
  
  driver_instructions: z.string().optional(),
});

export type BookingFormInput = z.infer<typeof bookingSchema>;

