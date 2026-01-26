import { View, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { Event } from "@/types";
import { EventCard } from "@/components/cards";
import SectionHeader from "./SectionHeader";
import colors from "@/config/colors";

interface UpcomingEventsSectionProps {
  events: Event[];
  isLoading?: boolean;
}

export default function UpcomingEventsSection({
  events,
  isLoading,
}: UpcomingEventsSectionProps) {
  const handleSeeAll = () => {
    router.push("/(tabs)/events");
  };

  if (isLoading) {
    return (
      <View className="py-8">
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (events.length === 0) return null;

  return (
    <View className="mb-6">
      <SectionHeader
        title="Upcoming Events"
        subtitle="Don't miss out"
        onSeeAll={handleSeeAll}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}
