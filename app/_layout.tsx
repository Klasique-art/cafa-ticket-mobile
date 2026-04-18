import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, SplashScreen } from "expo-router";
import { NativeModules, useColorScheme } from "react-native";
import { useEffect, useState, useCallback } from 'react';
import { useFonts } from "expo-font";

import "../global.css";
import { TabBarProvider } from "@/context/TabBarContext";
import { AuthProvider, CurrencyProvider } from "@/context";
import * as Sentry from '@sentry/react-native';
import NoInternet from "@/components/ui/NoInternet";

Sentry.init({
  dsn: 'https://c2a31ca6c3c55404f2c5521b59499bed@o4510828002148352.ingest.us.sentry.io/4510828003917824',

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
  const [hasInternet, setHasInternet] = useState(true);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [hasConnectionState, setHasConnectionState] = useState(false);
  const [fontsLoaded, error] = useFonts({
    "Rhodium-Regular": require("../assets/fonts/Rhodium-Regular.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
    "Metrophobic-Regular": require("../assets/fonts/Metrophobic-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
  const loadNetInfo = useCallback(async () => {
    try {
      // Prevent runtime crash when native module is not bundled in the current app binary.
      if (!NativeModules?.RNCNetInfo) {
        console.warn("NetInfo native module not found in this build. Skipping offline monitoring.");
        return null;
      }

      const NetInfoModule = await import("@react-native-community/netinfo");
      return NetInfoModule.default;
    } catch (netInfoError) {
      console.warn("NetInfo native module unavailable. Run a native rebuild and restart the app.", netInfoError);
      return null;
    }
  }, []);

  const isOnline = useCallback((state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error, "Error loading fonts");
    }

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupNetInfo = async () => {
      const NetInfo = await loadNetInfo();
      if (!isMounted) return;

      if (!NetInfo) {
        setHasConnectionState(true);
        setHasInternet(true);
        return;
      }

      const syncConnectionState = (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
        setHasInternet(isOnline(state));
        setHasConnectionState(true);
      };

      unsubscribe = NetInfo.addEventListener(syncConnectionState);
      const initialState = await NetInfo.fetch();
      if (isMounted) {
        syncConnectionState(initialState);
      }
    };

    setupNetInfo();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isOnline, loadNetInfo]);

  const handleRetryConnection = useCallback(async () => {
    setIsCheckingConnection(true);
    try {
      const NetInfo = await loadNetInfo();
      if (!NetInfo) return;

      const state = await NetInfo.fetch();
      setHasInternet(isOnline(state));
      setHasConnectionState(true);
    } finally {
      setIsCheckingConnection(false);
    }
  }, [isOnline, loadNetInfo]);

  if (!fontsLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CurrencyProvider>
          <TabBarProvider>
            {hasConnectionState && !hasInternet ? (
              <NoInternet onRetry={handleRetryConnection} isRetrying={isCheckingConnection} />
            ) : (
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
            )}
          </TabBarProvider>
        </CurrencyProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
});
