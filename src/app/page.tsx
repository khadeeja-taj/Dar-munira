import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Teachers } from "@/components/site/Teachers";
import { Gallery } from "@/components/site/Gallery";
import { News } from "@/components/site/News";
import { Contact } from "@/components/site/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <News />
        <Teachers />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
