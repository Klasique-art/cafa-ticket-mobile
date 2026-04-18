import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import type { MyEventAnalytics } from "@/types/dash-events.types";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface MyEventSalesByTicketTypeProps {
    salesByTicketType: MyEventAnalytics["sales_by_ticket_type"];
}

const MyEventSalesByTicketType = ({
    salesByTicketType,
}: MyEventSalesByTicketTypeProps) => {
    const formatMoney = useFormatMoney();
    return (
        <View className="p-4 bg-primary rounded-xl border border-accent">
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: "#a855f7" + "33" }}
                >
                    <Ionicons name="ticket-outline" size={20} color="#a855f7" />
                </View>
                <AppText styles="text-base text-white" font="font-ibold">
                    Sales by Ticket Type
                </AppText>
            </View>

            {/* Ticket Types List */}
            <View className="gap-4">
                {salesByTicketType.map((ticketType, index) => (
                    <View
                        key={index}
                        className="p-3 bg-primary-200 rounded-xl border border-accent"
                        accessible
                        accessibilityLabel={`${ticketType.ticket_type}. Sold ${ticketType.tickets_sold} of ${ticketType.total_quantity}. Revenue ${formatMoney(ticketType.revenue, { compact: true, trimTrailingZeros: true })}.`}
                    >
                        {/* Ticket Header */}
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-1">
                                <AppText styles="text-sm text-white mb-0.5" font="font-ibold">
                                    {ticketType.ticket_type}
                                </AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {formatMoney(ticketType.price)} per ticket
                                </AppText>
                            </View>
                            <View>
                                <AppText styles="text-sm text-white text-right" font="font-ibold">
                                    {ticketType.tickets_sold}/{ticketType.total_quantity}
                                </AppText>
                                <AppText styles="text-xs text-slate-400 text-right" font="font-iregular">
                                    tickets sold
                                </AppText>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View className="mb-3">
                            <View className="flex-row items-center justify-between mb-2">
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    Quantity Sold
                                </AppText>
                                <AppText styles="text-xs text-blue-400" font="font-isemibold">
                                    {ticketType.percentage_of_quantity_sold.toFixed(1)}%
                                </AppText>
                            </View>
                            <View className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${ticketType.percentage_of_quantity_sold}%`,
                                        backgroundColor: "#3b82f6",
                                    }}
                                />
                            </View>
                        </View>

                        {/* Revenue Stats */}
                        <View className="flex-row gap-2">
                            <View className="flex-1 p-2 bg-primary-200 rounded-lg border border-accent">
                                <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                                    Revenue
                                </AppText>
                                <AppText styles="text-sm text-emerald-400" font="font-ibold">
                                    {formatMoney(ticketType.revenue, { compact: true, trimTrailingZeros: true })}
                                </AppText>
                            </View>

                            <View className="flex-1 p-2 bg-primary-200 rounded-lg border border-accent">
                                <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                                    % of Total Sales
                                </AppText>
                                <AppText styles="text-sm text-white" font="font-ibold">
                                    {ticketType.percentage_of_total_sales.toFixed(1)}%
                                </AppText>
                            </View>
                        </View>

                    </View>
                ))}
            </View>
        </View>
    );
};

export default MyEventSalesByTicketType;
