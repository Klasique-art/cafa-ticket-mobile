import client from "./client";
import { PublicStats } from "@/types";

export async function getPublicStats(): Promise<PublicStats | null> {
  try {
    const response = await client.get("/public/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return null;
  }
}
