import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'info@chauffeurtopmembourne.au';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReminderRequest {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  pickupTime: string;
  pickupLocation: string;
  vehicleType: string;
  customMessage?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      pickupTime,
      pickupLocation,
      vehicleType,
      customMessage,
    }: ReminderRequest = await req.json();

    console.log('Sending reminder to:', customerEmail);

    const message = customMessage || `Hi ${customerName},

This is a friendly reminder about your upcoming chauffeur service.

Pickup Details:
📅 ${pickupTime}
📍 ${pickupLocation}
🚗 ${vehicleType}

Our driver will arrive 5-10 minutes before the scheduled time. Please be ready!

If you need to make any changes, please contact us immediately.

Thank you,
Chauffeur Top Melbourne`;

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Chauffeur Top Melbourne <${ADMIN_EMAIL}>`,
        to: [customerEmail],
        subject: '🚗 Reminder: Your Upcoming Chauffeur Service',
        text: message,
        html: message.replace(/\n/g, '<br>'),
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending reminder:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

