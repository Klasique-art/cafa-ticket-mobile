import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Screen, RequireAuth, Nav, AppText, AppBottomSheet, ConfirmAction } from "@/components";
import type { AppBottomSheetRef } from "@/components";
import { deletePaymentProfile, getMyPaymentProfiles } from "@/lib/dashboard";
import type { BankTransferPaymentProfile } from "@/types/payments.types";
import colors from "@/config/colors";

const PaymentProfilesScreen = () => {
    const deleteSheetRef = useRef<AppBottomSheetRef>(null);
    const [profiles, setProfiles] = useState<BankTransferPaymentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch payment profiles
    const fetchProfiles = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            const response = await getMyPaymentProfiles();
            if (response) {
                setProfiles(response.results);
            }
        } catch (err: any) {
            console.error("Error fetching profiles:", err);
            setError(err.message || "Failed to load payment profiles");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfiles();
        }, [fetchProfiles])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfiles(false);
    }, [fetchProfiles]);

    const handleAddProfile = () => {
        router.push("/dashboard/payments/profiles/create");
    };

    const handleEditProfile = (profileId: string) => {
        router.push(`/dashboard/payments/profiles/${profileId}/edit` as any);
    };

    const handleDeleteProfile = (profileId: string, profileName: string) => {
        setDeleteConfirm({ id: profileId, name: profileName });
        deleteSheetRef.current?.open();
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        try {
            deleteSheetRef.current?.close();
            setDeleting(true);
            setError(null);
            await deletePaymentProfile(deleteConfirm.id);
            setSuccessMessage(`"${deleteConfirm.name}" deleted successfully.`);
            setDeleteConfirm(null);
            fetchProfiles(false);
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to delete payment profile.";
            setError(message);
            setDeleteConfirm(null);
        } finally {
            setDeleting(false);
        }
    };

    const getStatusStyle = (_status: string, isVerified: boolean) => {
        if (isVerified) {
            return {
                badgeBg: "#34D3991A",
                badgeBorder: "#34D399",
                badgeText: "#16A34A",
                text: "Verified",
                cardBorder: "#34D399",
            };
        }

        return {
            badgeBg: colors.accent + "1A",
            badgeBorder: colors.accent + "66",
            badgeText: colors.accent,
            text: "Failed",
            cardBorder: colors.accent + "66",
        };
    };

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Payment Profiles" />

                <View className="flex-1">
                    {/* Loading State */}
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-black mt-4" style={{ opacity: 0.6 }}>
                                Loading payment profiles...
                            </AppText>
                        </View>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <View className="p-2 pb-10 gap-6">
                                {/* Page Header */}
                                <View>
                                    <AppText styles="text-sm text-black" style={{ opacity: 0.7 }}>
                                        Manage your payout methods
                                    </AppText>
                                </View>

                                {/* Info Card */}
                                <View
                                    className="p-4 rounded-xl border"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <Ionicons name="information-circle" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1">
                                                About Payment Profiles
                                            </AppText>
                                            <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                                                Payment profiles are used to receive payouts from your event sales. Add your
                                                bank account details to get paid. This is only required if you plan to sell tickets and receive payouts.
                                            </AppText>
                                        </View>
                                    </View>
                                </View>

                                {/* Add Profile Button */}
                                <TouchableOpacity
                                    onPress={handleAddProfile}
                                    className="flex-row items-center justify-center gap-2 px-6 py-4 rounded-xl"
                                    style={{ backgroundColor: colors.accent }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="add-circle" size={20} color={colors.white} />
                                    <AppText styles="text-sm text-white">
                                        Add Payment Profile
                                    </AppText>
                                </TouchableOpacity>

                                <View
                                    className="p-4 rounded-xl border"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <Ionicons name="alert-circle-outline" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                                        <AppText styles="text-xs text-slate-200 flex-1">
                                            You cannot delete a default payment profile. Add another profile and set it as
                                            default before deleting the current default profile.
                                        </AppText>
                                    </View>
                                </View>

                                {/* Error State */}
                                {error && (
                                    <View
                                        className="p-4 rounded-xl border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                    >
                                        <AppText styles="text-sm text-white text-center">
                                            {error}
                                        </AppText>
                                    </View>
                                )}
                                {successMessage && (
                                    <View
                                        className="p-4 rounded-xl border"
                                        style={{ backgroundColor: "#DCFCE7", borderColor: "#16653466" }}
                                    >
                                        <AppText styles="text-sm text-center" style={{ color: "#166534" }}>
                                            {successMessage}
                                        </AppText>
                                    </View>
                                )}

                                {/* Profiles List */}
                                {profiles.length === 0 ? (
                                    <View
                                        className="p-12 rounded-xl border-2 items-center"
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                    >
                                        <View
                                            className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                                            style={{ backgroundColor: colors.accent + "33" }}
                                        >
                                            <Ionicons name="wallet-outline" size={40} color={colors.accent50} />
                                        </View>
                                        <AppText styles="text-base text-white mb-3 text-center">
                                            No Payment Profiles Yet
                                        </AppText>
                                        <AppText styles="text-sm text-slate-200 text-center" style={{ maxWidth: 300 }}>
                                            Add a payment profile to start receiving payouts from your event sales.
                                        </AppText>
                                    </View>
                                ) : (
                                    <View className="gap-4">
                                        {profiles.map((profile) => {
                                            const status = getStatusStyle(profile.status, profile.is_verified);

                                            return (
                                                <View
                                                    key={profile.id}
                                                    className="rounded-xl border-2 p-4"
                                                    style={{
                                                        backgroundColor: profile.is_default
                                                            ? colors.accent + "1A"
                                                            : colors.white,
                                                        borderColor: profile.is_default
                                                            ? colors.accent
                                                            : status.cardBorder,
                                                    }}
                                                >
                                                    {/* Header */}
                                                    <View className="flex-row items-start justify-between mb-3">
                                                        <View className="flex-1">
                                                            <View className="flex-row items-center gap-2 mb-2">
                                                                <AppText styles="text-base font-nunbold" style={{ color: colors.primary }}>
                                                                    {profile.name}
                                                                </AppText>
                                                                {profile.is_default && (
                                                                    <View
                                                                        className="px-2 py-0.5 rounded"
                                                                        style={{ backgroundColor: colors.accent }}
                                                                    >
                                                                        <AppText styles="text-xs text-white">
                                                                            Default
                                                                        </AppText>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </View>

                                                        <View
                                                            className="px-3 py-1 rounded-lg border"
                                                            style={{
                                                                backgroundColor: status.badgeBg,
                                                                borderColor: status.badgeBorder,
                                                            }}
                                                        >
                                                            <AppText
                                                                styles="text-xs"
                                                                style={{ color: status.badgeText }}
                                                            >
                                                                {status.text}
                                                            </AppText>
                                                        </View>
                                                    </View>

                                                    {/* Account Details */}
                                                    <View className="gap-2 mb-4">
                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="person-outline"
                                                                size={14}
                                                                color={colors.primary}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-black"
                                                            >
                                                                {profile.account_details.account_name}
                                                            </AppText>
                                                        </View>

                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="business-outline"
                                                                size={14}
                                                                color={colors.primary}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-black"
                                                            >
                                                                {profile.account_details.bank_name}
                                                            </AppText>
                                                        </View>

                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="card-outline"
                                                                size={14}
                                                                color={colors.primary}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-black"
                                                            >
                                                                {profile.account_details.account_number}
                                                            </AppText>
                                                        </View>
                                                    </View>

                                                    {/* Actions */}
                                                    <View className="flex-row gap-3 pt-3">
                                                        <TouchableOpacity
                                                            onPress={() => handleEditProfile(profile.id)}
                                                            className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl border-2"
                                                            style={{
                                                                backgroundColor: colors.white,
                                                                borderColor: colors.primary + "55",
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Ionicons name="create-outline" size={16} color={colors.primary} />
                                                            <AppText styles="text-sm" style={{ color: colors.primary }}>
                                                                Edit
                                                            </AppText>
                                                        </TouchableOpacity>

                                                        {!profile.is_default && (
                                                            <TouchableOpacity
                                                                onPress={() => handleDeleteProfile(profile.id, profile.name)}
                                                                className="px-4 py-3 rounded-xl border-2"
                                                                style={{
                                                                    backgroundColor: colors.accent + "1A",
                                                                    borderColor: colors.accent,
                                                                }}
                                                                activeOpacity={0.8}
                                                            >
                                                                <Ionicons name="trash-outline" size={16} color={colors.accent} />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>

                <AppBottomSheet ref={deleteSheetRef} customSnapPoints={["40%"]}>
                    {deleteConfirm && (
                        <ConfirmAction
                            title="Delete Payment Profile?"
                            desc={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
                            onCancel={() => {
                                deleteSheetRef.current?.close();
                                setDeleteConfirm(null);
                            }}
                            onConfirm={handleDeleteConfirm}
                            confirmBtnTitle={deleting ? "Deleting..." : "Yes, Delete"}
                            isDestructive={true}
                        />
                    )}
                </AppBottomSheet>
            </RequireAuth>
        </Screen>
    );
};

export default PaymentProfilesScreen;
