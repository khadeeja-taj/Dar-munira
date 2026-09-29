"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SocialIcons } from "@/components/ui/Social";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function Contact() {
  const { d } = useLang();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setSent(true);
      reset();
    }
  }

  const info = [
    {
      icon: Phone,
      label: d.contact.phone,
      value: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 51 9019082",
    },
    {
      icon: Mail,
      label: d.contact.email,
      value: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dar.muneera@iiu.edu.pk",
    },
    { icon: MapPin, label: d.contact.address, value: d.contact.addressValue },
  ].filter((it) => it.value && it.value.trim().length > 0);

  return (
    <section id="contact" className="container-x scroll-mt-24 py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="section-kicker">{d.contact.kicker}</span>
        <h2 className="mt-3 font-display text-4xl text-emerald-deep">
          {d.contact.title}
        </h2>
        <p className="mt-4 leading-relaxed text-brand-muted">{d.contact.lead}</p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        {/* Info + map */}
        <Reveal className="lg:col-span-2">
          <div className="glass flex h-full flex-col gap-5 rounded-2xl p-7">
            {info.map((it) => (
              <div key={it.label} className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald/10 text-emerald">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-muted">
                    {it.label}
                  </p>
                  <p className="font-medium text-emerald-deep">{it.value}</p>
                </div>
              </div>
            ))}

            <div className="mt-1 overflow-hidden rounded-xl border border-emerald/10">
              <iframe
                title="map"
                className="h-44 w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=International+Islamic+University+Islamabad&output=embed"
              />
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-brand-muted">
                {d.contact.followUs}
              </p>
              <SocialIcons variant="dark" />
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal className="lg:col-span-3" delay={0.1}>
          <div className="glass rounded-2xl p-7">
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-leaf" />
                <p className="font-display text-xl text-emerald-deep">
                  {d.contact.sent}
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-2"
                >
                  {d.contact.send}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 sm:grid-cols-2"
              >
                <Field
                  label={d.contact.name}
                  required
                  error={errors.name?.message}
                >
                  <Input {...register("name")} />
                </Field>
                <Field
                  label={d.contact.email}
                  required
                  error={errors.email?.message}
                >
                  <Input type="email" {...register("email")} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={d.contact.subject} error={errors.subject?.message}>
                    <Input {...register("subject")} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label={d.contact.message}
                    required
                    error={errors.message?.message}
                  >
                    <Textarea rows={5} {...register("message")} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {d.contact.send}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
