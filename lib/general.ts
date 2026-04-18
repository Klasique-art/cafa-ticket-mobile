import client from "./client";
import * as Sentry from '@sentry/react-native';
import { PublicStats } from "@/types";
import { captureAxiosContext, isAxios4xx, logAxiosError } from "@/utils/axiosError";

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const response = await client.get("/public/stats/");
    return response.data;
  } catch (error) {
    logAxiosError("Error fetching public stats", error);
    if (!isAxios4xx(error)) {
      Sentry.captureException(error, { extra: captureAxiosContext(error) });
    }
    return null;
  }
}
