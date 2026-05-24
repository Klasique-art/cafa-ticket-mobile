import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { isAxiosError } from "axios";

import { Screen, AppText, Nav, AppForm, AppFormField, SubmitButton, FormLoader } from "@/components";
import { bankTransferValidation } from "@/data/validationSchema";
import { useBankForm } from "@/hooks/useBankForm";
import { useCountries } from "@/hooks/useCountries";
import { createPaymentProfile } from "@/lib/dashboard";
import colors from "@/config/colors";

type FormFieldsProps = {
  bankOptions: { label: string; value: string }[];
  isLoadingBanks: boolean;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  isDetectingCountry: boolean;
};

const extractPaymentProfileErrorMessage = (err: any): string => {
  if (err?.response?.data) {
    const data = err.response.data;
    const details = data.details;

    const pickFirstErrorMessage = (value: any): string | null => {
      if (!value) return null;
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first === "string" && first.trim()) return first;
        if (first && typeof first === "object") {
          return pickFirstErrorMessage(Object.values(first)[0]);
        }
      }
      if (typeof value === "object") {
        const firstValue = Object.values(value)[0];
        return pickFirstErrorMessage(firstValue);
      }
      return null;
    };

    // Common backend validation shape: { details: { account_details: { ... } } }
    const detailsMessage = pickFirstErrorMessage(details);
    if (detailsMessage) return detailsMessage;

    // Fallback legacy shape support
    const accountDetails = data.account_details;
    const accountMessage = pickFirstErrorMessage(accountDetails);
    if (accountMessage) return accountMessage;

    const topLevelMessage = pickFirstErrorMessage(data);
    if (topLevelMessage && topLevelMessage !== "The data provided is invalid") {
      return topLevelMessage;
    }

    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.error === "string" && data.error.trim()) return data.error;
    if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
  }

  if (err?.message === "Network Error") {
    return "Network error. Please check your internet connection and try again.";
  }

  return err instanceof Error ? err.message : "Failed to create payment profile";
};

const logPaymentProfileCreateError = (err: unknown) => {
  if (!isAxiosError(err)) {
    console.error("[CreatePaymentProfile] Non-axios error:", err);
    return;
  }

  const method = err.config?.method?.toUpperCase() || "POST";
  const url = err.config?.url || "/auth/payment-profile/";
  const status = err.response?.status ?? "NO_STATUS";
  const responseData = err.response?.data ?? null;

  console.error(`[CreatePaymentProfile] ${status} ${method} ${url}`, {
    code: err.code ?? null,
    message: err.message,
    responseData,
  });
};

// Inner component that has access to Formik context
const FormFields = ({
  bankOptions,
  isLoadingBanks,
  selectedCountry,
  setSelectedCountry,
  isDetectingCountry,
}: FormFieldsProps) => {
  const { values } = useFormikContext<Record<string, string>>();
  const { countryOptions, isLoading: isLoadingCountries } = useCountries();

  // Sync form's country field with bank fetching
  useEffect(() => {
    if (values.country && values.country !== selectedCountry) {
      setSelectedCountry(values.country);
    }
  }, [values.country, selectedCountry, setSelectedCountry]);

  return (
    <>
      <AppFormField
        type="text"
        name="name"
        label="Profile Name"
        placeholder="e.g., My Primary Bank Account"
        required
      />

      <AppFormField
        type="text"
        name="description"
        label="Description (Optional)"
        placeholder="e.g., Primary account for receiving event payments"
        multiline
        rows={3}
      />

      <AppFormField
        type="searchable-select"
        name="country"
        label="Country"
        labelColor="text-white"
        options={countryOptions}
        placeholder={isDetectingCountry ? "Detecting your country..." : "Search for your country..."}
        isLoading={isDetectingCountry || isLoadingCountries}
        required
      />

      <AppFormField
        type="searchable-select"
        name="bank_name"
        label="Bank Name"
        labelColor="text-white"
        options={bankOptions}
        placeholder={
          isLoadingBanks
            ? "Loading banks..."
            : bankOptions.length === 0
              ? "No banks available for this country"
              : "Search for your bank..."
        }
        isLoading={isLoadingBanks}
        required
      />

      <AppFormField
        type="text"
        name="account_number"
        label="Account Number"
        placeholder="Enter your bank account number"
        keyboardType="numeric"
        required
      />

      <AppFormField
        type="text"
        name="branch"
        label="Branch (Optional)"
      />

      <AppFormField
        type="text"
        name="routing_number"
        label="ABA/SWIFT/Routing Number (Optional)"
      />

      <View className="p-4 bg-info/10 rounded-lg border border-accent">
        <AppText styles="text-xs text-blue-300">
          <AppText styles="text-xs text-blue-300 font-nunbold">
            Verification:{" "}
          </AppText>
          Your bank account will be verified automatically. This is free and takes 5-10 seconds.
        </AppText>
      </View>

      <SubmitButton title="Create Bank Account Profile" />
    </>
  );
};

const CreatePaymentProfileScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    bankOptions,
    isLoadingBanks,
    selectedCountry,
    setSelectedCountry,
    isDetectingCountry,
    getBankFromCode,
  } = useBankForm();

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const bank = getBankFromCode(values.bank_name);

      if (!bank) {
        throw new Error("Invalid bank selected. Please try again.");
      }

      const payload = {
        method: "bank_transfer" as const,
        name: values.name,
        description: values.description || "",
        account_details: {
          account_number: values.account_number,
          bank_name: bank.name,
          bank_code: bank.code,
          branch: values.branch || "",
        },
      };

      await createPaymentProfile(payload);

      // Navigate back to payment profiles list
      router.back();
    } catch (err) {
      logPaymentProfileCreateError(err);
      setError(extractPaymentProfileErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen statusBarStyle="light-content" className="bg-primary" statusBarBg={colors.primary}>
      <Nav title="Create Payment Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-primary-100 rounded-xl p-4 border-2 border-accent mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 rounded-xl bg-info/20 items-center justify-center">
                <Ionicons name="business" size={24} color={colors.info} />
              </View>
              <View className="flex-1">
                <AppText styles="text-lg text-white font-nunbold">
                  Create Bank Account Profile
                </AppText>
                <AppText styles="text-xs text-slate-400">
                  Add your bank account for receiving payouts
                </AppText>
              </View>
            </View>
          </View>

          {error && (
            <View className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <View className="flex-row items-center gap-2">
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <AppText styles="text-sm text-red-400 flex-1 font-nunbold">
                  {error}
                </AppText>
              </View>
            </View>
          )}

          <AppForm
            initialValues={{
              name: "",
              description: "",
              account_number: "",
              country: selectedCountry,
              bank_name: "",
              branch: "",
              routing_number: "",
            }}
            validationSchema={bankTransferValidation}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <FormFields
              bankOptions={bankOptions}
              isLoadingBanks={isLoadingBanks}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              isDetectingCountry={isDetectingCountry}
            />
          </AppForm>
        </ScrollView>
      </KeyboardAvoidingView>

      <FormLoader visible={isSubmitting} />
    </Screen>
  );
};

export default CreatePaymentProfileScreen;
