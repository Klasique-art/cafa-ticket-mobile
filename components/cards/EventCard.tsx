import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Event } from "@/types";
import colors from "@/config/colors";
import { formatEventDate, formatPrice } from "@/utils/format";

interface EventCardProps {
  event: Event;
  width?: number;
}

export default function EventCard({ event, width = 180 }: EventCardProps) {
  const handlePress = () => {
    router.push(`/events/${event.slug}`);
  };

  return (
    <Pressable onPress={handlePress} style={{ width }}>
      <View className="overflow-hidden rounded-2xl bg-white/5">
        {/* Image */}
        <View style={{ height: width * 0.85 }}>
          <Image
            source={{ uri: event.featured_image }}
            className="h-full w-full"
          />
          {/* Price Badge */}
          <View
            className="absolute bottom-2 right-2 rounded-lg px-2 py-1"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="text-xs font-bold text-white">
              {formatPrice(event.lowest_price)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-3">
          <Text className="mb-1 text-sm font-bold text-white" numberOfLines={2}>
            {event.title}
          </Text>

          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.6)" />
            <Text className="text-xs text-white/60">
              {formatEventDate(event.start_date)}
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.6)" />
            <Text className="text-xs text-white/60" numberOfLines={1}>
              {event.venue_city}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
