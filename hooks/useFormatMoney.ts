import { useCurrency } from "@/context/CurrencyContext";
import { formatNumber } from "@/utils/format";

type FormatMoneyOptions = {
    compact?: boolean;
    trimTrailingZeros?: boolean;
};

/**
 * A hook that returns a function to format monetary values based on the current currency context.
 * 
 * @returns A function `(ghsAmount: string | number) => string` that converts and formats the amount.
 * 
 * @example
 * const formatMoney = useFormatMoney();
 * return <Text>{formatMoney(100)}</Text>;
 */
export const useFormatMoney = () => {
    const { convertFromGHS, formatCurrency, displayCurrency } = useCurrency();

    const formatMoney = (ghsAmount: string | number, options?: FormatMoneyOptions) => {
        const amount = typeof ghsAmount === 'string' ? parseFloat(ghsAmount) : ghsAmount;

        // Handle invalid numbers gracefully
        if (isNaN(amount)) {
            return options?.compact ? `${displayCurrency} 0` : formatCurrency(0);
        }

        const localAmount = convertFromGHS(amount);

        if (options?.compact) {
            const isNegative = localAmount < 0;
            const compactValue = formatNumber(Math.abs(localAmount));
            return `${isNegative ? "-" : ""}${displayCurrency} ${compactValue}`;
        }

        const formatted = formatCurrency(localAmount);
        if (options?.trimTrailingZeros) {
            return formatted.replace(/\.00$/, "");
        }

        return formatted;
    };

    return formatMoney;
};
