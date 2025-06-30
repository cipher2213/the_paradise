"use client";

import { useParams } from "next/navigation";

// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import About from "./about";
import Faq from "./faq";
import Contact from "./contact";

export default function Portfolio() {
  const params = useParams();
  const tableId = params?.tableId as string | undefined;

  return (
    <>
      <Navbar />
      <Hero tableId={tableId} />
      <About />
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
      <Faq />
      
    </>
  );
}
