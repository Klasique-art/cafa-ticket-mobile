import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

import { AppText, TicketTypeCard } from "@/components";
import type { TicketTypeFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

interface EventTicketTypesSectionProps {
    onOpenModal: (index: number | null) => void;
    ticketTypes: TicketTypeFormValues[];
    setFieldValue: (field: string, value: any) => void;
}

const EventTicketTypesSection = ({ onOpenModal, ticketTypes, setFieldValue }: EventTicketTypesSectionProps) => {
    const hasTickets = ticketTypes.length > 0;
    const canAddMore = ticketTypes.length < 10;

    // Calculate totals
    const { totalTypes, totalTickets, totalRevenue } = useMemo(() => {
        return {
            totalTypes: ticketTypes.length,
            totalTickets: ticketTypes.reduce((sum, ticket) => sum + (parseInt(ticket.quantity) || 0), 0),
            totalRevenue: ticketTypes.reduce(
                (sum, ticket) => sum + (parseFloat(ticket.price) || 0) * (parseInt(ticket.quantity) || 0),
                0
            ),
        };
    }, [ticketTypes]);

    const handleAddTicket = () => {
        if (!canAddMore) {
            Alert.alert("Limit Reached", "Maximum 10 ticket types allowed per event.");
            return;
        }
        onOpenModal(null);
    };

    const handleEditTicket = (index: number) => {
        onOpenModal(index);
    };

    const handleDeleteTicket = (index: number) => {
        Alert.alert(
            "Delete Ticket Type",
            `Are you sure you want to delete "${ticketTypes[index].name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const newTickets = ticketTypes.filter((_, i) => i !== index);
                        setFieldValue("ticket_types", newTickets);
                    },
                },
            ]
        );
    };

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary200 + "80" }}
                >
                    <Ionicons name="ticket-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Ticket Types
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Create different ticket types
                    </AppText>
                </View>
            </View>

            {/* Summary (if tickets exist) */}
            {hasTickets && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row gap-3">
                        <View
                            className="flex-1 p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                                Types
                            </AppText>
                            <AppText styles="text-base text-white" font="font-ibold">
                                {totalTypes}
                            </AppText>
                        </View>

                        <View
                            className="flex-1 p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                                Tickets
                            </AppText>
                            <AppText styles="text-base text-white" font="font-ibold">
                                {totalTickets.toLocaleString()}
                            </AppText>
                        </View>

                        <View
                            className="flex-1 p-3 rounded-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <AppText styles="text-xs text-white mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                                Revenue
                            </AppText>
                            <AppText styles="text-sm text-accent-50" font="font-ibold">
                                GH₵ {totalRevenue.toLocaleString()}
                            </AppText>
                        </View>
                    </View>
                </View>
            )}

            {/* Add Ticket Button (Top) */}
            {hasTickets && (
                <TouchableOpacity
                    onPress={handleAddTicket}
                    disabled={!canAddMore}
                    className="flex-row items-center justify-center gap-2 p-4 rounded-xl border-2"
                    style={{
                        backgroundColor: colors.accent,
                        borderColor: colors.accent,
                        opacity: canAddMore ? 1 : 0.5,
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add-circle-outline" size={20} color={colors.white} />
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Add Ticket Type ({ticketTypes.length}/10)
                    </AppText>
                </TouchableOpacity>
            )}

            {/* Tickets List or Empty State */}
            {!hasTickets ? (
                <View className="p-12 border-2 border-dashed rounded-xl" style={{ borderColor: colors.accent }}>
                    <View className="items-center gap-4">
                        <View
                            className="w-20 h-20 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: colors.primary200 + "80" }}
                        >
                            <Ionicons name="ticket-outline" size={32} color={colors.accent50} />
                        </View>
                        <View className="items-center gap-2">
                            <AppText styles="text-base text-white text-center" font="font-ibold">
                                No Ticket Types Yet
                            </AppText>
                            <AppText
                                styles="text-sm text-white text-center"
                                font="font-iregular"
                                style={{ opacity: 0.6 }}
                            >
                                Create your first ticket type to start selling
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddTicket}
                            className="flex-row items-center gap-2 px-6 py-3 rounded-xl"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                            <AppText styles="text-sm text-white" font="font-ibold">
                                Create Ticket Type
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="gap-3">
                    {ticketTypes.map((ticket, index) => (
                        <TicketTypeCard
                            key={index}
                            ticket={ticket}
                            index={index}
                            onEdit={handleEditTicket}
                            onDelete={handleDeleteTicket}
                        />
                    ))}
                </View>
            )}

            {/* Max Limit Warning */}
            {!canAddMore && (
                <View
                    className="p-3 rounded-lg border flex-row items-start gap-2"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <Ionicons name="alert-circle" size={16} color={colors.accent} style={{ marginTop: 2 }} />
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.8 }}>
                        Maximum 10 ticket types reached. Edit or remove existing tickets to add new ones.
                    </AppText>
                </View>
            )}

            {/* Info Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-white mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        Ticket Guidelines
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Create different types (Early Bird, VIP, etc.)
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Min price: GH₵10, Max quantity: 1M
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Use availability windows for time-limited offers
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventTicketTypesSection;