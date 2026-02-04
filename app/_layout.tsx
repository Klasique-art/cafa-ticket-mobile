import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen } from "expo-router";
import { useColorScheme } from "react-native";
import { useEffect } from 'react';

import "../global.css";
import { TabBarProvider } from "@/context/TabBarContext";
import { AuthProvider, CurrencyProvider } from "@/context";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://c2a31ca6c3c55404f2c5521b59499bed@o4510828002148352.ingest.us.sentry.io/4510828003917824',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
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
});