import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] pt-8">{children}</main>
      <Footer />
    </>
  );
}
