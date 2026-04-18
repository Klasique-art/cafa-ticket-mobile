import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import type { TicketTypeFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface TicketTypeCardProps {
    ticket: TicketTypeFormValues;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

const TicketTypeCard = ({ ticket, index, onEdit, onDelete }: TicketTypeCardProps) => {
    const hasAvailability = ticket.available_from || ticket.available_until;
    const formatMoney = useFormatMoney();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <View
            className="p-4 rounded-xl border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
        >
            {/* Header */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start gap-3 flex-1">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200 + "80" }}
                    >
                        <Ionicons name="ticket-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-1" font="font-ibold">
                            {ticket.name}
                        </AppText>
                        <AppText
                            styles="text-xs text-slate-300"
                            font="font-iregular"
                            style={{ opacity: 0.7 }}
                            numberOfLines={2}
                        >
                            {ticket.description}
                        </AppText>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row items-center gap-2 ml-3">
                    <TouchableOpacity
                        onPress={() => onEdit(index)}
                        className="w-8 h-8 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200 }}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${ticket.name} ticket type`}
                        accessibilityHint="Opens this ticket type for editing"
                    >
                        <Ionicons name="pencil" size={16} color={colors.accent50} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onDelete(index)}
                        className="w-8 h-8 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${ticket.name} ticket type`}
                        accessibilityHint="Removes this ticket type after confirmation"
                    >
                        <Ionicons name="trash-outline" size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row gap-3 mb-3">
                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                >
                    <AppText styles="text-xs text-slate-300 mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Price
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {formatMoney(ticket.price)}
                    </AppText>
                </View>

                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                >
                    <AppText styles="text-xs text-slate-300 mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Quantity
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {parseInt(ticket.quantity).toLocaleString()}
                    </AppText>
                </View>
            </View>

            {/* Purchase Limits */}
            <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="people-outline" size={14} color={colors.white} style={{ opacity: 0.6 }} />
                <AppText styles="text-xs text-slate-300" font="font-iregular" style={{ opacity: 0.7 }}>
                    Purchase limits: {ticket.min_purchase} - {ticket.max_purchase || "âˆž"} per transaction
                </AppText>
            </View>

            {/* Availability Dates */}
            {hasAvailability && (
                <View
                    className="p-3 rounded-lg border"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-start gap-2">
                        <Ionicons name="calendar-outline" size={14} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-slate-300 mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                                Limited Availability
                            </AppText>
                            {ticket.available_from && (
                                <AppText styles="text-xs text-slate-300" font="font-iregular" style={{ opacity: 0.7 }}>
                                    From: {formatDate(ticket.available_from)}
                                </AppText>
                            )}
                            {ticket.available_until && (
                                <AppText styles="text-xs text-slate-300" font="font-iregular" style={{ opacity: 0.7 }}>
                                    Until: {formatDate(ticket.available_until)}
                                </AppText>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default TicketTypeCard;
