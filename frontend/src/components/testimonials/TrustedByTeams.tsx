"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ClientLogo } from "@/services/clientService";
import { resolveImageUrl } from "@/lib/image-url";

function chunk<T>(items: T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, i) => items.slice(i * size, i * size + size)).filter(row => row.length);
}

function ClientChip({ client, duplicate }: { client: ClientLogo; duplicate: boolean }) {
  const [broken, setBroken] = useState(false);
  // Name-only wordmarks are unreadable at chip size; the chip already prints the name, so show the initial instead.
  const src = client.logo_url?.includes("-wordmark.") ? null : resolveImageUrl(client.logo_url);
  const name = client.company_name || "Client";
  return <li className="trusted-chip" aria-hidden={duplicate || undefined}>
    <span className="trusted-chip-icon">
      {src && !broken
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} />
        : <span className="trusted-chip-fallback">{name.trim().charAt(0).toUpperCase()}</span>}
    </span>
    <span className="trusted-chip-name">{name}</span>
  </li>;
}

function TrustedRow({ clients, tint, reverse }: { clients: ClientLogo[]; tint: "a" | "b" | "c"; reverse?: boolean }) {
  return <div className={`trusted-row trusted-row-${tint}`}>
    <ChevronLeft className="trusted-row-arrow" size={16} aria-hidden="true" />
    <div className="trusted-row-window">
      <div className={`trusted-row-track${reverse ? " trusted-row-track-reverse" : ""}`}>
        {[false, true].map(duplicate => <ul className="trusted-row-group" key={String(duplicate)}>
          {clients.map(client => <ClientChip key={`${duplicate}-${client.id}`} client={client} duplicate={duplicate} />)}
        </ul>)}
      </div>
    </div>
    <ChevronRight className="trusted-row-arrow" size={16} aria-hidden="true" />
  </div>;
}

export function TrustedByTeams({ clients }: { clients: ClientLogo[] }) {
  const [paused, setPaused] = useState(false);
  const eligible = clients.filter(client => client.company_name);
  if (eligible.length < 3) return null;
  const rows = chunk(eligible, 3);
  return <section className="trusted-section" aria-labelledby="trusted-heading" data-paused={paused || undefined}>
    <div className="trusted-heading-row">
      <h2 id="trusted-heading">Trusted by Teams <span className="text-brand-gradient">That Build, Move and Grow</span></h2>
      <button type="button" className="trusted-pause" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        {paused ? "Resume animation" : "Pause animation"}
      </button>
    </div>
    <div className="trusted-rows">
      {rows.map((row, index) => <TrustedRow key={index} clients={row} tint={(["a", "b", "c"] as const)[index % 3]} reverse={index === 1} />)}
    </div>
  </section>;
}
