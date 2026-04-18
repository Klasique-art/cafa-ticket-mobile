import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import AppText from "../../../ui/AppText";
import type { EventInfo } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface MyEventInfoProps {
    event: EventInfo;
}

const MyEventInfo = ({ event }: MyEventInfoProps) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCheckInPolicyLabel = (policy: string) => {
        const labels = {
            single_entry: "Single Entry",
            multiple_entry: "Multiple Entry",
            daily_entry: "Daily Entry",
        };
        return labels[policy as keyof typeof labels] || policy;
    };

    return (
        <View className="gap-2">
            {/* Section Header */}
            <View className="flex-row items-center justify-between">
                <AppText styles="text-xl text-black" accessibilityRole="header">
                    Event Information
                </AppText>
                <View className="flex-row items-center gap-2">
                    <Ionicons
                        name={event.is_published ? "eye-outline" : "eye-off-outline"}
                        size={18}
                        color={event.is_published ? colors.accent50 : colors.white}
                    />
                    <AppText
                        styles={`text-xs ${event.is_published ? "text-accent-50" : "text-black"}`}
                        font="font-isemibold"
                        style={{ opacity: event.is_published ? 1 : 0.6 }}
                    >
                        {event.is_published ? "Published" : "Unpublished"}
                    </AppText>
                </View>
            </View>

            {/* Short Description */}
            <View className="p-2 bg-primary rounded-xl border border-accent">
                <View className="flex-row items-start gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200 + "80" }}
                    >
                        <Ionicons name="document-text-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-2" font="font-ibold">
                            About This Event
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                            {event.short_description}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Full Description */}
            <View className="p-2">
                <AppText styles="text-sm text-black mb-3 font-nunbold">
                    Full Description
                </AppText>
                <AppText
                    styles="text-sm text-black"
                    font="font-iregular"
                    numberOfLines={showFullDescription ? undefined : 6}
                    style={{ opacity: 0.8 }}
                >
                    {event.description}
                </AppText>
                <TouchableOpacity
                    onPress={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3"
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={showFullDescription ? "Show less description" : "Read full description"}
                    accessibilityHint="Toggles full event description"
                >
                    <AppText styles="text-sm text-accent-50" font="font-isemibold">
                        {showFullDescription ? "Show Less" : "Read More"}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Date & Time Card */}
            <View
                className="p-2 bg-primary rounded-xl border border-accent"
                accessible
                accessibilityLabel={`Capacity. Maximum attendees ${event.max_attendees.toLocaleString()}`}
            >
                <View className="flex-row items-start gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="calendar-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                            Date & Time
                        </AppText>
                        <View className="gap-3">
                            <View>
                                <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.6 }}>
                                    Starts
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-imedium">
                                    {formatDateTime(event.start_date, event.start_time)}
                                </AppText>
                            </View>
                            <View>
                                <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.6 }}>
                                    Ends
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-imedium">
                                    {formatDateTime(event.end_date, event.end_time)}
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Venue Card */}
            <View className="p-2 bg-primary rounded-xl border border-accent">
                <View className="flex-row items-start gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200 + "80" }}
                    >
                        <Ionicons name="location-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                            Venue
                        </AppText>
                        <View className="gap-1">
                            <AppText styles="text-sm text-white mb-1" font="font-imedium">
                                {event.venue_name}
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                {event.venue_address}
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                {event.venue_city}, {event.venue_country}
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>

            {/* Capacity Card */}
            <View className="p-2 bg-primary rounded-xl border border-accent">
                <View className="flex-row items-start gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="people-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                            Capacity
                        </AppText>
                        <View>
                            <AppText styles="text-2xl text-white mb-1" font="font-ibold">
                                {event.max_attendees.toLocaleString()}
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                Maximum attendees
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>

            {/* Event Type Card */}
            <View className="p-2 bg-primary rounded-xl border border-accent">
                <View className="flex-row items-start gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200 + "80" }}
                    >
                        <Ionicons
                            name={event.is_recurring ? "repeat-outline" : "checkmark-circle-outline"}
                            size={20}
                            color={colors.accent50}
                        />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                            Event Type
                        </AppText>
                        <View className="gap-3">
                            <View>
                                <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.6 }}>
                                    Type
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-imedium">
                                    {event.is_recurring ? "Recurring Event" : "One-time Event"}
                                </AppText>
                            </View>
                            <View>
                                <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.6 }}>
                                    Check-in Policy
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-imedium">
                                    {getCheckInPolicyLabel(event.check_in_policy)}
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MyEventInfo;
