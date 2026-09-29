// Build-time helper: switch the Prisma datasource to PostgreSQL.
//
// Local development keeps SQLite (zero-config). On a real host (Vercel, Render,
// …) the `vercel-build` script runs this first so the same schema targets a
// hosted PostgreSQL database via DATABASE_URL. Nothing else changes.

import { readFileSync, writeFileSync } from "fs";

const file = "prisma/schema.prisma";
const src = readFileSync(file, "utf8");

if (src.includes('provider = "postgresql"')) {
  console.log("[use-postgres] schema already targets postgresql");
} else {
  const out = src.replace('provider = "sqlite"', 'provider = "postgresql"');
  writeFileSync(file, out);
  console.log("[use-postgres] switched Prisma datasource to postgresql");
}
