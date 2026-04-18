const isProduction = !__DEV__;

// API URLs
// http://10.223.110.23:8000/api/v1
const DEV_API_URL = "http://10.223.110.23:8000/api/v1";
const PROD_API_URL = "https://api.cafatickets.com/api/v1";

export const API_BASE_URL = isProduction ? PROD_API_URL : DEV_API_URL;