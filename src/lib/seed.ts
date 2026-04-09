import { BookingStatus } from "@/lib/types";

interface SeedBookingInput {
  client_name: string;
  destination: string;
  travel_date: string;
  amount_aud: number;
  status: BookingStatus;
}

export const starterBookings: SeedBookingInput[] = [
  {
    client_name: "Olivia Chen",
    destination: "Tokyo",
    travel_date: "2026-05-18",
    amount_aud: 3280,
    status: "Confirmed",
  },
  {
    client_name: "Liam Wilson",
    destination: "Auckland",
    travel_date: "2026-06-02",
    amount_aud: 1490,
    status: "Pending",
  },
  {
    client_name: "Aisha Patel",
    destination: "Singapore",
    travel_date: "2026-07-11",
    amount_aud: 2210,
    status: "Confirmed",
  },
  {
    client_name: "Noah Jackson",
    destination: "Bali",
    travel_date: "2026-08-21",
    amount_aud: 1895,
    status: "Cancelled",
  },
  {
    client_name: "Mia Thompson",
    destination: "Queenstown",
    travel_date: "2026-09-08",
    amount_aud: 2640,
    status: "Pending",
  },
];
