import { View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import AppText from "../../../ui/AppText";
import LocationSelector from "../../../ui/LocationSelector";
import type { LocationData } from "@/components/ui/LocationSelector";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventVenueSection = () => {
    const { values, setFieldValue, errors, touched } = useFormikContext<EventFormValues>();
    const [locationSelected, setLocationSelected] = useState(false);

    // Handle location selection from Google Maps
    const handleLocationSelect = (location: LocationData) => {
        // Set all venue fields
        setFieldValue("venue_name", location.venue_name);
        setFieldValue("venue_address", location.venue_address);
        setFieldValue("venue_city", location.venue_city);
        setFieldValue("venue_country", location.venue_country);
        setFieldValue("venue_latitude", location.latitude);
        setFieldValue("venue_longitude", location.longitude);

        setLocationSelected(true);

        // Hide success message after 3 seconds
        setTimeout(() => setLocationSelected(false), 3000);
    };

    // Get location error from any venue field
    const getLocationError = () => {
        if (touched.venue_name && errors.venue_name) {
            return String(errors.venue_name);
        }
        if (touched.venue_address && errors.venue_address) {
            return String(errors.venue_address);
        }
        if (touched.venue_city && errors.venue_city) {
            return String(errors.venue_city);
        }
        return undefined;
    };

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                >
                    <Ionicons name="location-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Venue Information
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Where will your event take place?
                    </AppText>
                </View>
            </View>

            {/* Location Selector (Google Maps Autocomplete) */}
            <LocationSelector
                onLocationSelect={handleLocationSelect}
                initialValue={values.venue_address || ""}
                label="Search for Venue"
                required
                error={getLocationError()}
            />

            {/* Location Selected Success Message */}
            {locationSelected && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <View className="flex-row items-start gap-3">
                        <Ionicons name="checkmark-circle" size={20} color={colors.accent50} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                Location Selected
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                                Venue details have been automatically filled in below
                            </AppText>
                        </View>
                    </View>
                </View>
            )}

            {/* Selected Venue Details Display */}
            {values.venue_name && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <AppText styles="text-sm text-white mb-3" font="font-ibold">
                        Selected Venue Details
                    </AppText>

                    <View className="gap-3">
                        {/* Venue Name */}
                        <View className="flex-row items-start gap-2">
                            <View
                                className="w-2 h-2 rounded-full mt-1.5"
                                style={{ backgroundColor: colors.accent50 }}
                            />
                            <View className="flex-1">
                                <AppText
                                    styles="text-xs text-white mb-0.5"
                                    font="font-iregular"
                                    style={{ opacity: 0.6 }}
                                >
                                    Venue Name
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-isemibold">
                                    {values.venue_name}
                                </AppText>
                            </View>
                        </View>

                        {/* Address */}
                        <View className="flex-row items-start gap-2">
                            <View
                                className="w-2 h-2 rounded-full mt-1.5"
                                style={{ backgroundColor: colors.accent50 }}
                            />
                            <View className="flex-1">
                                <AppText
                                    styles="text-xs text-white mb-0.5"
                                    font="font-iregular"
                                    style={{ opacity: 0.6 }}
                                >
                                    Address
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-isemibold">
                                    {values.venue_address}
                                </AppText>
                            </View>
                        </View>

                        {/* City */}
                        <View className="flex-row items-start gap-2">
                            <View
                                className="w-2 h-2 rounded-full mt-1.5"
                                style={{ backgroundColor: colors.accent50 }}
                            />
                            <View className="flex-1">
                                <AppText
                                    styles="text-xs text-white mb-0.5"
                                    font="font-iregular"
                                    style={{ opacity: 0.6 }}
                                >
                                    City
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-isemibold">
                                    {values.venue_city}
                                </AppText>
                            </View>
                        </View>

                        {/* Country */}
                        <View className="flex-row items-start gap-2">
                            <View
                                className="w-2 h-2 rounded-full mt-1.5"
                                style={{ backgroundColor: colors.accent50 }}
                            />
                            <View className="flex-1">
                                <AppText
                                    styles="text-xs text-white mb-0.5"
                                    font="font-iregular"
                                    style={{ opacity: 0.6 }}
                                >
                                    Country
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-isemibold">
                                    {values.venue_country}
                                </AppText>
                            </View>
                        </View>

                        {/* GPS Coordinates (if available) */}
                        {values.venue_latitude && values.venue_longitude && (
                            <View className="flex-row items-start gap-2">
                                <View
                                    className="w-2 h-2 rounded-full mt-1.5"
                                    style={{ backgroundColor: colors.accent50 }}
                                />
                                <View className="flex-1">
                                    <AppText
                                        styles="text-xs text-white mb-0.5"
                                        font="font-iregular"
                                        style={{ opacity: 0.6 }}
                                    >
                                        GPS Coordinates
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">
                                        {values.venue_latitude}, {values.venue_longitude}
                                    </AppText>
                                </View>
                            </View>
                        )}
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
                    <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        How it works
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Start typing the venue name or address
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Select from dropdown suggestions
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • All details including GPS coordinates fill automatically
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Attendees will see the location on a map
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventVenueSection;