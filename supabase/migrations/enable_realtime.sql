-- Enable Realtime for quotes and contacts tables
-- Run this in your Supabase SQL Editor

-- Enable Realtime for quotes table
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;

-- Enable Realtime for contacts table  
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;

-- Verify Realtime is enabled (optional check)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('quotes', 'contacts');

