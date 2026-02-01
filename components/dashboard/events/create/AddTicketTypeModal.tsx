import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { Formik } from "formik";

import { AppText, AppFormField, AppBottomSheet } from "@/components";
import type { AppBottomSheetRef } from "@/components";
import { ticketTypeSchema, type TicketTypeFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";

interface AddTicketTypeModalProps {
    onSubmit: (values: TicketTypeFormValues) => void;
    initialValues?: TicketTypeFormValues;
    isEditing?: boolean;
}

export interface AddTicketTypeModalRef {
    open: () => void;
    close: () => void;
}

const AddTicketTypeModal = forwardRef<AddTicketTypeModalRef, AddTicketTypeModalProps>(
    ({ onSubmit, initialValues, isEditing = false }, ref) => {
        const bottomSheetRef = useRef<AppBottomSheetRef>(null);

        useImperativeHandle(ref, () => ({
            open: () => bottomSheetRef.current?.open(),
            close: () => bottomSheetRef.current?.close(),
        }));

        const defaultValues: TicketTypeFormValues = {
            name: "",
            description: "",
            price: "",
            quantity: "",
            min_purchase: "1",
            max_purchase: "",
            available_from: "",
            available_until: "",
        };

        const handleSubmit = (values: TicketTypeFormValues) => {
            onSubmit(values);
            bottomSheetRef.current?.close();
        };

        return (
            <AppBottomSheet ref={bottomSheetRef} snapPoints={["90%"]} scrollable>
                <View className="flex-1 px-4 pb-4">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.primary200 + "80" }}
                            >
                                <Ionicons
                                    name={isEditing ? "pencil" : "add-circle-outline"}
                                    size={20}
                                    color={colors.accent50}
                                />
                            </View>
                            <AppText styles="text-lg text-white" font="font-ibold">
                                {isEditing ? "Edit Ticket Type" : "Add Ticket Type"}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            onPress={() => bottomSheetRef.current?.close()}
                            className="w-10 h-10 rounded-lg items-center justify-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <Formik
                        initialValues={initialValues || defaultValues}
                        validationSchema={ticketTypeSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ handleSubmit: formikHandleSubmit, isSubmitting }) => (
                            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                                <View className="gap-4 pb-6">
                                    {/* Basic Info */}
                                    <View>
                                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                                            Basic Information
                                        </AppText>

                                        <View className="gap-3">
                                            <AppFormField
                                                name="name"
                                                label="Ticket Name"
                                                placeholder="e.g., Early Bird, VIP, Regular"
                                                required
                                            />

                                            <AppFormField
                                                name="description"
                                                label="Description"
                                                placeholder="Describe what this ticket includes..."
                                                multiline
                                                rows={3}
                                                required
                                            />
                                        </View>
                                    </View>

                                    {/* Pricing & Quantity */}
                                    <View>
                                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                                            Pricing & Quantity
                                        </AppText>

                                        <View className="gap-3">
                                            <View className="flex-row gap-3">
                                                <View className="flex-1">
                                                    <AppFormField
                                                        name="price"
                                                        label="Price (GH₵)"
                                                        placeholder="50.00"
                                                        keyboardType="decimal-pad"
                                                        required
                                                    />
                                                </View>

                                                <View className="flex-1">
                                                    <AppFormField
                                                        name="quantity"
                                                        label="Quantity"
                                                        placeholder="100"
                                                        keyboardType="number-pad"
                                                        required
                                                    />
                                                </View>
                                            </View>

                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                                Min price: GH₵10 • Max quantity: 1,000,000
                                            </AppText>
                                        </View>
                                    </View>

                                    {/* Purchase Limits */}
                                    <View>
                                        <AppText styles="text-sm text-white mb-3" font="font-ibold">
                                            Purchase Limits
                                        </AppText>

                                        <View className="gap-3">
                                            <View className="flex-row gap-3">
                                                <View className="flex-1">
                                                    <AppFormField
                                                        name="min_purchase"
                                                        label="Minimum"
                                                        placeholder="1"
                                                        keyboardType="number-pad"
                                                        required
                                                    />
                                                </View>

                                                <View className="flex-1">
                                                    <AppFormField
                                                        name="max_purchase"
                                                        label="Maximum (Optional)"
                                                        placeholder="10"
                                                        keyboardType="number-pad"
                                                    />
                                                </View>
                                            </View>

                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                                Per transaction limits • Max: 100
                                            </AppText>
                                        </View>
                                    </View>

                                    {/* Availability Period */}
                                    <View>
                                        <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                            Availability Period (Optional)
                                        </AppText>
                                        <AppText styles="text-xs text-white mb-3" font="font-iregular" style={{ opacity: 0.6 }}>
                                            Set time window for this ticket type
                                        </AppText>

                                        <View className="gap-3">
                                            <AppFormField
                                                name="available_from"
                                                label="Available From"
                                                type="date"
                                            />

                                            <AppFormField
                                                name="available_until"
                                                label="Available Until"
                                                type="date"
                                            />
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    <View className="flex-row gap-3 pt-4">
                                        <TouchableOpacity
                                            onPress={() => bottomSheetRef.current?.close()}
                                            className="flex-1 px-6 py-3 rounded-xl border-2"
                                            style={{
                                                backgroundColor: colors.primary200,
                                                borderColor: colors.accent + "4D",
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <AppText styles="text-sm text-white text-center" font="font-ibold">
                                                Cancel
                                            </AppText>
                                        </TouchableOpacity>
                                        <View className="flex-1">
                                            <TouchableOpacity
                                                onPress={() => formikHandleSubmit()}
                                                disabled={isSubmitting}
                                                className="px-6 py-3 rounded-xl"
                                                style={{
                                                    backgroundColor: colors.accent,
                                                    opacity: isSubmitting ? 0.6 : 1,
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <AppText styles="text-sm text-white text-center" font="font-ibold">
                                                    {isEditing ? "Update Ticket" : "Add Ticket"}
                                                </AppText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
                </View>
            </AppBottomSheet>
        );
    }
);

AddTicketTypeModal.displayName = "AddTicketTypeModal";

export default AddTicketTypeModal;