import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContentBanner, ContentCTA, ContentState } from "@/components/common/ContentPage";
import { getClientLogos } from "@/services/clientService";
import { ClientLogoWall } from "@/components/testimonials/ClientLogoWall";

export const metadata: Metadata = { title: "Our Clients | Pujara Print N Pack", description: "Brands across India that trust Pujara Print N Pack with their printing and packaging." };

export default async function OurClientsPage() {
  const clients = await getClientLogos(100);
  return <main className="content-page"><ContentBanner
    prefix=""
    title="Our Clients"
    description="From mobile and real estate to media, pharma, finance and logistics, leading brands trust us with their printing and packaging, delivered all over India."
    stats={[{ value: `${clients && clients.length >= 10 ? Math.floor(clients.length / 10) * 10 : 70}+`, label: "Brand clients" }, { value: "19+", label: "Years legacy" }, { value: "Pan-India", label: "Delivery" }]}
  /><Container><section className="content-body" aria-label="Our clients">
    <header className="client-wall-head">
      <span className="client-wall-label">Brands we print for</span>
      <h2>Clients we&apos;ve <span className="text-brand-gradient">worked with</span></h2>
      <p>A few of the brands that trust us with their printing and packaging.</p>
    </header>
    {!clients?.length ? <ContentState error={!clients} label="clients" href="/testimonials" /> : <ClientLogoWall clients={clients} />}
    <ContentCTA testimonials />
  </section></Container></main>;
}
