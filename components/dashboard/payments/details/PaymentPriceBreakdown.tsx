import { View } from "react-native";

import AppText from "../../../ui/AppText";
import { PaymentDetails } from "@/types/payments.types";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    breakdown: PaymentDetails["breakdown"];
};

const PaymentPriceBreakdown = ({ breakdown }: Props) => {
    const formatMoney = useFormatMoney();
    return (
        <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent/30 mb-4">
            <AppText styles="text-lg text-white mb-4" font="font-ibold">
                Price Breakdown
            </AppText>

            <View className="gap-3">
                {/* Subtotal */}
                <View className="flex-row items-center justify-between pb-3 border-b border-accent/20">
                    <AppText styles="text-sm text-slate-300" font="font-iregular">
                        Subtotal
                    </AppText>
                    <AppText styles="text-base text-white" font="font-isemibold">
                        {formatMoney(breakdown.subtotal)}
                    </AppText>
                </View>

                {/* Service Fee */}
                <View className="flex-row items-center justify-between pb-3 border-b border-accent/20">
                    <AppText styles="text-sm text-slate-300" font="font-iregular">
                        Service Fee
                    </AppText>
                    <AppText styles="text-base text-slate-300" font="font-isemibold">
                        {formatMoney(breakdown.service_fee)}
                    </AppText>
                </View>

                {/* Total */}
                <View className="flex-row items-center justify-between pt-3">
                    <AppText styles="text-lg text-white" font="font-ibold">
                        Total
                    </AppText>
                    <AppText styles="text-2xl text-accent-50" font="font-ibold">
                        {formatMoney(breakdown.total)}
                    </AppText>
                </View>
            </View>
        </View>
    );
};

export default PaymentPriceBreakdown;