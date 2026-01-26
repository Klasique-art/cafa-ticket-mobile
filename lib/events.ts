import client from "./client";
import {
  Event,
  EventDetails,
  EventFilters,
  PaginatedEventsResponse,
  EventCategory,
} from "@/types";

export async function getEvents(
  filters: EventFilters = {}
): Promise<PaginatedEventsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.city) params.append("city", filters.city);
    if (filters.status) params.append("status", filters.status);
    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);
    if (filters.price_min) params.append("price_min", String(filters.price_min));
    if (filters.price_max) params.append("price_max", String(filters.price_max));
    if (filters.ordering) params.append("ordering", filters.ordering);
    if (filters.page) params.append("page", String(filters.page));

    const response = await client.get(`/events/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetails | null> {
  try {
    const response = await client.get(`/events/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getEventCategories(): Promise<EventCategory[]> {
  try {
    const response = await client.get("/event-categories/");
    return response.data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function searchEvents(query: string): Promise<Event[]> {
  try {
    const response = await getEvents({ search: query, status: "upcoming" });
    return response.results;
  } catch (error) {
    console.error("Error searching events:", error);
    return [];
  }
}
