import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { router } from "expo-router";
import { Linking } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import AppText from "../../ui/AppText";
import AppBottomSheet from "../../ui/AppBottomSheet";
import type { AppBottomSheetRef } from "../../ui/AppBottomSheet";
import { TicketType, EventDetails } from "@/types";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";
import { buyTicket } from "@/lib/tickets";

interface TicketPurchaseModalProps {
    ticket: TicketType | null;
    quantity: number;
    event: EventDetails | null;
    currentUser: CurrentUser | null;
}

export interface TicketPurchaseModalRef {
    open: () => void;
    close: () => void;
}

const TicketPurchaseModal = forwardRef<TicketPurchaseModalRef, TicketPurchaseModalProps>(
    ({ ticket, quantity, event, currentUser }, ref) => {
        const bottomSheetRef = useRef<AppBottomSheetRef>(null);
        const [isProcessing, setIsProcessing] = useState(false);
        const [error, setError] = useState<string | null>(null);

        useImperativeHandle(ref, () => ({
            open: () => {
                setError(null); // Reset error when opening
                bottomSheetRef.current?.open();
            },
            close: () => bottomSheetRef.current?.close(),
        }));

        // Calculate totals only if ticket exists
        const subtotal = ticket ? parseFloat(ticket.price) * quantity : 0;
        const serviceFee = subtotal * 0.01;
        const total = subtotal + serviceFee;

        // Main purchase handler
        const handlePurchase = async () => {
            if (!ticket || !event || !currentUser) return;

            setIsProcessing(true);
            setError(null);

            try {
                const response = await buyTicket({
                    event_slug: event.slug,
                    ticket_type_id: ticket.id,
                    quantity,
                    buyer_name: currentUser.full_name,
                    buyer_email: currentUser.email,
                    buyer_phone: currentUser.phone_number || "",
                });

                // Open Paystack payment URL
                await Linking.openURL(response.authorization_url);
                bottomSheetRef.current?.close();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to process purchase");
            } finally {
                setIsProcessing(false);
            }
        };

        // Render login required content
        const renderLoginRequired = () => (
            <View className="flex-1 px-4 pb-4 pt-2">
                <View className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 items-center justify-center">
                    <Ionicons name="alert-circle-outline" size={32} color="#fbbf24" />
                </View>

                <AppText styles="text-lg text-white text-center mb-3" font="font-ibold">
                    Login Required
                </AppText>
                <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed" font="font-iregular">
                    You need to be logged in to purchase tickets. Please login or create an account to continue.
                </AppText>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetRef.current?.close();
                            router.push("/login");
                        }}
                        className="flex-1 py-3 px-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Login
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetRef.current?.close();
                            router.push("/signup");
                        }}
                        className="flex-1 py-3 px-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.primary200 }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Sign Up
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );

        // Render phone required content
        const renderPhoneRequired = () => (
            <View className="flex-1 px-4 pb-4 pt-2">
                <View className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 items-center justify-center">
                    <Ionicons name="person-outline" size={32} color="#fbbf24" />
                </View>

                <AppText styles="text-lg text-white text-center mb-3" font="font-ibold">
                    Complete Your Profile
                </AppText>
                <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed" font="font-iregular">
                    Please add your phone number to your profile before purchasing tickets. This is required for ticket
                    delivery and event updates.
                </AppText>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => bottomSheetRef.current?.close()}
                        className="flex-1 py-3 px-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.primary200 }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Cancel
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetRef.current?.close();
                            router.push("/dashboard/profile/edit");
                        }}
                        className="flex-1 py-3 px-4 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Update Profile
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );

        // Render main purchase content
        const renderPurchaseContent = () => {
            if (!ticket || !event) return null;

            return (
                <BottomSheetScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="cart-outline" size={24} color={colors.accent50} />
                            </View>
                            <View>
                                <AppText styles="text-lg text-white" font="font-ibold">
                                    Confirm Purchase
                                </AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {event.title}
                                </AppText>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => bottomSheetRef.current?.close()}
                            disabled={isProcessing}
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="gap-4">
                        {error && (
                            <View
                                className="p-4 rounded-xl"
                                style={{
                                    backgroundColor: colors.error + "1A",
                                    borderWidth: 1,
                                    borderColor: colors.error,
                                }}
                            >
                                <AppText styles="text-sm text-red-400" font="font-iregular">
                                    {error}
                                </AppText>
                            </View>
                        )}

                        {/* Ticket Details */}
                        <View>
                            <AppText styles="text-base text-white mb-3" font="font-ibold">
                                Ticket Details
                            </AppText>
                            <View
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: colors.primary200, gap: 12 }}
                            >
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">
                                        Ticket Type
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">
                                        {ticket.name}
                                    </AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">
                                        Quantity
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">
                                        {quantity}
                                    </AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">
                                        Price per ticket
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">
                                        GH₵ {parseFloat(ticket.price).toFixed(2)}
                                    </AppText>
                                </View>
                            </View>
                        </View>

                        {/* Attendee Info */}
                        {currentUser && (
                            <View>
                                <AppText styles="text-base text-white mb-3" font="font-ibold">
                                    Attendee Information
                                </AppText>
                                <View
                                    className="p-4 rounded-xl"
                                    style={{ backgroundColor: colors.primary200, gap: 12 }}
                                >
                                    <View className="flex-row justify-between">
                                        <AppText styles="text-sm text-slate-400" font="font-iregular">
                                            Name
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-right flex-1 ml-4"
                                            font="font-isemibold"
                                            numberOfLines={1}
                                        >
                                            {currentUser.full_name}
                                        </AppText>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <AppText styles="text-sm text-slate-400" font="font-iregular">
                                            Email
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-right flex-1 ml-4"
                                            font="font-isemibold"
                                            numberOfLines={1}
                                        >
                                            {currentUser.email}
                                        </AppText>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <AppText styles="text-sm text-slate-400" font="font-iregular">
                                            Phone
                                        </AppText>
                                        <AppText styles="text-sm text-white" font="font-isemibold">
                                            {currentUser.phone_number}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Price Breakdown */}
                        <View>
                            <AppText styles="text-base text-white mb-3" font="font-ibold">
                                Price Breakdown
                            </AppText>
                            <View
                                className="p-4 rounded-xl"
                                style={{ backgroundColor: colors.primary200, gap: 12 }}
                            >
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">
                                        Subtotal
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-iregular">
                                        GH₵ {subtotal.toFixed(2)}
                                    </AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">
                                        Service Fee (1%)
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-iregular">
                                        GH₵ {serviceFee.toFixed(2)}
                                    </AppText>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.accent + "4D" }} />
                                <View className="flex-row justify-between">
                                    <AppText styles="text-base text-white" font="font-ibold">
                                        Total
                                    </AppText>
                                    <AppText styles="text-xl text-accent-50" font="font-ibold">
                                        GH₵ {total.toFixed(2)}
                                    </AppText>
                                </View>
                            </View>
                        </View>

                        {/* Notice */}
                        <View
                            className="p-4 rounded-xl"
                            style={{
                                backgroundColor: colors.info + "1A",
                                borderWidth: 1,
                                borderColor: colors.info,
                            }}
                        >
                            <View className="flex-row items-start gap-3">
                                <Ionicons name="information-circle-outline" size={20} color="#60a5fa" />
                                <View className="flex-1">
                                    <AppText styles="text-xs text-blue-300 mb-1" font="font-isemibold">
                                        Important:
                                    </AppText>
                                    <AppText styles="text-xs text-blue-300 leading-relaxed" font="font-iregular">
                                        You will be redirected to Paystack to complete your payment securely. Your
                                        tickets will be reserved for 10 minutes.
                                    </AppText>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 pt-4">
                            <TouchableOpacity
                                onPress={() => bottomSheetRef.current?.close()}
                                disabled={isProcessing}
                                className="flex-1 py-3 px-4 rounded-xl"
                                style={{ backgroundColor: colors.primary200 }}
                                activeOpacity={0.8}
                            >
                                <AppText styles="text-sm text-white text-center" font="font-ibold">
                                    Cancel
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handlePurchase}
                                disabled={isProcessing}
                                className="flex-1 py-3 px-4 rounded-xl flex-row justify-center items-center gap-2"
                                style={{
                                    backgroundColor: colors.accent,
                                    opacity: isProcessing ? 0.5 : 1,
                                }}
                                activeOpacity={0.8}
                            >
                                {isProcessing ? (
                                    <>
                                        <ActivityIndicator size="small" color={colors.white} />
                                        <AppText styles="text-sm text-white" font="font-ibold">
                                            Processing...
                                        </AppText>
                                    </>
                                ) : (
                                    <>
                                        <Ionicons name="card-outline" size={16} color={colors.white} />
                                        <AppText styles="text-sm text-white" font="font-ibold">
                                            Proceed to Payment
                                        </AppText>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetScrollView>
            );
        };

        // Determine which content to show and snap point
        const getContent = () => {
            if (!currentUser) {
                return { content: renderLoginRequired(), snapPoint: "40%" };
            }
            if (!currentUser.phone_number) {
                return { content: renderPhoneRequired(), snapPoint: "40%" };
            }
            return { content: renderPurchaseContent(), snapPoint: "90%" };
        };

        const { content, snapPoint } = getContent();

        return (
            <AppBottomSheet ref={bottomSheetRef} customSnapPoints={[snapPoint]} scrollable={snapPoint === "90%"}>
                {content}
            </AppBottomSheet>
        );
    }
);

TicketPurchaseModal.displayName = "TicketPurchaseModal";

export default TicketPurchaseModal;