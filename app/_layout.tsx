import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen } from "expo-router";
import { useColorScheme } from "react-native";
import { useEffect } from 'react';

import "../global.css";
import { TabBarProvider } from "@/context/TabBarContext";
import { AuthProvider, CurrencyProvider } from "@/context";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CurrencyProvider>
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
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </TabBarProvider>
        </CurrencyProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
