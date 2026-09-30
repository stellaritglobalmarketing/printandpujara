import "./services.css";
import { MessageSquare, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ServicesLayout } from "@/components/services/ServicesLayout";
import { CategoryShowcase } from "@/components/services/CategoryShowcase";
import { CategoryFilterNav } from "@/components/services/CategoryFilterNav";
import { ShowcaseSearch } from "@/components/services/ShowcaseSearch";
import { getServiceCategories, getCategoryCounts, getServices, getAllServices, servicesUrl } from "@/services/serviceService";
import type { Service } from "@/types/service";

export const metadata: Metadata = { title: "Our Services | Pujara Print N Pack", description: "Explore printing, packaging and branding services from Pujara Print N Pack." };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const pageNumber = Number(params.page);
  const filters = { category: typeof params.category === "string" ? params.category.slice(0, 150) : "", featured: params.featured === "1", page: Number.isSafeInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1 };
  const isDefaultView = !filters.category && !filters.featured && filters.page === 1;
  const [categoriesResult, servicesResult, allServicesResult] = await Promise.allSettled([
    getServiceCategories(),
    getServices(filters),
    isDefaultView ? getAllServices() : Promise.resolve<Service[]>([]),
  ]);
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const result = servicesResult.status === "fulfilled" ? servicesResult.value : null;
  const allServices = allServicesResult.status === "fulfilled" ? allServicesResult.value : [];
  const counts = categoriesResult.status === "fulfilled" ? await getCategoryCounts(categories).catch(() => ({})) : {};
  const selected = categories.find(category => category.slug === filters.category);
  const pagination = result?.pagination;
  const servicesByCategory = allServices.reduce<Record<string, Service[]>>((acc, service) => {
    if (!service.category_slug) return acc;
    (acc[service.category_slug] ??= []).push(service);
    return acc;
  }, {});

  return <main id="main-content" className="services-page">
    <section className="services-banner"><Container>
      <div className="services-banner-inner"><h1>OUR <span className="text-brand-gradient">SERVICES</span></h1>
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span> / </span><span aria-current="page">Our Services</span></nav></div>
    </Container></section>
    {isDefaultView && <CategoryFilterNav categories={categories} />}
    <section className="services-catalog" aria-labelledby="services-heading"><Container>
      <div className="services-intro-row">
        <div className="services-intro"><h2 id="services-heading">COMPLETE <span className="text-brand-gradient">PRINTING & PACKAGING</span> SOLUTIONS</h2>
        <p>From creative design to premium printing and packaging — everything under one roof.</p></div>
        {isDefaultView && allServices.length > 0 && <ShowcaseSearch services={allServices} />}
      </div>
      {selected?.description && <p className="services-category-description">{selected.description}</p>}
      {isDefaultView ? <CategoryShowcase categories={categories} servicesByCategory={servicesByCategory} /> : !result ? <div role="alert" className="rounded-2xl border border-ink/10 bg-white p-10 text-center"><h3 className="text-xl font-bold">We couldn’t load our services</h3><p className="mt-3 text-ink-soft">Please try again in a moment.</p><Link href={servicesUrl(filters)} className="mt-5 inline-block rounded-lg bg-brand-indigo px-6 py-3 text-white">Try again</Link></div> : result.data.length === 0 ? <div className="rounded-2xl border border-ink/10 bg-white p-12 text-center"><h3 className="text-xl font-bold">No services found</h3><p className="mt-3 text-ink-soft">Try another category or return to all services.</p><Link href="/services" className="mt-5 inline-block font-semibold text-brand-indigo underline">View all services</Link></div> : <>
        <ServicesLayout categories={categories} filters={filters} counts={counts} services={result.data} selectedCategoryName={selected?.name ?? null} total={pagination?.total ?? result.data.length} />
        {pagination && pagination.total_pages > 1 && <nav aria-label="Services pagination" className="services-pagination">
          {filters.page > 1 && <Link href={servicesUrl({ ...filters, page: filters.page - 1 })}>Previous</Link>}
          <span>Page {pagination.current_page} of {pagination.total_pages}</span>
          {filters.page < pagination.total_pages && <Link href={servicesUrl({ ...filters, page: filters.page + 1 })}>Next</Link>}
        </nav>}
      </>}
      <div className="services-cta"><MessageSquare size={36} aria-hidden="true" /><div><h2>Have a Project in Mind?</h2><p>Let’s bring your ideas to life with perfect print and packaging.</p></div><Link href="/contact-us" className="services-quote">GET FREE QUOTE <ArrowRight size={13} /></Link><Link href="/contact-us" className="services-expert">TALK TO EXPERT</Link></div>
    </Container></section>
  </main>;
}
