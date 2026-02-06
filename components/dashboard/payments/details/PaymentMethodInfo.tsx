import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    payment: PaymentDetails;
};

const PaymentMethodInfo = ({ payment }: Props) => {
    const getPaymentMethodIcon = (): keyof typeof Ionicons.glyphMap => {
        if (payment.payment_method === "card") return "card";
        if (payment.payment_method === "mobile_money") return "phone-portrait";
        return "card";
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent/30 mb-4">
            <AppText styles="text-lg text-black mb-4" font="font-ibold">
                Payment Method
            </AppText>

            <View className="flex-row gap-3 p-4 bg-primary-200 rounded-xl border border-accent/20">
                {/* Icon */}
                <View className="w-12 h-12 rounded-lg bg-blue-500/20 items-center justify-center shrink-0">
                    <Ionicons name={getPaymentMethodIcon()} size={24} color={colors.info} />
                </View>

                {/* Details */}
                <View className="flex-1">
                    <AppText styles="text-base text-black mb-1 capitalize" font="font-ibold">
                        {payment.payment_method.replace("_", " ")}
                    </AppText>
                    <AppText styles="text-sm text-slate-300 mb-2" font="font-iregular">
                        Provider:{" "}
                        <AppText styles="text-sm text-black capitalize" font="font-isemibold">
                            {payment.provider}
                        </AppText>
                    </AppText>

                    {/* Card Details */}
                    {payment.card_details && (
                        <View className="pt-2 mt-2 border-t border-accent/20">
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                                {payment.card_details.brand} •••• {payment.card_details.last4}
                            </AppText>
                            <AppText styles="text-xs text-slate-400" font="font-iregular">
                                Expires: {payment.card_details.exp_month}/{payment.card_details.exp_year}
                            </AppText>
                        </View>
                    )}

                    {/* Timestamps */}
                    <View className="pt-2 mt-2 border-t border-accent/20">
                        <View className="mb-2">
                            <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                Created
                            </AppText>
                            <AppText styles="text-xs text-slate-300" font="font-iregular">
                                {formatDateTime(payment.created_at)}
                            </AppText>
                        </View>

                        {payment.completed_at && (
                            <View>
                                <AppText styles="text-xs text-slate-400 mb-0.5" font="font-iregular">
                                    Completed
                                </AppText>
                                <AppText styles="text-xs text-emerald-400" font="font-iregular">
                                    {formatDateTime(payment.completed_at)}
                                </AppText>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentMethodInfo;