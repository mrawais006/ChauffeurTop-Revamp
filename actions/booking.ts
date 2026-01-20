'use server';

import { supabase, supabaseAdmin } from '@/lib/supabase';
import { normalizePhoneNumber } from '@/utils/phoneNormalization';
import { detectCityFromLocations, getCityTimezone } from '@/utils/cityDetection';
import type { BookingFormData, BookingSubmissionResult, ReturnTripStructure } from '@/types/booking';
import { ZodError } from 'zod';

export async function submitBookingForm(
  formData: BookingFormData
): Promise<BookingSubmissionResult> {
  try {
    console.log('Submitting booking form:', formData);

    // 1. Validate phone
    if (!formData.phone || formData.phone.trim() === '' || formData.phone === '+' || formData.phone.length < 6) {
      return { success: false, error: 'Please provide a complete phone number' };
    }

    // 2. Normalize phone to E.164 format
    const normalizedPhone = normalizePhoneNumber(formData.phone);
    console.log('Phone normalized:', formData.phone, '→', normalizedPhone);

    // 3. Prepare submission data
    // Manually generate token to ensure it exists for the email/SMS logic
    const confirmationToken = crypto.randomUUID();
    
    const submissionData = {
      ...formData,
      phone: normalizedPhone,
      confirmation_token: confirmationToken,
      status: 'pending', // Explicitly set status
    };

    console.log('Inserting quote with token:', confirmationToken);

    // 4. Submit to Supabase quotes table (all bookings go here)
    // Use admin client to bypass RLS policies for insert+select
    if (!supabaseAdmin) {
      console.error('SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing');
      return { success: false, error: 'Server configuration error. Please contact support.' };
    }

    const { data: quote, error: submitError } = await supabaseAdmin
      .from('quotes')
      .insert(submissionData)
      .select() // Retrieve the inserted record
      .single();

    if (submitError) {
      console.error('Supabase error:', submitError);
      return { 
        success: false, 
        error: `Failed to submit booking: ${submitError.message}` 
      };
    }

    // 5. Send email notification
    if (quote) {
       await sendBookingNotification(quote);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting booking form:', error);
    
    // Handle Zod validation errors
    if (error instanceof ZodError && error.issues) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path && issue.path.length > 0) {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        }
      });
      return { 
        success: false, 
        error: 'Please fix the errors in the form.',
        fieldErrors 
      };
    }
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: false, 
      error: 'Failed to submit booking. Please try again.' 
    };
  }
}

async function sendBookingNotification(quoteData: any): Promise<void> {
  try {
    // Check if this is a return trip
    const isReturnTrip = quoteData.destinations && 
      typeof quoteData.destinations === 'object' && 
      !Array.isArray(quoteData.destinations) &&
      (quoteData.destinations as any).type === 'return_trip';
    
    let notificationData: any;
    
    if (isReturnTrip) {
      const returnTripData = quoteData.destinations as ReturnTripStructure;
      const outboundDests = returnTripData.outbound.destinations || [];
      
      notificationData = {
        ...quoteData,
        destinations: quoteData.destinations,
        destination1: outboundDests[0] || '',
        destination2: outboundDests[1] || '',
        destination3: outboundDests[2] || '',
        destination4: outboundDests[3] || '',
        hasReturnTrip: true,
        returnPickup: returnTripData.return.pickup,
        returnDestination: returnTripData.return.destination,
        returnDate: returnTripData.return.date,
        returnTime: returnTripData.return.time,
      };
    } else {
      const destinationsArray = Array.isArray(quoteData.destinations)
        ? quoteData.destinations
        : [];
      
      notificationData = {
        ...quoteData,
        destinations: destinationsArray,
        destination1: destinationsArray[0] || '',
        destination2: destinationsArray[1] || '',
        destination3: destinationsArray[2] || '',
        destination4: destinationsArray[3] || '',
        hasReturnTrip: false,
      };
    }

    const { error: notificationError } = await supabase.functions.invoke(
      'send-quote-response',
      {
        body: {
          type: 'booking_received',
          quote: notificationData,
          priceBreakdown: null // No price breakdown for initial request
        },
      }
    );

    if (notificationError) {
      console.error('Notification error:', notificationError);
      console.warn('Booking saved but notification may not have been sent');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

