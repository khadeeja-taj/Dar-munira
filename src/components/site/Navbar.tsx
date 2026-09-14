"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { DarLogo, IIUILogo } from "@/components/ui/Logo";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { SocialIcons } from "@/components/ui/Social";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#home", key: "nav.home" },
  { href: "/#courses", key: "nav.courses" },
  { href: "/#teachers", key: "nav.teachers" },
  { href: "/#gallery", key: "nav.gallery" },
  { href: "/#news", key: "nav.news" },
  { href: "/#contact", key: "nav.contact" },
];

export function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-emerald/10 bg-white/70 backdrop-blur-[18px] shadow-glass"
          : "bg-white/40 backdrop-blur-[10px]",
      )}
    >
      <nav className="container-x flex items-center gap-3 py-3">
        <Link href="/#home" className="flex items-center gap-2">
          <DarLogo className="h-12 w-12 rounded-xl" />
          <IIUILogo className="h-12 w-12 rounded-xl" />
        </Link>

        {/* Desktop links */}
        <ul className="mx-auto hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-emerald-deep/80 transition hover:bg-emerald/8 hover:text-emerald-deep"
              >
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <div className="hidden lg:block">
            <SocialIcons variant="dark" />
          </div>
          <LanguageSwitch />
          <Link
            href="/admin/login"
            className="hidden whitespace-nowrap rounded-full border border-emerald/20 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-deep transition hover:bg-white lg:inline-flex"
          >
            {t("nav.admin")}
          </Link>
          <Link
            href="/register"
            className="hidden whitespace-nowrap rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:bg-emerald-soft sm:inline-flex"
          >
            {t("hero.getStarted")}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-emerald-deep lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-emerald/10 bg-white/90 backdrop-blur-lg lg:hidden">
          <ul className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-emerald-deep hover:bg-emerald/8"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn-primary flex-1"
              >
                {t("hero.getStarted")}
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="btn-ghost flex-1"
              >
                {t("nav.admin")}
              </Link>
            </li>
            <li className="mt-3">
              <SocialIcons variant="dark" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
