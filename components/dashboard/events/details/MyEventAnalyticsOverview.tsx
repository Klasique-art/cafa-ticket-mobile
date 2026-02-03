import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import type { MyEventAnalytics } from "@/types/dash-events.types";

interface MyEventAnalyticsOverviewProps {
    analytics: MyEventAnalytics["overview"];
}

const MyEventAnalyticsOverview = ({ analytics }: MyEventAnalyticsOverviewProps) => {
    const cards = [
        {
            title: "Tickets Sold",
            value: `${analytics.tickets_sold}/${analytics.total_tickets}`,
            icon: "ticket-outline" as const,
            iconBg: "#3b82f6" + "33",
            iconColor: "#3b82f6",
            subtitle: `${analytics.sales_percentage.toFixed(1)}% sold`,
            progress: analytics.sales_percentage,
            progressColor: "#3b82f6",
        },
        {
            title: "Gross Revenue",
            value: `GH₵${parseFloat(analytics.gross_revenue).toLocaleString()}`,
            icon: "cash-outline" as const,
            iconBg: "#10b981" + "33",
            iconColor: "#10b981",
            subtitle: `Net: GH₵${parseFloat(analytics.net_revenue).toLocaleString()}`,
            progress: null,
        },
        {
            title: "Avg. Ticket Price",
            value: `GH₵${parseFloat(analytics.average_ticket_price).toLocaleString()}`,
            icon: "trending-up-outline" as const,
            iconBg: "#a855f7" + "33",
            iconColor: "#a855f7",
            subtitle: "Per ticket",
            progress: null,
        },
        {
            title: "Checked In",
            value: `${analytics.tickets_checked_in}/${analytics.tickets_sold}`,
            icon: "checkmark-circle-outline" as const,
            iconBg: "#DC0000" + "33",
            iconColor: "#FF5555",
            subtitle: `${analytics.check_in_percentage.toFixed(1)}% attendance`,
            progress: analytics.check_in_percentage,
            progressColor: "#FF5555",
        },
        {
            title: "Tickets Remaining",
            value: analytics.tickets_remaining.toLocaleString(),
            icon: "people-outline" as const,
            iconBg: "#f59e0b" + "33",
            iconColor: "#f59e0b",
            subtitle: "Still available",
            progress: null,
        },
        {
            title: "Projected Revenue",
            value: `GH₵${parseFloat(analytics.projected_revenue).toLocaleString()}`,
            icon: "eye-outline" as const,
            iconBg: "#ec4899" + "33",
            iconColor: "#ec4899",
            subtitle: "If sold out",
            progress: null,
        },
    ];

    return (
        <View className="gap-4">
            <AppText styles="text-xl text-white" font="font-ibold">
                Event Analytics
            </AppText>

            <View className="gap-3">
                {cards.map((card, index) => (
                    <View
                        key={index}
                        className="p-4 bg-primary rounded-xl border border-accent"
                    >
                        <View className="flex-row items-start justify-between mb-3">
                            <View className="flex-1">
                                <AppText styles="text-sm text-slate-300 mb-2" font="font-imedium">
                                    {card.title}
                                </AppText>
                                <AppText styles="text-2xl text-white mb-1" font="font-ibold">
                                    {card.value}
                                </AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {card.subtitle}
                                </AppText>
                            </View>

                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: card.iconBg }}
                            >
                                <Ionicons name={card.icon} size={24} color={card.iconColor} />
                            </View>
                        </View>

                        {/* Progress Bar */}
                        {card.progress !== null && (
                            <View className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${card.progress}%`,
                                        backgroundColor: card.progressColor,
                                    }}
                                />
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default MyEventAnalyticsOverview;