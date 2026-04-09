"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/lib/types";
import { AddBookingForm } from "./add-booking-form";
import { BookingsTable } from "./bookings-table";

interface DashboardClientProps {
  agencyEmail: string;
  initialBookings: Booking[];
}

export function DashboardClient({
  agencyEmail,
  initialBookings,
}: DashboardClientProps) {
  const supabase = createClient();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loggingOut, setLoggingOut] = useState(false);

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort((a, b) =>
        a.travel_date.localeCompare(b.travel_date, "en-AU"),
      ),
    [bookings],
  );

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/auth");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-card p-4 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Logged in agency
          </p>
          <h1 className="text-xl font-semibold">{agencyEmail}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-70"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </header>

      <AddBookingForm onCreated={(booking) => setBookings((prev) => [booking, ...prev])} />
      <BookingsTable bookings={sortedBookings} />
    </main>
  );
}
