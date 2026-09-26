"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/Container";
import type { ServiceCategory } from "@/types/service";
import { ArrowRight } from "lucide-react";
import { ApiImage } from "./ApiImage";
import { servicesUrl } from "@/lib/services-url";
import { resolveImageUrl } from "@/lib/image-url";

const MotionLink = motion.create(Link);

// Category descriptions are written for the Services page header, not this compact teaser card.
function teaser(category: ServiceCategory) {
  if (!category.description) return `Explore our ${category.name.toLowerCase()} range.`;
  const [firstSentence] = category.description.split(/(?<=[.!?])\s/);
  return firstSentence.length > 90 ? `${firstSentence.slice(0, 87).trimEnd()}…` : firstSentence;
}

export function SolutionsGrid({ categories: allCategories }: { categories: ServiceCategory[] | null }) {
  // The homepage teaser is a single row of highlights; the full category list lives on /services.
  const categories = allCategories?.slice(0, 6) ?? allCategories;
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition },
  };
  return <motion.section className="solutions-section" id="services" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.55 } } }}>
    <Container>
      <motion.h2 className="solutions-heading" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } }}>Our <span className="text-brand-gradient">Services</span> &amp; Print Solutions</motion.h2>
      <motion.div className="solutions-row" variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}>
        {!categories ? <p className="home-data-state">Services are temporarily unavailable. Please try again later.</p> : categories.length === 0 ? <p className="home-data-state">Our services will be available here soon.</p> : categories.map((category) => <MotionLink href={servicesUrl({ category: category.slug, featured: false, page: 1 })} className="solution-card" key={category.slug} variants={cardVariants} whileHover={reducedMotion ? undefined : { y: -8, transition: { ...transition, duration: 0.22 } }} aria-label={`Explore ${category.name} services`}>
          <div className="solution-image-frame"><ApiImage src={resolveImageUrl(category.image_url)} alt={category.name} /></div>
          <h3>{category.name}</h3>
          <div className="solution-description"><p>{teaser(category)}</p>
            <span aria-hidden="true"><ArrowRight size={14} /></span>
          </div>
        </MotionLink>)}
      </motion.div>
    </Container>
  </motion.section>;
}
