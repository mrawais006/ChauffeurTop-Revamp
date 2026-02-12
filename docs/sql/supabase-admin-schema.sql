-- =====================================================
-- ADMIN DASHBOARD DATABASE SCHEMA
-- Complete schema for chauffeur booking admin system
-- =====================================================

-- Add any missing columns to quotes table
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reminder_sent TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trip_leg TEXT CHECK (trip_leg IN ('one-way', 'outbound', 'return')),
ADD COLUMN IF NOT EXISTS related_booking_id UUID REFERENCES quotes(id),
ADD COLUMN IF NOT EXISTS melbourne_datetime TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Australia/Melbourne',
ADD COLUMN IF NOT EXISTS user_timezone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Melbourne';

-- Add status column to contacts table if missing
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new' 
CHECK (status IN ('new', 'contacted', 'resolved'));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_melbourne_datetime ON quotes(melbourne_datetime);
CREATE INDEX IF NOT EXISTS idx_quotes_reminder_count ON quotes(reminder_count);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Update existing records to have default timezone
UPDATE quotes 
SET timezone = 'Australia/Melbourne' 
WHERE timezone IS NULL;

-- Update existing contacts to have default status
UPDATE contacts 
SET status = 'new' 
WHERE status IS NULL;

-- Create view for upcoming bookings (next 24 hours)
CREATE OR REPLACE VIEW upcoming_bookings AS
SELECT *
FROM quotes
WHERE status = 'confirmed'
  AND melbourne_datetime IS NOT NULL
  AND melbourne_datetime >= NOW()
  AND melbourne_datetime <= NOW() + INTERVAL '24 hours'
ORDER BY melbourne_datetime ASC;

-- Create view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  id,
  created_at,
  name AS customer_name,
  email,
  phone,
  status,
  'quote' AS activity_type
FROM quotes
WHERE created_at >= NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
  id,
  created_at,
  name AS customer_name,
  email,
  phone,
  status,
  'contact' AS activity_type
FROM contacts
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Grant permissions (if using RLS)
-- Make sure your admin users can access these tables

-- Comment: Remember to set up Row Level Security (RLS) policies
-- based on your authentication requirements

