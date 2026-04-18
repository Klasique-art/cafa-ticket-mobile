import client from "./client";
import * as Sentry from '@sentry/react-native';
import type { UserSettings } from "@/types";
import { captureAxiosContext, isAxios4xx, isAxiosAuthError, logAxiosError } from "@/utils/axiosError";

// =====================
// Security Settings
// =====================

export async function changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
}) {
    try {
        const response = await client.post("/auth/change-password/", data);
        return response.data;
    } catch (error) {
        logAxiosError("changePassword error", error);
        if (!isAxios4xx(error)) {
            Sentry.captureException(error, { extra: captureAxiosContext(error) });
        }
        if (isAxiosAuthError(error)) {
            throw new Error("Authentication required");
        }
        throw error;
    }
}

export async function changeEmail(data: {
    new_email: string;
    password: string;
}) {
    try {
        const response = await client.post("/auth/update-email/", data);
        return response.data;
    } catch (error) {
        logAxiosError("changeEmail error", error);
        if (!isAxios4xx(error)) {
            Sentry.captureException(error, { extra: captureAxiosContext(error) });
        }
        if (isAxiosAuthError(error)) {
            throw new Error("Authentication required");
        }
        throw error;
    }
}

export async function changeUsername(data: {
    username: string;
    password: string;
}) {
    try {
        const response = await client.post("/auth/change-username/", data);
        return response.data;
    } catch (error) {
        logAxiosError("changeUsername error", error);
        if (!isAxios4xx(error)) {
            Sentry.captureException(error, { extra: captureAxiosContext(error) });
        }
        if (isAxiosAuthError(error)) {
            throw new Error("Authentication required");
        }
        throw error;
    }
}

export async function deleteAccount(data: {
    password: string;
    confirmation: string;
}) {
    try {
        const response = await client.delete("/auth/delete-account/", { data });
        return response.data;
    } catch (error) {
        logAxiosError("deleteAccount error", error);
        if (!isAxios4xx(error)) {
            Sentry.captureException(error, { extra: captureAxiosContext(error) });
        }
        if (isAxiosAuthError(error)) {
            throw new Error("Authentication required");
        }
        throw error;
    }
}

export async function updateNotificationSettings(data: Partial<UserSettings>) {
    try {
        const response = await client.patch("/auth/settings/", data);
        return response.data;
    } catch (error) {
        logAxiosError("updateNotificationSettings error", error);
        if (!isAxios4xx(error)) {
            Sentry.captureException(error, { extra: captureAxiosContext(error) });
        }
        if (isAxiosAuthError(error)) {
            throw new Error("Authentication required");
        }
        throw error;
    }
}
