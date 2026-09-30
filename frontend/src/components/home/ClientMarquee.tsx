"use client";

import { useState } from "react";
import type { HomeClient } from "@/services/homeService";
import { resolveImageUrl } from "@/lib/image-url";

// These company logos are missing/broken in the CMS and keep flashing a broken-image icon before onError removes them.
const HIDDEN_CLIENT_NAMES = new Set(["autocp india pvt. ltd.", "avon corporation ltd."]);

export const isShownClient = (client: HomeClient) => Boolean(client.logo_url) && !HIDDEN_CLIENT_NAMES.has((client.company_name || "").trim().toLowerCase());

export function ClientMarquee({ clients, limit = 10 }: { clients: HomeClient[]; limit?: number }) {
  const [paused, setPaused] = useState(false);
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());
  const visibleClients = clients
    .filter(client => isShownClient(client) && !brokenIds.has(client.id))
    .slice(0, limit);
  if (!visibleClients.length) return null;
  const markBroken = (id: number) => setBrokenIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  return <div className="client-marquee" data-paused={paused}>
    <div className="client-marquee-window">
      <div className="client-marquee-track">
        {[false, true].map(duplicate => <ul className="client-marquee-group" key={String(duplicate)} aria-hidden={duplicate || undefined} aria-label={duplicate ? undefined : "Our clients"}>
          {visibleClients.map(client => <li className="client-marquee-item" key={client.id} title={client.company_name || undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageUrl(client.logo_url) ?? undefined}
              alt={duplicate ? "" : client.company_name || "Client logo"}
              loading="lazy"
              className="client-marquee-logo"
              onError={() => markBroken(client.id)}
            />
            {client.company_name && <span className="sr-only">{client.company_name}</span>}
          </li>)}
        </ul>)}
      </div>
    </div>
    <button type="button" className="client-marquee-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume scrolling" : "Pause scrolling"}</button>
  </div>;
}
