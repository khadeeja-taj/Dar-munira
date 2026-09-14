import { z } from "zod";
import {
  COURSE_KEYS,
  INSTRUCTOR_COURSES,
  EXPERIENCE_YEARS,
  TEACHING_MODES,
} from "./constants";

const phoneRe = /^[+]?[\d\s()-]{7,20}$/;
const nameRe = /^[\p{L}\p{M}\s.'-]{2,80}$/u;

const instructorCourseKeys = INSTRUCTOR_COURSES.map((c) => c.key) as [string, ...string[]];
const experienceKeys = EXPERIENCE_YEARS.map((c) => c.key) as [string, ...string[]];
const modeKeys = TEACHING_MODES.map((c) => c.key) as [string, ...string[]];

export const studentSchema = z
  .object({
    fullName: z.string().regex(nameRe, "Enter a valid full name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().regex(phoneRe, "Enter a valid phone number"),
    fatherPhone: z
      .string()
      .regex(phoneRe, "Enter a valid phone number")
      .optional()
      .or(z.literal("")),
    nationality: z.string().min(2, "Required").max(60),
    registrationNo: z.string().min(2, "Required").max(40),
    universityId: z.string().max(40).optional().or(z.literal("")),
    department: z.string().max(80).optional().or(z.literal("")),
    specialization: z.string().max(80).optional().or(z.literal("")),
    academicLevel: z.string().max(40).optional().or(z.literal("")),
    course: z.enum(COURSE_KEYS as [string, ...string[]], {
      errorMap: () => ({ message: "Select a course" }),
    }),
    courseLevel: z.string().max(40).optional().or(z.literal("")),
    quranParts: z.string().max(120).optional().or(z.literal("")),
    studiedBefore: z.boolean().default(false),
    completedLevel: z.string().max(40).optional().or(z.literal("")),
    instituteName: z.string().max(120).optional().or(z.literal("")),
  })
  .refine(
    (d) => !d.studiedBefore || (d.completedLevel && d.completedLevel.length > 0),
    { message: "Select your completed level", path: ["completedLevel"] },
  );

export type StudentInput = z.infer<typeof studentSchema>;

export const instructorSchema = z.object({
  fullName: z.string().regex(nameRe, "Enter a valid full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRe, "Enter a valid phone number"),
  nationality: z.string().min(2, "Required").max(60),
  employeeNo: z.string().min(2, "Required").max(40),
  universityId: z.string().max(40).optional().or(z.literal("")),
  department: z.string().max(80).optional().or(z.literal("")),
  specialization: z.string().max(80).optional().or(z.literal("")),
  academicLevel: z.string().max(40).optional().or(z.literal("")),
  course: z.enum(instructorCourseKeys, {
    errorMap: () => ({ message: "Select a course" }),
  }),
  courseLevel: z.string().max(40).optional().or(z.literal("")),
  taughtBefore: z.boolean().default(false),
  highestLevelTaught: z.string().max(40).optional().or(z.literal("")),
  instituteName: z.string().max(120).optional().or(z.literal("")),
  experienceYears: z.enum(experienceKeys, {
    errorMap: () => ({ message: "Select your experience" }),
  }),
  teachingMode: z.enum(modeKeys, {
    errorMap: () => ({ message: "Select a teaching mode" }),
  }),
});

export type InstructorInput = z.infer<typeof instructorSchema>;

export const visitingSchema = z.object({
  fullName: z.string().regex(nameRe, "Enter a valid full name"),
  phone: z.string().regex(phoneRe, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  department: z.string().max(80).optional().or(z.literal("")),
  course: z.enum(COURSE_KEYS as [string, ...string[]], {
    errorMap: () => ({ message: "Select a course" }),
  }),
  preferredTime: z.string().max(40).optional().or(z.literal("")),
  preferredDate: z.string().max(40).optional().or(z.literal("")),
  daysCount: z.string().max(20).optional().or(z.literal("")),
});
export type VisitingInput = z.infer<typeof visitingSchema>;

// Admin-created visiting teacher (e.g. adding an existing/previous teacher).
// CV is not required here, and the admin may set the status.
export const visitingAdminSchema = visitingSchema.extend({
  // Admin may pick any course or type a custom one ("Other").
  course: z.string().min(1, "Select a course").max(80),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "ARCHIVED"])
    .default("APPROVED"),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
export type VisitingAdminInput = z.infer<typeof visitingAdminSchema>;

// Admin-created teacher (add an existing/known teacher directly, no public form).
export const instructorAdminSchema = z.object({
  fullName: z.string().regex(nameRe, "Enter a valid full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRe, "Enter a valid phone number"),
  nationality: z.string().min(2, "Required").max(60),
  employeeNo: z.string().min(1, "Required").max(40),
  // Admin may pick any course or type a custom one ("Other"), so accept any
  // non-empty label rather than restricting to a fixed list.
  course: z.string().min(1, "Select a course").max(80),
  department: z.string().max(80).optional().or(z.literal("")),
  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "ARCHIVED"])
    .default("APPROVED"),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
export type InstructorAdminInput = z.infer<typeof instructorAdminSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Required").max(80),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "Please write a longer message").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is too short"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const announcementSchema = z.object({
  // Titles and bodies are all optional — a single language is enough, and a
  // picture-only announcement is allowed. The API enforces that at least a
  // title, some text, or a picture is present.
  titleEn: z.string().max(160).optional().default(""),
  titleAr: z.string().max(160).optional().default(""),
  bodyEn: z.string().max(4000).optional().default(""),
  bodyAr: z.string().max(4000).optional().default(""),
  category: z.enum(["news", "course", "event", "deadline", "notice"]),
  pinned: z.boolean().default(false),
  published: z.boolean().default(true),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;
