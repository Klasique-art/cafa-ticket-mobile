import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";

import { Event } from "@/types";
import { SoonEventCard } from "@/components/cards";
import SectionHeader from "./SectionHeader";
import colors from "@/config/colors";

interface SoonEventsSectionProps {
  events: Event[];
  isLoading?: boolean;
}

export default function SoonEventsSection({
  events,
  isLoading,
}: SoonEventsSectionProps) {
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
        title="Happening Soon"
        subtitle="Events this week"
        onSeeAll={handleSeeAll}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {events.map((event) => (
          <SoonEventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}
