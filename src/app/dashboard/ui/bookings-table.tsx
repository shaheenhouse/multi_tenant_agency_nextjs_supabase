import { Booking } from "@/lib/types";

function statusClass(status: Booking["status"]) {
  if (status === "Confirmed") return "bg-emerald-100 text-emerald-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Booking Ref</th>
              <th className="px-4 py-3 font-medium">Client Name</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Travel Date</th>
              <th className="px-4 py-3 font-medium">Amount (AUD)</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-100 hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3 font-medium">{booking.booking_ref}</td>
                  <td className="px-4 py-3">{booking.client_name}</td>
                  <td className="px-4 py-3">{booking.destination}</td>
                  <td className="px-4 py-3">
                    {new Date(booking.travel_date).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    {new Intl.NumberFormat("en-AU", {
                      style: "currency",
                      currency: "AUD",
                    }).format(booking.amount_aud)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
