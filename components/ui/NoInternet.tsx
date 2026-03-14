import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AppText from "./AppText";
import colors from "@/config/colors";

type NoInternetProps = {
    isRetrying?: boolean;
    onRetry: () => void;
};

const NoInternet = ({ isRetrying = false, onRetry }: NoInternetProps) => {
    return (
        <LinearGradient
            colors={[colors.primary, colors.primary100, colors.primary200]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <View className="flex-1 items-center justify-center px-6">
                <View
                    className="w-24 h-24 rounded-3xl items-center justify-center mb-6 border-2"
                    style={{
                        backgroundColor: colors.accent + "22",
                        borderColor: colors.accent + "66",
                    }}
                >
                    <Ionicons name="cloud-offline-outline" size={44} color={colors.accent50} />
                </View>

                <AppText styles="text-2xl text-white font-nunbold mb-2 text-center">
                    You&apos;re Offline
                </AppText>
                <AppText styles="text-sm text-white text-center mb-8" style={{ opacity: 0.82, maxWidth: 320 }}>
                    Internet connection is required to continue. Reconnect and tap retry.
                </AppText>

                <TouchableOpacity
                    onPress={onRetry}
                    disabled={isRetrying}
                    activeOpacity={0.85}
                    className="px-6 py-4 rounded-xl flex-row items-center justify-center gap-2 w-full"
                    style={{
                        maxWidth: 320,
                        backgroundColor: colors.accent,
                        opacity: isRetrying ? 0.75 : 1,
                    }}
                >
                    {isRetrying ? (
                        <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                        <Ionicons name="refresh-outline" size={18} color={colors.white} />
                    )}
                    <AppText styles="text-white text-sm font-nunbold">
                        {isRetrying ? "Checking..." : "Retry Connection"}
                    </AppText>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default NoInternet;
