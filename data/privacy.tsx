import { APP_EMAIL, APP_NUMBER } from "@/data/constants";

export interface PrivacyHighlight {
  id: number;
  icon: "lock-closed-outline" | "eye-outline" | "shield-checkmark-outline" | "document-text-outline";
  title: string;
  description: string;
}

export interface PrivacyPolicySection {
  id: number;
  title: string;
  content: string[];
}

export const privacyLastUpdated = "December 19, 2025";

export const privacyHighlights: PrivacyHighlight[] = [
  {
    id: 1,
    icon: "lock-closed-outline",
    title: "Secure by Design",
    description: "End-to-end encryption for all your data.",
  },
  {
    id: 2,
    icon: "eye-outline",
    title: "Transparent",
    description: "Clear information on how your data is used.",
  },
  {
    id: 3,
    icon: "shield-checkmark-outline",
    title: "Your Control",
    description: "Manage your data preferences at any time.",
  },
  {
    id: 4,
    icon: "document-text-outline",
    title: "Compliance",
    description: "Aligned with major data protection standards.",
  },
];

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: 1,
    title: "Introduction",
    content: [
      "Welcome to Cafa Ticket. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our event ticketing platform.",
      "By accessing or using Cafa Ticket, you agree to the terms outlined in this Privacy Policy. If you do not agree with these terms, please do not use our services.",
    ],
  },
  {
    id: 2,
    title: "Information We Collect",
    content: [
      "We collect information that you provide directly to us when creating an account, purchasing tickets, organizing events, or communicating with us. This includes:",
      "Personal Information: Name, email address, phone number, profile picture, bio, city, and country.",
      "Account Information: Username, password (encrypted), and authentication tokens.",
      "Payment Information: Payment method details, billing address, and transaction history. We do not store complete credit card numbers. These are processed securely by our payment partners.",
      "Event Information: Details about events you organize or attend, including ticket purchases, check-ins, and event preferences.",
      "Communication Data: Messages sent through our platform, customer support inquiries, and feedback.",
      "Usage Data: Information about how you interact with our platform, including IP address, browser type, device information, pages visited, and time spent.",
      "Location Data: With your permission, we may collect location information to provide location-based services and improve event recommendations.",
    ],
  },
  {
    id: 3,
    title: "How We Use Your Information",
    content: [
      "We use the collected information for the following purposes:",
      "Service Delivery: To process ticket purchases, manage event registrations, send event notifications and reminders, and facilitate event check-ins.",
      "Account Management: To create and manage your account, authenticate your identity, and provide customer support.",
      "Event Organization: To enable event organizers to manage their events, track ticket sales, and communicate with attendees.",
      "Personalization: To personalize your experience, recommend relevant events, and customize content based on your preferences.",
      "Communication: To send transactional emails, marketing communications (with your consent), and important platform updates.",
      "Analytics: To analyze platform usage, improve our services, develop new features, and understand user behavior.",
      "Security: To detect and prevent fraud, maintain platform security, and protect against unauthorized access.",
      "Legal Compliance: To comply with legal obligations, enforce our terms of service, and resolve disputes.",
    ],
  },
  {
    id: 4,
    title: "Information Sharing and Disclosure",
    content: [
      "We share your information only in the following circumstances:",
      "Event Organizers: When you purchase a ticket, we share your name, email, and attendance information with the event organizer to facilitate event management.",
      "Service Providers: We work with trusted third-party service providers who assist us with payment processing, email delivery, analytics, customer support, and hosting services. These providers are bound by confidentiality agreements.",
      "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.",
      "Legal Requirements: We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.",
      "With Your Consent: We may share your information with third parties when you explicitly provide consent.",
    ],
  },
  {
    id: 5,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information:",
      "Encryption: All sensitive data is encrypted in transit using SSL/TLS protocols and at rest using strong encryption algorithms.",
      "Access Controls: We limit access to personal information to authorized personnel who need it to perform their job functions.",
      "Regular Audits: We conduct regular security audits and vulnerability assessments to identify and address potential risks.",
      "Secure Infrastructure: Our platform is hosted on secure servers with redundant backups and disaster recovery procedures.",
      "No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.",
    ],
  },
  {
    id: 6,
    title: "Your Rights and Choices",
    content: [
      "You have the following rights regarding your personal information:",
      "Access: You can access and review your personal information through your account dashboard.",
      "Correction: You can update or correct your personal information at any time through your profile settings.",
      "Deletion: You can request deletion of your account and personal information. We may retain certain information for legal or business purposes.",
      "Data Portability: You can request a copy of your personal information in a structured, machine-readable format.",
      "Marketing Opt-Out: You can opt out of marketing communications by clicking the unsubscribe link in emails or adjusting your notification preferences.",
      "Cookie Management: You can control cookie preferences through your browser settings.",
    ],
  },
  {
    id: 7,
    title: "Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to enhance your experience on our platform:",
      "Essential Cookies: Required for basic platform functionality, including authentication and security.",
      "Analytics Cookies: Help us understand how users interact with our platform to improve services.",
      "Preference Cookies: Remember your settings and preferences for a personalized experience.",
      "Marketing Cookies: Used to deliver relevant advertisements and measure campaign effectiveness.",
      "You can manage cookie preferences through your browser settings, but disabling certain cookies may affect platform functionality.",
    ],
  },
  {
    id: 8,
    title: "Children's Privacy",
    content: [
      "Cafa Ticket is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will take steps to delete such information.",
    ],
  },
  {
    id: 9,
    title: "International Data Transfers",
    content: [
      "Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to the transfer of your information to these countries. We take appropriate measures to ensure your information remains protected.",
    ],
  },
  {
    id: 10,
    title: "Data Retention",
    content: [
      "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or business purposes.",
    ],
  },
  {
    id: 11,
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or business needs. We will notify you of significant changes by posting the updated policy on our platform and updating the Last Updated date. We encourage you to review this policy periodically.",
    ],
  },
  {
    id: 12,
    title: "Contact Us",
    content: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
      `Email: ${APP_EMAIL}`,
      `Phone: ${APP_NUMBER}`,
      "We will respond to your inquiry within a reasonable timeframe and work to address your concerns.",
    ],
  },
];
