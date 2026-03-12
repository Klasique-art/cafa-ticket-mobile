import { View, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import AppText from "../../ui/AppText";
import { EventDetails } from "@/types";
import colors from "@/config/colors";

interface VenueSectionProps {
    event: EventDetails;
}

const VenueSection = ({ event }: VenueSectionProps) => {
    const { venue } = event;

    const openMaps = () => {
        const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    return (
        <Animated.View entering={FadeInDown.delay(1000)} className="bg-white py-8">
            <View className="px-4">
                <View className="mb-6">
                    <View className="flex-row items-center gap-3 mb-3">
                        <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}>
                            <Ionicons name="location-outline" size={24} color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-black" font="font-ibold">Venue &amp; Location</AppText>
                    </View>
                    <AppText styles="text-sm text-slate-700 leading-relaxed" font="font-iregular">
                        Get directions and explore the venue location.
                    </AppText>
                </View>

                <View
                    className="rounded-2xl overflow-hidden mb-4 items-center justify-center"
                    style={{ height: 250, borderWidth: 2, borderColor: colors.accent, backgroundColor: colors.primary200 }}
                >
                    <Ionicons name="map-outline" size={48} color={colors.white} />
                    <AppText styles="text-slate-300 mt-2" font="font-iregular">
                        Map preview is not available on web.
                    </AppText>
                </View>

                <View className="flex-row gap-3 mb-4">
                    <TouchableOpacity
                        onPress={openMaps}
                        className="flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center gap-2"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="navigate-outline" size={20} color={colors.white} />
                        <AppText styles="text-sm text-white" font="font-ibold">Get Directions</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(venue.google_maps_url)}
                        className="flex-1 py-3 px-4 bg-primary-100 rounded-xl flex-row items-center justify-center gap-2"
                        style={{ borderWidth: 2, borderColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="open-outline" size={20} color={colors.accent50} />
                        <AppText styles="text-sm text-black" font="font-ibold">Open in Maps</AppText>
                    </TouchableOpacity>
                </View>

                <View className="bg-primary rounded-xl p-4" style={{ borderWidth: 1, borderColor: colors.accent }}>
                    <AppText styles="text-base text-white mb-4" font="font-ibold">Venue Details</AppText>

                    <View style={{ gap: 16 }}>
                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">Venue Name</AppText>
                            <AppText styles="text-base text-white" font="font-ibold">{venue.name}</AppText>
                        </View>

                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">Address</AppText>
                            <AppText styles="text-sm text-white" font="font-iregular">{venue.address}</AppText>
                            <AppText styles="text-sm text-slate-300" font="font-iregular">{venue.city}, {venue.country}</AppText>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default VenueSection;
