export interface LeadSource {
  id: string;
  quote_id: string;
  source: string;
  page_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  created_at: string;
}

export interface Quote {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string;
  vehicle_type: string;
  vehicle_name: string | null;
  vehicle_model: string | null;
  passengers: number;
  pickup_location: string;
  destinations: any; // Can be array or object (return trip)
  date: string;
  time: string;
  service_type: string | null;
  flight_number: string | null;
  terminal_type: string | null;
  driver_instructions: string | null;
  melbourne_datetime: string | null;
  timezone: string | null;
  user_timezone: string | null;
  city: string | null;
  status: QuoteStatus | null;
  quoted_price: number | null;
  price_breakdown: any | null;
  quote_sent_at: string | null;
  quote_accepted_at: string | null;
  admin_comments: string | null;
  notes: string | null;
  reminder_count?: number | null;
  last_reminder_sent?: string | null;
  admin_reminder_sent?: boolean | null;
  follow_up_count?: number | null;
  last_follow_up_at?: string | null;
  trip_leg?: 'one-way' | 'outbound' | 'return' | null;
  related_booking_id?: string | null;
  confirmation_token?: string | null;
  // Lead source (joined from lead_sources table)
  lead_source?: LeadSource | null;
}

export type QuoteStatus =
  | 'pending'
  | 'contacted'
  | 'quoted'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'lost';

export type ContactStatus = 'pending' | 'contacted' | 'resolved' | 'spam';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  user_timezone?: string;
  user_local_time?: string;
  melbourne_time?: string;
  subject?: string;
}

// Filter Types
export interface QuoteFilters {
  status: QuoteStatus | 'all';
  serviceType: string | 'all';
  dateFrom: Date | null;
  dateTo: Date | null;
  priceMin: number | null;
  priceMax: number | null;
  vehicleType: string | 'all';
  leadSource: string | 'all';
}

export interface ContactFilters {
  status: ContactStatus | 'all';
  dateFrom: Date | null;
  dateTo: Date | null;
}

export type SortField = 'date' | 'name' | 'price';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Price breakdown types
export interface PriceItem {
  description: string;
  amount: number;
}

export interface PriceBreakdown {
  base_price: number;
  return_base_price?: number | null;
  additional_items: PriceItem[];
  subtotal: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
    reason?: string;
  } | null;
  total: number;
  notes?: string;
  is_return_trip?: boolean;
}

export interface QuoteActivity {
  id: string;
  quote_id?: string | null;
  booking_id?: string | null;
  action_type: 'quote_sent' | 'reminder_sent' | 'discount_sent' | 'personal_email_sent' | 'customer_called' | 'marked_lost' | 'customer_confirmed';
  details?: any;
  created_at: string;
}

