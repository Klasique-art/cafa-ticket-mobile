export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string; // Ionicons name
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Local Events, One Place",
    description:
      "Cafa Tickets brings local events into one app so you can stop hunting across social posts, flyers, and scattered links.",
    icon: "compass",
  },
  {
    id: 2,
    title: "Find What Matches Your Mood",
    description:
      "Use search to quickly discover what is happening around you, whether you want music, sports, comedy, or community events.",
    icon: "search",
  },
  {
    id: 3,
    title: "Browse By Category",
    description:
      "Jump into categories like music, sports, and arts and culture to discover events by interest instead of endless scrolling.",
    icon: "grid",
  },
  {
    id: 4,
    title: "Simple Ticket Buying",
    description:
      "Go from interested to confirmed in a few taps with clear event details and in-app ticket checkout.",
    icon: "ticket",
  },
  {
    id: 5,
    title: "Track Your Payments",
    description:
      "Review completed and pending payments, transaction history, and your event spending in one organized place.",
    icon: "wallet",
  },
  {
    id: 6,
    title: "Your Profile, Your Account",
    description:
      "Manage account details, contact info, and settings so your tickets, payments, and event activity stay connected.",
    icon: "person-circle",
  },
  {
    id: 7,
    title: "Tools For Organizers",
    description:
      "Create events, monitor ticket sales, view recent activity, and track performance with built-in organizer insights.",
    icon: "analytics",
  },
  {
    id: 8,
    title: "Show Up And Connect",
    description:
      "Cafa Tickets helps attendees and organizers meet, support local scenes, and build stronger communities through events.",
    icon: "people",
  },
];
