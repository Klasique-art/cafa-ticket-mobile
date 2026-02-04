import { useCurrency } from "@/context/CurrencyContext";

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
    const { convertFromGHS, formatCurrency } = useCurrency();

    const formatMoney = (ghsAmount: string | number) => {
        const amount = typeof ghsAmount === 'string' ? parseFloat(ghsAmount) : ghsAmount;

        // Handle invalid numbers gracefully
        if (isNaN(amount)) {
            return formatCurrency(0);
        }

        const localAmount = convertFromGHS(amount);
        return formatCurrency(localAmount);
    };

    return formatMoney;
};
