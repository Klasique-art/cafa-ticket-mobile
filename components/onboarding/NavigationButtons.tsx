import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  SharedValue,
} from "react-native-reanimated";

import { onboardingSlides } from "@/data/onboarding";
import colors from "@/config/colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NavigationButtonsProps {
  currentIndex: SharedValue<number>;
  buttonScale: SharedValue<number>;
  onNext: () => void;
  onPrev: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export default function NavigationButtons({
  currentIndex,
  buttonScale,
  onNext,
  onPrev,
  onPressIn,
  onPressOut,
}: NavigationButtonsProps) {
  const nextButtonAnimatedStyle = useAnimatedStyle(() => {
    const isLastSlide = currentIndex.value === onboardingSlides.length - 1;

    return {
      transform: [{ scale: buttonScale.value }],
      width: withSpring(isLastSlide ? 160 : 64),
    };
  });

  const prevButtonAnimatedStyle = useAnimatedStyle(() => {
    const isFirstSlide = currentIndex.value === 0;

    return {
      opacity: withTiming(isFirstSlide ? 0 : 1),
      transform: [{ scale: withTiming(isFirstSlide ? 0.8 : 1) }],
    };
  });

  const nextButtonTextStyle = useAnimatedStyle(() => {
    const isLastSlide = currentIndex.value === onboardingSlides.length - 1;

    return {
      opacity: withTiming(isLastSlide ? 1 : 0),
      width: withTiming(isLastSlide ? 80 : 0),
    };
  });

  return (
    <View className="flex-row items-center justify-between">
      {/* Previous Button */}
      <AnimatedPressable
        onPress={onPrev}
        style={prevButtonAnimatedStyle}
        className="h-16 w-16 items-center justify-center rounded-full"
      >
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </View>
      </AnimatedPressable>

      {/* Next/Get Started Button */}
      <AnimatedPressable
        onPress={onNext}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[nextButtonAnimatedStyle, { backgroundColor: colors.accent }]}
        className="h-16 flex-row items-center justify-center rounded-full"
      >
        <Animated.Text
          style={nextButtonTextStyle}
          className="font-bold text-black"
        >
          Get Started
        </Animated.Text>
        <Ionicons name="chevron-forward" size={28} color={colors.white} />
      </AnimatedPressable>
    </View>
  );
}
