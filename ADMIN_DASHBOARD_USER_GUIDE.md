# 📘 Admin Dashboard User Guide

Complete user guide for the Chauffeur Top Admin Dashboard.

## 🎯 Dashboard Overview

The admin dashboard is a comprehensive management system for your chauffeur business, featuring:

- **5 Organized Tabs** for different stages of the booking lifecycle
- **Real-time Revenue Tracking** across multiple time periods
- **Customer Reminder System** for upcoming bookings
- **Contact Management** for inquiries
- **Search & Filter** capabilities
- **Auto-refresh** every 60 seconds

---

## 🔐 Logging In

1. Navigate to `/admin`
2. Enter your admin email and password
3. Click "Sign In"

**First time setup:** Create admin user via Supabase Dashboard > Authentication

---

## 📊 Dashboard Layout

### Header Section
- **User Email** - Shows logged in user
- **Refresh Button** 🔄 - Manual data refresh
- **Logout Button** - Sign out

### Revenue Stats (Top Section)
Displays 4 key metrics:
- **Today** 💵 - Revenue from today's bookings
- **This Week** 📈 - Past 7 days revenue
- **This Month** 📅 - Current month revenue
- **All Time** 💼 - Total lifetime revenue

Plus 3 additional quick stats:
- Pending Quotes
- Confirmed Bookings
- Completed Jobs

### Search Bar
Global search across all quotes/bookings by:
- Customer name
- Email address
- Phone number

---

## 🚗 Tab 1: Upcoming (Amber)

### Purpose
Shows confirmed bookings within the next 24 hours.

### Features
- **Real-time 24-hour window** - Automatically filters bookings
- **Chronological order** - Soonest pickups first
- **Reminder button** - Send customer reminders

### How to Send Reminders

1. Click **"Remind"** button on any booking
2. Dialog opens with:
   - Booking summary (date, time, location, vehicle)
   - Default reminder message
   - Editable custom message field
3. Review/edit the message
4. Click **"Send Reminder"**
5. Confirmation toast appears
6. Email sent to customer
7. Reminder count updated in database

### Reminder Features
- **Tracks count** - Shows how many reminders sent
- **Last reminder time** - Records timestamp
- **Custom messages** - Personalize each reminder
- **Email formatting** - Professional HTML emails

---

## 📝 Tab 2: Quotes (Blue)

### Purpose
Manage pending quote requests and inquiries.

### Status Types
- **Pending** 🟡 - New quote request
- **Contacted** 🔵 - Customer contacted
- **Quoted** 🟣 - Price quote sent

### Actions
- **View Details** 👁️ - See full quote information
- **Update Status** - Change quote status
- **Convert to Booking** - Change status to "confirmed"

### Quote Information Displayed
- Customer name and contact
- Service type
- Vehicle requested
- Pickup date and time
- Pickup location
- Status badge

---

## ✅ Tab 3: Bookings (Green)

### Purpose
View all confirmed bookings (not just upcoming).

### Features
- **All confirmed bookings** - Complete list
- **Sorted by pickup date** - Soonest first
- **Full booking details** - All customer and trip info

### Use Cases
- Check upcoming schedule (beyond 24 hours)
- Verify booking details
- Plan driver assignments
- Review customer requirements

---

## 📋 Tab 4: History (Gray)

### Purpose
Archive of completed and cancelled bookings.

### Status Types
- **Completed** ✅ - Service successfully provided
- **Cancelled** ❌ - Booking cancelled

### Features
- **Reverse chronological order** - Most recent first
- **Complete records** - All booking details preserved
- **Reference lookup** - Search past bookings

### Use Cases
- Customer history lookup
- Billing reconciliation
- Service quality review
- Dispute resolution

---

## 💬 Tab 5: Contacts (Purple)

### Purpose
Manage general inquiries from contact form.

### Contact Stats Dashboard
Shows 7 metrics:
- Today's contacts
- This week's contacts
- This month's contacts
- All time contacts
- New inquiries (blue)
- Contacted (yellow)
- Resolved (green)

### Contact Statuses
- **New** 🔵 - Unread inquiry
- **Contacted** 🟡 - Response sent
- **Resolved** 🟢 - Issue closed

### Contact Details Dialog

Click **"View"** to see:
- Full name and contact info
- Email (clickable mailto link)
- Phone (clickable tel link)
- Submission timestamp
- Timezone information
- Complete message
- Status change buttons

### Status Management
Quick action buttons in dialog:
- **Mark as New** - Reopen inquiry
- **Mark as Contacted** - Indicate response sent
- **Mark as Resolved** - Close inquiry

---

## 🔍 Search & Filter Features

### Global Search
Located at the top of the dashboard, searches:
- All quotes
- All bookings
- All history

**Search by:**
- Customer name
- Email address
- Phone number

### Tab-Specific Search
Contacts tab has its own search bar for:
- Contact name
- Email
- Phone
- Message content

---

## 📱 Quote/Booking Details Dialog

Click **"View"** on any row to see:

### Customer Information
- Full name
- Email (clickable)
- Phone (clickable)
- Passenger count

### Trip Details
- Service type (Airport Transfer, Point to Point, etc.)
- Vehicle information
- Pickup location
- Destination(s)
- Date and time
- Flight number (if applicable)
- Terminal (if applicable)
- Driver instructions

### Trip Leg Badges
For return trips, badges show:
- 🔄 **Return** (blue) - Return leg
- ⇉ **Outbound** (purple) - Outbound leg

### Pricing
- Quoted price (if available)
- Price breakdown (if available)

### Activity Tracking
- 📧 **Follow-up count** - Number of follow-ups sent
- 🔔 **Reminder count** - Number of reminders sent
- Last reminder timestamp

### Admin Notes
- Internal comments
- Special instructions

### Metadata
- Creation timestamp
- Last updated
- Last reminder sent

---

## 🎨 Status Badges

### Quote Statuses
- 🟡 **Pending** - Yellow
- 🔵 **Contacted** - Blue
- 🟣 **Quoted** - Purple
- 🟢 **Confirmed** - Green
- ⚪ **Completed** - Gray
- 🔴 **Cancelled** - Red

### Contact Statuses
- 🔵 **New** - Blue
- 🟡 **Contacted** - Yellow
- 🟢 **Resolved** - Green

---

## 🔄 Auto-Refresh

Dashboard automatically refreshes every **60 seconds** to show:
- New quotes
- Status changes
- New contacts
- Updated counts

**Manual refresh:** Click 🔄 button in header anytime

---

## 💡 Pro Tips

### 1. Morning Routine
1. Check **Upcoming** tab first
2. Send reminders to today's customers
3. Verify driver assignments

### 2. Quote Management
1. Review **Quotes** tab daily
2. Follow up on pending quotes within 24 hours
3. Update status as you progress

### 3. Customer Service
1. Check **Contacts** tab for new inquiries
2. Respond within 2 hours during business hours
3. Mark as resolved when complete

### 4. End of Day
1. Review **Bookings** tab
2. Confirm tomorrow's pickups
3. Check **History** for today's completed jobs

### 5. Using Search
- Use partial names (e.g., "John" finds "John Smith")
- Search by phone for quick customer lookup
- Email search for quote follow-ups

---

## 🚨 Common Tasks

### Send a Reminder
1. Go to **Upcoming** tab
2. Find the booking
3. Click **"Remind"** button
4. Edit message if needed
5. Click **"Send Reminder"**

### Convert Quote to Booking
1. Go to **Quotes** tab
2. Click **"View"** on quote
3. Contact customer with price
4. Update status in your database to "confirmed"
5. Booking appears in **Bookings** tab

### Mark Contact as Resolved
1. Go to **Contacts** tab
2. Click **"View"** on contact
3. Click **"Mark as Resolved"**
4. Dialog closes automatically

### Look Up Past Booking
1. Go to **History** tab
2. Use search bar to find customer
3. Click **"View"** to see details

### Check Today's Revenue
Look at top **"Today"** card in Revenue Stats

---

## 📈 Understanding the Numbers

### Revenue Cards
- **Today** - Bookings confirmed/completed today
- **This Week** - Rolling 7-day total
- **This Month** - Calendar month total
- **All Time** - Lifetime total

### Tab Counts
Numbers in parentheses show:
- **Upcoming** (X) - Bookings in next 24 hours
- **Quotes** (X) - Pending/contacted/quoted
- **Bookings** (X) - All confirmed
- **History** (X) - Completed + cancelled
- **Contacts** (X) - Based on current search

---

## 🔔 Email Notifications

### Reminder Emails Include:
- Friendly greeting with customer name
- Pickup date and time
- Pickup location
- Vehicle type
- Driver arrival notice
- Contact instructions
- Professional signature

### Email Sent From:
`Chauffeur Top Melbourne <info@chauffeurtopmembourne.au>`

### Tracking:
- Each reminder increments counter
- Timestamp recorded
- Visible in booking details

---

## 🛠️ Troubleshooting

### Dashboard Not Loading
1. Check internet connection
2. Verify login credentials
3. Clear browser cache
4. Try different browser

### Reminder Button Not Showing
- Only appears in **Upcoming** tab
- Only for confirmed bookings
- Only for bookings within 24 hours

### Search Not Working
- Check spelling
- Try partial name
- Try phone/email instead
- Verify data exists in database

### Numbers Don't Match
- Wait for auto-refresh (60s)
- Click manual refresh button
- Check browser console for errors

---

## 🎓 Best Practices

### Data Entry
- Always add driver instructions if provided
- Include flight numbers for airport transfers
- Note any special requests

### Communication
- Send reminders 2-4 hours before pickup
- Respond to contacts within business hours
- Update status after each customer interaction

### Organization
- Review and update quotes daily
- Clear old resolved contacts weekly
- Keep admin comments professional

### Security
- Never share login credentials
- Log out on shared computers
- Use strong password
- Change password regularly

---

## 📞 Getting Help

For technical support:
- Check browser console for errors
- Review deployment documentation
- Contact system administrator

---

**🎉 You're ready to manage your chauffeur business efficiently!**

