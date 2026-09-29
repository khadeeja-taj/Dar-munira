"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { Field, Input } from "@/components/ui/Field";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { BackLink } from "@/components/ui/BackLink";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Suspense } from "react";

function LoginInner() {
  const { d } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      router.push(params.get("from") || "/admin/dashboard");
      router.refresh();
    } else {
      setError(d.admin.invalid);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <BackLink href="/" label={d.nav.home} />
          <LanguageSwitch />
        </div>
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald/10 text-emerald">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-emerald-deep">
                {d.admin.login}
              </h1>
              <p className="text-sm text-brand-muted">{d.admin.loginLead}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <Field label={d.admin.email} required error={errors.email?.message}>
              <Input type="email" autoComplete="username" {...register("email")} />
            </Field>
            <Field label={d.admin.password} required error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
            </Field>
            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                {error}
              </p>
            )}
            <button type="submit" disabled={isSubmitting} className="btn-primary mt-1">
              <LogIn className="h-4 w-4" />
              {isSubmitting ? d.admin.signingIn : d.admin.signIn}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-brand-muted">
          Dar Munira · IIUI
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
