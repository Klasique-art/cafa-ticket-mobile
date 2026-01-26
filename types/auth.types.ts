export interface UserSettings {
  marketing_emails: boolean;
  event_reminders: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

export interface UserStats {
  total_tickets_purchased: number;
  total_events_attended: number;
  events_organized: number;
  total_spent: number;
  account_age_days: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  profile_image: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  is_email_verified: boolean;
  date_joined: string;
  last_login: string | null;
  settings: UserSettings;
  stats: UserStats;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  full_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}
