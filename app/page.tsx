import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Narrative } from "@/components/Narrative";
import { Work } from "@/components/Work";
import { Method } from "@/components/Method";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Narrative />
      <Work />
      <Method />
      <Contact />
    </main>
  );
}
