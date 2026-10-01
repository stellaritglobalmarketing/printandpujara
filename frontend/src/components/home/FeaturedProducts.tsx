"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Service } from "@/types/service";
import { ApiImage } from "./ApiImage";
import { resolveImageUrl } from "@/lib/image-url";

const MotionLink = motion.create(Link);

function FeaturedProductImage({ product }: { product: Service }) {
  return <ApiImage src={resolveImageUrl(product.featured_image_url)} alt={product.title} />;
}

function FeaturedProductsStack({ products }: { products: Service[] }) {
  const [activeId, setActiveId] = useState(products[0]?.id);
  return <div className="featured-products-stack" role="list">
    {products.map(product => {
      const isActive = product.id === activeId;
      return <div
        className={`fp-stack-card${isActive ? " is-active" : ""}`}
        key={product.id}
        role={isActive ? "listitem" : "button"}
        tabIndex={isActive ? undefined : 0}
        aria-expanded={isActive}
        aria-label={isActive ? undefined : `Show ${product.title}`}
        onClick={isActive ? undefined : () => setActiveId(product.id)}
        onKeyDown={isActive ? undefined : event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveId(product.id); } }}
      >
        <FeaturedProductImage product={product} />
        <span className="fp-stack-scrim" aria-hidden="true" />
        {isActive ? <>
          <span className="fp-stack-badge"><Star size={11} aria-hidden="true" fill="currentColor" />Featured</span>
          <div className="fp-stack-body">
            <h3>{product.title}</h3>
            {product.short_description && <p>{product.short_description}</p>}
            <Link href={`/services#service-${product.id}`} className="fp-stack-cta">View Service <ArrowRight size={14} /></Link>
          </div>
        </> : <span className="fp-stack-title-collapsed">{product.title}</span>}
      </div>;
    })}
  </div>;
}

export function FeaturedProducts({ products }: { products: Service[] | null }) {
  const reducedMotion = useReducedMotion();
  if (products && products.length === 0) return null;
  const transition = { duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition },
  };
  return <motion.section className="featured-products-section" aria-labelledby="featured-products-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.5 } } }}>
    <Container>
      <motion.h2 id="featured-products-heading" className="solutions-heading" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition } }}>Featured <span className="text-brand-gradient">Services</span></motion.h2>
      {!products ? <p className="home-data-state">Featured products are temporarily unavailable. Please try again later.</p> : <>
        <motion.div className="featured-products-row" variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }}>
          {products.map(product => <MotionLink href={`/services#service-${product.id}`} className="featured-product-card" key={product.id} variants={cardVariants} whileHover={reducedMotion ? undefined : { y: -8, transition: { ...transition, duration: 0.22 } }} aria-label={`Explore ${product.title}`}>
            <div className="featured-product-image-frame">
              <span className="featured-product-badge"><Star size={11} aria-hidden="true" fill="currentColor" />Featured</span>
              <FeaturedProductImage product={product} />
            </div>
            <div className="featured-product-body">
              <h3>{product.title}</h3>
              {product.short_description && <p>{product.short_description}</p>}
              <span className="featured-product-cta">View Service <ArrowRight size={14} /></span>
            </div>
          </MotionLink>)}
        </motion.div>
        <FeaturedProductsStack products={products} />
      </>}
    </Container>
  </motion.section>;
}
