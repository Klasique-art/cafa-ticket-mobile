export type EventStatus = "upcoming" | "ongoing" | "past";

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  event_count: number;
}

export interface Organizer {
  id: number;
  username: string;
  full_name: string;
  profile_image: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  organizer: Organizer;
  category: Category;
  short_description: string;
  featured_image: string;
  venue_name: string;
  venue_city: string;
  venue_country: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  tickets_sold: number;
  tickets_available: number;
  total_tickets: number;
  lowest_price: string;
  highest_price: string;
  status: EventStatus;
  is_recurring: boolean;
  created_at: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  google_maps_url: string;
}

export interface TicketType {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  tickets_sold: number;
  tickets_remaining: number;
  min_purchase: number;
  max_purchase: number;
  available_from: string;
  available_until: string;
  is_available: boolean;
  sold_out_at?: string;
}

export interface SimilarEvent {
  id: number;
  title: string;
  slug: string;
  featured_image: string;
  start_date: string;
  venue_city: string;
  lowest_price: string;
}

export interface ShareUrls {
  facebook: string;
  twitter: string;
  whatsapp: string;
  email: string;
}

export interface RecurrenceInfo {
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  end_date: string;
  total_occurrences: number;
}

export interface EventDetails extends Event {
  description: string;
  additional_images: string[];
  venue: Venue;
  timezone: string;
  max_attendees: number;
  ticket_types: TicketType[];
  similar_events: SimilarEvent[];
  share_urls: ShareUrls;
  check_in_policy: "single_entry" | "multi_entry" | "daily_entry";
  is_published: boolean;
  updated_at: string;
  recurrence_info?: RecurrenceInfo;
}

export interface EventFilters {
  search?: string;
  category?: string;
  city?: string;
  status?: EventStatus | "all";
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
  ordering?: string;
  page?: number;
}

export interface PaginatedEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  page_size?: number;
  total_pages?: number;
  current_page?: number;
  results: Event[];
}
