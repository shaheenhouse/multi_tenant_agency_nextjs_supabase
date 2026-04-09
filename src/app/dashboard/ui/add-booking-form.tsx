"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Booking, BookingStatus } from "@/lib/types";

interface AddBookingFormProps {
  onCreated: (booking: Booking) => void;
}

function createBookingRef() {
  return `BK-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function AddBookingForm({ onCreated }: AddBookingFormProps) {
  const supabase = createClient();
  const [clientName, setClientName] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<BookingStatus>("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const payload = {
      agency_id: user.id,
      booking_ref: createBookingRef(),
      client_name: clientName,
      destination,
      travel_date: travelDate,
      amount_aud: Number(amount),
      status,
    };

    const { data, error: insertError } = await supabase
      .from("bookings")
      .insert(payload)
      .select("*")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    onCreated(data as Booking);
    setClientName("");
    setDestination("");
    setTravelDate("");
    setAmount("");
    setStatus("Pending");
    setLoading(false);
  }

  return (
    <form
      className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-4 text-lg font-semibold">Add booking</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Client Name</span>
          <input
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Destination</span>
          <input
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Travel Date</span>
          <input
            required
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={travelDate}
            onChange={(event) => setTravelDate(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Amount (AUD)</span>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="font-medium">Status</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={status}
            onChange={(event) => setStatus(event.target.value as BookingStatus)}
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        disabled={loading}
        type="submit"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
      >
        {loading ? "Creating..." : "Create booking"}
      </button>
    </form>
  );
}
