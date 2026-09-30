"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/Container";
import type { HomeBlog } from "@/services/homeService";
import { ApiImage } from "./ApiImage";
import { resolveImageUrl } from "@/lib/image-url";

function State({ data }: { data: unknown[] | null }) {
  return <p className="home-data-state">{data ? "New updates will appear here soon." : "This section is temporarily unavailable. Please try again later."}</p>;
}

export function HomeSections({ blogs }: { blogs: HomeBlog[] | null }) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition },
  };
  return <>
    <motion.section className="home-api-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.5 } } }}>
      <Container>
        <motion.h2 variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition } }}>Latest Blogs</motion.h2>
        {!blogs?.length ? <State data={blogs} /> : <motion.div className="home-api-grid" variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.12 } } }}>
          {blogs.map(blog => <motion.article className="home-api-card home-blog-card" key={blog.id} variants={cardVariants} whileHover={reducedMotion ? undefined : { y: -6, transition: { ...transition, duration: 0.2 } }}>
            <Link href={`/blogs/${blog.slug}`} className="home-blog-image-link" aria-label={blog.title}>
              <ApiImage src={resolveImageUrl(blog.featured_image_url)} alt={blog.title} className="home-blog-image" />
            </Link>
            <div className="home-blog-copy">
              <h3><Link href={`/blogs/${blog.slug}`}>{blog.title}</Link></h3>
              {blog.excerpt && <p>{blog.excerpt}</p>}
            </div>
          </motion.article>)}
        </motion.div>}
      </Container>
    </motion.section>
  </>;
}
