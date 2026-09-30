import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { WhatWePrint } from "@/components/home/WhatWePrint";
import { TrustedClientsStrip } from "@/components/home/TrustedClientsStrip";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { RecentWork } from "@/components/home/RecentWork";
import { MachinesSection } from "@/components/home/MachinesSection";
import { CTABand } from "@/components/home/CTABand";
import { getHomeData } from "@/services/homeService";
import { HomeSections } from "@/components/home/HomeSections";

export default async function Home() {
  const data = await getHomeData();
  return (
    <>
      <main>
        <Hero />
        <TrustedClientsStrip clients={data.clients} />
        <WhoWeAre />
        <MachinesSection machines={data.machines} />
        <WhatWePrint categories={data.serviceCategories} services={data.services} />
        <FeaturedProducts products={data.featuredProducts} />
        <RecentWork projects={data.portfolio} content={data.recentWork} />
        <HomeSections blogs={data.blogs} />
        <CTABand />
      </main>
    </>
  );
}
