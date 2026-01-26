export interface PublicStatsOverview {
  total_upcoming_events: number;
  total_tickets_sold: number;
  total_organizers: number;
  total_attendees_checked_in: number;
  total_events_published: number;
  active_events_now: number;
}

export interface PublicStatsRevenue {
  total_revenue: string;
  currency: string;
}

export interface MostPopularEvent {
  id: number;
  slug: string;
  title: string;
  tickets_sold: number;
  category: string | null;
}

export interface PublicStatsHighlights {
  most_popular_event: MostPopularEvent | null;
  events_this_month: number;
  new_organizers_this_month: number;
}

export interface PublicStats {
  data: {
    overview: PublicStatsOverview;
    revenue: PublicStatsRevenue;
    highlights: PublicStatsHighlights;
    last_updated: string;
  };
}
