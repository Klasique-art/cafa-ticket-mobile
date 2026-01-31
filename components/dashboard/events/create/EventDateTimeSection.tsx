import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";

import { AppText, AppFormField } from "@/components";
import type { EventFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

const EventDateTimeSection = () => {
    const { values } = useFormikContext<EventFormValues>();

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split("T")[0];

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="calendar-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white" font="font-ibold">
                        Date & Time
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        When will your event happen?
                    </AppText>
                </View>
            </View>

            {/* Event Start */}
            <View>
                <AppText styles="text-sm text-white mb-3" font="font-isemibold">
                    Event Start
                </AppText>
                <View className="gap-3">
                    <AppFormField
                        name="start_date"
                        label="Start Date"
                        type="date"
                        required
                        min={today}
                    />

                    <AppFormField
                        name="start_time"
                        label="Start Time"
                        placeholder="HH:MM"
                        required
                    />
                </View>
            </View>

            {/* Event End */}
            <View>
                <AppText styles="text-sm text-white mb-3" font="font-isemibold">
                    Event End
                </AppText>
                <View className="gap-3">
                    <AppFormField
                        name="end_date"
                        label="End Date"
                        type="date"
                        required
                        min={values.start_date || today}
                    />

                    <AppFormField
                        name="end_time"
                        label="End Time"
                        placeholder="HH:MM"
                        required
                    />
                </View>
            </View>
        </View>
    );
};

export default EventDateTimeSection;