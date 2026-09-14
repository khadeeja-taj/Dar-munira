"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send, Info } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Stepper } from "@/components/ui/Stepper";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { Field, Input, Select, RadioPills } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";
import { instructorSchema, type InstructorInput } from "@/lib/validations";
import {
  INSTRUCTOR_COURSES,
  TAJWEED_LEVELS,
  TAUGHT_LEVELS,
  ACADEMIC_LEVELS,
  EXPERIENCE_YEARS,
  TEACHING_MODES,
  WHATSAPP_GROUP_URL,
} from "@/lib/constants";

type FilesState = Record<string, File | null>;

export function InstructorForm() {
  const { d, lang, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<FilesState>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const steps = [
    d.form.personal,
    d.form.academic,
    d.form.teachingInfo,
    d.form.documents,
  ];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InstructorInput>({
    resolver: zodResolver(instructorSchema),
    defaultValues: { taughtBefore: false } as any,
    mode: "onTouched",
  });

  const course = watch("course");
  const taughtBefore = watch("taughtBefore");
  const isTajweed = INSTRUCTOR_COURSES.find((c) => c.key === course)?.leveled;

  const stepFields: (keyof InstructorInput)[][] = [
    ["fullName", "email", "phone", "nationality", "employeeNo"],
    ["department", "specialization", "academicLevel"],
    ["course", "courseLevel", "taughtBefore", "highestLevelTaught", "instituteName", "experienceYears", "teachingMode"],
    [],
  ];

  async function next() {
    const valid = await trigger(stepFields[step] as any);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(values: InstructorInput) {
    setSubmitError(null);
    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));
    Object.entries(files).forEach(([label, file]) => {
      if (file) fd.append(`file:${label}`, file);
    });
    const res = await fetch("/api/register/instructor", {
      method: "POST",
      body: fd,
    });
    if (res.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (res.status === 409) setSubmitError(d.form.duplicate);
    else setSubmitError(d.form.error);
  }

  if (done) {
    return (
      <SuccessCard
        title={d.instructor.title}
        message={d.form.successInstructor}
        home={d.nav.home}
        whatsappUrl={WHATSAPP_GROUP_URL}
        whatsappHint={d.form.whatsappHint}
        whatsappJoin={d.form.whatsappJoin}
      />
    );
  }

  const setFile = (label: string) => (f: File | null) =>
    setFiles((prev) => ({ ...prev, [label]: f }));

  return (
    <div className="glass rounded-3xl p-6 sm:p-9">
      <Stepper steps={steps} current={step} />
      <p className="mt-4 text-sm text-brand-muted">
        {d.form.step} {step + 1} {d.form.of} {steps.length}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
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
            <Field label={d.form.employeeNo} required error={errors.employeeNo?.message}>
              <Input {...register("employeeNo")} />
            </Field>
          </div>
        )}

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

        {step === 2 && (
          <div className="grid gap-5">
            <Field label={d.form.selectCourseTeach} required error={errors.course?.message}>
              <Select {...register("course")}>
                <option value="">{d.form.select}</option>
                {INSTRUCTOR_COURSES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {lang === "ar" ? c.ar : c.en}
                  </option>
                ))}
              </Select>
            </Field>

            {isTajweed && (
              <Field label={d.form.level} error={errors.courseLevel?.message}>
                <RadioPills
                  name="courseLevel"
                  value={watch("courseLevel") || ""}
                  onChange={(v) => setValue("courseLevel", v)}
                  options={TAJWEED_LEVELS.map((l) => ({
                    value: l.key,
                    label: lang === "ar" ? l.ar : l.en,
                  }))}
                />
              </Field>
            )}

            <Field label={d.form.taughtBefore}>
              <RadioPills
                name="taughtBefore"
                value={taughtBefore ? "yes" : "no"}
                onChange={(v) => setValue("taughtBefore", v === "yes")}
                options={[
                  { value: "yes", label: d.form.yes },
                  { value: "no", label: d.form.no },
                ]}
              />
            </Field>

            {taughtBefore && (
              <div className="grid gap-5">
                <Field label={d.form.highestLevel} error={errors.highestLevelTaught?.message}>
                  <RadioPills
                    name="highestLevelTaught"
                    value={watch("highestLevelTaught") || ""}
                    onChange={(v) => setValue("highestLevelTaught", v)}
                    options={TAUGHT_LEVELS.map((l) => ({
                      value: l.key,
                      label: lang === "ar" ? l.ar : l.en,
                    }))}
                  />
                </Field>
                <Field label={d.form.instructorInstitute} error={errors.instituteName?.message}>
                  <Input {...register("instituteName")} />
                </Field>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={d.form.experience} required error={errors.experienceYears?.message}>
                <Select {...register("experienceYears")}>
                  <option value="">{d.form.select}</option>
                  {EXPERIENCE_YEARS.map((e) => (
                    <option key={e.key} value={e.key}>
                      {lang === "ar" ? e.ar : e.en}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={d.form.teachingMode} required error={errors.teachingMode?.message}>
                <RadioPills
                  name="teachingMode"
                  value={watch("teachingMode") || ""}
                  onChange={(v) => setValue("teachingMode", v)}
                  options={TEACHING_MODES.map((m) => ({
                    value: m.key,
                    label: lang === "ar" ? m.ar : m.en,
                  }))}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <FileUpload
              label={d.form.uploadCv}
              required
              value={files[d.form.uploadCv] || null}
              onChange={setFile(d.form.uploadCv)}
            />
            {submitError && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {submitError}
              </p>
            )}
          </div>
        )}

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
              type="submit"
              disabled={isSubmitting || !files[d.form.uploadCv]}
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
        {d.instructor.note}
      </div>
    </div>
  );
}
