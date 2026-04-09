import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Booking } from "@/lib/types";
import { DashboardClient } from "./ui/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("travel_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <DashboardClient
      agencyEmail={user.email ?? "Agency"}
      initialBookings={(bookings ?? []) as Booking[]}
    />
  );
}
