import { BookingStatus, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

for (const envFile of [".env.local", ".env"]) {
  const fullPath = resolve(process.cwd(), envFile);
  if (existsSync(fullPath)) {
    loadEnv({ path: fullPath, override: true });
  }
}

const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!datasourceUrl) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL in .env.local/.env");
}

const adapter = new PrismaPg({ connectionString: datasourceUrl });
const prisma = new PrismaClient({ adapter });

function bookingRef() {
  return `BK-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function agencyPrefixFromEmail(email: string) {
  const local = email.split("@")[0] ?? "agency";
  const normalized = local.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return normalized.slice(0, 8) || "AGENCY";
}

const starterRows: Array<{
  clientName: string;
  destination: string;
  travelDate: string;
  amountAud: number;
  status: BookingStatus;
}> = [
  {
    clientName: "Olivia Chen",
    destination: "Tokyo",
    travelDate: "2026-05-18",
    amountAud: 3280,
    status: BookingStatus.Confirmed,
  },
  {
    clientName: "Liam Wilson",
    destination: "Auckland",
    travelDate: "2026-06-02",
    amountAud: 1490,
    status: BookingStatus.Pending,
  },
  {
    clientName: "Aisha Patel",
    destination: "Singapore",
    travelDate: "2026-07-11",
    amountAud: 2210,
    status: BookingStatus.Confirmed,
  },
  {
    clientName: "Noah Jackson",
    destination: "Bali",
    travelDate: "2026-08-21",
    amountAud: 1895,
    status: BookingStatus.Cancelled,
  },
  {
    clientName: "Mia Thompson",
    destination: "Queenstown",
    travelDate: "2026-09-08",
    amountAud: 2640,
    status: BookingStatus.Pending,
  },
];

async function seedAgencyByEmail(email: string, prefix: string) {
  const agency = await prisma.agency.findUnique({ where: { email } });
  if (!agency) {
    throw new Error(
      `Agency not found for ${email}. Sign up this agency once in the app first.`,
    );
  }

  const count = await prisma.booking.count({ where: { agencyId: agency.id } });
  if (count >= 5) return;

  const rows = starterRows.slice(0, 5 - count).map((row) => ({
    agencyId: agency.id,
    bookingRef: `${prefix}-${bookingRef()}`,
    clientName: `${prefix} ${row.clientName}`,
    destination: row.destination,
    travelDate: new Date(row.travelDate),
    amountAud: row.amountAud,
    status: row.status,
  }));

  await prisma.booking.createMany({ data: rows });
}

async function main() {
  const agency1 = process.env.SEED_AGENCY_1_EMAIL;
  const agency2 = process.env.SEED_AGENCY_2_EMAIL;

  if (!agency1 || !agency2) {
    throw new Error(
      "Set SEED_AGENCY_1_EMAIL and SEED_AGENCY_2_EMAIL in your .env.local first.",
    );
  }

  await seedAgencyByEmail(agency1, 'User1');
  await seedAgencyByEmail(agency2, 'User2');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
