"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Service, ServiceCategory } from "@/types/service";
import { ApiImage } from "./ApiImage";
import { resolveImageUrl } from "@/lib/image-url";

const ALL = "all";

// Category tabs over a horizontally scrolling rail of every service, so each tab shows real products.
export function WhatWePrint({ categories, services }: { categories: ServiceCategory[] | null; services: Service[] | null }) {
  const reducedMotion = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(ALL);
  if (!services?.length) return null;
  const tabs = (categories ?? []).filter(category => services.some(service => service.category_slug === category.slug));
  const visible = active === ALL ? services : services.filter(service => service.category_slug === active);
  const select = (slug: string) => {
    setActive(slug);
    railRef.current?.scrollTo({ left: 0, behavior: "instant" });
  };
  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: reducedMotion ? "instant" : "smooth" });
  };
  return <motion.section className="what-we-print" id="services" aria-labelledby="what-we-print-heading" initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.55 }}>
    <Container>
      <div className="what-we-print-head">
        <h2 id="what-we-print-heading">What We <span className="text-brand-gradient">Print</span></h2>
        <p>Browse our full range of printing products across every category.</p>
      </div>
      <div className="what-we-print-tabs" role="tablist" aria-label="Print categories">
        {[{ slug: ALL, name: "All" }, ...tabs].map(tab => <button key={tab.slug} type="button" role="tab" id={`wwp-tab-${tab.slug}`} aria-selected={active === tab.slug} aria-controls="wwp-panel" className="what-we-print-tab" onClick={() => select(tab.slug)}>{tab.name}</button>)}
      </div>
      <div className="what-we-print-rail-wrap" id="wwp-panel" role="tabpanel" aria-labelledby={`wwp-tab-${active}`}>
        <button type="button" className="what-we-print-arrow what-we-print-arrow-prev" onClick={() => scroll(-1)} aria-label="Scroll products left"><ArrowLeft size={18} /></button>
        <ul className="what-we-print-rail" ref={railRef}>
          {visible.map(service => <li key={service.id} className="what-we-print-item">
            <Link href={`/services#service-${service.id}`} className="what-we-print-card">
              <span className="what-we-print-image"><ApiImage src={resolveImageUrl(service.featured_image_url)} alt="" /></span>
              <span className="what-we-print-title">{service.title}</span>
            </Link>
          </li>)}
        </ul>
        <button type="button" className="what-we-print-arrow what-we-print-arrow-next" onClick={() => scroll(1)} aria-label="Scroll products right"><ArrowRight size={18} /></button>
      </div>
      <div className="what-we-print-more">
        <Link href={active === ALL ? "/services" : `/services#category-${active}`}>Explore all services <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </Container>
  </motion.section>;
}
