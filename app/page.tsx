import { Footer } from "@/components/layout/footer";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Products } from "@/components/sections/products";
import { Team } from "@/components/sections/team";

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col pt-16">
      <Hero />
      <Products />
      <Capabilities />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}