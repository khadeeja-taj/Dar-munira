import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BotanicalBackdrop />
      <Navbar />
      <main className="min-h-[70vh] pt-8">{children}</main>
      <Footer />
    </>
  );
}
