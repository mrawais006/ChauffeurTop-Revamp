export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSubject: string;
  html: string;
}

// Shared styles used across all campaign templates
const campaignStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); padding: 30px 20px; text-align: center; }
  .header h1 { color: #C5A572; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
  .header p { color: #9CA3AF; margin: 6px 0 0 0; font-size: 13px; }
  .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C5A572, transparent); }
  .content { padding: 40px 30px; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, #C5A572 0%, #D4B88C 100%); color: #1A1F2C; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; text-align: center; box-shadow: 0 4px 12px rgba(197, 165, 114, 0.35); letter-spacing: 0.5px; }
  .footer { background: #1A1F2C; padding: 30px; text-align: center; color: #9CA3AF; font-size: 12px; }
  .footer a { color: #C5A572; text-decoration: none; }
`;

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'reengagement',
    name: 'Re-engagement',
    description: 'Win back cancelled or lost leads with a special offer',
    icon: '💌',
    defaultSubject: 'We miss you — here\'s 10% off your next ChauffeurTop ride',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${campaignStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>We'd Love to See You Again</h1>
      <p>ChauffeurTop Melbourne</p>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hi there,</p>
      
      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        It's been a while since we last heard from you. We'd love the chance to show you what makes ChauffeurTop Melbourne's preferred chauffeur service — and we're sweetening the deal.
      </p>

      <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;">Exclusive Offer</span>
        <div style="font-size: 36px; font-weight: 800; color: #C5A572; margin: 8px 0;">10% OFF</div>
        <span style="font-size: 14px; color: #6B7280;">Your next booking with ChauffeurTop</span>
      </div>

      <div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef9f0 100%); border: 1px solid #C5A572; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #1A1F2C;">Why clients choose ChauffeurTop:</p>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🚘</span><span>Luxury fleet — Mercedes, BMW, and Audi vehicles</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🔒</span><span>Fixed pricing — no surge, often less than a taxi</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🎩</span><span>Professional chauffeurs — suited, licensed, punctual</span></div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://chauffeurtop.com.au" class="cta-button">Book Now & Save 10%</a>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #9CA3AF;">Use code <strong style="color: #C5A572;">WELCOME10</strong> when you confirm your booking.</p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 10px;"><a href="https://chauffeurtop.com.au/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'seasonal',
    name: 'Seasonal Promo',
    description: 'Seasonal offer for airport transfers or special events',
    icon: '🌞',
    defaultSubject: 'Melbourne Airport Transfers from $79 — Limited Time Offer',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${campaignStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Seasonal Special</h1>
      <p>ChauffeurTop Melbourne</p>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hello,</p>
      
      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        Planning a trip this season? Skip the taxi queue and travel in style. For a limited time, we're offering premium airport transfers at unbeatable rates.
      </p>

      <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;">Airport Transfers From</span>
        <div style="font-size: 48px; font-weight: 800; color: #C5A572; margin: 8px 0;">$79</div>
        <span style="font-size: 14px; color: #6B7280;">Melbourne CBD ↔ Tullamarine Airport</span>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1A1F2C;">Every airport transfer includes:</p>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">✈️</span><span>Real-time flight tracking — we adjust to delays</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">⏳</span><span>60 minutes free waiting time at the airport</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🚘</span><span>Luxury Mercedes or BMW — not a rideshare</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🔒</span><span>Fixed pricing — no surprises, guaranteed</span></div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://chauffeurtop.com.au" class="cta-button">Book Your Airport Transfer</a>
      </div>
      
      <p style="text-align: center; font-size: 13px; color: #6b7280; font-style: italic;">
        "Less than a taxi, better than first class." — ChauffeurTop
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 10px;"><a href="https://chauffeurtop.com.au/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'repeat_customer',
    name: 'Repeat Customer',
    description: 'Loyalty offer for past customers',
    icon: '🏆',
    defaultSubject: 'Welcome back — 15% off your next ChauffeurTop ride',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${campaignStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome Back</h1>
      <p>A special thank you from ChauffeurTop</p>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Dear valued client,</p>
      
      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        Thank you for choosing ChauffeurTop for your previous trip. We truly value your trust in our service, and we'd love to welcome you back with an exclusive loyalty offer.
      </p>

      <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;">Loyalty Reward</span>
        <div style="font-size: 36px; font-weight: 800; color: #C5A572; margin: 8px 0;">15% OFF</div>
        <span style="font-size: 14px; color: #6B7280;">Your next ride with ChauffeurTop</span>
      </div>

      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        Whether it's an airport transfer, a corporate event, or a special occasion — your preferred chauffeur is just a booking away. Same luxury fleet, same professional service, now at an even better price.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://chauffeurtop.com.au" class="cta-button">Book Your Next Ride</a>
      </div>
      
      <p style="text-align: center; font-size: 12px; color: #9CA3AF;">Use code <strong style="color: #C5A572;">LOYAL15</strong> when confirming your booking.</p>

      <div style="text-align: center; padding: 15px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">Refer a friend and they'll get 10% off too!</p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 10px;"><a href="https://chauffeurtop.com.au/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'new_service',
    name: 'New Service',
    description: 'Announce new routes, vehicles, or services',
    icon: '🆕',
    defaultSubject: 'Introducing New Services at ChauffeurTop Melbourne',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${campaignStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Something New at ChauffeurTop</h1>
      <p>Melbourne's Premium Chauffeur Service</p>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hello,</p>
      
      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        We're excited to announce new additions to the ChauffeurTop experience. We're always working to offer you the best in premium chauffeur services — and we've just raised the bar.
      </p>

      <div style="background: linear-gradient(135deg, #fdfbf7 0%, #fef9f0 100%); border: 1px solid #C5A572; border-radius: 8px; padding: 25px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1A1F2C;">What's New</h3>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; color: #4b5563;">
          <span style="flex-shrink: 0;">🚘</span>
          <span><strong>Expanded Fleet</strong> — New luxury vehicles added to our collection for an even more premium experience.</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 14px; color: #4b5563;">
          <span style="flex-shrink: 0;">📍</span>
          <span><strong>More Coverage</strong> — Now serving additional areas across Greater Melbourne and regional Victoria.</span>
        </div>
        <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;">
          <span style="flex-shrink: 0;">🎯</span>
          <span><strong>Corporate Packages</strong> — Tailored corporate account solutions with priority booking and monthly invoicing.</span>
        </div>
      </div>

      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        As always, every ride includes a professional chauffeur, luxury vehicle, and fixed pricing with no hidden fees.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://chauffeurtop.com.au" class="cta-button">Explore Our Services</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 10px;"><a href="https://chauffeurtop.com.au/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'event_based',
    name: 'Event-Based',
    description: 'Melbourne Cup, Grand Prix, or seasonal events',
    icon: '🏇',
    defaultSubject: 'Melbourne Cup Season — Book Your Chauffeur Early',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${campaignStyles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>Event Season is Here</h1>
      <p>ChauffeurTop Melbourne</p>
    </div>
    <div class="gold-bar"></div>
    <div class="content">
      <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">Hello,</p>
      
      <p style="color: #4b5563; line-height: 1.7; margin-bottom: 25px;">
        Major events are coming to Melbourne, and demand for premium transport is high. Book your ChauffeurTop chauffeur early to guarantee availability and lock in your rate.
      </p>

      <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #1A1F2C 0%, #2d3344 100%); border-radius: 8px; margin: 25px 0;">
        <span style="font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;">Early Bird Discount</span>
        <div style="font-size: 36px; font-weight: 800; color: #C5A572; margin: 8px 0;">BOOK EARLY</div>
        <span style="font-size: 14px; color: #6B7280;">Secure your chauffeur before dates fill up</span>
      </div>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1A1F2C;">Why book with ChauffeurTop for events?</p>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🎩</span><span>Arrive in style — make a statement at any event</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🔒</span><span>Fixed pricing — no event surge, guaranteed</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">⏰</span><span>Priority pickup — skip the post-event chaos</span></div>
        <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #4b5563;"><span style="flex-shrink: 0;">🚘</span><span>Luxury fleet — Mercedes, BMW, Audi</span></div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://chauffeurtop.com.au" class="cta-button">Book Your Event Chauffeur</a>
      </div>

      <p style="text-align: center; color: #EF4444; font-weight: 600; font-size: 13px;">
        Event dates fill up fast — don't wait until the last minute.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><a href="tel:+61430240945">+61 430 240 945</a> · <a href="mailto:bookings@chauffeurtop.com.au">bookings@chauffeurtop.com.au</a></p>
      <p style="margin: 0;">© ${new Date().getFullYear()} ChauffeurTop Melbourne. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 10px;"><a href="https://chauffeurtop.com.au/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  },
];
