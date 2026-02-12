-- ============================================
-- ChauffeurTop Contact Form - Supabase Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- ============================================

-- 1. Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. Create policy: Anyone can submit contact form (INSERT)
CREATE POLICY "Anyone can submit contact form" 
ON contacts 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Create policy: Only authenticated users can view contacts (SELECT)
-- This is for admin panel access later
CREATE POLICY "Authenticated users can read contacts" 
ON contacts 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Apply trigger to contacts table
CREATE TRIGGER update_contacts_updated_at 
  BEFORE UPDATE ON contacts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'contacts'
) AS table_exists;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'contacts';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'contacts';

-- ============================================
-- Test Query (After Form Submission)
-- ============================================
-- View all contacts (run this to see submitted data)
SELECT 
  id,
  name,
  email,
  subject,
  LEFT(message, 50) AS message_preview,
  created_at
FROM contacts 
ORDER BY created_at DESC 
LIMIT 10;

