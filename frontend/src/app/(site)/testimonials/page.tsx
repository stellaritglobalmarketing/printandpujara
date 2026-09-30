import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ApiImage } from "@/components/home/ApiImage";
import { ContentBanner, ContentCTA, ContentPagination, ContentState } from "@/components/common/ContentPage";
import { getTestimonials } from "@/services/testimonialService";
import { getClientLogos } from "@/services/clientService";
import { resolveImageUrl } from "@/lib/image-url";
import { VoicesFromEveryIndustry } from "@/components/testimonials/VoicesFromEveryIndustry";
import { TrustedByTeams } from "@/components/testimonials/TrustedByTeams";

export const metadata: Metadata = { title: "Testimonials | Pujara Print N Pack", description: "Hear from our printing and packaging customers." };

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const query = new URLSearchParams({ page: String(page), limit: "6" });
  if (params.featured === "1") query.set("featured", "1");
  const href = (nextPage: number) => { const next = new URLSearchParams(query); next.delete("limit"); next.set("page", String(nextPage)); return `/testimonials?${next}`; };
  const [result, clients] = await Promise.all([getTestimonials(query).catch(() => null), getClientLogos(100)]);
  return <main className="content-page"><ContentBanner prefix="" title="Testimonials" /><Container><section className="content-body" aria-labelledby="testimonial-heading">
    <div className="testimonial-intro"><h2 id="testimonial-heading">WHAT OUR CLIENTS SAY</h2><p>Trusted by businesses for our quality, service, and commitment.</p></div>
    {!result || !result.data.length ? <ContentState error={!result} label="testimonials" href={result ? "/testimonials" : href(page)} /> : <div className="testimonial-grid">{result.data.map(item => <figure className="testimonial-card" key={item.id}><div className="testimonial-card-top"><ApiImage src={resolveImageUrl(item.client_image_url)} alt={item.client_name} className="testimonial-avatar" /><Quote className="testimonial-quote" size={24} aria-hidden="true" /></div>
      <blockquote>{item.message}</blockquote><figcaption><strong>— {item.client_name}</strong>{(item.designation || item.company_name) && <span>{[item.designation, item.company_name].filter(Boolean).join(", ")}</span>}</figcaption>
    </figure>)}</div>}
    <ContentPagination pagination={result?.pagination} href={href} />
    <VoicesFromEveryIndustry />
    {clients && <TrustedByTeams clients={clients} />}
    <ContentCTA testimonials />
  </section></Container></main>;
}
