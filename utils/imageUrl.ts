import { placeholderImage } from "@/data/constants";

export const getFullImageUrl = (path?: string | null): string => {
    if (!path) return placeholderImage // fallback
    if (path.startsWith('http')) return path;
    return `http://api.cafatickets.com${path}`;
};
