"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Check, Pause, Play, Truck } from "lucide-react";
import styles from "./Hero.module.css";

type Slide = { label: string; eyebrow: string; title: string; accent: string; inlineAccent?: boolean; description: string; cta: string; href: string; secondary?: { label: string; href: string }; features?: string[]; stats?: { value: string; label: string }[] };

// The first slide is what visitors see on load: location, positioning and proof points, like a classic B2B print hero.
const slides: Slide[] = [
  { label: "Printing", eyebrow: "Best printing services in", title: "Andheri East,", accent: "Mumbai", inlineAccent: true, description: "Mumbai's trusted B2B printing and packaging partner. Offset, digital, packaging and large-format printing under one roof since 2007.", cta: "Start your project", href: "/contact-us", secondary: { label: "View our work", href: "/#portfolio" }, stats: [{ value: "19", label: "Years legacy" }, { value: "75", label: "Brand clients" }, { value: "50", label: "Print solutions" }] },
  { label: "Packaging", eyebrow: "Made for your brand", title: "First impressions.", accent: "Beautifully packed.", description: "Custom boxes and printed packaging that bring your brand to life. Thoughtful materials, precise printing and a finish your customers will remember.", cta: "Explore packaging", href: "/services#category-packaging", features: ["Custom boxes", "Brand packaging", "Premium materials"] },
  { label: "Finishing", eyebrow: "The details make the difference", title: "Every detail.", accent: "Perfectly finished.", description: "From clean cuts and crisp folds to lamination and binding, give every printed piece the finish it deserves.", cta: "Explore finishing", href: "/services#category-finishing", features: ["Lamination", "Die-cutting", "Binding"] },
];
const backgrounds = ["offset", "packaging", "print"];

export function Hero() {
  const region = useRef<HTMLElement>(null);

  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = region.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!element) return;
    const resize = () => element.style.setProperty("--hero-header", (header?.offsetHeight || 0) + "px");
    const observer = new ResizeObserver(resize);
    if (header) observer.observe(header);
    resize();
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    visibility.observe(element);
    return () => { observer.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!reduced.matches);
    update();
    reduced.addEventListener("change", update);
    return () => reduced.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoplay || hovered || focused || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [active, autoplay, hovered, focused, visible]);

  const goTo = (index: number) => {
    setActive((index + slides.length) % slides.length);
  };
  const continuePage = () => {
    const element = region.current;
    if (!element) return;
    const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight || 0;
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().bottom - header, behavior: "instant" });
    const next = element.nextElementSibling as HTMLElement | null;
    if (next) { next.tabIndex = -1; next.focus({ preventScroll: true }); }
  };

  return (
    <section ref={region} className={styles.hero} aria-label="Printing, packaging and finishing" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className={styles.frame}>
        <div className={styles.backdrop} aria-hidden="true">
          {backgrounds.map((background, index) => (
            // Responsive decorative backgrounds are loaded together for a seamless first rotation.
            // eslint-disable-next-line @next/next/no-img-element
            <img key={background} src={`/images/hero-${background}-1664.webp`} srcSet={`/images/hero-${background}-960.webp 960w, /images/hero-${background}-1664.webp 1664w`} sizes="100vw" alt="" className={styles.media + (active === index ? " " + styles.mediaActive : "")} fetchPriority={index === 0 ? "high" : "low"} />
          ))}
          <div className={styles.overlay} />
        </div>
        <h1 className={styles.srOnly}>Pujara Print Pack — Printing and packaging in Andheri East, Mumbai</h1>
        {slides.map((slide, index) => (
          <div key={slide.label} className={styles.slide + (active === index ? " " + styles.active : "")} aria-hidden={active !== index} inert={active !== index} role="group" aria-roledescription="slide" aria-label={(index + 1) + " of 3: " + slide.label}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>{slide.eyebrow}</p>
              <h2 className={styles.heading + (slide.inlineAccent ? " " + styles.headingInline : "")}>{slide.title} <span>{slide.accent}</span></h2>
              <p className={styles.description}>{slide.description}</p>
              <p className={styles.note}><Truck size={17} aria-hidden="true" />We deliver all over India</p>
              <div className={styles.actions}>
                <Link href={slide.href} className={styles.button + " " + styles.primary}>{slide.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
                <Link href={slide.secondary?.href ?? "/contact-us"} className={styles.button + " " + styles.secondary}>{slide.secondary?.label ?? "Get a quote"}</Link>
              </div>
              {slide.features && <ul className={styles.features}>{slide.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>}
              {slide.stats && <dl className={styles.stats}>{slide.stats.map(stat => <div key={stat.label} className={styles.stat}><dt>{stat.label}</dt><dd>{stat.value}<sup>+</sup></dd></div>)}</dl>}
            </div>
          </div>
        ))}
        <div className={styles.controls}>
          <button className={styles.scroll} onClick={continuePage}>Explore more <ArrowDown size={16} aria-hidden="true" /></button>
          <div className={styles.navigation}>
            <button className={styles.arrow} aria-label={autoplay ? "Pause hero slideshow" : "Play hero slideshow"} onClick={() => setAutoplay(value => !value)}>{autoplay ? <Pause size={16} /> : <Play size={16} />}</button>
            <div className={styles.dots} aria-label="Choose a hero slide">{slides.map((slide, index) => <button key={slide.label} aria-label={"Show " + slide.label + " slide"} aria-current={active === index ? "true" : undefined} className={active === index ? styles.selected : ""} onClick={() => goTo(index)} />)}</div>
            <button className={styles.arrow} aria-label="Previous hero slide" onClick={() => goTo(active - 1)}><ArrowLeft size={19} /></button>
            <button className={styles.arrow} aria-label="Next hero slide" onClick={() => goTo(active + 1)}><ArrowRight size={19} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
