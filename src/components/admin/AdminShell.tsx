"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Megaphone,
  Image as ImageIcon,
  Mail,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { DarLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/instructors", label: "Teachers", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dam_admin_theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => res && setPending(res.data.totals.pending))
      .catch(() => {});
  }, []);

  function toggleTheme() {
    const nextVal = !dark;
    setDark(nextVal);
    document.documentElement.classList.toggle("dark", nextVal);
    localStorage.setItem("dam_admin_theme", nextVal ? "dark" : "light");
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-40 w-[250px] bg-gradient-to-b from-emerald-deep to-[#0a4a30] p-5 text-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white">
            <DarLogo className="h-8 w-8" />
          </div>
          <div>
            <p className="font-display text-lg leading-none">Dar Munira</p>
            <p className="text-xs text-white/50">Admin Console</p>
          </div>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-leaf/20 text-white shadow-inner"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign Out
        </button>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-emerald/10 bg-white/70 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-emerald-deep dark:text-white lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ms-auto flex items-center gap-2">
            <Link
              href="/admin/students"
              className="relative hidden items-center gap-1.5 rounded-full bg-emerald/10 px-3 py-1.5 text-xs font-medium text-emerald transition hover:bg-emerald/15 dark:bg-white/10 dark:text-white sm:inline-flex"
              title="Pending applications"
            >
              <Bell className="h-3.5 w-3.5" />
              {pending && pending > 0 ? `${pending} pending` : "Notifications"}
              {pending && pending > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {pending}
                </span>
              ) : null}
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-10 w-10 place-items-center rounded-xl bg-emerald/8 text-emerald-deep transition hover:bg-emerald/15 dark:bg-white/10 dark:text-white"
            >
              {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <div className="flex items-center gap-2 rounded-full bg-white/70 px-1.5 py-1.5 pe-3 shadow-sm dark:bg-white/10">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-leaf to-teal text-sm font-bold text-white">
                {adminName.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-emerald-deep dark:text-white sm:block">
                {adminName}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
