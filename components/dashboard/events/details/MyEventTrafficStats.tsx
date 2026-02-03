import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import type { MyEventAnalytics } from "@/types/dash-events.types";

interface MyEventTrafficStatsProps {
    traffic: MyEventAnalytics["traffic"];
    ticketsSold: number;
}

const MyEventTrafficStats = ({ traffic, ticketsSold }: MyEventTrafficStatsProps) => {
    return (
        <View className="p-4 bg-primary rounded-xl border border-accent">
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#3b82f6" + "33" }}
                >
                    <Ionicons name="eye-outline" size={20} color="#3b82f6" />
                </View>
                <AppText styles="text-base text-white" font="font-ibold">
                    Traffic & Conversion
                </AppText>
            </View>

            {/* Stats Grid */}
            <View className="flex-row gap-2 mb-4">
                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-blue-500/30">
                    <View className="flex-row items-center gap-1 mb-2">
                        <Ionicons name="eye-outline" size={14} color="#3b82f6" />
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Page Views
                        </AppText>
                    </View>
                    <AppText styles="text-lg text-blue-400" font="font-ibold">
                        {traffic.page_views.toLocaleString()}
                    </AppText>
                </View>

                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-purple-500/30">
                    <View className="flex-row items-center gap-1 mb-2">
                        <Ionicons name="people-outline" size={14} color="#a855f7" />
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Unique Visitors
                        </AppText>
                    </View>
                    <AppText styles="text-lg text-purple-400" font="font-ibold">
                        {traffic.unique_visitors.toLocaleString()}
                    </AppText>
                </View>

                <View className="flex-1 p-3 bg-primary-200 rounded-xl border border-emerald-500/30">
                    <View className="flex-row items-center gap-1 mb-2">
                        <Ionicons name="trending-up-outline" size={14} color="#10b981" />
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Conversion
                        </AppText>
                    </View>
                    <AppText styles="text-lg text-emerald-400" font="font-ibold">
                        {traffic.conversion_rate.toFixed(2)}%
                    </AppText>
                </View>
            </View>

            {/* Conversion Funnel */}
            <View className="gap-3">
                <AppText styles="text-sm text-white" font="font-isemibold">
                    Conversion Funnel
                </AppText>

                {/* Page Views */}
                <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Page Views
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-isemibold">
                            {traffic.page_views.toLocaleString()} (100%)
                        </AppText>
                    </View>
                    <View className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                        <View
                            className="h-full rounded-full"
                            style={{ width: "100%", backgroundColor: "#3b82f6" }}
                        />
                    </View>
                </View>

                {/* Unique Visitors */}
                <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Unique Visitors
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-isemibold">
                            {traffic.unique_visitors.toLocaleString()} (
                            {((traffic.unique_visitors / traffic.page_views) * 100).toFixed(1)}%)
                        </AppText>
                    </View>
                    <View className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                        <View
                            className="h-full rounded-full"
                            style={{
                                width: `${(traffic.unique_visitors / traffic.page_views) * 100}%`,
                                backgroundColor: "#a855f7",
                            }}
                        />
                    </View>
                </View>

                {/* Tickets Sold */}
                <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                        <AppText styles="text-xs text-slate-400" font="font-iregular">
                            Tickets Sold (Conversions)
                        </AppText>
                        <AppText styles="text-xs text-emerald-400" font="font-isemibold">
                            {ticketsSold.toLocaleString()} ({traffic.conversion_rate.toFixed(2)}%)
                        </AppText>
                    </View>
                    <View className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                        <View
                            className="h-full rounded-full"
                            style={{ width: `${traffic.conversion_rate}%`, backgroundColor: "#10b981" }}
                        />
                    </View>
                </View>
            </View>

            {/* Info Note */}
            <View
                className="mt-4 p-3 rounded-lg border"
                style={{ backgroundColor: "#3b82f6" + "1A", borderColor: "#3b82f6" + "33" }}
            >
                <AppText styles="text-xs text-blue-300" font="font-iregular">
                    💡 Conversion rate = (Tickets Sold ÷ Unique Visitors) × 100
                </AppText>
            </View>
        </View>
    );
};

export default MyEventTrafficStats;