import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import { useEffect } from 'react';

import "../global.css";
import { TabBarProvider } from "@/context/TabBarContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    // "Inter-24": require("../assets/fonts/Inter_24.ttf"),
    // "Inter-Black": require("../assets/fonts/Inter_Black.ttf"),
    // "Inter-Bold": require("../assets/fonts/Inter_Bold.ttf"),
    // "Inter-ExtraBold": require("../assets/fonts/Inter_ExtraBold.ttf"),
    // "Inter-SemiBold": require("../assets/fonts/Inter_SemiBold.ttf"),
    // "Inter-Medium": require("../assets/fonts/Inter_Medium.ttf"),
    // "Inter-Regular": require("../assets/fonts/Inter_Regular.ttf"),
    // "Inter-Light": require("../assets/fonts/Inter_Light.ttf"),
    // "Inter-Thin": require("../assets/fonts/Inter_Thin.ttf"),
    // "Inter-ExtraLight": require("../assets/fonts/Inter_ExtraLight.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error, "Error loading fonts");
    }

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView>
    <TabBarProvider>
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        animation: "slide_from_right",
      }}
    > 
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Entry point/splash */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
    </TabBarProvider>
    </GestureHandlerRootView>
  );
}