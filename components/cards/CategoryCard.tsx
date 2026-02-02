import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { EventCategory } from "@/types/tickets.types";
import colors from "@/config/colors";

// Map category icons to Ionicons
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  FaMusic: "musical-notes",
  FaTheaterMasks: "happy",
  FaFootballBall: "football",
  FaGraduationCap: "school",
  FaBriefcase: "briefcase",
  FaUtensils: "restaurant",
  FaHeart: "heart",
  FaPray: "people",
  FaPalette: "color-palette",
  FaFilm: "film",
  FaLaptop: "laptop",
  FaUsers: "people-circle",
};

interface CategoryCardProps {
  category: EventCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const handlePress = () => {
    // Use navigate() instead of push() to properly update tab state
    // The key is to navigate to the route name, not the path
    router.navigate({
      pathname: "/(tabs)/events",
      params: { category: category.slug }
    });
  };

  const iconName = iconMap[category.icon] || "apps";

  return (
    <Pressable onPress={handlePress}>
      <View className="items-center" style={{ width: 80 }}>
        <View
          className="mb-2 h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Ionicons name={iconName} size={24} color={colors.accent} />
        </View>
        <Text className="text-center text-xs text-white" numberOfLines={1}>
          {category.name}
        </Text>
        <Text className="text-center text-xs text-white/50">
          {category.event_count} events
        </Text>
      </View>
    </Pressable>
  );
}