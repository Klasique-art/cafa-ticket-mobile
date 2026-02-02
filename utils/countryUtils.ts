import { ISO_TO_PAYSTACK } from "@/data/countryMappings";

export type DetectedCountry = {
    code: string;
    name: string;
    countryCode: string;
};

export const detectUserCountry = async (): Promise<DetectedCountry | null> => {
    try {
        const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        if (!response.ok) throw new Error('Geolocation failed');
        
        const data = await response.json();

        if (data.country_code && data.country_name) {
            const isoCode = data.country_code.toLowerCase();
            const paystackCode = ISO_TO_PAYSTACK[isoCode] || isoCode;
            
            return {
                code: paystackCode,
                name: data.country_name,
                countryCode: data.country_code.toUpperCase(),
            };
        }

        return null;
    } catch (error) {
        console.error('❌ Country detection failed:', error);
        return null;
    }
};

export const getPaystackCode = (isoCode: string): string => {
    return ISO_TO_PAYSTACK[isoCode.toLowerCase()] || isoCode.toLowerCase();
};