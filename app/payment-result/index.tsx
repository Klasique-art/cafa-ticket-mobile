import { View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Screen, AppText } from "@/components";
import colors from "@/config/colors";
import { verifyPayment } from "@/lib/tickets";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";
import { storage } from "@/lib/storage";

type PaymentStatus = "verifying" | "success" | "failed" | "error";
type CanonicalVerifyStatus = "pending" | "success" | "failed" | "cancelled" | "expired";

const PENDING_PAYMENT_KEY = "@cafa_pending_payment";
const VERIFY_POLL_INTERVAL_MS = 3000;
const VERIFY_POLL_TIMEOUT_MS = 45000;

interface Ticket {
    ticket_id: string;
    attendee_name: string;
    qr_code?: string;
    attendee_info?: {
        name: string;
    };
}

interface PurchaseDetails {
    purchase_id: string;
    amount: number;
    ticket_count: number;
}

interface PendingPayment {
    payment_reference?: string;
    purchase_id?: string;
    expires_at?: string;
    effective_callback_url?: string;
}

const PaymentResultScreen = () => {
    const formatMoney = useFormatMoney();
    const params = useLocalSearchParams<{
        reference?: string;
        trxref?: string;
        payment_reference?: string;
        ref?: string;
        status?: string;
        error?: string;
    }>();
    const reference =
        params.reference || params.trxref || params.payment_reference || params.ref || "";
    const [status, setStatus] = useState<PaymentStatus>("verifying");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [retryTick, setRetryTick] = useState(0);
    const visibleTickets = tickets.slice(0, 5);
    const hiddenTicketsCount = Math.max(tickets.length - visibleTickets.length, 0);

    useEffect(() => {
        let isMounted = true;

        const clearPendingPayment = async () => {
            await storage.removeItem(PENDING_PAYMENT_KEY);
        };

        const loadPendingPayment = async (): Promise<PendingPayment | null> => {
            const raw = await storage.getItem(PENDING_PAYMENT_KEY);
            if (!raw) return null;
            try {
                return JSON.parse(raw) as PendingPayment;
            } catch {
                return null;
            }
        };

        const normalizeVerifyStatus = (rawStatus: string | undefined): CanonicalVerifyStatus => {
            const statusValue = (rawStatus || "").toLowerCase();
            if (statusValue === "completed") return "success";
            if (statusValue === "success") return "success";
            if (statusValue === "pending" || statusValue === "processing") return "pending";
            if (statusValue === "failed") return "failed";
            if (statusValue === "cancelled" || statusValue === "canceled") return "cancelled";
            if (statusValue === "expired") return "expired";
            return "failed";
        };

        const applyTerminalState = async (terminalStatus: CanonicalVerifyStatus, message?: string) => {
            if (!isMounted) return;

            if (terminalStatus === "success") {
                setStatus("success");
                setErrorMessage("");
                await clearPendingPayment();
                return;
            }

            setStatus(terminalStatus === "failed" ? "failed" : "error");
            if (terminalStatus === "cancelled") {
                setErrorMessage(message || "Payment was cancelled.");
            } else if (terminalStatus === "expired") {
                setErrorMessage(message || "Payment session expired. Please restart purchase.");
            } else {
                setErrorMessage(message || "Payment verification failed.");
            }
            await clearPendingPayment();
        };

        const verifyWithPolling = async (paymentReference: string) => {
            const startedAt = Date.now();

            while (isMounted) {
                const data = await verifyPayment(paymentReference);
                const verifyStatus = normalizeVerifyStatus(data?.status);

                if (verifyStatus === "success") {
                    if (!isMounted) return;
                    setStatus("success");
                    setTickets(data?.tickets || []);
                    setPurchaseDetails({
                        purchase_id: data?.purchase_id || paymentReference,
                        amount: Number(data?.amount || 0),
                        ticket_count: Number(data?.ticket_count || 0),
                    });
                    await clearPendingPayment();
                    return;
                }

                if (verifyStatus !== "pending") {
                    await applyTerminalState(verifyStatus, data?.message);
                    return;
                }

                if (Date.now() - startedAt > VERIFY_POLL_TIMEOUT_MS) {
                    if (!isMounted) return;
                    setStatus("error");
                    setErrorMessage("Payment verification is taking too long. Please try again shortly.");
                    return;
                }

                await new Promise((resolve) => setTimeout(resolve, VERIFY_POLL_INTERVAL_MS));
            }
        };

        const verifyPaymentStatus = async () => {
            try {
                const pending = await loadPendingPayment();
                const fallbackReference = pending?.payment_reference || "";
                const paymentReference = reference || fallbackReference;
                const callbackStatus = (params.status || "").toLowerCase();

                if (!paymentReference) {
                    if (callbackStatus === "cancelled" || params.error === "no_reference") {
                        setStatus("error");
                        setErrorMessage("Payment was cancelled.");
                        await clearPendingPayment();
                        return;
                    }

                    setStatus("error");
                    setErrorMessage("No payment reference found");
                    return;
                }

                await verifyWithPolling(paymentReference);
            } catch (error) {
                if (!isMounted) return;
                setStatus("error");
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to verify payment. Please contact support."
                );
            }
        };

        verifyPaymentStatus();

        return () => {
            isMounted = false;
        };
    }, [reference, params.status, params.error, retryTick]);

    const handleRetryVerification = () => {
        setStatus("verifying");
        setErrorMessage("");
        setRetryTick((prev) => prev + 1);
    };

    const leavePaymentResult = (target: string) => {
        // Clear nested history first so payment-result cannot be reached via back navigation.
        if (typeof (router as any).dismissAll === "function") {
            (router as any).dismissAll();
        }
        router.replace(target as any);
    };

    // Verifying State
    if (status === "verifying") {
        return (
            <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
                <View className="flex-1 items-center justify-center px-4">
                    <View
                        className="w-full max-w-md p-8 rounded-2xl items-center"
                        style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.accent }}
                    >
                        <View
                            className="w-16 h-16 mb-4 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.accent + "33" }}
                        >
                            <ActivityIndicator size="large" color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-white text-center mb-2 font-nunbold">
                            Verifying Payment
                        </AppText>
                        <AppText styles="text-sm text-slate-300 text-center">
                            Please wait while we confirm your payment...
                        </AppText>
                    </View>
                </View>
            </Screen>
        );
    }

    // Success State
    if (status === "success") {
        return (
            <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 6, paddingBottom: 14 }}>
                    {/* Success Header */}
                    <View
                        className="p-3 rounded-2xl mb-2"
                        style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.success }}
                        accessible
                        accessibilityLabel="Payment successful. Your purchase has been verified."
                    >
                        <View
                            className="w-16 h-16 mx-auto mb-3 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.success + "33" }}
                        >
                            <Ionicons name="checkmark-circle" size={42} color={colors.success} />
                        </View>
                        <AppText styles="text-2xl text-white text-center mb-2 font-nunbold">
                            Payment Successful! 🎉
                        </AppText>
                        <AppText styles="text-sm text-slate-300 text-center mb-3">
                            Your tickets have been confirmed and sent to your email.
                        </AppText>
                        <View
                            className="px-4 py-2 rounded-lg self-center"
                            style={{ backgroundColor: colors.primary200 }}
                        >
                            <View className="flex-row items-center gap-2">
                                <AppText styles="text-xs text-slate-400">
                                    Purchase ID:
                                </AppText>
                                <AppText styles="text-sm text-white font-nunbold">
                                    {purchaseDetails?.purchase_id}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Purchase Summary */}
                    <View
                        className="p-3 rounded-2xl mb-2"
                        style={{ backgroundColor: colors.primary100, borderWidth: 1, borderColor: colors.accent + "4D" }}
                        accessible
                        accessibilityLabel="Purchase summary section"
                    >
                        <AppText styles="text-base text-white mb-3 font-nunbold">
                            Purchase Summary
                        </AppText>
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-400 mb-1">
                                    Total Paid
                                </AppText>
                                <AppText styles="text-lg text-white font-nunbold">
                                    {formatMoney(purchaseDetails?.amount || 0)}
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-400 mb-1">
                                    Tickets
                                </AppText>
                                <AppText styles="text-lg text-white font-nunbold">
                                    {purchaseDetails?.ticket_count} Ticket
                                    {purchaseDetails && purchaseDetails.ticket_count > 1 ? "s" : ""}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Tickets Display */}
                    <View
                        className="p-3 rounded-2xl mb-2"
                        style={{ backgroundColor: colors.primary100, borderWidth: 1, borderColor: colors.accent + "4D" }}
                        accessible
                        accessibilityLabel="Purchased tickets section"
                    >
                        <View className="flex-row items-center gap-3 mb-3">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="ticket" size={20} color={colors.accent50} />
                            </View>
                            <AppText styles="text-lg text-white font-nunbold">
                                Your Tickets
                            </AppText>
                        </View>

                        <View className="gap-2">
                            {visibleTickets.map((ticket, index) => (
                                <View
                                    key={ticket.ticket_id}
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + "33" }}
                                    accessible
                                    accessibilityLabel={`Ticket ${index + 1}. ID ${ticket.ticket_id}. Attendee ${ticket.attendee_info?.name || ticket.attendee_name}.`}
                                >
                                    <View className="flex-row items-start justify-between gap-4">
                                        <View className="flex-1">
                                            <AppText styles="text-xs text-slate-400 mb-1">
                                                Ticket #{index + 1}
                                            </AppText>
                                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                                {ticket.ticket_id}
                                            </AppText>
                                            <AppText styles="text-xs text-slate-300">
                                                {ticket.attendee_info?.name || ticket.attendee_name}
                                            </AppText>
                                        </View>
                                        {ticket.qr_code && (
                                            <View className="bg-white p-2 rounded-lg">
                                                <Image
                                                    source={{ uri: getFullImageUrl(ticket.qr_code) || undefined }}
                                                    style={{ width: 68, height: 68 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                            {hiddenTicketsCount > 0 && (
                                <View
                                    className="px-3 py-2 rounded-xl items-center"
                                    style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + "33" }}
                                    accessible
                                    accessibilityLabel={`${hiddenTicketsCount} more tickets not displayed`}
                                >
                                    <AppText styles="text-xs text-white font-nunbold">
                                        +{hiddenTicketsCount} more tickets
                                    </AppText>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-2 mb-2">
                        <TouchableOpacity
                            onPress={() => leavePaymentResult("/dashboard/tickets")}
                            className="py-3 px-5 rounded-xl items-center"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="View all my tickets"
                            accessibilityHint="Opens your tickets and removes this payment result screen from back navigation"
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                View All My Tickets
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => leavePaymentResult("/")}
                            className="py-3 px-5 rounded-xl items-center flex-row justify-center gap-2"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Browse events"
                            accessibilityHint="Opens events and removes this payment result screen from back navigation"
                        >
                            <Ionicons name="home" size={20} color={colors.white} />
                            <AppText styles="text-sm text-white font-nunbold">
                                Browse Events
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    {/* Important Note */}
                    <View
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: colors.accent + "1A", borderWidth: 1, borderColor: colors.accent + "4D" }}
                    >
                        <AppText styles="text-xs text-black text-center">
                            📧 A confirmation email with your tickets has been sent to your email address. Please check
                            your inbox and spam folder.
                        </AppText>
                    </View>
                </ScrollView>
            </Screen>
        );
    }

    // Failed or Error State
    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
            <View className="flex-1 items-center justify-center px-4">
                <View
                    className="w-full max-w-md p-8 rounded-2xl"
                    style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.error }}
                >
                    <View
                        className="w-16 h-16 mx-auto mb-4 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.error + "33" }}
                    >
                        <Ionicons name="close-circle" size={48} color={colors.error} />
                    </View>
                    <AppText styles="text-xl text-white text-center mb-2 font-nunbold">
                        {status === "failed" ? "Payment Failed" : "Something Went Wrong"}
                    </AppText>
                    <AppText styles="text-sm text-slate-300 text-center mb-6">
                        {errorMessage || "We couldn't complete your payment. Please try again or contact support."}
                    </AppText>
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={handleRetryVerification}
                            className="py-3 px-4 rounded-xl items-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Retry payment verification"
                            accessibilityHint="Attempts to verify this payment again"
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                Retry Verification
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/")}
                            className="py-3 px-4 rounded-xl items-center"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                Back to Events
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/contact")}
                            className="py-3 px-4 rounded-xl items-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-white font-nunbold">
                                Contact Support
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Screen>
    );
};

export default PaymentResultScreen;
