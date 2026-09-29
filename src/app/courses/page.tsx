import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { Courses } from "@/components/site/Courses";

export const metadata: Metadata = { title: "Courses & Programs" };

export default function CoursesPage() {
  return (
    <PageShell>
      <Courses />
    </PageShell>
  );
}
