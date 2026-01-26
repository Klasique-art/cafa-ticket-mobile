import { View, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

import { OnboardingSlide } from "@/data/onboarding";
import colors from "@/config/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PaginationDotProps {
  index: number;
  scrollX: SharedValue<number>;
}

function PaginationDot({ index, scrollX }: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 32, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[animatedStyle, { backgroundColor: colors.accent }]}
      className="h-2 rounded-full"
    />
  );
}

interface PaginationProps {
  scrollX: SharedValue<number>;
  data: OnboardingSlide[];
}

export default function Pagination({ scrollX, data }: PaginationProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {data.map((_, index) => (
        <PaginationDot key={index} index={index} scrollX={scrollX} />
      ))}
    </View>
  );
}
