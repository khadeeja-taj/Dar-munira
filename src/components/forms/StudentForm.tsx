"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Send, Info, Search, History } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Stepper } from "@/components/ui/Stepper";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { Field, Input, Select, RadioPills } from "@/components/ui/Field";
import { JuzPicker } from "@/components/ui/JuzPicker";
import { studentSchema, type StudentInput } from "@/lib/validations";
import { COMPLETED_LEVELS, ACADEMIC_LEVELS, WHATSAPP_GROUP_URL } from "@/lib/constants";

type CourseOpt = { id: string; titleEn: string; titleAr: string };
type HistoryRow = { course: string; status: string; createdAt: string };

export function StudentForm() {
  const { d, lang, dir } = useLang();
  const params = useSearchParams();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const preId = params.get("courseId") || "";
  const preTitle = params.get("course") || "";
  const fromCard = !!preId;

  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [courses, setCourses] = useState<CourseOpt[]>([]);

  // Returning-student lookup
  const [lookupReg, setLookupReg] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupMsg, setLookupMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRow[] | null>(null);

  // Steps end with a Review step so the user confirms everything and submits
  // themselves. Coming from a course card skips the Course-selection step.
  const steps = fromCard
    ? [d.form.personal, d.form.academic, d.form.review]
    : [d.form.personal, d.form.academic, d.form.courseInfo, d.form.review];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      course: preTitle,
      courseId: preId,
      studiedBefore: false,
    } as any,
    mode: "onTouched",
  });

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => setCourses(res.data || []))
      .catch(() => setCourses([]));
  }, []);

  const studiedBefore = watch("studiedBefore");

  // Juz' (parts) selection — shown for Qur'an memorization / recitation courses.
  const [juz, setJuz] = useState<number[]>([]);
  const selCourseId = watch("courseId") || preId;
  const selCourseTitle = watch("course") || preTitle;
  const showJuz =
    ["prog-hifz-quran", "prog-tilawah"].includes(selCourseId) ||
    /hifz|tilaw/i.test(selCourseTitle) ||
    /حفظ\s*القرآن|تلاوة/.test(selCourseTitle);

  // Human-readable academic level for the review summary.
  const acadItem = ACADEMIC_LEVELS.find((a) => a.key === watch("academicLevel"));
  const acadLevelLabel = acadItem ? (lang === "ar" ? acadItem.ar : acadItem.en) : "";

  const stepFields: (keyof StudentInput)[][] = fromCard
    ? [
        ["fullName", "email", "phone", "nationality", "registrationNo"],
        ["department", "specialization", "academicLevel"],
      ]
    : [
        ["fullName", "email", "phone", "nationality", "registrationNo"],
        ["department", "specialization", "academicLevel"],
        ["course", "studiedBefore", "completedLevel", "instituteName"],
      ];

  async function next() {
    const valid = await trigger(stepFields[step] as any);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function lookup() {
    if (lookupReg.trim().length < 2) return;
    setLookupBusy(true);
    setLookupMsg(null);
    try {
      const res = await fetch(
        `/api/register/student/lookup?reg=${encodeURIComponent(lookupReg.trim())}`,
      );
      const json = await res.json();
      if (res.ok && json.data?.found) {
        const p = json.data.profile;
        // Pre-fill personal + academic info from the saved record.
        setValue("fullName", p.fullName || "");
        setValue("email", p.email || "");
        setValue("phone", p.phone || "");
        setValue("nationality", p.nationality || "");
        setValue("registrationNo", p.registrationNo || "");
        setValue("universityId", p.universityId || "");
        setValue("department", p.department || "");
        setValue("specialization", p.specialization || "");
        setValue("academicLevel", p.academicLevel || "");
        setHistory(json.data.history || []);
        setLookupMsg(null);
        // Details are filled in. If a course is already chosen (came from a
        // course card): for Hifz/Tilawah go to the Academic step so they can
        // pick their juz'; otherwise jump straight to the Review step.
        if (fromCard) {
          setStep(showJuz ? 1 : steps.length - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setHistory(null);
        setLookupMsg(d.form.lookupNotFound);
      }
    } catch {
      setLookupMsg(d.form.error);
    } finally {
      setLookupBusy(false);
    }
  }

  async function onSubmit(values: StudentInput) {
    setSubmitError(null);
    const fd = new FormData();
    fd.append(
      "payload",
      JSON.stringify({
        ...values,
        quranParts: showJuz && juz.length ? juz.join(",") : undefined,
      }),
    );
    const res = await fetch("/api/register/student", { method: "POST", body: fd });
    if (res.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (res.status === 409) setSubmitError(d.form.duplicate);
    else setSubmitError(d.form.error);
  }

  // The form never submits on its own. Pressing Enter only advances the
  // earlier steps; on the Review step it does nothing — the user must click
  // the Submit button (which calls submitNow) themselves.
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps.length - 1) next();
  }

  function submitNow() {
    handleSubmit(onSubmit)();
  }

  if (done) {
    return (
      <SuccessCard
        title={d.student.title}
        message={d.form.successStudent}
        home={d.nav.home}
        whatsappUrl={WHATSAPP_GROUP_URL}
        whatsappHint={d.form.whatsappHint}
        whatsappJoin={d.form.whatsappJoin}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Returning student lookup */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-deep">
          <History className="h-4 w-4" />
          {d.form.returningTitle}
        </div>
        <p className="mt-1 text-xs text-brand-muted">{d.form.returningHint}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            className="field-input max-w-xs flex-1"
            placeholder={d.form.registrationNo}
            value={lookupReg}
            onChange={(e) => setLookupReg(e.target.value)}
          />
          <button
            type="button"
            onClick={lookup}
            disabled={lookupBusy}
            className="btn-primary !py-2 text-sm"
          >
            <Search className="h-4 w-4" />
            {lookupBusy ? "…" : d.form.lookupBtn}
          </button>
        </div>
        {lookupMsg && <p className="mt-2 text-sm text-rose-600">{lookupMsg}</p>}
        {history && (
          <div className="mt-3 rounded-xl bg-emerald/5 p-3">
            <p className="text-xs font-semibold text-emerald-deep">
              {d.form.yourCourses}
            </p>
            {history.length === 0 ? (
              <p className="mt-1 text-xs text-brand-muted">{d.form.noCoursesYet}</p>
            ) : (
              <ul className="mt-1 space-y-1">
                {history.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm text-emerald-deep"
                  >
                    <span>{h.course}</span>
                    <span className="chip bg-teal/10 text-teal">{h.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-brand-muted">{d.form.prefilled}</p>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-6 sm:p-9">
        <Stepper steps={steps} current={step} />
        <p className="mt-4 text-sm text-brand-muted">
          {d.form.step} {step + 1} {d.form.of} {steps.length}
        </p>

        <form onSubmit={handleFormSubmit} className="mt-6">
          {/* Step 1 — Personal */}
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={d.form.fullName} required error={errors.fullName?.message}>
                <Input {...register("fullName")} />
              </Field>
              <Field label={d.form.emailAddress} required error={errors.email?.message}>
                <Input type="email" {...register("email")} />
              </Field>
              <Field label={d.form.phoneNumber} required error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="+92 3xx xxxxxxx" />
              </Field>
              <Field label={d.form.nationality} required error={errors.nationality?.message}>
                <Input {...register("nationality")} />
              </Field>
              <Field
                label={d.form.registrationNo}
                required
                error={errors.registrationNo?.message}
              >
                <Input {...register("registrationNo")} />
              </Field>
            </div>
          )}

          {/* Step 2 — Academic */}
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={d.form.department} error={errors.department?.message}>
                <Input {...register("department")} />
              </Field>
              <Field label={d.form.specialization} error={errors.specialization?.message}>
                <Input {...register("specialization")} />
              </Field>
              <Field label={d.form.academicLevel} error={errors.academicLevel?.message}>
                <Select {...register("academicLevel")}>
                  <option value="">{d.form.select}</option>
                  {ACADEMIC_LEVELS.map((a) => (
                    <option key={a.key} value={a.key}>
                      {lang === "ar" ? a.ar : a.en}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          )}

          {/* Qur'an parts (juz') picker — for Hifz / Tilawah courses. */}
          {step === 1 && showJuz && (
            <div className="mt-6">
              <label className="field-label mb-2 block">{d.form.juzLabel}</label>
              <JuzPicker value={juz} onChange={setJuz} />
            </div>
          )}

          {/* Step 3 — Course (only when not coming from a card) */}
          {!fromCard && step === 2 && (
            <div className="grid gap-5">
              <Field label={d.form.selectCourse} required error={errors.course?.message}>
                <Select
                  value={watch("course") || ""}
                  onChange={(e) => {
                    const opt = courses.find((c) => c.titleEn === e.target.value);
                    setValue("course", e.target.value);
                    setValue("courseId", opt?.id || "");
                  }}
                >
                  <option value="">{d.form.select}</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.titleEn}>
                      {lang === "ar" ? c.titleAr : c.titleEn}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={d.form.studiedBefore}>
                <RadioPills
                  name="studiedBefore"
                  value={studiedBefore ? "yes" : "no"}
                  onChange={(v) => setValue("studiedBefore", v === "yes")}
                  options={[
                    { value: "yes", label: d.form.yes },
                    { value: "no", label: d.form.no },
                  ]}
                />
              </Field>

              {studiedBefore && (
                <>
                  <Field label={d.form.completedLevel} error={errors.completedLevel?.message}>
                    <RadioPills
                      name="completedLevel"
                      value={watch("completedLevel") || ""}
                      onChange={(v) => setValue("completedLevel", v)}
                      options={COMPLETED_LEVELS.map((l) => ({
                        value: l.key,
                        label: lang === "ar" ? l.ar : l.en,
                      }))}
                    />
                  </Field>
                  <Field label={d.form.studentInstitute} error={errors.instituteName?.message}>
                    <Input {...register("instituteName")} />
                  </Field>
                </>
              )}
            </div>
          )}

          {/* Final step — Review everything, then the user submits themselves. */}
          {step === steps.length - 1 && (
            <div className="grid gap-1">
              <p className="mb-1 text-sm font-semibold text-emerald-deep">
                {d.form.review}
              </p>
              {(
                [
                  [d.form.fullName, watch("fullName")],
                  [d.form.emailAddress, watch("email")],
                  [d.form.phoneNumber, watch("phone")],
                  [d.form.nationality, watch("nationality")],
                  [d.form.registrationNo, watch("registrationNo")],
                  [d.form.department, watch("department")],
                  [d.form.specialization, watch("specialization")],
                  [d.form.academicLevel, acadLevelLabel],
                  [d.form.selectCourse, watch("course") || preTitle],
                  [d.form.juzLabel, showJuz && juz.length ? juz.join(", ") : ""],
                ] as [string, string | undefined][]
              )
                .filter(([, v]) => v)
                .map(([label, value], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 border-b border-emerald/10 py-2 text-sm"
                  >
                    <span className="text-brand-muted">{label}</span>
                    <span className="text-right font-medium text-emerald-deep">
                      {value}
                    </span>
                  </div>
                ))}
              <p className="mt-2 text-xs text-brand-muted">{d.form.reviewNote}</p>
            </div>
          )}

          {submitError && (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {submitError}
            </p>
          )}

          {/* On the earlier steps (not review), remind which course was chosen. */}
          {fromCard && preTitle && step < steps.length - 1 && (
            <p className="mt-4 rounded-xl bg-emerald/5 px-4 py-3 text-sm text-emerald-deep">
              {d.form.selectCourse}: <strong>{preTitle}</strong>
            </p>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:invisible"
            >
              <BackArrow className="h-4 w-4" />
              {d.form.back}
            </button>

            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">
                {d.form.next}
                <Arrow className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitNow}
                disabled={isSubmitting}
                className="btn-accent"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? d.form.submitting : d.form.submit}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald/5 p-3 text-sm text-emerald-deep">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {d.student.note}
        </div>
      </div>
    </div>
  );
}
