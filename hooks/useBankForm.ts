import { useState, useEffect } from "react";
import client from "@/lib/client";

type Bank = {
    name: string;
    code: string;
    country: string;
};

export const useBankForm = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoadingBanks, setIsLoadingBanks] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isDetectingCountry, setIsDetectingCountry] = useState(true);

    // Detect user's country on mount
    useEffect(() => {
        const detectCountry = async () => {
            setIsDetectingCountry(true);

            try {
                // Option 1: Use IP geolocation service
                const response = await fetch("https://ipapi.co/json/");
                const data = await response.json();

                if (data.country_code) {
                    const countryCode = data.country_code.toLowerCase();
                    setSelectedCountry(countryCode);
                    console.log(`✅ Detected country: ${data.country_name} (${countryCode})`);
                } else {
                    setSelectedCountry("gh"); // Fallback to Ghana
                    console.log("⚠️ Could not detect country, defaulting to Ghana");
                }
            } catch (error) {
                console.error("Country detection error:", error);
                setSelectedCountry("gh"); // Fallback to Ghana
            } finally {
                setIsDetectingCountry(false);
            }
        };

        detectCountry();
    }, []);

    // Fetch banks when country changes
    useEffect(() => {
        if (isDetectingCountry || !selectedCountry) return;

        const fetchBanks = async () => {
            setIsLoadingBanks(true);
            try {
                // Replace with your actual backend endpoint
                const response = await client.get(`/payments/banks/?country=${selectedCountry}`);

                if (response.data && response.data.banks) {
                    setBanks(response.data.banks);
                    console.log(`✅ Loaded ${response.data.banks.length} banks for ${selectedCountry}`);
                } else {
                    setBanks([]);
                }
            } catch (err) {
                console.error("Failed to fetch banks:", err);
                setBanks([]);
            } finally {
                setIsLoadingBanks(false);
            }
        };

        fetchBanks();
    }, [selectedCountry, isDetectingCountry]);

    const bankOptions = banks.map((bank) => ({
        label: bank.name,
        value: bank.code,
    }));

    const getBankFromCode = (bankCode: string) => {
        return banks.find((b) => b.code === bankCode);
    };

    const handleCountryChange = (newCountry: string) => {
        setSelectedCountry(newCountry);
    };

    return {
        banks,
        bankOptions,
        isLoadingBanks,
        selectedCountry,
        setSelectedCountry: handleCountryChange,
        isDetectingCountry,
        getBankFromCode,
    };
};