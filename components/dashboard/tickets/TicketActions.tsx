import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";
import type { TicketDetails } from "@/types/tickets.types";

type Props = {
    ticket: TicketDetails;
};

const TicketActions = ({ ticket }: Props) => {
    return (
        <View
            className="rounded-xl p-3 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            <View>
                <TouchableOpacity
                    onPress={() => router.push(`/events/${ticket.event.slug}` as Href)}
                    className="flex-1 px-3 py-3 rounded-xl border"
                    style={{ backgroundColor: colors.accent, borderColor: colors.accent }}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`View event details for ${ticket.event.title}`}
                >
                    <View className="flex-row items-center gap-2">
                        <View
                            className="w-8 h-8 rounded-full items-center justify-center"
                            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                        >
                            <Ionicons name="eye-outline" size={16} color={colors.white} />
                        </View>
                        <View>
                            <AppText styles="text-sm text-white font-nunbold">
                                View Event
                            </AppText>
                            <AppText styles="text-[11px] text-white" style={{ opacity: 0.8 }}>
                                Open full event page
                            </AppText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TicketActions;
