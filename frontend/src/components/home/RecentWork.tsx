"use client";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import type { HomeProject } from "@/services/homeService";
import type { PortfolioContent } from "@/services/portfolioService";
import { resolveImageUrl } from "@/lib/image-url";
import { ApiImage } from "./ApiImage";
import { WhatsAppLink } from "@/components/common/WhatsApp";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RecentWork({ projects, content }: { projects: HomeProject[] | null; content: PortfolioContent["recent_work"] | null }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * (track.current.clientWidth * 0.8), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  if (!content) return null;
  return <section className="work-section" id="portfolio"><Container className="work-layout">
    <div className="work-intro"><p className="eyebrow">{content.eyebrow}</p><h2>{content.title}</h2>
      <p style={{ whiteSpace: "pre-line" }}>{content.description}</p>
    </div>
    <div className="work-gallery">
      {!!projects?.length && <button className="gallery-arrow previous" onClick={() => scroll(-1)} aria-label="Previous projects"><ChevronLeft size={19} /></button>}
      <div className="work-track" ref={track} tabIndex={0} role="region" aria-label="Recent projects, scroll horizontally">{!projects ? <p className="home-data-state">Recent work is temporarily unavailable.</p> : projects.length === 0 ? <p className="home-data-state">New projects will be shared here soon.</p> : projects.map((item) => <article className="work-item" key={item.id}>
        <div className="work-photo-frame">
          <ApiImage src={resolveImageUrl(item.cover_image_url)} alt={item.title} className="work-photo" />
          <div className="work-quote-overlay">
            <WhatsAppLink service={{ title: item.title, category_name: null, short_description: item.short_description }} label={`Get a quote for ${item.title} on WhatsApp (opens in a new tab)`} className="work-quote-button">Get Quote</WhatsAppLink>
          </div>
        </div>
        <h3>{item.title}</h3>
      </article>)}</div>
      {!!projects?.length && <button className="gallery-arrow next" onClick={() => scroll(1)} aria-label="Next projects"><ChevronRight size={19} /></button>}
    </div>
  </Container></section>;
}
