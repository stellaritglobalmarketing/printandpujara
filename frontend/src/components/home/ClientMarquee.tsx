"use client";

import { useState } from "react";
import type { HomeClient } from "@/services/homeService";
import { resolveImageUrl } from "@/lib/image-url";

// /seed-images/ logos are text placeholders from the initial seed, not real logos; they flash a broken image on the live site.
export const isShownClient = (client: HomeClient) => Boolean(client.logo_url) && !client.logo_url?.startsWith("/seed-images/");

export function ClientMarquee({ clients, limit = 10 }: { clients: HomeClient[]; limit?: number }) {
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());
  const visibleClients = clients
    .filter(client => isShownClient(client) && !brokenIds.has(client.id))
    .slice(0, limit);
  if (!visibleClients.length) return null;
  const markBroken = (id: number) => setBrokenIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  return <div className="client-marquee">
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
  </div>;
}
