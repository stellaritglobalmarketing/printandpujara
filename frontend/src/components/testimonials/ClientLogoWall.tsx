"use client";

import { useEffect, useRef, useState } from "react";
import type { ClientLogo } from "@/services/clientService";
import { resolveImageUrl } from "@/lib/image-url";
import { isShownClient } from "@/components/home/ClientMarquee";

const SPOTLIGHT_MS = 1800;
const MAX_STAGGER_MS = 1600;

// Logos pop in one after another when the wall scrolls into view, then a random logo
// "pops" every couple of seconds so the wall keeps a little life without constant motion.
export function ClientLogoWall({ clients }: { clients: ClientLogo[] }) {
  const wallRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);
  const [spot, setSpot] = useState(-1);
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());
  const shown = clients.filter(client => isShownClient(client) && !brokenIds.has(client.id));

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || shown.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setSpot(previous => {
        let next = Math.floor(Math.random() * shown.length);
        if (next === previous) next = (next + 1) % shown.length;
        return next;
      });
    }, SPOTLIGHT_MS);
    return () => window.clearInterval(timer);
  }, [visible, shown.length]);

  if (!shown.length) return null;
  const stagger = Math.min(60, MAX_STAGGER_MS / shown.length);
  const markBroken = (id: number) => setBrokenIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  return <ul ref={wallRef} className={`client-wall${visible ? " is-visible" : ""}`} aria-label="Our clients">
    {shown.map((client, index) => <li
      key={client.id}
      className={`client-wall-item${index === spot ? " is-spot" : ""}`}
      style={{ animationDelay: `${Math.round(index * stagger)}ms` }}
      title={client.company_name || undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveImageUrl(client.logo_url) ?? undefined} alt={client.company_name || "Client logo"} loading="lazy" onError={() => markBroken(client.id)} />
    </li>)}
  </ul>;
}
