# Supabase Edge Functions Deployment Guide

This guide explains how to deploy the email notification Edge Functions for the booking confirmation system.

## Prerequisites

1. **Supabase CLI** installed: `npm install -g supabase`
2. **Supabase project** created
3. **Resend API account** for sending emails (https://resend.com)

## Environment Variables

You need to set the following environment variables in your Supabase project:

```bash
# Get your Resend API key from https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Your website URL (production or development)
SITE_URL=https://yourdomain.com
# For local development: SITE_URL=http://localhost:3000
```

### Setting Environment Variables

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Set environment variables
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SITE_URL=https://yourdomain.com
```

## Deploying Edge Functions

### Deploy All Functions

```bash
# From the project root directory
cd supabase/functions

# Deploy all functions at once
supabase functions deploy send-quote-response
supabase functions deploy send-follow-up
supabase functions deploy send-confirmation-email
```

### Deploy Individual Functions

```bash
# Deploy quote response function
supabase functions deploy send-quote-response

# Deploy follow-up function
supabase functions deploy send-follow-up

# Deploy confirmation email function
supabase functions deploy send-confirmation-email
```

## Testing Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Serve functions locally
supabase functions serve

# Test a function
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-quote-response' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "quote": {
      "id": "test-id",
      "name": "John Doe",
      "email": "test@example.com",
      "phone": "+61412345678",
      "date": "2024-01-15",
      "time": "10:00",
      "pickup_location": "Melbourne Airport",
      "dropoff_location": "CBD",
      "vehicle_name": "Mercedes S-Class",
      "passengers": 2,
      "quoted_price": 150,
      "confirmation_token": "test-token-123"
    },
    "priceBreakdown": {
      "base_price": 150,
      "total": 150
    }
  }'
```

## Edge Function Descriptions

### 1. send-quote-response
- **Purpose**: Sends initial quotation email to customer
- **Triggered by**: Admin sending quote from admin panel
- **Email includes**: Price breakdown, trip details, confirmation button

### 2. send-follow-up
- **Purpose**: Sends follow-up emails (reminders, discounts, personal messages)
- **Triggered by**: Admin sending follow-up from admin panel
- **Types**: 
  - Reminder: Gentle reminder about pending quote
  - Discount: Special offer with new price
  - Personal: Custom message from admin

### 3. send-confirmation-email
- **Purpose**: Sends confirmation email after customer confirms booking
- **Triggered by**: Customer clicking "Confirm Booking" button
- **Sends to**: 
  - Customer: Booking confirmation with details
  - Admin: Notification of new confirmed booking

## Email Configuration

### Resend Setup

1. Sign up at https://resend.com
2. Verify your domain (recommended) or use Resend's test domain
3. Create an API key
4. Add the API key to Supabase secrets

### Email Sender Configuration

Update the `from` field in each Edge Function to match your verified domain:

```typescript
// In send-quote-response/index.ts
from: 'ChauffeurTop <bookings@chauffertop.com.au>',

// In send-confirmation-email/index.ts (customer email)
from: 'ChauffeurTop <bookings@chauffertop.com.au>',

// In send-confirmation-email/index.ts (admin notification)
from: 'ChauffeurTop System <system@chauffertop.com.au>',
to: ['admin@chauffertop.com.au'], // Replace with actual admin email
```

## Monitoring

### View Function Logs

```bash
# View logs for a specific function
supabase functions logs send-quote-response

# Follow logs in real-time
supabase functions logs send-quote-response --follow
```

### Common Issues

1. **Email not sending**: Check Resend API key and domain verification
2. **Token errors**: Ensure confirmation_token is being generated and saved
3. **CORS errors**: Edge Functions automatically handle CORS
4. **Rate limiting**: Resend has rate limits on free tier

## Next Steps

After deploying:

1. ✅ Test the full flow: Admin sends quote → Customer receives email → Customer confirms
2. ✅ Verify emails are being delivered
3. ✅ Check admin notifications are working
4. ✅ Test discount follow-up flow
5. ✅ Monitor function logs for errors

## Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- Resend Docs: https://resend.com/docs
- Edge Functions Examples: https://github.com/supabase/supabase/tree/master/examples/edge-functions
