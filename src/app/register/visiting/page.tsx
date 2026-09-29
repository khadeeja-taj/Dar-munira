import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { VisitingForm } from "@/components/forms/VisitingForm";
import { VisitingHeader } from "@/components/forms/FormHeaders";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = { title: "Visiting Teacher Registration" };

export default function VisitingRegisterPage() {
  return (
    <PageShell>
      <div className="container-x max-w-4xl py-10">
        <div className="mb-6">
          <BackLink href="/register" />
        </div>
        <VisitingHeader />
        <VisitingForm />
      </div>
    </PageShell>
  );
}
