import { ISO_TO_PAYSTACK } from "@/data/countryMappings";

export type DetectedCountry = {
    code: string;
    name: string;
    countryCode: string;
};

const GEO_ENDPOINTS = [
    "https://ipapi.co/json/",
    "https://ipwho.is/",
    "http://ip-api.com/json",
];

const parseDetectedCountry = (data: any): DetectedCountry | null => {
    const rawIso = data?.country_code || data?.countryCode || data?.country;
    const rawName = data?.country_name || data?.countryName || data?.country;

    if (!rawIso || !rawName) return null;

    const isoCode = String(rawIso).toLowerCase();
    const paystackCode = ISO_TO_PAYSTACK[isoCode] || isoCode;

    return {
        code: paystackCode,
        name: String(rawName),
        countryCode: isoCode.toUpperCase(),
    };
};

export const detectUserCountry = async (): Promise<DetectedCountry | null> => {
    for (const endpoint of GEO_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, {
                cache: "no-store",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) continue;

            const contentType = response.headers.get("content-type") || "";
            if (!contentType.toLowerCase().includes("application/json")) continue;

            const rawText = await response.text();
            let data: any;
            try {
                data = JSON.parse(rawText);
            } catch {
                continue;
            }

            const detected = parseDetectedCountry(data);
            if (detected) return detected;
        } catch {
            // Try the next provider.
        }
    }

    console.warn("Country detection failed across providers. Falling back to default.");
    return null;
};

export const getPaystackCode = (isoCode: string): string => {
    return ISO_TO_PAYSTACK[isoCode.toLowerCase()] || isoCode.toLowerCase();
};
