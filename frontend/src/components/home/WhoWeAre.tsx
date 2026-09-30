"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function WhoWeAre() {
  const reducedMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.6 } },
  };
  return <motion.section className="who-we-are-section" aria-labelledby="who-we-are-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
    <Container>
      <div className="who-we-are-grid">
        <motion.div className="who-we-are-copy" variants={reveal}>
          <span className="who-we-are-eyebrow">Who we are</span>
          <h2 id="who-we-are-heading">A Legacy of<span>Printing Excellence</span></h2>
          <p className="who-we-are-description">Since 2007, Pujara Print N Pack has helped businesses bring their brands to life through thoughtful printing, packaging and a commitment to quality.</p>
          <p className="who-we-are-detail">Based in Andheri East, Mumbai, we bring offset, digital, packaging and large-format production together under one roof. From the first proof to the final delivery, our team takes care of every detail.</p>
          <Link href="/about" className="who-we-are-link">Discover Our Story <ArrowRight size={17} aria-hidden="true" /></Link>
        </motion.div>
        <motion.div className="who-we-are-visual" variants={reveal}>
          <div className="who-we-are-main-image">
            <Image src="/images/hero-offset-machine.jpg" alt="Illustration of an offset printing press producing colourful sheets" width={1920} height={1080} sizes="(max-width: 900px) 90vw, 45vw" className="who-we-are-art" />
            <div className="who-we-are-experience" aria-label="Printing since 2007"><span>Printing since</span><strong>2007</strong></div>
          </div>
          <div className="who-we-are-thumbnails">
            <figure><Image src="/images/who-we-are-packaging.jpg" alt="Custom printed product boxes with premium finishes" width={1000} height={1000} sizes="(max-width: 580px) 42vw, 190px" /><figcaption>Packaging</figcaption></figure>
            <figure><Image src="/images/printers-digital.jpg" alt="Colourful printed sheets emerging from a digital press" width={1000} height={1000} sizes="(max-width: 580px) 42vw, 190px" /><figcaption>Digital print</figcaption></figure>
          </div>
        </motion.div>
      </div>
    </Container>
  </motion.section>;
}
