import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

type ExchangeRates = Record<string, number>;

type CurrencyContextType = {
    displayCurrency: string;
    setDisplayCurrency: (currency: string) => void;
    exchangeRates: ExchangeRates;
    isLoading: boolean;
    error: string | null;
    convertFromGHS: (ghsAmount: number, toCurrency?: string) => number;
    convertToGHS: (amount: number, fromCurrency?: string) => number;
    formatCurrency: (amount: number, currency?: string) => string;
    getCurrencySymbol: (currency: string) => string;
    getAllCurrencies: () => string[];
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// ✅ Cache key for localStorage
const CACHE_KEY = 'cafa_exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [displayCurrency, setDisplayCurrency] = useState('GHS');
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ 'GHS': 1.0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ FIXED: Better currency detection using IP geolocation
    useEffect(() => {
        const detectCurrency = async (): Promise<string> => {
            try {

                // ✅ Method 1: Try IP-based geolocation (most accurate)
                try {
                    console.log('🌍 Detecting location via IP...');
                    const geoResponse = await fetch('https://ipapi.co/json/', {
                        signal: AbortSignal.timeout(3000) // 3 second timeout
                    });

                    if (geoResponse.ok) {
                        const geoData = await geoResponse.json();
                        const countryCode = geoData.country_code; // e.g., "GH", "NG", "US"

                        // Map country code to currency
                        const countryToCurrency: Record<string, string> = {
                            'GH': 'GHS', // Ghana
                            'NG': 'NGN', // Nigeria
                            'US': 'USD',
                            'GB': 'GBP',
                            'FR': 'EUR',
                            'DE': 'EUR',
                            'ES': 'EUR',
                            'IT': 'EUR',
                            'NL': 'EUR',
                            'BE': 'EUR',
                            'JP': 'JPY',
                            'CN': 'CNY',
                            'IN': 'INR',
                            'ZA': 'ZAR', // South Africa
                            'KE': 'KES', // Kenya
                            'CA': 'CAD',
                            'AU': 'AUD',
                            'NZ': 'NZD',
                            'BR': 'BRL',
                            'MX': 'MXN',
                        };

                        if (countryCode && countryToCurrency[countryCode]) {
                            console.log('✅ Currency from IP:', countryToCurrency[countryCode]);
                            return countryToCurrency[countryCode];
                        }
                    }
                } catch (geoError) {
                    console.warn('⚠️ IP geolocation failed, using fallback');
                }

                // ✅ Method 2: Use timezone as fallback (less accurate but better than locale)
                try {
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    console.log('🕐 Timezone:', timezone);

                    // Ghana timezones
                    if (timezone === 'Africa/Accra') {
                        console.log('✅ Currency from timezone: GHS');
                        return 'GHS';
                    }

                    // Other African countries
                    if (timezone.startsWith('Africa/Lagos')) return 'NGN'; // Nigeria
                    if (timezone.startsWith('Africa/Nairobi')) return 'KES'; // Kenya
                    if (timezone.startsWith('Africa/Johannesburg')) return 'ZAR'; // South Africa

                    // Other regions
                    if (timezone.startsWith('America/New_York') || timezone.startsWith('America/Los_Angeles')) return 'USD';
                    if (timezone.startsWith('Europe/London')) return 'GBP';
                    if (timezone.startsWith('Europe/')) return 'EUR';
                    if (timezone.startsWith('Asia/Tokyo')) return 'JPY';
                    if (timezone.startsWith('Asia/Shanghai') || timezone.startsWith('Asia/Hong_Kong')) return 'CNY';
                    if (timezone.startsWith('Asia/Kolkata')) return 'INR';
                } catch (tzError) {
                    console.warn('⚠️ Timezone detection failed');
                }

                // ✅ Method 3: Browser locale (least reliable, last resort)
                const locale = navigator.language || 'en-GH';
                console.log('🌐 Browser locale:', locale);

                const currencyMap: Record<string, string> = {
                    'en-GH': 'GHS',
                    'en-NG': 'NGN',
                    'en-US': 'USD',
                    'en-GB': 'GBP',
                    'fr-FR': 'EUR',
                    'de-DE': 'EUR',
                    'es-ES': 'EUR',
                    'ja-JP': 'JPY',
                    'zh-CN': 'CNY',
                    'en-IN': 'INR',
                    'en-ZA': 'ZAR',
                    'en-KE': 'KES',
                    'en-CA': 'CAD',
                    'en-AU': 'AUD',
                };

                if (currencyMap[locale]) {
                    console.log('✅ Currency from locale:', currencyMap[locale]);
                    return currencyMap[locale];
                }

                // Default to GHS for Cafa Tickets (Ghana-based platform)
                console.log('✅ Using default: GHS');
                return 'GHS';
            } catch (error) {
                console.error('❌ Currency detection failed:', error);
                return 'GHS'; // Default to GHS
            }
        };

        // Detect and set currency
        detectCurrency().then(currency => {
            setDisplayCurrency(currency);
        });
    }, []);

    // ✅ Fetch exchange rates from API
    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check cache first
                const cachedData = await storage.getItem(CACHE_KEY);
                if (cachedData) {
                    const { rates, timestamp } = JSON.parse(cachedData);
                    const now = Date.now();

                    // Use cached data if less than 24 hours old
                    if (now - timestamp < CACHE_DURATION) {
                        console.log('✅ Using cached exchange rates');
                        setExchangeRates(rates);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh rates
                console.log('🔄 Fetching fresh exchange rates...');

                // ✅ Replace with your actual API key
                const API_KEY = process.env.EXPO_PUBLIC_EXCHANGE_RATE_API_KEY || '';

                const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/GHS`;

                const response = await fetch(url);

                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'No error text');
                    console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
                    throw new Error(`Failed to fetch exchange rates: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (data.result === 'success') {
                    const rates = data.conversion_rates as ExchangeRates;

                    // Cache the rates
                    await storage.setItem(CACHE_KEY, JSON.stringify({
                        rates,
                        timestamp: Date.now(),
                    }));

                    setExchangeRates(rates);
                } else {
                    throw new Error(data.error || 'API error');
                }
            } catch (err) {
                console.error('❌ Failed to fetch exchange rates:', err);
                setError('Failed to load exchange rates');

                // Use fallback rates for critical currencies
                setExchangeRates({
                    'GHS': 1.0,
                    'USD': 0.092,
                    'GBP': 0.069,
                    'EUR': 0.075,
                    'NGN': 131.59,
                    'ZAR': 1.56,
                    'KES': 11.81,
                    'CAD': 0.129,
                    'AUD': 0.141,
                    'INR': 7.82,
                    'JPY': 14.36,
                    'CNY': 0.67,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    // ✅ Convert from GHS to any currency
    const convertFromGHS = (ghsAmount: number, toCurrency?: string): number => {
        const targetCurrency = toCurrency || displayCurrency;
        const rate = exchangeRates[targetCurrency] || 1;
        return ghsAmount * rate;
    };

    // ✅ Convert from any currency to GHS
    const convertToGHS = (amount: number, fromCurrency?: string): number => {
        const sourceCurrency = fromCurrency || displayCurrency;
        const rate = exchangeRates[sourceCurrency] || 1;
        return amount / rate;
    };

    // ✅ Format currency with proper symbol and locale
    const formatCurrency = (amount: number, currency?: string): string => {
        const curr = currency || displayCurrency;

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: curr,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch (error) {
            // Fallback if currency code is invalid
            return `${curr} ${amount.toFixed(2)}`;
        }
    };

    // ✅ Get currency symbol
    const getCurrencySymbol = (currency: string): string => {
        try {
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(0);

            // Extract symbol (remove digits and spaces)
            return formatted.replace(/[0-9,.\s]/g, '');
        } catch (error) {
            // Common fallbacks
            const symbols: Record<string, string> = {
                'GHS': 'GH₵',
                'USD': '$',
                'GBP': '£',
                'EUR': '€',
                'NGN': '₦',
                'JPY': '¥',
                'CNY': '¥',
                'INR': '₹',
            };
            return symbols[currency] || currency;
        }
    };

    // ✅ Get all available currencies
    const getAllCurrencies = (): string[] => {
        return Object.keys(exchangeRates).sort();
    };

    // ✅ Save user preference when they manually change currency
    const handleSetDisplayCurrency = async (currency: string) => {
        setDisplayCurrency(currency);
        await storage.setItem('user_preferred_currency', currency);
    };

    return (
        <CurrencyContext.Provider
            value={{
                displayCurrency,
                setDisplayCurrency: handleSetDisplayCurrency,
                exchangeRates,
                isLoading,
                error,
                convertFromGHS,
                convertToGHS,
                formatCurrency,
                getCurrencySymbol,
                getAllCurrencies,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
};