import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import type { MyEventAnalytics } from "@/types/dash-events.types";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface MyEventRecentSalesProps {
    recentSales: MyEventAnalytics["recent_sales"];
}

const MyEventRecentSales = ({ recentSales }: MyEventRecentSalesProps) => {
    const formatMoney = useFormatMoney();
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (recentSales.length === 0) {
        return (
            <View className="p-4 bg-primary rounded-xl border border-accent">
                {/* Header */}
                <View className="flex-row items-center gap-3 mb-4">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: "#10b981" + "33" }}
                    >
                        <Ionicons name="time-outline" size={20} color="#10b981" />
                    </View>
                    <AppText styles="text-base text-white" font="font-ibold">
                        Recent Sales
                    </AppText>
                </View>

                {/* Empty State */}
                <View className="py-8 items-center">
                    <AppText styles="text-sm text-slate-400 text-center" font="font-iregular">
                        No sales yet for this event
                    </AppText>
                </View>
            </View>
        );
    }

    return (
        <View className="p-4 bg-primary rounded-xl border border-accent">
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#10b981" + "33" }}
                >
                    <Ionicons name="time-outline" size={20} color="#10b981" />
                </View>
                <AppText styles="text-base text-white" font="font-ibold">
                    Recent Sales
                </AppText>
            </View>

            {/* Sales List */}
            <View className="gap-3">
                {recentSales.map((sale, index) => (
                    <View
                        key={index}
                        className="p-3 bg-primary-200 rounded-xl border border-accent/20"
                    >
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-1">
                                <AppText styles="text-sm text-white mb-0.5" font="font-ibold">
                                    {sale.buyer_name}
                                </AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {sale.ticket_type}
                                </AppText>
                            </View>
                            <View>
                                <AppText styles="text-sm text-emerald-400 text-right" font="font-ibold">
                                    {formatMoney(sale.amount)}
                                </AppText>
                                <AppText styles="text-xs text-slate-400 text-right" font="font-iregular">
                                    {formatDateTime(sale.purchase_date)}
                                </AppText>
                            </View>
                        </View>

                        {/* Ticket ID */}
                        <View className="pt-2 border-t border-accent/10">
                            <AppText styles="text-xs text-slate-500" font="font-iregular">
                                {sale.ticket_id}
                            </AppText>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default MyEventRecentSales;