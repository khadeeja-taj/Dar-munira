"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Info } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { SuccessCard } from "@/components/ui/SuccessCard";
import { Field, Input, Select } from "@/components/ui/Field";
import { FileUpload } from "@/components/ui/FileUpload";
import { visitingSchema, type VisitingInput } from "@/lib/validations";
import { COURSES, WHATSAPP_GROUP_URL } from "@/lib/constants";

export function VisitingForm() {
  const { d, lang } = useLang();
  const [cv, setCv] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VisitingInput>({ resolver: zodResolver(visitingSchema) });

  async function onSubmit(values: VisitingInput) {
    setSubmitError(null);
    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));
    if (cv) fd.append(`file:${d.visiting.uploadCv}`, cv);
    const res = await fetch("/api/register/visiting", { method: "POST", body: fd });
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
        title={d.visiting.title}
        message={d.visiting.success}
        home={d.nav.home}
        whatsappUrl={WHATSAPP_GROUP_URL}
        whatsappHint={d.form.whatsappHint}
        whatsappJoin={d.form.whatsappJoin}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-3xl p-6 sm:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={d.visiting.fullName} required error={errors.fullName?.message}>
          <Input {...register("fullName")} />
        </Field>
        <Field label={d.visiting.email} required error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label={d.visiting.phone} required error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="+92 3xx xxxxxxx" />
        </Field>
        <Field label={d.visiting.department} error={errors.department?.message}>
          <Input {...register("department")} />
        </Field>

        <div className="sm:col-span-2">
          <Field label={d.visiting.course} required error={errors.course?.message}>
            <Select {...register("course")}>
              <option value="">{d.form.select}</option>
              {COURSES.map((c) => (
                <option key={c.key} value={c.key}>
                  {lang === "ar" ? c.ar : c.en}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label={d.visiting.preferredDate} error={errors.preferredDate?.message}>
          <Input type="date" {...register("preferredDate")} />
        </Field>
        <Field label={d.visiting.preferredTime} error={errors.preferredTime?.message}>
          <Input type="time" {...register("preferredTime")} />
        </Field>
        <Field label={d.visiting.daysCount} error={errors.daysCount?.message}>
          <Input type="number" min={1} max={60} {...register("daysCount")} />
        </Field>

        <div className="sm:col-span-2">
          <FileUpload
            label={d.visiting.uploadCv}
            required
            value={cv}
            onChange={setCv}
          />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-emerald/5 p-3 text-sm text-emerald-deep">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {d.visiting.note}
      </div>

      {submitError && (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !cv}
        className="btn-accent mt-6"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? d.form.submitting : d.form.submit}
      </button>
    </form>
  );
}
