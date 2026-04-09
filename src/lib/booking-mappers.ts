import type { Booking as PrismaBooking } from "@prisma/client";
import type { Booking } from "@/lib/types";

export function toBookingDto(record: PrismaBooking): Booking {
  return {
    id: record.id,
    booking_ref: record.bookingRef,
    client_name: record.clientName,
    destination: record.destination,
    travel_date: record.travelDate.toISOString().slice(0, 10),
    amount_aud: Number(record.amountAud),
    status: record.status,
    created_at: record.createdAt.toISOString(),
  };
}
