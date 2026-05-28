export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string; // Ionicons name
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Local Events, One App",
    description:
      "Discover nearby events without jumping between social posts, flyers, and random links.",
    icon: "compass",
  },
  {
    id: 2,
    title: "Search What You Want",
    description:
      "Use search to quickly find music, sports, comedy, and community events near you.",
    icon: "search",
  },
  {
    id: 3,
    title: "Browse By Category",
    description:
      "Explore categories like music, sports, and arts to find events by interest faster.",
    icon: "grid",
  },
  {
    id: 4,
    title: "Easy Ticket Checkout",
    description:
      "Go from interested to confirmed in a few taps with clear details and in-app payment.",
    icon: "ticket",
  },
  {
    id: 5,
    title: "Payment History",
    description:
      "Track completed and pending payments, plus your event transactions, in one place.",
    icon: "wallet",
  },
  {
    id: 6,
    title: "Manage Your Profile",
    description:
      "Keep your account details and settings updated so tickets and payments stay organized.",
    icon: "person-circle",
  },
  {
    id: 7,
    title: "Tools For Organizers",
    description:
      "Create events, monitor sales, and review performance with simple organizer analytics.",
    icon: "analytics",
  },
  {
    id: 8,
    title: "Join Your Community",
    description:
      "Attend local events, support organizers, and connect with people around you.",
    icon: "people",
  },
];
