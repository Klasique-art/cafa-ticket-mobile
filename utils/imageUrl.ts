import { placeholderImage } from "@/data/constants";
import { API_BASE_URL } from "@/config/settings";

const getApiOrigin = (): string => {
    try {
        const parsed = new URL(API_BASE_URL);
        return `${parsed.protocol}//${parsed.host}`;
    } catch {
        return "https://api.cafatickets.com";
    }
};

const API_ORIGIN = getApiOrigin();
const API_PROTOCOL = API_ORIGIN.startsWith("https://") ? "https:" : "http:";

export const getFullImageUrl = (path?: string | null): string => {
    if (!path) return placeholderImage;

    const trimmedPath = path.trim();
    if (!trimmedPath) return placeholderImage;

    // Keep local/device sources untouched.
    if (
        trimmedPath.startsWith("file://") ||
        trimmedPath.startsWith("content://") ||
        trimmedPath.startsWith("data:") ||
        trimmedPath.startsWith("blob:")
    ) {
        return trimmedPath;
    }

    if (trimmedPath.startsWith("//")) {
        return `${API_PROTOCOL}${trimmedPath}`;
    }

    if (trimmedPath.startsWith("http://")) {
        return trimmedPath;
    }

    if (trimmedPath.startsWith("https://")) {
        return trimmedPath;
    }

    const normalizedPath = trimmedPath.startsWith("/")
        ? trimmedPath
        : `/${trimmedPath}`;

    return `${API_ORIGIN}${normalizedPath}`;
};
