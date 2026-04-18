import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { Formik } from "formik";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import AppText from "../../../ui/AppText";
import AppFormField from "../../../form/AppFormField";
import AppBottomSheet from "../../../ui/AppBottomSheet";
import type { AppBottomSheetRef } from "../../../ui/AppBottomSheet";
import { ticketTypeSchema, type TicketTypeFormValues } from "@/data/eventCreationSchema";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

interface AddTicketTypeModalProps {
    onSubmit: (values: TicketTypeFormValues) => void;
    initialValues?: TicketTypeFormValues;
    isEditing?: boolean;
    eventStartDate?: string;
    eventEndDate?: string;
}

export interface AddTicketTypeModalRef {
    open: () => void;
    close: () => void;
}

const AddTicketTypeModal = forwardRef<AddTicketTypeModalRef, AddTicketTypeModalProps>(
    ({ onSubmit, initialValues, isEditing = false, eventStartDate, eventEndDate }, ref) => {
        const bottomSheetRef = useRef<AppBottomSheetRef>(null);
        const formatMoney = useFormatMoney();

        const getLocalToday = () => {
            const now = new Date();
            const y = now.getFullYear();
            const m = `${now.getMonth() + 1}`.padStart(2, "0");
            const d = `${now.getDate()}`.padStart(2, "0");
            return `${y}-${m}-${d}`;
        };
        const today = getLocalToday();

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
            <AppBottomSheet
                ref={bottomSheetRef}
                snapPoints={["90%"]}
                scrollable // ← tells AppBottomSheet to skip BottomSheetView wrapper
            >
                {/* Outer flex container — fills the sheet */}
                <View className="flex-1 px-4">

                    {/* ── Header — pinned, never scrolls ── */}
                    <View className="flex-row items-center justify-between py-4">
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
                            accessibilityRole="button"
                            accessibilityLabel="Close ticket type form"
                            accessibilityHint="Closes this sheet without saving"
                        >
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* ── Formik wraps both the scrolling body AND the pinned buttons ── */}
                    <Formik
                        initialValues={initialValues || defaultValues}
                        validationSchema={ticketTypeSchema}
                        onSubmit={handleSubmit}
                        validate={(values) => {
                            const errors: Partial<Record<keyof TicketTypeFormValues, string>> = {};

                            if (values.available_from) {
                                if (values.available_from < today) {
                                    errors.available_from = "Available from date cannot be earlier than today";
                                }

                                if (eventStartDate && values.available_from > eventStartDate) {
                                    errors.available_from = "Available from date cannot be later than event start date";
                                }
                            }

                            if (values.available_until) {
                                if (values.available_from && values.available_until < values.available_from) {
                                    errors.available_until = "Available until date cannot be earlier than available from date";
                                }

                                if (eventEndDate && values.available_until > eventEndDate) {
                                    errors.available_until = "Available until date cannot be later than event end date";
                                }
                            }

                            return errors;
                        }}
                        enableReinitialize
                    >
                        {({ handleSubmit: formikHandleSubmit, isSubmitting, values }) => (
                            <>
                                {/* ── Scrollable form fields — only this part scrolls ── */}
                                <BottomSheetScrollView
                                    className="flex-1"
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View className="gap-4 pb-4">
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
                                                            label="Price"
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
                                                    Min price: {formatMoney(10)} • Max quantity: 1,000,000
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
                                                    labelColor="text-white"
                                                    min={today}
                                                    max={eventStartDate}
                                                />
                                                <AppFormField
                                                    name="available_until"
                                                    label="Available Until"
                                                    type="date"
                                                    labelColor="text-white"
                                                    min={values.available_from || today}
                                                    max={eventEndDate}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </BottomSheetScrollView>

                                {/* ── Action Buttons — pinned at bottom, never scrolls ── */}
                                <View className="flex-row gap-3 pb-6 pt-2">
                                    <TouchableOpacity
                                        onPress={() => bottomSheetRef.current?.close()}
                                        className="flex-1 px-6 py-3 rounded-xl border-2"
                                        style={{
                                            backgroundColor: colors.primary200,
                                            borderColor: colors.accent + "4D",
                                        }}
                                        activeOpacity={0.7}
                                        accessibilityRole="button"
                                        accessibilityLabel="Cancel ticket type changes"
                                        accessibilityHint="Closes the ticket type form without saving"
                                    >
                                        <AppText styles="text-sm text-white text-center" font="font-ibold">
                                            Cancel
                                        </AppText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => formikHandleSubmit()}
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 rounded-xl"
                                        style={{
                                            backgroundColor: colors.accent,
                                            opacity: isSubmitting ? 0.6 : 1,
                                        }}
                                        activeOpacity={0.8}
                                        accessibilityRole="button"
                                        accessibilityLabel={isEditing ? "Update ticket type" : "Add ticket type"}
                                        accessibilityHint={isEditing ? "Saves updates to this ticket type" : "Saves this new ticket type"}
                                    >
                                        <AppText styles="text-sm text-white text-center" font="font-ibold">
                                            {isEditing ? "Update Ticket" : "Add Ticket"}
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </AppBottomSheet>
        );
    }
);

AddTicketTypeModal.displayName = "AddTicketTypeModal";

export default AddTicketTypeModal;
