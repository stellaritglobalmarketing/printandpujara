import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Pagination } from "@/types/api";
import "./content-page.css";

export function ContentBanner({ prefix = "OUR", title, description, stats }: { prefix?: string; title: string; description?: string; stats?: { value: string; label: string }[] }) {
  return <section className={`content-banner${description || stats ? " content-banner-rich" : ""}`}><Container><div>
    <div className="content-banner-copy">
      <h1>{prefix && `${prefix} `}<span className="text-brand-gradient">{title.toUpperCase()}</span></h1>
      {description && <p className="content-banner-description">{description}</p>}
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">{title}</span></nav>
    </div>
    {stats && <dl className="content-banner-stats">{stats.map(stat => <div key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt></div>)}</dl>}
  </div></Container></section>;
}

export function ContentCTA({ testimonials = false }: { testimonials?: boolean }) {
  return <div className="content-cta"><MessageSquare size={36} aria-hidden="true" /><div><h2>{testimonials ? "Join Our Happy Clients" : "Have a Printing Project?"}</h2><p>{testimonials ? "Let us add your name to the list of satisfied customers." : "We are ready to print your ideas with perfection."}</p></div><Link href="/contact-us">GET FREE QUOTE</Link><Link href={testimonials ? "/#contact" : "/services"}>{testimonials ? "TALK TO EXPERT" : "VIEW SERVICES"}</Link></div>;
}

export function ContentPagination({ pagination, href }: { pagination?: Pagination; href: (page: number) => string }) {
  if (!pagination || pagination.total_pages < 2) return null;
  const current = pagination.current_page;
  const start = Math.max(1, Math.min(current - 2, pagination.total_pages - 4));
  return <nav className="content-pagination" aria-label="Pagination">
    {current > 1 && <Link href={href(current - 1)}>Previous</Link>}
    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => start + i).map(page => <Link key={page} href={href(page)} aria-label={`Page ${page}`} aria-current={page === current ? "page" : undefined}>{page}</Link>)}
    {current < pagination.total_pages && <Link href={href(current + 1)}>Next</Link>}
  </nav>;
}

export function ContentState({ error, label, href }: { error: boolean; label: string; href: string }) {
  return <div className="content-state" role={error ? "alert" : "status"}><h2>{error ? `We couldn’t load ${label}` : `No ${label} found`}</h2><p>{error ? "Please try again in a moment." : "New updates will appear here soon. You can also try clearing your filters."}</p><Link href={href}>{error ? "Try again" : "Clear filters"}</Link></div>;
}
