import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import { Animation } from "@/components";
import { storage } from "@/lib/storage";
import colors from "@/config/colors";
import { tickets } from "@/assets";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompleted = await storage.hasCompletedOnboarding();
      if (hasCompleted) {
        router.replace("/(tabs)");
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = useCallback(async () => {
    await storage.setOnboardingComplete();
    router.replace("/(tabs)");
  }, []);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <Animation
          isVisible={true}
          path={tickets}
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return null;
}