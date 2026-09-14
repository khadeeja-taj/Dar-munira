"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/provider";
import { DarLogo, IIUILogo } from "@/components/ui/Logo";
import { SocialIcons } from "@/components/ui/Social";
import { COURSES } from "@/lib/constants";

export function Footer() {
  const { t, lang, d } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-emerald/10 bg-emerald-deep text-white/85">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <DarLogo className="h-11 w-11 rounded-xl" />
            <IIUILogo className="h-11 w-11 rounded-xl" />
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            {d.footer.tagline}
          </p>
          <div className="mt-5">
            <SocialIcons variant="light" />
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-white">
            {d.footer.quickLinks}
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/#teachers", "nav.teachers"],
              ["/#news", "nav.news"],
              ["/#contact", "nav.contact"],
              ["/register/student", "nav.student"],
              ["/register/instructor", "nav.instructor"],
            ].map(([href, key]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/70 transition hover:text-leaf"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-white">
            {d.footer.programs}
          </h4>
          <ul className="space-y-2 text-sm">
            {COURSES.map((c) => (
              <li key={c.key}>
                <Link
                  href="/#courses"
                  className="text-white/70 transition hover:text-leaf"
                >
                  {lang === "ar" ? c.ar : c.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-white">
            {d.footer.social}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{process.env.NEXT_PUBLIC_CONTACT_PHONE || "+92 51 9019082"}</li>
            <li>
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "dar.muneera@iiu.edu.pk"}
            </li>
            <li>{d.contact.addressValue}</li>
          </ul>
          <Link
            href="/admin/login"
            className="mt-5 inline-block text-xs text-white/40 transition hover:text-white/70"
          >
            {t("nav.admin")} →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {process.env.NEXT_PUBLIC_SITE_NAME || "Dar Munira"}.{" "}
            {d.footer.rights}
          </p>
          <p>{d.footer.builtBy}</p>
        </div>
      </div>
    </footer>
  );
}
