import * as Yup from "yup";
import type { InferType } from "yup";

// Import RecurrencePattern type
import type { RecurrencePattern } from "@/types/dash-events.types";

// Ticket Type Validation Schema
export const ticketTypeSchema = Yup.object().shape({
    name: Yup.string()
        .required("Ticket type name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must not exceed 50 characters"),
    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must not exceed 200 characters"),
    price: Yup.string()
        .required("Price is required")
        .test("is-number", "Price must be a valid number", (value) => !isNaN(Number(value)))
        .test("min-value", "Minimum ticket price is GH₵ 10.00", (value) => Number(value) >= 10)
        .test("max-value", "Maximum ticket price is GH₵ 100,000", (value) => Number(value) <= 100000),
    quantity: Yup.string()
        .required("Quantity is required")
        .test("is-number", "Quantity must be a valid number", (value) => !isNaN(Number(value)))
        .test("is-integer", "Quantity must be a whole number", (value) => Number.isInteger(Number(value)))
        .test("min-value", "Minimum quantity is 1", (value) => Number(value) >= 1)
        .test("max-value", "Maximum quantity is 1,000,000", (value) => Number(value) <= 1000000),
    min_purchase: Yup.string()
        .required("Minimum purchase is required")
        .test("is-number", "Must be a valid number", (value) => !isNaN(Number(value)))
        .test("is-integer", "Must be a whole number", (value) => Number.isInteger(Number(value)))
        .test("min-value", "Minimum purchase must be at least 1", (value) => Number(value) >= 1)
        .test("less-than-max", "Minimum must be less than or equal to maximum purchase", function (value) {
            const { max_purchase } = this.parent;
            if (!value || !max_purchase) return true;
            return Number(value) <= Number(max_purchase);
        }),
    max_purchase: Yup.string()
        .nullable()
        .test("is-number", "Must be a valid number", (value) => !value || !isNaN(Number(value)))
        .test("is-integer", "Must be a whole number", (value) => !value || Number.isInteger(Number(value)))
        .test("min-value", "Maximum purchase must be at least 1", (value) => !value || Number(value) >= 1)
        .test("max-value", "Maximum purchase per transaction is 100", (value) => !value || Number(value) <= 100),
    available_from: Yup.string().nullable(),
    available_until: Yup.string()
        .nullable()
        .test("after-available-from", "End date must be on or after start date", function (value) {
            const { available_from } = this.parent;
            if (!value || !available_from) return true;
            return new Date(value) >= new Date(available_from);
        }),
});

export type TicketTypeFormValues = InferType<typeof ticketTypeSchema>;

// Recurrence Pattern Validation Schema
const recurrencePatternSchema = Yup.object().shape({
    frequency: Yup.string()
        .required("Frequency is required")
        .oneOf(["daily", "weekly", "monthly"], "Invalid frequency"),
    interval: Yup.number()
        .required("Interval is required")
        .integer("Interval must be a whole number")
        .min(1, "Interval must be at least 1")
        .max(30, "Interval cannot exceed 30"),
    end_date: Yup.string()
        .nullable()
        .test("after-start", "Recurrence end date must be after event start date", function (value) {
            if (!value) return true;
            const parentForm = this.from?.[1]?.value;
            if (!parentForm?.start_date) return true;
            return new Date(value) > new Date(parentForm.start_date);
        }),
    occurrences: Yup.number()
        .nullable()
        .integer("Occurrences must be a whole number")
        .min(2, "Occurrences must be at least 2")
        .max(365, "Occurrences cannot exceed 365")
        .test("end-date-or-occurrences", "Either end date or occurrences must be provided", function (value) {
            const { end_date } = this.parent;
            return !!(value || end_date);
        }),
    days_of_week: Yup.array().of(Yup.number()).nullable(),
    day_of_month: Yup.number().nullable(),
});

// Main Event Creation Validation Schema
export const eventCreationSchema = Yup.object().shape({
    // Basic Info
    title: Yup.string()
        .required("Event title is required")
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must not exceed 200 characters"),
    category_slug: Yup.string().required("Event category is required"),
    short_description: Yup.string()
        .required("Short description is required")
        .min(20, "Short description must be at least 20 characters")
        .max(300, "Short description must not exceed 300 characters"),
    description: Yup.string()
        .required("Full description is required")
        .min(50, "Description must be at least 50 characters")
        .max(10000, "Description must not exceed 10,000 characters"),

    // Venue
    venue_name: Yup.string()
        .required("Venue name is required")
        .min(3, "Venue name must be at least 3 characters")
        .max(200, "Venue name must not exceed 200 characters"),
    venue_address: Yup.string()
        .required("Venue address is required")
        .min(5, "Venue address must be at least 5 characters")
        .max(300, "Venue address must not exceed 300 characters"),
    venue_city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters")
        .max(100, "City must not exceed 100 characters"),
    venue_country: Yup.string().required("Country is required").default("Ghana"),
    venue_latitude: Yup.string()
        .nullable()
        .matches(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/, "Invalid latitude"),
    venue_longitude: Yup.string()
        .nullable()
        .matches(/^-?((1[0-7][0-9])|([0-9]{1,2}))(\.[0-9]{1,10})?$/, "Invalid longitude"),

    // Date & Time
    start_date: Yup.string()
        .required("Start date is required")
        .test("not-past", "Start date cannot be in the past", (value) => {
            if (!value) return true;
            return new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0));
        }),
    end_date: Yup.string()
        .required("End date is required")
        .test("after-start", "End date must be on or after start date", function (value) {
            const { start_date } = this.parent;
            if (!value || !start_date) return true;
            return new Date(value) >= new Date(start_date);
        }),
    start_time: Yup.string()
        .required("Start time is required")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, "Invalid time format (HH:MM:SS)"),
    end_time: Yup.string()
        .required("End time is required")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, "Invalid time format (HH:MM:SS)")
        .test("after-start-time", "End time must be after start time on same day", function (value) {
            const { start_date, end_date, start_time } = this.parent;
            if (!value || !start_time || !start_date || !end_date) return true;

            if (new Date(start_date).toDateString() === new Date(end_date).toDateString()) {
                return value > start_time;
            }
            return true;
        }),

    // Event Type - ✅ FIXED: Proper RecurrencePattern typing
    is_recurring: Yup.boolean().required("Recurring status is required").default(false),
    recurrence_pattern: Yup.lazy((value) =>
        value === null || value === undefined
            ? Yup.mixed().nullable()
            : recurrencePatternSchema
    ) as unknown as Yup.Schema<RecurrencePattern | null>,
    check_in_policy: Yup.string()
        .required("Check-in policy is required")
        .oneOf(["single_entry", "multiple_entry", "daily_entry"], "Invalid check-in policy")
        .default("single_entry"),

    // Capacity
    max_attendees: Yup.string()
        .required("Maximum attendees is required")
        .test("is-number", "Must be a valid number", (value) => !isNaN(Number(value)))
        .test("is-integer", "Must be a whole number", (value) => Number.isInteger(Number(value)))
        .test("min-value", "Maximum attendees must be at least 1", (value) => Number(value) >= 1)
        .test("max-value", "Maximum attendees cannot exceed 100,000", (value) => Number(value) <= 100000)
        .test("sum-of-tickets", "Max attendees must be at least equal to sum of ticket quantities", function (value) {
            const { ticket_types } = this.parent;
            if (!value || !ticket_types || ticket_types.length === 0) return true;

            const totalTickets = ticket_types.reduce((sum: number, ticket: any) => {
                return sum + (parseInt(ticket.quantity) || 0);
            }, 0);

            return Number(value) >= totalTickets;
        }),

    // Payment Profile
    payment_profile_id: Yup.string().required("Payment profile is required. Please create and verify a payment profile first."),

    // Images
    featured_image: Yup.string().required("Featured image is required"),
    additional_images: Yup.array().of(Yup.string()).max(5, "Maximum 5 additional images allowed").default([]),

    // Publishing
    is_published: Yup.boolean().required("Publishing status is required").default(true),

    // Ticket Types
    ticket_types: Yup.array()
        .of(ticketTypeSchema)
        .min(1, "At least one ticket type is required")
        .max(10, "Maximum 10 ticket types allowed")
        .required("At least one ticket type is required"),
});

export type EventFormValues = InferType<typeof eventCreationSchema>;
