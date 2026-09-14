// Shared constants and controlled vocabularies used across the app.

export const APPLICATION_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_META: Record<
  ApplicationStatus,
  { en: string; ar: string; tone: string }
> = {
  PENDING: { en: "Pending", ar: "قيد المراجعة", tone: "amber" },
  APPROVED: { en: "Approved", ar: "مقبولة", tone: "emerald" },
  REJECTED: { en: "Rejected", ar: "مرفوضة", tone: "rose" },
  ARCHIVED: { en: "Archived", ar: "مؤرشفة", tone: "slate" },
};

// Courses offered — the single source of truth for the whole product.
// `group` splits the offering into "برامج / Programs" and "دورات / Courses"
// as shown in the Courses section.
export const COURSES = [
  { key: "tajweed", en: "Tajweed", ar: "التجويد", icon: "BookOpenCheck", leveled: true, group: "program" },
  { key: "hifz-quran", en: "Hifz ul Qur'an", ar: "حفظ القرآن", icon: "BookMarked", leveled: false, group: "program" },
  { key: "understanding-quran", en: "Understanding Qur'an", ar: "فهم القرآن", icon: "GraduationCap", leveled: false, group: "program" },
  { key: "arabic-institute", en: "Arabic Language Institute", ar: "معهد اللغة العربية", icon: "Languages", leveled: false, group: "program" },
  { key: "hifz-ahadees", en: "Hifz ul Ahadees", ar: "حفظ الأحاديث", icon: "ScrollText", leveled: false, group: "course" },
  { key: "hifz-mutun", en: "Hifz Mutun", ar: "حفظ المتون", icon: "Library", leveled: false, group: "course" },
  { key: "aqeedah", en: "Aqeedah", ar: "العقيدة", icon: "Sparkles", leveled: false, group: "course" },
  { key: "sharh-mutun", en: "Explanation of Mutun", ar: "شرح المتون", icon: "PenLine", leveled: false, group: "course" },
  { key: "fiqh", en: "Fiqh", ar: "الفقه", icon: "Scale", leveled: false, group: "course" },
  { key: "comprehensive", en: "Al-Maktaba Al-Shamela", ar: "دورة المكتبة الشاملة", icon: "Layers", leveled: false, group: "course" },
  { key: "tilawah", en: "Tilawah", ar: "التلاوة", icon: "Mic", leveled: false, group: "course" },
] as const;

// The 30 juz' of the Qur'an — shown as a calendar-style picker when a student
// chooses Hifz ul Qur'an.
export const QURAN_JUZ = Array.from({ length: 30 }, (_, i) => i + 1);

// WhatsApp group shown to applicants after a successful registration.
// Override with NEXT_PUBLIC_WHATSAPP_GROUP_URL if the group link changes.
export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ||
  "https://chat.whatsapp.com/HhP7hjGGVy9FHfd9DqtWsp?s=cl&p=a&mlu=4&ilr=4";

export const COURSE_KEYS = COURSES.map((c) => c.key);

export const TAJWEED_LEVELS = [
  { key: "basic", en: "Basic", ar: "المبتدئ" },
  { key: "intermediate", en: "Intermediate", ar: "المتوسط" },
  { key: "advanced", en: "Advance", ar: "المتقدم" },
] as const;

// Hifz ul Qur'an sub-programs.
export const HIFZ_QURAN_TYPES = [
  { key: "complete", en: "Complete Qur'an", ar: "حفظ القرآن كامل" },
  { key: "university-syllabus", en: "University Syllabus", ar: "مقرر الجامعة" },
  { key: "selected-parts", en: "Selected Parts", ar: "الأجزاء المنتخبة" },
] as const;

// Returns the sub-option list for a course (Tajweed levels / Hifz types), or null.
export function courseSubOptions(courseKey: string) {
  if (courseKey === "tajweed") return TAJWEED_LEVELS;
  if (courseKey === "hifz-quran") return HIFZ_QURAN_TYPES;
  return null;
}

// Student — "If yes, how many levels have you completed?"
export const COMPLETED_LEVELS = [
  { key: "not-studied", en: "I have not studied this course before.", ar: "لم أدرس" },
  { key: "basic", en: "Basic level", ar: "المبتدئ" },
  { key: "intermediate", en: "Intermediate level", ar: "المتوسط" },
  { key: "advanced", en: "Advance level", ar: "المتقدم" },
] as const;

// Instructor — "If yes, what is the highest level you have taught?"
export const TAUGHT_LEVELS = [
  { key: "beginner", en: "Beginner", ar: "المبتدئ" },
  { key: "intermediate", en: "Intermediate", ar: "المتوسط" },
  { key: "advanced", en: "Advanced", ar: "المتقدم" },
] as const;

// Instructors teach a narrower course set per the blueprint.
export const INSTRUCTOR_COURSES = [
  { key: "tajweed", en: "Tajweed", ar: "التجويد", leveled: true },
  { key: "hifz-quran", en: "Hifz ul Qur'an", ar: "حفظ القرآن", leveled: false },
  { key: "hifz-hadith", en: "Hifz ul Hadith", ar: "حفظ الحديث", leveled: false },
] as const;

export const EXPERIENCE_YEARS = [
  { key: "1", en: "1 Year", ar: "سنة واحدة" },
  { key: "2", en: "2 Years", ar: "سنتان" },
  { key: "3", en: "3 Years", ar: "3 سنوات" },
  { key: "4", en: "4 Years", ar: "4 سنوات" },
  { key: "5", en: "5 Years", ar: "5 سنوات" },
  { key: "5plus", en: "More than 5 Years", ar: "أكثر من 5 سنوات" },
] as const;

export const TEACHING_MODES = [
  { key: "online", en: "Online", ar: "عن بُعد" },
  { key: "offline", en: "Offline", ar: "حضوري" },
  { key: "both", en: "Both", ar: "كلاهما" },
] as const;

export const ACADEMIC_LEVELS = [
  { key: "bs", en: "BS / Undergraduate", ar: "بكالوريوس" },
  { key: "ms", en: "MS / Master's", ar: "ماجستير" },
  { key: "phd", en: "PhD", ar: "دكتوراه" },
  { key: "diploma", en: "Diploma", ar: "دبلوم" },
  { key: "other", en: "Other", ar: "أخرى" },
] as const;

// Teachers are managed from the admin panel and stored in the database.
// The public Teachers section loads them from /api/teachers (approved
// instructor records), so nothing is shown until an admin adds a teacher.

// Upload constraints
export const ACCEPTED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
export const ACCEPTED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];
export const MAX_UPLOAD_BYTES =
  (Number(process.env.MAX_UPLOAD_MB) || 8) * 1024 * 1024;

export function courseLabel(key: string, lang: "en" | "ar") {
  const c = COURSES.find((x) => x.key === key) || INSTRUCTOR_COURSES.find((x) => x.key === key);
  return c ? c[lang] : key;
}
