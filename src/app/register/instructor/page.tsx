import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { InstructorForm } from "@/components/forms/InstructorForm";
import { InstructorHeader } from "@/components/forms/FormHeaders";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "Instructor Application" };

export default function InstructorRegisterPage() {
  return (
    <PageShell>
      <div className="container-x max-w-4xl py-10">
        <div className="mb-6">
          <BackLink href="/register" />
        </div>
        <InstructorHeader />
        <InstructorForm />
      </div>
    </PageShell>
  );
}
