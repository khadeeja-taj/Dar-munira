import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-time setup endpoint.
 * Visit /api/setup?key=YOUR_ADMIN_PASSWORD once after deploying.
 * It creates the tables (if missing) and the admin account IN THE SAME
 * database the app is connected to, then you can log in.
 */
const TABLES = [
  `CREATE TABLE IF NOT EXISTS "Admin" ("id" TEXT PRIMARY KEY,"email" TEXT NOT NULL,"passwordHash" TEXT NOT NULL,"name" TEXT NOT NULL,"role" TEXT NOT NULL DEFAULT 'admin',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email")`,
  `CREATE TABLE IF NOT EXISTS "StudentApplication" ("id" TEXT PRIMARY KEY,"fullName" TEXT NOT NULL,"email" TEXT NOT NULL,"phone" TEXT NOT NULL,"fatherPhone" TEXT,"nationality" TEXT NOT NULL,"nationalId" TEXT NOT NULL,"registrationNo" TEXT NOT NULL,"universityId" TEXT,"department" TEXT,"specialization" TEXT,"academicLevel" TEXT,"course" TEXT NOT NULL,"courseLevel" TEXT,"studiedBefore" BOOLEAN NOT NULL DEFAULT false,"completedLevel" TEXT,"instituteName" TEXT,"status" TEXT NOT NULL DEFAULT 'PENDING',"notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "InstructorApplication" ("id" TEXT PRIMARY KEY,"fullName" TEXT NOT NULL,"email" TEXT NOT NULL,"phone" TEXT NOT NULL,"nationality" TEXT NOT NULL,"nationalId" TEXT NOT NULL,"employeeNo" TEXT NOT NULL,"universityId" TEXT,"department" TEXT,"specialization" TEXT,"academicLevel" TEXT,"course" TEXT NOT NULL,"courseLevel" TEXT,"taughtBefore" BOOLEAN NOT NULL DEFAULT false,"highestLevelTaught" TEXT,"instituteName" TEXT,"experienceYears" TEXT,"teachingMode" TEXT,"status" TEXT NOT NULL DEFAULT 'PENDING',"notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "VisitingTeacherApplication" ("id" TEXT PRIMARY KEY,"fullName" TEXT NOT NULL,"phone" TEXT NOT NULL,"email" TEXT NOT NULL,"department" TEXT,"course" TEXT NOT NULL,"preferredTime" TEXT,"preferredDate" TEXT,"daysCount" TEXT,"status" TEXT NOT NULL DEFAULT 'PENDING',"notes" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "UploadedFile" ("id" TEXT PRIMARY KEY,"label" TEXT NOT NULL,"originalName" TEXT NOT NULL,"storedName" TEXT NOT NULL,"mimeType" TEXT NOT NULL,"size" INTEGER NOT NULL,"data" BYTEA NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"studentId" TEXT,"instructorId" TEXT,"visitingId" TEXT)`,
  `CREATE TABLE IF NOT EXISTS "Announcement" ("id" TEXT PRIMARY KEY,"titleEn" TEXT NOT NULL,"titleAr" TEXT NOT NULL,"bodyEn" TEXT NOT NULL,"bodyAr" TEXT NOT NULL,"category" TEXT NOT NULL DEFAULT 'news',"pinned" BOOLEAN NOT NULL DEFAULT false,"published" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT PRIMARY KEY,"name" TEXT NOT NULL,"email" TEXT NOT NULL,"subject" TEXT,"message" TEXT NOT NULL,"handled" BOOLEAN NOT NULL DEFAULT false,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "GalleryItem" ("id" TEXT PRIMARY KEY,"titleEn" TEXT NOT NULL,"titleAr" TEXT NOT NULL,"mimeType" TEXT NOT NULL,"data" BYTEA NOT NULL,"videoUrl" TEXT,"published" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
];

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (!adminPassword || key !== adminPassword) {
    return Response.json(
      { ok: false, error: "Invalid or missing ?key= (use your ADMIN_PASSWORD)" },
      { status: 401 },
    );
  }

  try {
    for (const stmt of TABLES) {
      await prisma.$executeRawUnsafe(stmt);
    }

    const email = (process.env.ADMIN_EMAIL || "admin@darmuneerah.edu.pk").toLowerCase();
    const name = process.env.ADMIN_NAME || "Administrator";
    const hash = await bcrypt.hash(adminPassword, 10);

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Admin" ("id","email","passwordHash","name","role","updatedAt")
       VALUES ($1,$2,$3,$4,'admin',CURRENT_TIMESTAMP)
       ON CONFLICT ("email") DO UPDATE SET "passwordHash"=EXCLUDED."passwordHash","name"=EXCLUDED."name"`,
      "admin_main",
      email,
      hash,
      name,
    );

    return Response.json({
      ok: true,
      message: "Setup complete. You can now log in.",
      loginEmail: email,
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
