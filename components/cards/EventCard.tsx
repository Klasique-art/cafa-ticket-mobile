import { View, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Event } from "@/types";
import colors from "@/config/colors";
import { formatEventDate } from "@/utils/format";
import { getFullImageUrl } from "@/utils/imageUrl";
import AppText from "@/components/ui/AppText";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface EventCardProps {
  event: Event;
  width?: number;
  textVariant?: "dark" | "light";
}

export default function EventCard({ event, width = 180, textVariant = "light" }: EventCardProps) {
  const formatMoney = useFormatMoney();
  const isLightText = textVariant === "light";
  const titleColor = isLightText ? "text-white" : "text-black";
  const metaColor = isLightText ? "text-white/80" : "text-black/60";
  const priceColor = isLightText ? "text-white" : "text-black";
  const metaIconColor = isLightText ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.55)";

  const handlePress = () => {
    router.push(`/events/${event.slug}`);
  };

  return (
    <Pressable onPress={handlePress} style={{ width }}>
      <View
        className="overflow-hidden rounded-2xl border"
        style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
      >
        {/* Image */}
        <View style={{ height: width * 0.85 }}>
          <Image
            source={{ uri: getFullImageUrl(event.featured_image) || undefined }}
            className="h-full w-full"
          />
          {/* Price Badge */}
          <View
            className="absolute bottom-2 right-2 rounded-lg px-2 py-1"
            style={{ backgroundColor: colors.accent }}
          >
            <AppText styles={`text-xs font-bold ${priceColor}`}>
              {formatMoney(event.lowest_price)}
            </AppText>
          </View>
        </View>

        {/* Content */}
        <View className="p-3">
          <AppText styles={`mb-1 text-sm font-bold ${titleColor}`} numberOfLines={2}>
            {event.title}
          </AppText>

          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="calendar-outline" size={12} color={metaIconColor} />
            <AppText styles={`text-xs ${metaColor}`}>
              {formatEventDate(event.start_date)}
            </AppText>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={12} color={metaIconColor} />
            <AppText styles={`text-xs ${metaColor}`} numberOfLines={1}>
              {event.venue_city}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
