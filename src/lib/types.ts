export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export interface Booking {
  id: string;
  booking_ref: string;
  client_name: string;
  destination: string;
  travel_date: string;
  amount_aud: number;
  status: BookingStatus;
  created_at: string;
}
