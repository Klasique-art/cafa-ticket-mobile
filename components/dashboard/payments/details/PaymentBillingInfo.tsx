import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    billing: PaymentDetails["billing_info"];
};

const PaymentBillingInfo = ({ billing }: Props) => {
    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent/30 mb-4">
            <AppText styles="text-lg text-white mb-4" font="font-ibold">
                Billing Information
            </AppText>

            <View className="gap-3">
                {/* Name */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-blue-500/20 items-center justify-center">
                        <Ionicons name="person" size={20} color={colors.info} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Name
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            {billing.name}
                        </AppText>
                    </View>
                </View>

                {/* Email */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-emerald-500/20 items-center justify-center">
                        <Ionicons name="mail" size={20} color={colors.success} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Email
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            {billing.email}
                        </AppText>
                    </View>
                </View>

                {/* Phone */}
                <View className="flex-row items-start gap-3 p-3 bg-primary-200 rounded-lg border border-accent/20">
                    <View className="w-10 h-10 rounded-lg bg-purple-500/20 items-center justify-center">
                        <Ionicons name="call" size={20} color="#A78BFA" />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                            Phone
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            {billing.phone}
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentBillingInfo;