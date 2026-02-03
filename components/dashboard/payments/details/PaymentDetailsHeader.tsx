import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    payment: PaymentDetails;
};

const PaymentDetailsHeader = ({ payment }: Props) => {
    const getStatusConfig = () => {
        switch (payment.status) {
            case "completed":
                return {
                    icon: "checkmark-circle" as const,
                    text: "Completed",
                    bg: "bg-emerald-500/20",
                    textColor: "text-emerald-400",
                    border: "border-emerald-500/30",
                    iconColor: colors.success,
                };
            case "pending":
                return {
                    icon: "time" as const,
                    text: "Pending",
                    bg: "bg-amber-500/20",
                    textColor: "text-amber-400",
                    border: "border-amber-500/30",
                    iconColor: colors.warning,
                };
            case "failed":
                return {
                    icon: "close-circle" as const,
                    text: "Failed",
                    bg: "bg-red-500/20",
                    textColor: "text-red-400",
                    border: "border-red-500/30",
                    iconColor: colors.accent,
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent mb-4">
            {/* Header Row */}
            <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1 mr-3">
                    <AppText styles="text-xl text-white mb-2" font="font-ibold">
                        Payment Details
                    </AppText>
                    <View className="flex-row items-center flex-wrap">
                        <AppText styles="text-xs text-slate-300 mr-1" font="font-iregular">
                            Reference:
                        </AppText>
                        <AppText styles="text-xs text-accent-50 font-mono" font="font-imedium">
                            {payment.reference}
                        </AppText>
                    </View>
                </View>

                {/* Status Badge */}
                <View
                    className={`flex-row items-center gap-1.5 px-3 py-2 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}
                >
                    <Ionicons name={statusConfig.icon} size={16} color={statusConfig.iconColor} />
                    <AppText styles={`text-xs ${statusConfig.textColor}`} font="font-ibold">
                        {statusConfig.text}
                    </AppText>
                </View>
            </View>

            {/* Amount Card */}
            <View className="p-4 bg-primary-200 rounded-xl border border-accent/30">
                <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                    Total Amount Paid
                </AppText>
                <AppText styles="text-3xl text-white" font="font-ibold">
                    GH₵{" "}
                    {parseFloat(payment.amount).toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                    })}
                </AppText>
            </View>
        </View>
    );
};

export default PaymentDetailsHeader;