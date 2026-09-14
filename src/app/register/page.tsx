import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { RegisterChooser } from "@/components/site/RegisterChooser";

export const metadata: Metadata = { title: "Get Started" };

export default function RegisterPage() {
  return (
    <PageShell>
      <RegisterChooser />
    </PageShell>
  );
}
