export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatEventDateFull(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatEventTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (numPrice === 0) return "Free";
  return `GHS ${numPrice.toFixed(2)}`;
}

/**
 * Format a number to a compact string representation (1k, 2m, 3b, etc.)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.2k", "3.5m", "1b")
 * 
 * @example
 * formatNumber(1234) // "1.2k"
 * formatNumber(1234567) // "1.2m"
 * formatNumber(1234567890) // "1.2b"
 * formatNumber(999) // "999"
 * formatNumber(1500, 0) // "2k"
 */
export function formatNumber(num: number, decimals: number = 1): string {
    if (num < 1000) {
        return num.toString();
    }

    const lookup = [
        { value: 1e9, symbol: "b" },  // billion
        { value: 1e6, symbol: "m" },  // million
        { value: 1e3, symbol: "k" },  // thousand
    ];

    const item = lookup.find((item) => num >= item.value);

    if (!item) {
        return num.toString();
    }

    const formatted = (num / item.value).toFixed(decimals);
    
    // Remove trailing zeros and decimal point if not needed
    return formatted.replace(/\.0+$/, "") + item.symbol;
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  return formatEventDate(dateString);
}

export function isWithinDays(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}
