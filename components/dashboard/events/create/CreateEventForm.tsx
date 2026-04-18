import { View, ScrollView, Alert, RefreshControl, Modal, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import type { MutableRefObject } from "react";
import { router } from "expo-router";
import type { FormikErrors } from "formik";

import AppText from "../../../ui/AppText";
import AppForm from "../../../form/AppForm";
import SubmitButton from "../../../form/SubmitButton";
import FormLoader from "../../../form/FormLoader";
import EventBasicInfoSection from "./EventBasicInfoSection";
import EventVenueSection from "./EventVenueSection";
import EventDateTimeSection from "./EventDateTimeSection";
import EventTypeSection from "./EventTypeSection";
import EventCapacitySection from "./EventCapacitySection";
import EventPaymentProfileSection from "./EventPaymentProfileSection";
import EventImagesSection from "./EventImagesSection";
import EventTicketTypesSection from "./EventTicketTypesSection";
import EventPublishSection from "./EventPublishSection";
import { eventCreationSchema, type EventFormValues, type TicketTypeFormValues } from "@/data/eventCreationSchema";
import { buildEventFormData } from "@/utils/buildEventFormData";
import { createEvent } from "@/lib/events";
import colors from "@/config/colors";


interface CreateEventFormProps {
    /** Called when the user taps Add (null) or Edit (index) ticket type. */
    onOpenModal: (index: number | null) => void;
    /** Screen writes here so the lifted AddTicketTypeModal can call setFieldValue. */
    formContextRef: MutableRefObject<{
        setFieldValue: (field: string, value: any) => void;
        ticketTypes: TicketTypeFormValues[];
        eventStartDate: string;
        eventEndDate: string;
    } | null>;
}

const CreateEventForm = ({ onOpenModal, formContextRef }: CreateEventFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [createdEventSlug, setCreatedEventSlug] = useState<string>("");

    const initialValues: EventFormValues = {
        // Basic Info
        title: "",
        category_slug: "",
        short_description: "",
        description: "",

        // Venue
        venue_name: "",
        venue_address: "",
        venue_city: "",
        venue_country: "Ghana",
        venue_latitude: null,
        venue_longitude: null,

        // Date & Time
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",

        // Event Type
        is_recurring: false,
        recurrence_pattern: null,
        check_in_policy: "single_entry",

        // Capacity
        max_attendees: "",

        // Payment Profile
        payment_profile_id: "",

        // Images
        featured_image: "",
        additional_images: [],

        // Publishing
        is_published: true,

        // Ticket Types
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
        if (!values.ticket_types || values.ticket_types.length === 0) missing.push("At least one ticket type");

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
                ticket_types: formattedValues.ticket_types.map((t) => ({
                    ...t,
                    quantity: parseInt(t.quantity),
                    min_purchase: parseInt(t.min_purchase),
                    max_purchase: t.max_purchase ? parseInt(t.max_purchase) : undefined,
                    available_from: t.available_from || undefined,
                    available_until: t.available_until || undefined,
                })),
            });

            const result = await createEvent(payload);
            const createdSlug = result?.data?.slug || result?.slug || "";
            setCreatedEventSlug(createdSlug);
            setIsSuccessModalVisible(true);
        } catch (error: any) {
            console.error("Error creating event:", error);
            Alert.alert("Error", error.message || "Failed to create event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewCreatedEvent = () => {
        if (!createdEventSlug || createdEventSlug === "undefined") return;
        setIsSuccessModalVisible(false);
        router.replace(`/dashboard/events/${createdEventSlug}`);
    };

    return (
        <AppForm
            initialValues={initialValues}
            validationSchema={eventCreationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isValid, setFieldValue, errors }) => {
                formContextRef.current = {
                    setFieldValue,
                    ticketTypes: values.ticket_types,
                    eventStartDate: values.start_date,
                    eventEndDate: values.end_date,
                };

                const missingFields = getMissingFields(values);
                const validationErrorFields = getValidationErrorFields(errors);
                const canSubmit = isValid && missingFields.length === 0;

                return (
                    <>
                        <FormLoader visible={isSubmitting} />
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={colors.accent}
                                />
                            }
                            keyboardShouldPersistTaps="always"
                            accessible
                            accessibilityLabel="Create event form"
                            accessibilityHint="Complete all sections to create your event"
                        >
                            <View className="gap-6 pb-10">
                                {/* Basic Info */}
                                <EventBasicInfoSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Venue */}
                                <EventVenueSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Date & Time */}
                                <EventDateTimeSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Event Type */}
                                <EventTypeSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Images */}
                                <EventImagesSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Tickets — button calls up to screen via prop */}
                                <EventTicketTypesSection
                                    onOpenModal={onOpenModal}
                                    ticketTypes={values.ticket_types}
                                    setFieldValue={setFieldValue}
                                />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Capacity */}
                                <EventCapacitySection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Payment Profile */}
                                <EventPaymentProfileSection />

                                <View className="border-t" style={{ borderColor: colors.accent + "4D" }} />

                                {/* Publishing */}
                                <EventPublishSection />

                                {/* Form Status */}
                                {missingFields.length > 0 && !isSubmitting && (
                                    <View
                                        className="p-4 rounded-lg border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                        accessible
                                        accessibilityRole="alert"
                                        accessibilityLabel={`Complete required fields. Missing: ${missingFields.slice(0, 5).join(", ")}${missingFields.length > 5 ? ` and ${missingFields.length - 5} more` : ""}`}
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
                                        accessible
                                        accessibilityRole="alert"
                                        accessibilityLabel={`Fix validation errors. Check: ${validationErrorFields.slice(0, 5).join(", ")}${validationErrorFields.length > 5 ? ` and ${validationErrorFields.length - 5} more` : ""}`}
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
                                        accessible
                                        accessibilityRole="text"
                                        accessibilityLabel="All set. Ready to create your event."
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <Ionicons name="checkmark-circle" size={18} color={colors.accent50} />
                                            <AppText styles="text-sm text-black" font="font-ibold">
                                                All set! Ready to create your event.
                                            </AppText>
                                        </View>
                                    </View>
                                )}

                                {/* Submit Button */}
                                <View className="pt-4 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                    <SubmitButton
                                        title={values.is_published ? "Create & Publish Event" : "Create Draft Event"}
                                    />
                                </View>

                                {/* Helper Text */}
                                <AppText styles="text-xs text-black text-center" font="font-iregular" style={{ opacity: 0.6 }}>
                                    By creating this event, you agree to our Terms of Service
                                </AppText>
                            </View>
                        </ScrollView>
                        <Modal
                            visible={isSuccessModalVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setIsSuccessModalVisible(false)}
                            accessibilityViewIsModal
                        >
                            <Pressable
                                className="flex-1 items-center justify-center px-6"
                                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                                onPress={() => setIsSuccessModalVisible(false)}
                                accessibilityRole="button"
                                accessibilityLabel="Close success modal"
                                accessibilityHint="Closes the event created success dialog"
                            >
                                <Pressable
                                    className="w-full rounded-2xl p-5 border-2"
                                    style={{ backgroundColor: colors.primary, borderColor: colors.accent }}
                                    onPress={(event) => event.stopPropagation()}
                                    accessible
                                    accessibilityRole="alert"
                                    accessibilityLabel="Event created successfully. Your event is now live and ready for attendees."
                                >
                                    <View className="items-center gap-3">
                                        <View
                                            className="w-14 h-14 rounded-full items-center justify-center"
                                            style={{ backgroundColor: colors.accent + "33" }}
                                        >
                                            <Ionicons name="checkmark-circle" size={32} color={colors.accent50} />
                                        </View>
                                        <AppText styles="text-lg text-white text-center" font="font-ibold">
                                            Event Created Successfully
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-center"
                                            font="font-iregular"
                                            style={{ opacity: 0.8 }}
                                        >
                                            Your event is now live and ready for attendees.
                                        </AppText>
                                    </View>

                                    <View className="mt-5 gap-3">
                                        <TouchableOpacity
                                            className="rounded-xl py-3 items-center"
                                            style={{ backgroundColor: colors.accent }}
                                            onPress={handleViewCreatedEvent}
                                            activeOpacity={0.85}
                                            accessibilityRole="button"
                                            accessibilityLabel="View created event"
                                            accessibilityHint="Navigates to your newly created event details"
                                        >
                                            <AppText styles="text-sm text-white" font="font-ibold">
                                                View Event
                                            </AppText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="rounded-xl py-3 items-center border"
                                            style={{ borderColor: colors.accent + "80" }}
                                            onPress={() => setIsSuccessModalVisible(false)}
                                            activeOpacity={0.85}
                                            accessibilityRole="button"
                                            accessibilityLabel="Stay on create form"
                                            accessibilityHint="Closes this success dialog and keeps you on the form"
                                        >
                                            <AppText styles="text-sm text-white" font="font-isemibold" style={{ opacity: 0.9 }}>
                                                Stay Here
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </Pressable>
                            </Pressable>
                        </Modal>
                    </>
                );
            }}
        </AppForm>
    );
};

export default CreateEventForm;

