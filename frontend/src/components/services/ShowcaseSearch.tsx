"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { resolveImageUrl } from "@/lib/image-url";
import type { Service } from "@/types/service";

const HIGHLIGHT_MS = 6000;
const MAX_RESULTS = 8;

let releaseFocused: (() => void) | null = null;

// Scrolls to a service's category block and brings its card into view, freezing the marquee
// on that card for a few seconds so it doesn't slide away before the visitor sees it.
function focusService(id: number, smooth: boolean) {
  const card = document.getElementById(`service-${id}`);
  if (!card) return false;
  releaseFocused?.();
  const block = card.closest<HTMLElement>(".category-block") ?? card;
  block.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  const marquee = card.closest<HTMLElement>(".category-marquee");
  const track = marquee?.querySelector<HTMLElement>(".category-marquee-track");
  if (marquee && track) {
    const offset = Math.max(0, card.offsetLeft - (marquee.clientWidth - card.offsetWidth) / 2);
    track.classList.add("is-focused");
    track.style.transform = `translateX(${-offset}px)`;
  }
  card.classList.add("is-search-hit");
  const timer = window.setTimeout(() => releaseFocused?.(), HIGHLIGHT_MS);
  releaseFocused = () => {
    window.clearTimeout(timer);
    card.classList.remove("is-search-hit");
    track?.classList.remove("is-focused");
    if (track) track.style.transform = "";
    releaseFocused = null;
  };
  return true;
}

export function ShowcaseSearch({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services.filter(service => service.title.toLowerCase().includes(q) || service.category_name?.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [services, query]);

  // Menu and homepage links arrive as /services#category-<slug> or #service-<id>. The showcase streams in
  // after the loading screen, so the browser's own hash jump misses it; scroll once the page has loaded.
  useEffect(() => {
    let timer = 0;
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash);
      const service = /^#service-(\d+)$/.exec(hash);
      if (service) focusService(Number(service[1]), true);
      else if (hash.startsWith("#category-")) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const schedule = () => { timer = window.setTimeout(fromHash, 400); };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    window.addEventListener("hashchange", fromHash);
    return () => { window.clearTimeout(timer); window.removeEventListener("load", schedule); window.removeEventListener("hashchange", fromHash); releaseFocused?.(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const choose = (service: Service) => {
    setQuery(service.title);
    setOpen(false);
    setActive(-1);
    window.history.replaceState(null, "", `#service-${service.id}`);
    setNotFound(!focusService(service.id, !window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { setOpen(false); setActive(-1); return; }
    if (!results.length || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    event.preventDefault();
    setOpen(true);
    setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
  };

  const showResults = open && results.length > 0;
  return <div className="showcase-search" ref={wrapRef}>
    <form role="search" className="showcase-search-form" onSubmit={event => { event.preventDefault(); const pick = results[active] ?? results[0]; if (pick) choose(pick); else setNotFound(Boolean(query.trim())); }}>
      <span className="showcase-search-icon" aria-hidden="true"><Search size={17} /></span>
      <input
        type="search"
        role="combobox"
        value={query}
        placeholder="Search services, e.g. business card, flex, box…"
        aria-label="Search services"
        aria-autocomplete="list"
        aria-controls="showcase-search-results"
        aria-expanded={showResults}
        aria-activedescendant={showResults && active >= 0 ? `showcase-search-option-${results[active].id}` : undefined}
        onChange={event => { setQuery(event.target.value); setOpen(true); setActive(-1); setNotFound(false); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query && <button type="button" className="showcase-search-clear" aria-label="Clear search" onClick={() => { setQuery(""); setActive(-1); setNotFound(false); }}><X size={15} /></button>}
      <button type="submit" className="showcase-search-submit">Search</button>
    </form>
    {showResults && <ul className="showcase-search-results" id="showcase-search-results" role="listbox" aria-label="Matching services">
      {results.map((service, index) => <li key={service.id} id={`showcase-search-option-${service.id}`} role="option" aria-selected={index === active} className={index === active ? "is-active" : undefined} onPointerDown={event => event.preventDefault()} onClick={() => choose(service)} onPointerEnter={() => setActive(index)}>
        <span className="showcase-search-thumb">
          {service.featured_image_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={resolveImageUrl(service.featured_image_url) ?? undefined} alt="" loading="lazy" />
            : <Search size={14} aria-hidden="true" />}
        </span>
        <span className="showcase-search-text">
          <span className="showcase-search-title"><Highlight text={service.title} query={query} /></span>
          {service.category_name && <span className="showcase-search-category">{service.category_name}</span>}
        </span>
        <ArrowRight size={15} className="showcase-search-go" aria-hidden="true" />
      </li>)}
    </ul>}
    {notFound && <p className="showcase-search-empty" role="status">No service matches “{query.trim()}”. Try another word.</p>}
  </div>;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<mark>{text.slice(at, at + q.length)}</mark>{text.slice(at + q.length)}</>;
}
