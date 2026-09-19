import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@darmuneerah.edu.pk").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!2026";
  const name = process.env.ADMIN_NAME || "Administrator";

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`✔ Admin ready: ${email}`);

  // Seed the four default Programs (idempotent). Admins can edit/delete these
  // and add Courses / Competitions from the admin panel.
  const programs = [
    { id: "prog-hifz-quran", titleEn: "Hifz ul Qur'an", titleAr: "حفظ القرآن", descEn: "Structured memorization of the Holy Qur'an with revision and tarbiyah.", descAr: "حفظٌ منظّم للقرآن الكريم مع المراجعة والتربية." },
    { id: "prog-tilawah", titleEn: "Tilawah (Recitation)", titleAr: "تلاوة القرآن", descEn: "Beautiful, correct recitation of the Holy Qur'an.", descAr: "تلاوة القرآن الكريم تلاوةً صحيحةً مُجوَّدة." },
    { id: "prog-tadabbur", titleEn: "Tadabbur (Reflection)", titleAr: "تدبر القرآن", descEn: "Reflect on the meanings and guidance of the Qur'an.", descAr: "التدبّر في معاني القرآن الكريم وهداياته." },
    { id: "prog-tajweed", titleEn: "Tajweed", titleAr: "التجويد", descEn: "Master correct Qur'anic recitation across progressive levels.", descAr: "إتقان التلاوة الصحيحة عبر مستويات متدرّجة." },
  ];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    await prisma.courseItem.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        category: "program",
        titleEn: p.titleEn,
        titleAr: p.titleAr,
        descEn: p.descEn,
        descAr: p.descAr,
        sortOrder: i,
      },
    });
  }
  console.log("✔ Programs ready (Hifz, Tilawah, Tadabbur, Tajweed)");

  // Demo/sample data is only seeded when explicitly requested (e.g. local dev).
  // In production leave the site empty. Set SEED_SAMPLES=true to include samples.
  if (process.env.SEED_SAMPLES !== "true") {
    console.log("↷ Skipping sample data (set SEED_SAMPLES=true to include it)");
    return;
  }

  // Sample announcements
  const count = await prisma.announcement.count();
  if (count === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          titleEn: "New Tajweed Intake — Registration Open",
          titleAr: "دفعة تجويد جديدة — التسجيل مفتوح",
          bodyEn:
            "Registration for the new Tajweed program (Beginner to Advanced) is now open. Limited seats available.",
          bodyAr:
            "التسجيل في برنامج التجويد الجديد (من المبتدئ إلى المتقدم) مفتوح الآن. المقاعد محدودة.",
          category: "course",
          pinned: true,
        },
        {
          titleEn: "Hifz ul Qur'an — Orientation Session",
          titleAr: "حفظ القرآن — جلسة تعريفية",
          bodyEn:
            "An orientation session for new Hifz students will be held at the end of this month, in shā’ Allah.",
          bodyAr:
            "ستُعقد جلسة تعريفية لطالبات الحفظ الجديدات نهاية هذا الشهر إن شاء الله.",
          category: "event",
        },
        {
          titleEn: "Registration Deadline Reminder",
          titleAr: "تذكير بالموعد النهائي للتسجيل",
          bodyEn: "Please complete your registration before the semester begins.",
          bodyAr: "يُرجى إكمال تسجيلك قبل بداية الفصل الدراسي.",
          category: "deadline",
        },
      ],
    });
    console.log("✔ Seeded sample announcements");
  }

  // A couple of sample applications so the dashboard isn't empty on first run.
  const students = await prisma.studentApplication.count();
  if (students === 0) {
    await prisma.studentApplication.createMany({
      data: [
        {
          fullName: "Aisha Rahman",
          email: "aisha.demo@example.com",
          phone: "+92 300 1112223",
          nationality: "Pakistan",
          registrationNo: "REG-2026-001",
          universityId: "UNI-2026-001",
          department: "Usuluddin",
          academicLevel: "bs",
          course: "tajweed",
          courseLevel: "beginner",
          status: "PENDING",
        },
        {
          fullName: "Fatima Zahra",
          email: "fatima.demo@example.com",
          phone: "+20 100 2223334",
          nationality: "Egypt",
          registrationNo: "REG-2026-002",
          universityId: "UNI-2026-002",
          department: "Arabic",
          academicLevel: "ms",
          course: "hifz-quran",
          status: "APPROVED",
        },
      ],
    });
    await prisma.instructorApplication.create({
      data: {
        fullName: "Ustadha Maryam",
        email: "maryam.demo@example.com",
        phone: "+92 321 4445556",
        nationality: "Pakistan",
        employeeNo: "EMP-1024",
        universityId: "UNI-EMP-1024",
        department: "Usuluddin",
        academicLevel: "phd",
        course: "tajweed",
        courseLevel: "advanced",
        taughtBefore: true,
        highestLevelTaught: "Advanced",
        experienceYears: "5plus",
        teachingMode: "both",
        status: "PENDING",
      },
    });
    console.log("✔ Seeded sample applications");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
