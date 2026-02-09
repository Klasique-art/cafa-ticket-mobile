import { APP_EMAIL, APP_NUMBER } from "@/data/constants";

export interface TermsHighlight {
  id: number;
  icon: "checkmark-circle-outline" | "scale-outline" | "document-text-outline";
  title: string;
  description: string;
}

export interface TermsSection {
  id: number;
  title: string;
  content: string[];
}

export const termsLastUpdated = "December 19, 2025";

export const termsNotice =
  "By using Cafa Ticket, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our platform.";

export const termsHighlights: TermsHighlight[] = [
  {
    id: 1,
    icon: "checkmark-circle-outline",
    title: "Fair Usage",
    description: "Clear guidelines for users and organizers.",
  },
  {
    id: 2,
    icon: "scale-outline",
    title: "Legal Protection",
    description: "Rights and responsibilities are clearly defined.",
  },
  {
    id: 3,
    icon: "document-text-outline",
    title: "Transparency",
    description: "Open information about our policies and procedures.",
  },
];

export const termsSections: TermsSection[] = [
  {
    id: 1,
    title: "Agreement to Terms",
    content: [
      "By accessing and using Cafa Ticket (the Platform), you agree to be bound by these Terms of Service.",
      "If you do not agree to these Terms, you must not access or use the Platform. Continued use means acceptance of these Terms and future updates.",
    ],
  },
  {
    id: 2,
    title: "Eligibility",
    content: [
      "You must be at least 13 years old to use Cafa Ticket. Users between 13 and 18 years old must have parental or guardian consent.",
      "To purchase tickets or organize events, you must be at least 18 years old and have legal capacity to enter binding contracts.",
    ],
  },
  {
    id: 3,
    title: "Account Registration and Security",
    content: [
      "To access certain features, you must create an account and provide accurate, current, and complete information.",
      "You are responsible for safeguarding your credentials and all activity under your account.",
      "You may not share credentials, impersonate others, or create deceptive accounts.",
    ],
  },
  {
    id: 4,
    title: "User Conduct",
    content: [
      "You must use Cafa Ticket lawfully and respectfully.",
      "You must not post fraudulent information, abuse other users, perform unauthorized access, scrape the platform, or violate applicable laws.",
    ],
  },
  {
    id: 5,
    title: "Event Organizer Responsibilities",
    content: [
      "Organizers must provide accurate event information, follow applicable laws, and honor ticket obligations.",
      "Organizers are responsible for permits, safety, attendee handling, and event execution quality.",
      "Cafa Ticket acts as a platform facilitator and is not responsible for organizer-run events.",
    ],
  },
  {
    id: 6,
    title: "Ticket Purchases",
    content: [
      "Purchasers must pay listed ticket prices and applicable fees.",
      "Sales are final unless otherwise stated by the organizer or required by law.",
      "In cancellations or postponements, the organizer refund policy applies and processing timelines may vary.",
    ],
  },
  {
    id: 7,
    title: "Payment and Fees",
    content: [
      "Payments include ticket cost, service fees, processor fees, and applicable taxes.",
      "All payments are handled via secure third-party processors. We do not store complete card details.",
      "Organizer payouts may be subject to verification and holding periods.",
    ],
  },
  {
    id: 8,
    title: "Intellectual Property Rights",
    content: [
      "Platform content is owned by Cafa Ticket and protected by intellectual property laws.",
      "You receive a limited license for personal, non-commercial use and may not copy, alter, or reverse engineer platform assets.",
      "Content you upload remains yours, but you grant us rights needed to deliver our services.",
    ],
  },
  {
    id: 9,
    title: "Third-Party Links and Services",
    content: [
      "The platform may include third-party services and links.",
      "Your interactions with third parties are governed by their own terms and policies.",
    ],
  },
  {
    id: 10,
    title: "Disclaimers and Limitations of Liability",
    content: [
      "The platform is provided as is and as available, without warranties to the fullest extent allowed by law.",
      "Cafa Ticket is not liable for indirect or consequential losses, organizer actions, cancellations, or unauthorized account access.",
    ],
  },
  {
    id: 11,
    title: "Indemnification",
    content: [
      "You agree to indemnify and hold Cafa Ticket harmless for claims resulting from your use of the platform, policy violations, or unlawful conduct.",
    ],
  },
  {
    id: 12,
    title: "Dispute Resolution and Governing Law",
    content: [
      "These Terms are governed by the laws of Ghana.",
      "Parties should attempt good-faith resolution first, followed by binding arbitration where applicable.",
    ],
  },
  {
    id: 13,
    title: "Termination",
    content: [
      "We may suspend or terminate accounts for violations, fraudulent activity, inactivity, or legal requirements.",
      "On termination, applicable obligations survive as required by law and contract.",
    ],
  },
  {
    id: 14,
    title: "Changes to Terms",
    content: [
      "We may update these Terms to reflect legal, business, or product changes.",
      "Your continued use after updates take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: 15,
    title: "Severability",
    content: [
      "If any provision is found unenforceable, the remaining provisions remain in effect.",
    ],
  },
  {
    id: 16,
    title: "Entire Agreement",
    content: [
      "These Terms and the Privacy Policy form the full agreement between you and Cafa Ticket regarding platform use.",
    ],
  },
  {
    id: 17,
    title: "Contact Information",
    content: [
      `For questions about these Terms, contact us at ${APP_EMAIL} or ${APP_NUMBER}.`,
    ],
  },
];
