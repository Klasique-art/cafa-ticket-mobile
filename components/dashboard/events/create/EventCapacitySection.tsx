import { useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "../../../ui/AppText";
import AppFormField from "../../../form/AppFormField";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventCapacitySection = () => {
    const { values } = useFormikContext<EventFormValues>();

    // Calculate total tickets from ticket types
    const totalTickets = useMemo(() => {
        if (!values.ticket_types || values.ticket_types.length === 0) return 0;

        return values.ticket_types.reduce((sum, ticket) => {
            const quantity = parseInt(ticket.quantity) || 0;
            return sum + quantity;
        }, 0);
    }, [values.ticket_types]);

    const hasTickets = values.ticket_types && values.ticket_types.length > 0;
    const maxAttendeesValue = parseInt(values.max_attendees) || 0;
    const isCapacityValid = maxAttendeesValue >= totalTickets;
    const availableSpace = maxAttendeesValue - totalTickets;

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="people-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Event Capacity
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Set maximum number of attendees
                    </AppText>
                </View>
            </View>

            {/* Max Attendees Input */}
            <AppFormField
                name="max_attendees"
                label="Maximum Attendees"
                labelColor="text-black"
                placeholder="e.g., 500"
                keyboardType="number-pad"
                required
            />

            {/* Ticket Summary Card (if tickets exist) */}
            {hasTickets && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{
                        backgroundColor: isCapacityValid ? colors.success + "1A" : colors.accent + "33",
                        borderColor: isCapacityValid ? colors.success : colors.accent,
                    }}
                >
                    <View className="flex-row items-start gap-3 mb-4">
                        <Ionicons
                            name={isCapacityValid ? "checkmark-circle" : "alert-circle"}
                            size={20}
                            color={isCapacityValid ? colors.success : colors.accent}
                        />
                        <View className="flex-1">
                            <AppText
                                styles="text-sm text-black mb-1"
                                font="font-ibold"
                                style={{ color: isCapacityValid ? colors.white : colors.accent }}
                            >
                                {isCapacityValid ? "Capacity Valid" : "Capacity Invalid"}
                            </AppText>
                            <AppText
                                styles="text-xs text-black"
                                font="font-iregular"
                                style={{ opacity: 0.8 }}
                            >
                                {isCapacityValid
                                    ? "Maximum attendees covers all tickets"
                                    : "Maximum attendees must be at least equal to total tickets"}
                            </AppText>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View className="gap-3">
                        <View
                            className="flex-row items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                                Total Tickets
                            </AppText>
                            <AppText styles="text-base text-black" font="font-ibold">
                                {totalTickets.toLocaleString()}
                            </AppText>
                        </View>

                        <View
                            className="flex-row items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                                Max Attendees
                            </AppText>
                            <AppText styles="text-base text-black" font="font-ibold">
                                {maxAttendeesValue > 0 ? maxAttendeesValue.toLocaleString() : "—"}
                            </AppText>
                        </View>

                        <View
                            className="flex-row items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                                Available Space
                            </AppText>
                            <AppText
                                styles="text-base text-black"
                                font="font-ibold"
                                style={{ color: isCapacityValid ? colors.accent50 : colors.accent }}
                            >
                                {isCapacityValid && availableSpace >= 0 ? availableSpace.toLocaleString() : "—"}
                            </AppText>
                        </View>
                    </View>
                </View>
            )}

            {/* Info Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-black mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        About Capacity
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Must cover all ticket quantities
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Can exceed tickets for future additions
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Helps with venue planning
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventCapacitySection;