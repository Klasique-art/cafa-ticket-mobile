import { View, ScrollView, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import type { FormikErrors } from "formik";

import AppText from "../../../ui/AppText";
import AppForm from "../../../form/AppForm";
import SubmitButton from "../../../form/SubmitButton";
import FormLoader from "../../../form/FormLoader";
import EventBasicInfoSection from "../create/EventBasicInfoSection";
import EventVenueSection from "../create/EventVenueSection";
import EventDateTimeSection from "../create/EventDateTimeSection";
import EventTypeSection from "../create/EventTypeSection";
import EventCapacitySection from "../create/EventCapacitySection";
import EventPaymentProfileSection from "../create/EventPaymentProfileSection";
import EventImagesSection from "../create/EventImagesSection";
import EventPublishSection from "../create/EventPublishSection";
import { eventCreationSchema, type EventFormValues } from "@/data/eventCreationSchema";
import { buildEventFormData } from "@/utils/buildEventFormData";
import { updateEvent } from "@/lib/events";
import type { MyEventDetailsResponse } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface EditEventFormProps {
    event: MyEventDetailsResponse;
}

const EditEventForm = ({ event }: EditEventFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const initialValues: EventFormValues = {
        // Basic Info
        title: event.title,
        category_slug: event.category.slug,
        short_description: event.short_description,
        description: event.description,

        // Venue
        venue_name: event.venue_name,
        venue_address: event.venue_address,
        venue_city: event.venue_city,
        venue_country: event.venue_country,
        venue_latitude: event.venue_location?.latitude || null,
        venue_longitude: event.venue_location?.longitude || null,

        // Date & Time
        start_date: event.start_date,
        end_date: event.end_date,
        start_time: event.start_time,
        end_time: event.end_time,

        // Event Type
        is_recurring: event.is_recurring,
        recurrence_pattern: event.recurrence_pattern,
        check_in_policy: event.check_in_policy as "single_entry" | "multiple_entry" | "daily_entry",

        // Capacity
        max_attendees: event.max_attendees.toString(),

        // Payment Profile
        payment_profile_id: event.payment_profile?.id || "",

        // Images
        featured_image: event.featured_image,
        additional_images: event.additional_images || [],

        // Publishing
        is_published: event.is_published,

        // Ticket Types - empty (edited separately)
        ticket_types: [],
    };

    // Helper to format time HH:MM to HH:MM:SS
    const formatTime = (time: string): string => {
        if (!time) return "";
        if (time.includes(":") && time.split(":").length === 3) return time;
        return `${time}:00`;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const getMissingFields = (values: EventFormValues): string[] => {
        const missing: string[] = [];

        if (!values.title) missing.push("Event title");
        if (!values.category_slug) missing.push("Category");
        if (!values.short_description) missing.push("Short description");
        if (!values.description) missing.push("Full description");
        if (!values.venue_name) missing.push("Venue name");
        if (!values.venue_address) missing.push("Venue address");
        if (!values.venue_city) missing.push("City");
        if (!values.start_date) missing.push("Start date");
        if (!values.end_date) missing.push("End date");
        if (!values.start_time) missing.push("Start time");
        if (!values.end_time) missing.push("End time");
        if (!values.max_attendees) missing.push("Maximum attendees");
        if (!values.payment_profile_id) missing.push("Payment profile");
        if (!values.featured_image) missing.push("Featured image");

        if (values.is_recurring && values.recurrence_pattern) {
            const pattern = values.recurrence_pattern as any;
            if (!pattern.frequency) {
                missing.push("Recurrence frequency");
            }
        }

        return missing;
    };

    const toTitleCase = (value: string): string => {
        return value
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getValidationErrorPaths = (errorObj: unknown, parentPath = ""): string[] => {
        if (!errorObj) return [];

        if (typeof errorObj === "string") {
            return parentPath ? [parentPath] : [];
        }

        if (Array.isArray(errorObj)) {
            return errorObj.flatMap((item, index) => getValidationErrorPaths(item, `${parentPath}[${index}]`));
        }

        if (typeof errorObj === "object") {
            return Object.entries(errorObj as Record<string, unknown>).flatMap(([key, value]) => {
                const nextPath = parentPath ? `${parentPath}.${key}` : key;
                return getValidationErrorPaths(value, nextPath);
            });
        }

        return [];
    };

    const mapPathToFieldLabel = (path: string): string => {
        const ticketTypeMatch = path.match(/^ticket_types\[(\d+)\]\.(.+)$/);
        if (ticketTypeMatch) {
            const ticketTypeIndex = parseInt(ticketTypeMatch[1], 10) + 1;
            const ticketTypeField = ticketTypeMatch[2];
            return `Ticket Type ${ticketTypeIndex}: ${toTitleCase(ticketTypeField)}`;
        }

        const topLevelMap: Record<string, string> = {
            title: "Event title",
            category_slug: "Category",
            short_description: "Short description",
            description: "Full description",
            venue_name: "Venue name",
            venue_address: "Venue address",
            venue_city: "City",
            venue_country: "Country",
            venue_latitude: "Venue latitude",
            venue_longitude: "Venue longitude",
            start_date: "Start date",
            end_date: "End date",
            start_time: "Start time",
            end_time: "End time",
            max_attendees: "Maximum attendees",
            payment_profile_id: "Payment profile",
            featured_image: "Featured image",
            additional_images: "Additional images",
            ticket_types: "Ticket types",
            is_published: "Publish status",
            check_in_policy: "Check-in policy",
            is_recurring: "Recurring setting",
            recurrence_pattern: "Recurrence pattern",
            "recurrence_pattern.frequency": "Recurrence frequency",
            "recurrence_pattern.interval": "Recurrence interval",
            "recurrence_pattern.end_date": "Recurrence end date",
            "recurrence_pattern.occurrences": "Recurrence occurrences",
            "recurrence_pattern.days_of_week": "Recurrence days of week",
            "recurrence_pattern.day_of_month": "Recurrence day of month",
        };

        if (topLevelMap[path]) return topLevelMap[path];

        const lastSegment = path.split(".").pop() || path;
        return toTitleCase(lastSegment);
    };

    const getValidationErrorFields = (errors: FormikErrors<EventFormValues>): string[] => {
        const paths = getValidationErrorPaths(errors);
        const labels = paths.map(mapPathToFieldLabel);
        return Array.from(new Set(labels));
    };

    const handleSubmit = async (values: EventFormValues) => {
        try {
            setIsSubmitting(true);

            // Format times to HH:MM:SS
            const formattedValues = {
                ...values,
                start_time: formatTime(values.start_time),
                end_time: formatTime(values.end_time),
            };

            const payload = buildEventFormData({
                ...formattedValues,
                max_attendees: parseInt(formattedValues.max_attendees),
                venue_latitude: formattedValues.venue_latitude || undefined,
                venue_longitude: formattedValues.venue_longitude || undefined,
                additional_images: (formattedValues.additional_images || []).filter((img): img is string => !!img),
                ticket_types: [], // Empty - tickets edited separately
            });

            const result = await updateEvent(event.slug, payload);

            Alert.alert("Success!", "Event updated successfully", [
                {
                    text: "OK",
                    onPress: () => router.replace(`/dashboard/events/${result.slug}`),
                },
            ]);
        } catch (error: any) {
            console.error("Error updating event:", error);
            Alert.alert("Error", error.message || "Failed to update event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppForm
            initialValues={initialValues}
            validationSchema={eventCreationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, isValid, errors }) => {
                const missingFields = getMissingFields(values);
                const validationErrorFields = getValidationErrorFields(errors);
                const canSubmit = isValid && missingFields.length === 0;

                return (
                    <>
                        <FormLoader visible={isSubmitting} />

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <View className="gap-6 pb-6">
                                {/* Basic Info */}
                                <EventBasicInfoSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Venue */}
                                <EventVenueSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Date & Time */}
                                <EventDateTimeSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Event Type */}
                                <EventTypeSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Images */}
                                <EventImagesSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Capacity */}
                                <EventCapacitySection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Payment Profile */}
                                <EventPaymentProfileSection />

                                {/* Divider */}
                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Publishing */}
                                <EventPublishSection />

                                {/* Form Status */}
                                {missingFields.length > 0 && !isSubmitting && (
                                    <View
                                        className="p-4 rounded-lg border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                    >
                                        <View className="flex-row items-start gap-3">
                                            <Ionicons name="alert-circle" size={18} color={colors.accent} style={{ marginTop: 2 }} />
                                            <View className="flex-1">
                                                <AppText styles="text-sm text-black mb-2" font="font-ibold">
                                                    Complete Required Fields
                                                </AppText>
                                                <AppText styles="text-xs text-black mb-2" font="font-iregular" style={{ opacity: 0.8 }}>
                                                    Please fill in the following:
                                                </AppText>
                                                <View className="gap-1">
                                                    {missingFields.slice(0, 5).map((field, index) => (
                                                        <AppText key={index} styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.8 }}>
                                                            • {field}
                                                        </AppText>
                                                    ))}
                                                    {missingFields.length > 5 && (
                                                        <AppText styles="text-xs text-black" font="font-isemibold" style={{ opacity: 0.9 }}>
                                                            ...and {missingFields.length - 5} more
                                                        </AppText>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Validation Issues (non-missing fields) */}
                                {!isValid && missingFields.length === 0 && !isSubmitting && (
                                    <View
                                        className="p-4 rounded-lg border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                    >
                                        <View className="flex-row items-start gap-3">
                                            <Ionicons name="alert-circle" size={18} color={colors.accent} style={{ marginTop: 2 }} />
                                            <View className="flex-1">
                                                <AppText styles="text-sm text-black mb-1" font="font-ibold">
                                                    Fix Validation Errors
                                                </AppText>
                                                <AppText styles="text-xs text-black mb-2" font="font-iregular" style={{ opacity: 0.8 }}>
                                                    Please check these fields:
                                                </AppText>
                                                <View className="gap-1">
                                                    {validationErrorFields.slice(0, 5).map((field, index) => (
                                                        <AppText key={index} styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.8 }}>
                                                            • {field}
                                                        </AppText>
                                                    ))}
                                                    {validationErrorFields.length > 5 && (
                                                        <AppText styles="text-xs text-black" font="font-isemibold" style={{ opacity: 0.9 }}>
                                                            ...and {validationErrorFields.length - 5} more
                                                        </AppText>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* All Set Message */}
                                {canSubmit && !isSubmitting && (
                                    <View
                                        className="p-4 rounded-lg border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <Ionicons name="checkmark-circle" size={18} color={colors.accent50} />
                                            <AppText styles="text-sm text-black" font="font-ibold">
                                                All set! Ready to update your event.
                                            </AppText>
                                        </View>
                                    </View>
                                )}

                                {/* Submit Button */}
                                <View className="pt-4 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                    <SubmitButton
                                        title={values.is_published ? "Update & Publish" : "Update Draft"}
                                    />
                                </View>

                                {/* Helper Text */}
                                <AppText styles="text-xs text-black text-center" font="font-iregular" style={{ opacity: 0.6 }}>
                                    Changes will be applied immediately after saving
                                </AppText>
                            </View>
                        </ScrollView>
                    </>
                );
            }}
        </AppForm>
    );
};

export default EditEventForm;
