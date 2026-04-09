import { NextResponse } from "next/server";
import { toBookingDto } from "@/lib/booking-mappers";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { BookingStatus } from "@/lib/types";

function createBookingRef() {
  return `BK-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      client_name?: string;
      destination?: string;
      travel_date?: string;
      amount_aud?: number;
      status?: BookingStatus;
    };

    if (
      !body.client_name ||
      !body.destination ||
      !body.travel_date ||
      typeof body.amount_aud !== "number" ||
      !body.status
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const created = await prisma.booking.create({
      data: {
        agencyId: user.id,
        bookingRef: createBookingRef(),
        clientName: body.client_name,
        destination: body.destination,
        travelDate: new Date(body.travel_date),
        amountAud: body.amount_aud,
        status: body.status,
      },
    });

    return NextResponse.json({ booking: toBookingDto(created) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while creating booking." },
      { status: 500 },
    );
  }
}
