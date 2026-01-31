import type { RecurrencePattern } from "@/types/dash-events.types";

export function buildEventFormData(eventData: {
    // Basic Info
    title: string;
    category_slug: string;
    short_description: string;
    description: string;

    // Venue
    venue_name: string;
    venue_address: string;
    venue_city: string;
    venue_country: string;
    venue_latitude?: string;
    venue_longitude?: string;

    // Date & Time
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;

    // Recurrence (optional)
    is_recurring: boolean;
    recurrence_pattern?: RecurrencePattern | null;

    // Policies
    check_in_policy: "single_entry" | "multiple_entry" | "daily_entry";
    max_attendees: number;

    // Payment
    payment_profile_id: string;

    // Images - base64 strings on mobile
    featured_image: string;
    additional_images?: string[];

    // Publishing
    is_published: boolean;

    // Tickets
    ticket_types: Array<{
        name: string;
        description?: string;
        price: string;
        quantity: number;
        min_purchase?: number;
        max_purchase?: number;
        available_from?: string;
        available_until?: string;
    }>;
}) {
    // On mobile, we send JSON instead of FormData
    // Convert base64 images to the format backend expects

    const payload: any = {
        // Basic Info
        title: eventData.title,
        category_slug: eventData.category_slug,
        short_description: eventData.short_description,
        description: eventData.description,

        // Venue
        venue_name: eventData.venue_name,
        venue_address: eventData.venue_address,
        venue_city: eventData.venue_city,
        venue_country: eventData.venue_country,
    };

    // Optional venue coordinates
    if (eventData.venue_latitude) payload.venue_latitude = eventData.venue_latitude;
    if (eventData.venue_longitude) payload.venue_longitude = eventData.venue_longitude;

    // Date & Time
    payload.start_date = eventData.start_date;
    payload.end_date = eventData.end_date;
    payload.start_time = eventData.start_time;
    payload.end_time = eventData.end_time;

    // Recurrence
    payload.is_recurring = eventData.is_recurring;
    if (eventData.recurrence_pattern) {
        payload.recurrence_pattern = eventData.recurrence_pattern;
    }

    // Policies
    payload.check_in_policy = eventData.check_in_policy;
    payload.max_attendees = eventData.max_attendees;

    // Payment
    payload.payment_profile_id = eventData.payment_profile_id;

    // Images - base64 strings
    if (eventData.featured_image) {
        payload.featured_image = eventData.featured_image;
    }

    if (eventData.additional_images && eventData.additional_images.length > 0) {
        payload.additional_images = eventData.additional_images.filter(
            (img) => img && img.length > 0
        );
    }

    // Publishing
    payload.is_published = eventData.is_published;

    // Ticket Types
    payload.ticket_types = eventData.ticket_types.map((ticket) => ({
        name: ticket.name,
        description: ticket.description || "",
        price: ticket.price,
        quantity: ticket.quantity,
        min_purchase: ticket.min_purchase || 1,
        max_purchase: ticket.max_purchase || undefined,
        available_from: ticket.available_from || undefined,
        available_until: ticket.available_until || undefined,
    }));

    return payload;
}