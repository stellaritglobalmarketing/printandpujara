import { apiGet } from "@/lib/api-client";
import type { Service, ServiceCategory } from "@/types/service";
import { getPortfolioPage } from "./portfolioService";
import { getClientLogos } from "./clientService";

export interface HomeProject { id: number; title: string; slug: string; cover_image_url: string | null; short_description: string | null }
export interface HomeClient { id: number; company_name: string | null; logo_url: string | null }
export interface HomeTestimonial { id: number; client_name: string; company_name: string | null; message: string }
export interface HomeBlog { id: number; title: string; slug: string; excerpt: string | null; featured_image_url: string | null }
export interface HomeMachine { id: number; name: string; slug: string; machine_type?: string | null; short_description: string | null; featured_image_url: string | null }

async function list<T>(endpoint: string): Promise<T[] | null> {
  try {
    const response = await apiGet<T[]>(endpoint);
    if (response.code === 3) return [];
    if (!Array.isArray(response.data)) throw new Error("Invalid list response");
    return response.data;
  } catch { return null; }
}

export async function getHomeData() {
  const [serviceCategories, portfolio, clients, blogs, featuredProducts, machines, services] = await Promise.all([
    list<ServiceCategory>("service-categories"),
    getPortfolioPage().catch(() => null),
    getClientLogos(20),
    list<HomeBlog>("blogs?limit=3"),
    list<Service>("services?featured=1&limit=6"),
    list<HomeMachine>("machines?featured=1&limit=6"),
    list<Service>("services?limit=100"),
  ]);
  return { serviceCategories, portfolio: portfolio?.items ?? null, recentWork: portfolio?.content.recent_work ?? null, clients, blogs, featuredProducts, machines, services };
}
