-- ============================================
-- ChauffeurTop Booking/Quote Form - Supabase Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- ============================================

-- 1. Create quotes table (stores all booking requests)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  
  -- Vehicle Details
  vehicle_type TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  vehicle_model TEXT,
  
  -- Location & Time
  pickup_location TEXT NOT NULL,
  destinations JSONB NOT NULL, -- Can be array or return trip structure
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  
  -- Service Details
  service_type TEXT NOT NULL,
  flight_number TEXT,
  terminal_type TEXT,
  driver_instructions TEXT,
  
  -- Timezone & Location
  melbourne_datetime TEXT,
  timezone TEXT,
  user_timezone TEXT,
  city TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- 3. Create policy: Anyone can submit booking form (INSERT)
CREATE POLICY "Anyone can submit booking form" 
ON quotes 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Create policy: Only authenticated users can view quotes (SELECT)
-- This is for admin panel access later
CREATE POLICY "Authenticated users can read quotes" 
ON quotes 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_phone_idx ON quotes(phone);
CREATE INDEX IF NOT EXISTS quotes_email_idx ON quotes(email);
CREATE INDEX IF NOT EXISTS quotes_service_type_idx ON quotes(service_type);
CREATE INDEX IF NOT EXISTS quotes_date_idx ON quotes(date);

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Apply trigger to quotes table
DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at 
  BEFORE UPDATE ON quotes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'quotes'
) AS table_exists;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'quotes';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'quotes';

-- ============================================
-- Test Query (After Form Submission)
-- ============================================
-- View all bookings/quotes (run this to see submitted data)
SELECT 
  id,
  name,
  email,
  phone,
  service_type,
  vehicle_name,
  pickup_location,
  destinations,
  date,
  time,
  passengers,
  created_at
FROM quotes 
ORDER BY created_at DESC 
LIMIT 20;

-- ============================================
-- Optional: Create view for return trips only
-- ============================================
CREATE OR REPLACE VIEW return_trip_bookings AS
SELECT 
  id,
  name,
  phone,
  email,
  service_type,
  vehicle_name,
  destinations,
  created_at
FROM quotes
WHERE jsonb_typeof(destinations) = 'object'
  AND destinations->>'type' = 'return_trip'
ORDER BY created_at DESC;

-- ============================================
-- Optional: Create view for one-way trips only
-- ============================================
CREATE OR REPLACE VIEW oneway_bookings AS
SELECT 
  id,
  name,
  phone,
  email,
  service_type,
  vehicle_name,
  pickup_location,
  destinations,
  date,
  time,
  created_at
FROM quotes
WHERE jsonb_typeof(destinations) = 'array'
ORDER BY created_at DESC;

