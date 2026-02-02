import { View, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";
import { getFullImageUrl } from "@/utils/imageUrl";

type Props = {
    payment: PaymentDetails;
};

const PaymentEventDetails = ({ payment }: Props) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent/30 mb-4">
            <AppText styles="text-lg text-white mb-4" font="font-ibold">
                Event Information
            </AppText>

            {/* Event Image */}
            <View className="w-full h-48 rounded-xl overflow-hidden border-2 border-accent/30 mb-4">
                <Image
                    source={{ uri: getFullImageUrl(payment.event.featured_image) }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            {/* Event Title */}
            <TouchableOpacity
                onPress={() => router.push(`/events/${payment.event.slug}`)}
                activeOpacity={0.7}
                className="mb-4"
            >
                <AppText styles="text-lg text-white" font="font-ibold">
                    {payment.event.title}
                </AppText>
            </TouchableOpacity>

            {/* Event Details Grid */}
            <View className="gap-3">
                {/* Date & Time */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-blue-500/20 items-center justify-center">
                        <Ionicons name="calendar" size={20} color={colors.info} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Date & Time
                        </AppText>
                        <AppText styles="text-sm text-white mb-0.5" font="font-isemibold">
                            {formatDate(payment.event.start_date)}
                        </AppText>
                        <AppText styles="text-xs text-slate-300" font="font-iregular">
                            {payment.event.start_time}
                        </AppText>
                    </View>
                </View>

                {/* Venue */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-purple-500/20 items-center justify-center">
                        <Ionicons name="location" size={20} color="#A78BFA" />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Venue
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            {payment.event.venue_name}
                        </AppText>
                    </View>
                </View>

                {/* Organizer */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-emerald-500/20 items-center justify-center">
                        <Ionicons name="person" size={20} color={colors.success} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Organizer
                        </AppText>
                        <AppText styles="text-sm text-white mb-0.5" font="font-isemibold">
                            {payment.event.organizer.full_name}
                        </AppText>
                        <AppText styles="text-xs text-slate-300" font="font-iregular">
                            @{payment.event.organizer.username}
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentEventDetails;