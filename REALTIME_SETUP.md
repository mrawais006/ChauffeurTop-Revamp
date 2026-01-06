# Supabase Realtime Setup Guide

## What Was Implemented

Real-time subscriptions have been added to your admin panel. The admin dashboard will now automatically:

1. **Show new quotes instantly** when someone submits the quote form
2. **Update quotes in real-time** when status changes or other updates occur
3. **Show new contacts instantly** when someone submits the contact form
4. **Display toast notifications** for new submissions

## Enable Realtime on Supabase

You need to enable Realtime on your Supabase tables. Follow these steps:

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Database** → **Replication**
4. Find the `quotes` table and toggle **Enable Realtime** ON
5. Find the `contacts` table and toggle **Enable Realtime** ON

### Option 2: Via SQL Editor

If you prefer SQL, run these commands in your Supabase SQL Editor:

```sql
-- Enable Realtime for quotes table
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;

-- Enable Realtime for contacts table
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
```

## How It Works

### For Quotes:
- **INSERT events**: New quote appears at the top of the list with a toast notification
- **UPDATE events**: Existing quotes update automatically (status changes, price updates, etc.)
- **DELETE events**: Deleted quotes are removed from the list automatically

### For Contacts:
- **INSERT events**: New contact appears at the top of the list with a toast notification  
- **UPDATE events**: Contact status changes update automatically
- **DELETE events**: Deleted contacts are removed from the list automatically

## Testing Real-time Updates

1. Open your admin panel in one browser tab
2. Open your website quote form in another tab
3. Submit a quote
4. Watch it appear instantly in the admin panel! 🎉

## Benefits

✅ No more manual refresh needed
✅ Always see the latest data
✅ Instant notifications for new submissions
✅ Smooth, seamless updates
✅ Multiple admins can work simultaneously and see each other's changes

## Troubleshooting

If realtime isn't working:

1. **Check browser console** for `[Realtime]` logs
2. **Verify Realtime is enabled** on both tables in Supabase
3. **Check connection status** - should see "subscribed" in console
4. **Ensure RLS policies** allow SELECT on the tables for your role

## Console Logs

When working correctly, you'll see:
```
[Realtime] Quotes subscription status: SUBSCRIBED
[Realtime] Contacts subscription status: SUBSCRIBED
[Realtime] New quote received: {...}
```

