import { Footer } from "@/components/layout/footer";
import { Capabilities } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { NewsSection } from "@/components/sections/news";
import { Products } from "@/components/sections/products";
import { Team } from "@/components/sections/team";

export const revalidate = 60;

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      <Hero />
      <Products />
      <Capabilities />
      <Team />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
