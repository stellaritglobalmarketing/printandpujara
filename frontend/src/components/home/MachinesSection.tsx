"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/Container";
import type { HomeMachine } from "@/services/homeService";
import { Settings2 } from "lucide-react";
import { ApiImage } from "./ApiImage";

export function MachinesSection({ machines }: { machines: HomeMachine[] | null }) {
  if (machines && machines.length === 0) return null;
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition },
  };
  return <motion.section className="machines-section" aria-labelledby="machines-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.5 } } }}>
    <Container>
      <motion.h2 id="machines-heading" className="solutions-heading" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } }}>Our <span className="text-brand-gradient">Printers</span></motion.h2>
      {!machines ? <p className="home-data-state">Machine details are temporarily unavailable. Please try again later.</p> : <motion.div className="machines-row" variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}>
        {machines.map(machine => <motion.div className="machine-card" key={machine.id} variants={cardVariants} tabIndex={0}>
          <ApiImage src={machine.featured_image_url} alt={machine.name} className="machine-card-image" />
          <div className="machine-card-overlay">
            <span className="machine-card-icon"><Settings2 size={16} aria-hidden="true" /></span>
            <h3>{machine.name}</h3>
            {machine.short_description && <p>{machine.short_description}</p>}
          </div>
        </motion.div>)}
      </motion.div>}
    </Container>
  </motion.section>;
}
