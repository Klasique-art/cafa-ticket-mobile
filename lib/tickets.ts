/**
 * Tickets API functions
 */

import { isAxiosError } from "axios";
import client from "./client";
import { API_BASE_URL } from "@/config/settings";
import { formatAxiosError } from "@/utils/axiosError";

interface BuyTicketPayload {
    event_slug: string;
    ticket_type_id: number;
    quantity: number;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    callback_url?: string;
}

interface BuyTicketResponse {
    success: boolean;
    purchase_id: string;
    payment_reference: string;
    authorization_url: string;
    amount: number;
    currency: string;
    expires_at: string;
}

/**
 * Initiate ticket purchase and get Paystack payment URL
 * @param payload - Ticket purchase data
 * @returns Payment initiation response with authorization URL
 */
export async function buyTicket(payload: BuyTicketPayload): Promise<BuyTicketResponse> {
    try {
        // Add mobile callback URL if not provided
        const requestPayload = {
            ...payload,
            callback_url: payload.callback_url || `${API_BASE_URL}/payments/mobile-callback/`,
        };

        const response = await client.post("/payments/initiate/", requestPayload);
        return response.data;
    } catch (error: any) {
        const isAxios = isAxiosError(error);
        const status = isAxios ? error.response?.status : undefined;
        const method = isAxios ? error.config?.method?.toUpperCase() : "POST";
        const endpoint = isAxios ? error.config?.url : "/payments/initiate/";
        const backendData = isAxios ? error.response?.data : undefined;

        const backendDetails =
            backendData?.details ||
            backendData?.error ||
            backendData?.message ||
            backendData?.detail ||
            null;

        console.log(
            `[Payment Init] ${status || "NO_STATUS"} ${method || "POST"} ${endpoint || "/payments/initiate/"} | event=${payload.event_slug} ticketType=${payload.ticket_type_id} qty=${payload.quantity} | ${backendDetails ? JSON.stringify(backendDetails) : formatAxiosError(error)}`
        );

        if (error.response?.data) {
            const errorData = error.response.data;

            // Extract error message
            if (errorData.error) {
                throw new Error(errorData.error);
            }
            if (errorData.message) {
                throw new Error(errorData.message);
            }
            if (errorData.details) {
                throw new Error(errorData.details);
            }

            // Field-specific errors
            if (errorData.available_quantity !== undefined) {
                throw new Error(`Only ${errorData.available_quantity} ticket(s) available`);
            }
        }

        throw new Error("Failed to initiate purchase. Please try again.");
    }
}

/**
 * Verify payment after Paystack redirect
 * @param reference - Payment reference from Paystack
 * @returns Payment verification response with tickets
 */
export async function verifyPayment(reference: string) {
    try {
        const response = await client.get(`/payments/verify/${reference}/`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data) {
            const errorData = error.response.data;

            if (errorData.message) {
                throw new Error(errorData.message);
            }
        }

        throw new Error("Failed to verify payment. Please contact support.");
    }
}
