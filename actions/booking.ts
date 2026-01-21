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
    
    // Destructure to exclude lead source fields - they go in the separate lead_sources table
    const {
      lead_source,
      lead_source_page,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      gclid,
      ...quoteData
    } = formData;
    
    const submissionData = {
      ...quoteData,
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

    // 5. Store lead source data if available
    if (quote && (lead_source || utm_source || gclid)) {
      const leadSourceData = {
        quote_id: quote.id,
        source: lead_source || 'website',
        page_url: lead_source_page || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        gclid: gclid || null,
      };

      const { error: leadSourceError } = await supabaseAdmin
        .from('lead_sources')
        .insert(leadSourceData);

      if (leadSourceError) {
        // Log but don't fail the booking
        console.error('Lead source tracking error:', leadSourceError);
      } else {
        console.log('Lead source tracked for quote:', quote.id);
      }
    }

    // 6. Send email notification
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

    // Send customer notification via Supabase Edge Function
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
      console.error('Customer notification error:', notificationError);
      console.warn('Booking saved but customer notification may not have been sent');
    }

    // Send admin notification directly via Resend API
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    // IMPORTANT: Admin receives at different email than FROM to avoid Resend suppression
    const ADMIN_EMAIL = 'admin@chauffeurtop.com.au';
    
    if (RESEND_API_KEY) {
      try {
        // Format date nicely
        const formattedDate = quoteData.date 
          ? new Date(quoteData.date).toLocaleDateString('en-AU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })
          : 'TBD';

        // Format destinations
        let destinationText = 'As instructed';
        if (Array.isArray(quoteData.destinations) && quoteData.destinations.length > 0) {
          destinationText = quoteData.destinations.join(' → ');
        } else if (quoteData.dropoff_location) {
          destinationText = quoteData.dropoff_location;
        }

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); padding: 24px; text-align: center; }
              .header h1 { color: #1A1F2C; margin: 0; font-size: 24px; }
              .badge { display: inline-block; background: #1f2937; color: #C5A572; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 8px; }
              .content { padding: 24px; }
              .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; }
              .card h3 { margin: 0 0 12px 0; color: #1f2937; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
              .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .info-row:last-child { border-bottom: none; }
              .label { color: #6b7280; font-size: 14px; }
              .value { color: #1f2937; font-weight: 600; font-size: 14px; }
              .cta { display: block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-weight: 700; text-align: center; margin: 24px 0; }
              .footer { background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Quote Request</h1>
                <span class="badge">ACTION REQUIRED</span>
              </div>
              
              <div class="content">
                <div class="card">
                  <h3>👤 Customer Details</h3>
                  <div class="info-row">
                    <span class="label">Name</span>
                    <span class="value">${quoteData.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">${quoteData.email || 'Not provided'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value">${quoteData.phone}</span>
                  </div>
                </div>
                
                <div class="card">
                  <h3>🚗 Trip Details</h3>
                  <div class="info-row">
                    <span class="label">Service Type</span>
                    <span class="value">${quoteData.service_type || 'Standard'}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Vehicle</span>
                    <span class="value">${quoteData.vehicle_name || quoteData.vehicle_type}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Passengers</span>
                    <span class="value">${quoteData.passengers}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Date</span>
                    <span class="value">${formattedDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Time</span>
                    <span class="value">${quoteData.time || 'TBD'}</span>
                  </div>
                </div>
                
                <div class="card">
                  <h3>📍 Locations</h3>
                  <div class="info-row">
                    <span class="label">Pickup</span>
                    <span class="value">${quoteData.pickup_location}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Destination</span>
                    <span class="value">${destinationText}</span>
                  </div>
                </div>

                ${quoteData.driver_instructions ? `
                <div class="card" style="background: #fef3c7; border-color: #fcd34d;">
                  <h3>📝 Special Instructions</h3>
                  <p style="margin: 0; color: #92400e;">${quoteData.driver_instructions}</p>
                </div>
                ` : ''}
                
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://chauffeurtop.com.au'}/admin" class="cta">
                  View in Admin Dashboard →
                </a>
              </div>
              
              <div class="footer">
                <p>ChauffeurTop Admin Notification System</p>
              </div>
            </div>
          </body>
          </html>
        `;

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'ChauffeurTop <bookings@chauffeurtop.com.au>',
            to: [ADMIN_EMAIL],
            reply_to: ['bookings@chauffeurtop.com.au'],
            subject: `🔔 New Quote: ${quoteData.name} - ${formattedDate}`,
            html: emailHtml,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Admin notification via Resend failed:', errorText);
        } else {
          console.log('Admin notification sent successfully via Resend');
        }
      } catch (adminError) {
        console.error('Error sending admin notification:', adminError);
      }
    } else {
      console.warn('RESEND_API_KEY not configured - admin notification skipped');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

