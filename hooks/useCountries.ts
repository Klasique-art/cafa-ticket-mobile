import { useState, useEffect } from "react";
import { getPaystackCode } from "@/utils/countryUtils";

type Country = {
    name: string;
    code: string;
    flag?: string;
};

type CountryOption = {
    label: string;
    value: string;
};

/**
 * Fetch all countries from restcountries.com API
 */
export const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    "https://restcountries.com/v3.1/all?fields=name,cca2"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch countries");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const countryList = data
                        .map((country: any) => ({
                            name: country.name.common,
                            code: getPaystackCode(country.cca2),
                        }))
                        .sort((a, b) => a.name.localeCompare(b.name));

                    setCountries(countryList);
                } else {
                    throw new Error("Invalid response");
                }
            } catch (err) {
                console.error("Failed to fetch countries:", err);

                // Fallback to common African countries
                setCountries([
                    { name: "Ghana", code: "ghana" },
                    { name: "Nigeria", code: "nigeria" },
                    { name: "Kenya", code: "kenya" },
                    { name: "South Africa", code: "south-africa" },
                ]);

                setError("Using fallback country list");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const countryOptions: CountryOption[] = countries.map((country) => ({
        label: country.name,
        value: country.code,
    }));

    return { countries, countryOptions, isLoading, error };
};