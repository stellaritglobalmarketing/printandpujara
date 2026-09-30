"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/Container";
import type { HomeMachine } from "@/services/homeService";
import { Settings2 } from "lucide-react";
import { ApiImage } from "./ApiImage";

const printerGroups = [
  { type: "offset", title: "Offset Printing", description: "Sheet-fed presses for long runs, brand-accurate colour and packaging.", image: "/images/printers-offset.jpg" },
  { type: "digital", title: "Digital Printing", description: "Plate-free presses for short runs, vinyl, flex and personalised print.", image: "/images/printers-digital.jpg" },
] as const;

export function MachinesSection({ machines }: { machines: HomeMachine[] | null }) {
  const reducedMotion = useReducedMotion();
  if (machines && machines.length === 0) return null;
  const transition = { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition },
  };
  const rowVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } };
  const machineRow = (items: HomeMachine[]) => <motion.div className="machines-row" variants={rowVariants}>
    {items.map(machine => <motion.div className="machine-card" key={machine.id} variants={cardVariants} tabIndex={0}>
      <ApiImage src={machine.featured_image_url} alt={machine.name} className="machine-card-image" />
      <div className="machine-card-overlay">
        <span className="machine-card-icon"><Settings2 size={16} aria-hidden="true" /></span>
        <h3>{machine.name}</h3>
        {machine.short_description && <p>{machine.short_description}</p>}
      </div>
    </motion.div>)}
  </motion.div>;
  // Until every environment has machine_type, untyped data falls back to the single printer row.
  const groups = printerGroups.map(group => ({ ...group, items: machines?.filter(machine => machine.machine_type === group.type) ?? [] })).filter(group => group.items.length);
  return <motion.section className="machines-section" aria-labelledby="machines-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.5 } } }}>
    <Container>
      <motion.h2 id="machines-heading" className="solutions-heading" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } }}>Our <span className="text-brand-gradient">Printers</span></motion.h2>
      {!machines ? <p className="home-data-state">Machine details are temporarily unavailable. Please try again later.</p>
        : !groups.length ? machineRow(machines)
        : groups.map(group => <motion.div className="printer-group" key={group.type} aria-labelledby={`printer-group-${group.type}`} role="group" variants={rowVariants}>
          <div className="printer-group-head">
            <Image src={group.image} alt="" width={72} height={72} className="printer-group-thumb" />
            <div>
              <h3 id={`printer-group-${group.type}`}>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            <span className="printer-group-count">{group.items.length} {group.items.length === 1 ? "machine" : "machines"}</span>
          </div>
          {machineRow(group.items)}
        </motion.div>)}
    </Container>
  </motion.section>;
}
