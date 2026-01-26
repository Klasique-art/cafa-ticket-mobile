export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string; // Ionicons name
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Discover Amazing Events",
    description:
      "Explore concerts, festivals, conferences, and more happening around you. Find your next unforgettable experience.",
    icon: "compass",
  },
  {
    id: 2,
    title: "Book Tickets Instantly",
    description:
      "Secure your spot in seconds with our seamless booking process. No queues, no hassle—just tap and you're in.",
    icon: "ticket",
  },
  {
    id: 3,
    title: "Your Tickets, Always Ready",
    description:
      "Access your digital tickets anytime, anywhere. Show your QR code at the venue and enjoy the event.",
    icon: "qr-code",
  },
  {
    id: 4,
    title: "Host Your Own Events",
    description:
      "Create and manage your events with powerful tools. Sell tickets, track attendance, and grow your audience.",
    icon: "calendar",
  },
];
