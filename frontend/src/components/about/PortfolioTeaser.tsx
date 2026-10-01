"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const categories = [
  { title: "Offset & Digital Print", image: "/images/portfolio/brochure.webp", span: "tall" },
  { title: "Corporate Gifting", image: "/images/portfolio/packaging.webp", span: "normal" },
  { title: "Outdoor Branding", image: "/images/portfolio/banner.webp", span: "normal" },
  { title: "ID Cards", image: "/images/portfolio/business-cards.webp", span: "normal" },
  { title: "Diaries", image: "/images/portfolio/catalog.webp", span: "tall" },
  { title: "Trophies", image: "/images/portfolio/packaging.webp", span: "normal" },
  { title: "T-Shirts & Caps", image: "/images/portfolio/apparel.webp", span: "normal" },
];

export function PortfolioTeaser() {
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return <section className="about-portfolio-section">
    <Container>
      <div className="about-portfolio-heading">
        <SectionHeading eyebrow="Capabilities" title="What We Can Make For You" />
        <Link href="/#portfolio" className="about-portfolio-link">View Full Portfolio <ArrowRight size={16} /></Link>
      </div>
      <motion.div
        className="about-portfolio-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.08 } } }}
      >
        {categories.map((category, index) => <motion.div
          key={category.title}
          data-span={category.span}
          style={{ "--stack-index": index } as React.CSSProperties}
          variants={{ hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1, transition } }}
        >
          <Link href="/#portfolio" className="about-portfolio-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.image} alt={category.title} loading="lazy" className="about-portfolio-image" />
            <div className="about-portfolio-overlay" />
            <span className="about-portfolio-label">{category.title}</span>
          </Link>
        </motion.div>)}
      </motion.div>
    </Container>
  </section>;
}
