-- ============================================
-- Contacts Table Migration - Add Missing Columns and Policies
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- ============================================

-- 1. Add status column with default value
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved', 'spam'));

-- 2. Add phone column
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Add timezone columns (optional, for better tracking)
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS user_timezone TEXT,
ADD COLUMN IF NOT EXISTS user_local_time TEXT,
ADD COLUMN IF NOT EXISTS melbourne_time TEXT;

-- 4. Update existing records to have 'new' status if NULL
UPDATE contacts SET status = 'new' WHERE status IS NULL;

-- 5. Create UPDATE policy for authenticated users (ADMIN)
-- This allows admins to update contact status
CREATE POLICY IF NOT EXISTS "Authenticated users can update contacts" 
ON contacts 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 6. Add index for status column
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify everything is set up correctly:

-- Check if columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- Check all policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'contacts';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'contacts';

-- View sample data with new columns
SELECT 
  id,
  name,
  email,
  phone,
  status,
  LEFT(message, 30) AS message_preview,
  created_at
FROM contacts 
ORDER BY created_at DESC 
LIMIT 5;

