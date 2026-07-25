/* =========================================================================
   Motion system — GSAP ScrollTrigger + Lenis smooth scroll.

   Resilience contract:
   - All content renders visible in static HTML. This module only *hides then
     animates* elements after it has loaded and run, so a JS failure leaves the
     page fully readable.
   - prefers-reduced-motion: reduce  → no Lenis, no parallax, no transforms.
     Reveals resolve instantly to their final visible state.
   Re-run safe: designed to be called on every Astro View Transition load.
   ========================================================================= */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

function startLenis() {
  if (reduceMotion() || lenis) return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function stopLenis() {
  lenis?.destroy();
  lenis = null;
}

/* ------------------------------------------------------- scroll reveals */
function setupReveals() {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!els.length) return;

  if (reduceMotion()) return; // leave visible, do nothing

  els.forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || '0');
    gsap.set(el, { autoAlpha: 0, y: 26 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
        }),
    });
  });

  // Staggered groups
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const kids = gsap.utils.toArray<HTMLElement>(
      '[data-reveal-item]',
      group
    );
    if (!kids.length) return;
    gsap.set(kids, { autoAlpha: 0, y: 30 });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        gsap.to(kids, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
        }),
    });
  });
}

/* ------------------------------------------------------------- parallax */
function setupParallax() {
  if (reduceMotion()) return;
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2');
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('[data-parallax-scope]') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* --------------------------------------------------------- count-up nums */
function setupCounters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const suffix = el.dataset.countSuffix || '';
    const prefix = el.dataset.countPrefix || '';
    const render = (v: number) =>
      (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`);

    if (reduceMotion()) {
      render(target);
      return;
    }
    render(0);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => render(obj.v),
        }),
    });
  });
}

/* --------------------------- line drawing (timelines / route lines) ---- */
function setupDraws() {
  gsap.utils.toArray<SVGGeometryElement>('[data-draw]').forEach((path) => {
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      return;
    }
    if (!len) return;
    if (reduceMotion()) {
      path.style.strokeDasharray = 'none';
      return;
    }
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    ScrollTrigger.create({
      trigger: path.closest('[data-draw-scope]') || path,
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 0.6,
      onUpdate: (self) =>
        gsap.set(path, { strokeDashoffset: len * (1 - self.progress) }),
    });
  });
}

/* ---------------------- scrollytelling: cinema era timeline ------------ */
function setupScrolly() {
  const scope = document.querySelector<HTMLElement>('[data-scrolly]');
  if (!scope) return;
  const steps = gsap.utils.toArray<HTMLElement>('[data-scrolly-step]', scope);
  const progressLine = scope.querySelector<HTMLElement>('[data-scrolly-progress]');

  // Progress spine height (works with or without reduced motion)
  if (progressLine) {
    ScrollTrigger.create({
      trigger: scope,
      start: 'top 40%',
      end: 'bottom 70%',
      scrub: true,
      onUpdate: (self) => {
        if (reduceMotion()) {
          progressLine.style.height = '100%';
        } else {
          progressLine.style.height = `${self.progress * 100}%`;
        }
      },
    });
  }

  if (reduceMotion()) return;
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 65%',
      end: 'bottom 55%',
      onToggle: (self) => step.classList.toggle('is-active', self.isActive),
    });
  });
}

/* --------------------------------------------------------------- hero fx */
function setupHero() {
  if (reduceMotion()) return;
  const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
  if (lines.length) {
    gsap.set(lines, { autoAlpha: 0, y: 34 });
    gsap.to(lines, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.14,
      delay: 0.15,
    });
  }
}

/* ----------------------------------------------------- magnetic buttons */
function setupMagnetic() {
  if (reduceMotion() || window.matchMedia('(pointer: coarse)').matches) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4 });
    };
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
  });
}

/* ------------------------------------------------------------- lifecycle */
function init() {
  startLenis();
  setupHero();
  setupReveals();
  setupParallax();
  setupCounters();
  setupDraws();
  setupScrolly();
  setupMagnetic();
  ScrollTrigger.refresh();
}

function teardown() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
  stopLenis();
}

// Astro View Transitions: rebuild the scene on every navigation.
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', teardown);

// Fallback for a plain first load without the router event.
if (document.readyState !== 'loading') {
  // astro:page-load fires on initial load too; guard against double-init.
}
