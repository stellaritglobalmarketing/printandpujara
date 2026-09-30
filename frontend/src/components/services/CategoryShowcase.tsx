import { Check, Printer } from "lucide-react";
import type { Service, ServiceCategory } from "@/types/service";
import { WhatsAppLink } from "@/components/common/WhatsApp";
import { ApiImage } from "@/components/home/ApiImage";
import { resolveImageUrl } from "@/lib/image-url";
import { categoryHighlights, categorySummaries } from "@/lib/site-data";

const MARQUEE_MIN_ITEMS = 5;

function ProductCard({ service, hidden }: { service: Service; hidden?: boolean }) {
  // Only the first copy of a marquee item carries the id, so #service-<id> links and the search land on one card.
  return <div className="category-product-card" role="listitem" aria-hidden={hidden} id={hidden ? undefined : `service-${service.id}`}>
    <div className="category-product-image">
      {service.featured_image_url ? (
        // Hosted API images may come from different image providers.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveImageUrl(service.featured_image_url) ?? undefined} alt={service.title} loading="lazy" />
      ) : <Printer size={40} className="text-brand-violet/40" aria-hidden="true" />}
      <div className="category-product-overlay">
        <WhatsAppLink service={service} label={`Get a quick quote for ${service.title} on WhatsApp`} className="category-product-quote">Get Quote</WhatsAppLink>
      </div>
    </div>
    <p>{service.title}</p>
  </div>;
}

export function CategoryShowcase({ categories, servicesByCategory }: { categories: ServiceCategory[]; servicesByCategory: Record<string, Service[]> }) {
  // Number and alternate sides using only categories that actually render — a category with
  // no services (skipped below) must not break the left/right alternation or leave a gap in numbering.
  const groups = categories
    .map(category => ({ category, services: servicesByCategory[category.slug] ?? [] }))
    .filter(group => group.services.length > 0);

  return <div className="category-showcase-list">
    {groups.map(({ category, services }, index) => { const description = categorySummaries[category.slug] ?? category.description; return <section key={category.slug} id={`category-${category.slug}`} className={`category-block${index % 2 === 1 ? " category-block-reverse" : ""}`} aria-labelledby={`category-${category.slug}-heading`}>
      <div className="category-hero">
        <div className="category-hero-copy">
          <span className="category-hero-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h2 id={`category-${category.slug}-heading`}>{category.name}</h2>
          {description && <p>{description}</p>}
          {categoryHighlights[category.slug] && <ul className="category-hero-highlights">
            {categoryHighlights[category.slug].map(item => <li key={item}><Check size={15} aria-hidden="true" /><span>{item}</span></li>)}
          </ul>}
          <WhatsAppLink service={{ title: category.name, category_name: category.name, short_description: description }} label={`Get a quote for ${category.name} on WhatsApp`} className="category-hero-cta">Get Quote</WhatsAppLink>
        </div>
        <div className="category-hero-image">
          <ApiImage src={category.image_url} alt={category.name} className="category-hero-img" />
        </div>
      </div>
      {services.length >= MARQUEE_MIN_ITEMS ? (
        <div className="category-marquee" role="list" aria-label={`${category.name} products`}>
          <div className="category-marquee-track" style={{ animationDuration: `${services.length * 3.5}s` }}>
            {[...services, ...services].map((service, i) => <ProductCard key={`${service.id}-${i}`} service={service} hidden={i >= services.length} />)}
          </div>
        </div>
      ) : (
        <div className="category-product-row" role="list" aria-label={`${category.name} products`}>
          {services.map(service => <ProductCard key={service.id} service={service} />)}
        </div>
      )}
    </section>; })}
  </div>;
}
