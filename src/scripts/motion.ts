/**
 * Mouvement du site : GSAP (ScrollTrigger, SplitText) et Lenis.
 *
 * Règles tenues ici :
 * - seules `transform` et `opacity` sont animées ;
 * - le HTML livré est l'état final : sans JavaScript ou avec
 *   `prefers-reduced-motion`, tout le contenu est visible et rien ne bouge ;
 * - l'intro de la une est en CSS (global.css) : elle ne dépend pas de ce script,
 *   ce qui garde le LCP au plus près du premier rendu ;
 * - chaque animation est créée quand sa section approche du viewport, par petites
 *   tâches, pour ne jamais bloquer le thread principal ;
 * - les scènes épinglées n'existent qu'au-delà de 1024 px.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

/** Équivalent GSAP de cubic-bezier(0.22, 1, 0.36, 1). */
const EASE = 'power4.out';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const all = <T extends Element>(selector: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(selector));

/** Exécute les tâches une à une, chacune dans un moment d'inactivité du navigateur. */
function schedule(tasks: Array<() => void>) {
  const idle = (callback: () => void) => {
    // Safari n'a pas requestIdleCallback.
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(callback, { timeout: 500 });
    } else {
      setTimeout(callback, 50);
    }
  };
  const next = () => {
    const task = tasks.shift();
    if (!task) return;
    task();
    idle(next);
  };
  idle(next);
}

/** Appelle `setup` pour chaque élément quand il arrive à moins d'un écran du viewport. */
function whenNear<T extends Element>(elements: T[], setup: (element: T) => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        setup(entry.target as T);
      }
    },
    { rootMargin: '100% 0px 100% 0px' },
  );
  elements.forEach((element) => observer.observe(element));
}

marqueeToggle();

if (!reducedMotion) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  schedule([smoothScroll, parcours, rules, counters, titles, caseVisuals, stackCascade, pointer]);
}

// ---------------------------------------------------------------------------
// 9. Smooth scroll, synchronisé avec ScrollTrigger (souris et trackpad ;
//    le tactile garde son défilement natif)
// ---------------------------------------------------------------------------
function smoothScroll() {
  if (!finePointer) return;
  const lenis = new Lenis({ autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------------------------------------------------------------------------
// 2. Filets : tracés de gauche à droite à l'entrée dans le viewport
// ---------------------------------------------------------------------------
function rules() {
  whenNear(all<HTMLElement>('[data-rule]'), (rule) => {
    gsap.from(rule, {
      scaleX: 0,
      duration: 1.2,
      ease: EASE,
      scrollTrigger: { trigger: rule, start: 'top 94%', once: true },
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Compteurs : une fois seulement
// ---------------------------------------------------------------------------
function counters() {
  const format = new Intl.NumberFormat('fr-FR');
  whenNear(all<HTMLElement>('[data-count]'), (counter) => {
    const live = counter.querySelector<HTMLElement>('.count-live');
    const target = Number(counter.dataset.count);
    if (!live || !Number.isFinite(target)) return;
    const prefix = counter.dataset.prefix ?? '';
    const suffix = counter.dataset.suffix ?? '';
    const render = (value: number) => {
      const number = format.format(Math.round(value)).replace(/\u202f/g, '\u00a0');
      live.textContent = `${prefix}${number}${suffix}`;
    };
    const state = { value: 0 };
    render(0);
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          value: target,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => render(state.value),
        });
      },
    });
  });
}

// ---------------------------------------------------------------------------
// Titres : révélation par lignes (SplitText, masques qui montent)
// ---------------------------------------------------------------------------
function titles() {
  // SplitText mesure les lignes : on attend les polices.
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  whenNear(all<HTMLElement>('[data-split]'), (title) => {
    fonts.then(() => {
      SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'hl',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.05,
            ease: EASE,
            stagger: 0.07,
            scrollTrigger: { trigger: title, start: 'top 88%', once: true },
          }),
      });
    });
  });
}

// ---------------------------------------------------------------------------
// 5. Études de cas : chaque schéma se construit au fil du défilement
//    (vocabulaire data-a / data-t / data-d / data-v décrit dans src/lib/viz.ts)
// ---------------------------------------------------------------------------
function caseVisuals() {
  whenNear(all<SVGSVGElement>('[data-viz]'), (svg) => {
    const timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: svg, start: 'top 86%', end: 'top 16%', scrub: 0.6 },
    });

    all<SVGElement>('[data-a]', svg).forEach((element) => {
      const at = Number(element.dataset.t ?? 0);
      const duration = Number(element.dataset.d ?? 0.5);
      const values = (element.dataset.v ?? '').split(',').map(Number);
      const ease = element.dataset.ease;

      switch (element.dataset.a) {
        case 'draw':
        case 'wipe':
          timeline.from(
            element,
            { scaleX: 0, transformOrigin: '0% 50%', duration, ease: ease ?? 'power2.inOut' },
            at,
          );
          break;
        case 'pop':
          timeline.from(
            element,
            { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration, ease: 'back.out(1.6)' },
            at,
          );
          break;
        case 'rise':
          timeline.from(element, { y: 10, opacity: 0, duration }, at);
          break;
        case 'fade':
          timeline.from(element, { opacity: 0, duration }, at);
          break;
        case 'flash':
          timeline
            .to(element, { opacity: 1, duration: duration * 0.25 }, at)
            .to(element, { opacity: 0, duration: duration * 0.25 }, at + duration * 0.75);
          break;
        case 'move':
          timeline.from(
            element,
            {
              x: values[0] ?? 0,
              y: values[1] ?? 0,
              rotation: values[2] ?? 0,
              opacity: 0.3,
              transformOrigin: '50% 50%',
              duration,
              ease: 'power3.inOut',
            },
            at,
          );
          break;
        case 'travel': {
          // Étapes « dx,dy » successives, parcourues à vitesse constante.
          const steps: Array<[number, number]> = [];
          for (let i = 0; i + 1 < values.length; i += 2) steps.push([values[i], values[i + 1]]);
          const lengths = steps.map(([x, y], i) => {
            const [px, py] = i > 0 ? steps[i - 1] : [0, 0];
            return Math.hypot(x - px, y - py);
          });
          const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
          let clock = at;
          steps.forEach(([x, y], i) => {
            const part = (lengths[i] / total) * duration;
            timeline.to(element, { x, y, duration: part, ease: 'none' }, clock);
            clock += part;
          });
          timeline
            .to(element, { opacity: 1, duration: duration * 0.1 }, at)
            .to(element, { opacity: 0, duration: duration * 0.1 }, at + duration * 0.9);
          break;
        }
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 6. Parcours : scène épinglée, les outils d'hier deviennent ceux d'aujourd'hui.
//    Créée en premier : l'épinglage allonge la page, les autres repères en dépendent.
// ---------------------------------------------------------------------------
function parcours() {
  const section = document.querySelector<HTMLElement>('[data-parcours]');
  if (!section) return;

  const lanes = all<HTMLElement>('[data-lane]', section);
  const friseItems = all<HTMLElement>('[data-frise-item]', section);
  const friseFill = section.querySelector<HTMLElement>('[data-frise-fill]');
  const before = section.querySelector<HTMLElement>('[data-parcours-before]');
  const after = section.querySelector<HTMLElement>('[data-parcours-after]');
  const media = gsap.matchMedia();

  // Grand écran : scène épinglée, pilotée par le défilement.
  media.add('(min-width: 1024px) and (min-height: 680px)', () => {
    const LENGTH = 10;
    // Atténuation des éléments « pas encore atteints » : le texte reste au-dessus du contraste AA.
    const DIM = 0.62;
    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 2.2)}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (friseFill) {
      timeline.fromTo(friseFill, { scaleX: 0 }, { scaleX: 1, duration: LENGTH, ease: 'none' }, 0);
    }
    friseItems.forEach((item) => {
      const position = (Number(item.dataset.pos) / 100) * LENGTH - 0.35;
      const at = Math.min(LENGTH - 0.6, Math.max(0, position));
      timeline.fromTo(item, { opacity: DIM }, { opacity: 1, duration: 0.5, ease: 'none' }, at);
    });
    if (before) timeline.to(before, { opacity: DIM, duration: 4, ease: 'none' }, 3);
    if (after) timeline.fromTo(after, { opacity: DIM }, { opacity: 1, duration: 4, ease: 'none' }, 3);

    lanes.forEach((lane, index) => {
      const from = lane.querySelector<HTMLElement>('[data-lane-from]');
      const to = lane.querySelector<HTMLElement>('[data-lane-to]');
      const fill = lane.querySelector<HTMLElement>('[data-lane-fill]');
      const mover = lane.querySelector<HTMLElement>('[data-lane-mover]');
      const oldFace = lane.querySelector<HTMLElement>('[data-lane-old]');
      const newFace = lane.querySelector<HTMLElement>('[data-lane-new]');
      if (!from || !to || !fill || !mover || !oldFace || !newFace) return;

      const at = 0.6 + index * 1.5;
      const travel = 2.6;
      timeline
        .fromTo(from, { opacity: 1 }, { opacity: DIM, duration: 0.8 }, at + 0.2)
        .fromTo(mover, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at)
        .fromTo(mover, { x: 0 }, { x: () => to.offsetLeft, duration: travel }, at)
        .fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: travel }, at)
        .fromTo(
          oldFace,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.6, transformOrigin: '0% 50%', duration: 0.7 },
          at + 0.9,
        )
        .fromTo(
          newFace,
          { opacity: 0, scale: 1.4 },
          { opacity: 1, scale: 1, transformOrigin: '0% 50%', duration: 0.7 },
          at + 1.1,
        )
        .fromTo(to, { opacity: DIM, x: -12 }, { opacity: 1, x: 0, duration: 0.5 }, at + travel - 0.35)
        .to(mover, { opacity: 0, duration: 0.3 }, at + travel - 0.2);
    });
  });

  // Mobile, tablette, écrans bas : pas d'épinglage, une simple apparition.
  media.add('(max-width: 1023.98px), (max-height: 679.98px)', () => {
    const list = section.querySelector<HTMLElement>('.lanes');
    const frise = section.querySelector<HTMLElement>('[data-frise]');
    if (list) {
      gsap.from(lanes, {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      });
    }
    if (frise) {
      gsap.from(friseItems, {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: EASE,
        stagger: 0.05,
        scrollTrigger: { trigger: frise, start: 'top 88%', once: true },
      });
    }
  });
}

// ---------------------------------------------------------------------------
// 7. Stack : les familles apparaissent en cascade
// ---------------------------------------------------------------------------
function stackCascade() {
  whenNear(all<HTMLElement>('[data-stack]'), (stack) => {
    gsap.from(all<HTMLElement>('[data-stack-family]', stack), {
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: stack, start: 'top 82%', once: true },
    });
  });
}

// ---------------------------------------------------------------------------
// 8. Micro-interactions : bouton magnétique, curseur (souris uniquement)
// ---------------------------------------------------------------------------
function pointer() {
  if (!finePointer) return;
  magnetic();
  cursor();
}

function magnetic() {
  all<HTMLElement>('[data-magnetic]').forEach((button) => {
    const label = button.querySelector<HTMLElement>('span');
    const x = gsap.quickTo(button, 'x', { duration: 0.6, ease: EASE });
    const y = gsap.quickTo(button, 'y', { duration: 0.6, ease: EASE });
    const labelX = label ? gsap.quickTo(label, 'x', { duration: 0.6, ease: EASE }) : null;
    const labelY = label ? gsap.quickTo(label, 'y', { duration: 0.6, ease: EASE }) : null;

    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      x(dx * 0.28);
      y(dy * 0.36);
      labelX?.(dx * 0.1);
      labelY?.(dy * 0.12);
    });
    button.addEventListener('pointerleave', () => {
      x(0);
      y(0);
      labelX?.(0);
      labelY?.(0);
    });
  });
}

function cursor() {
  const element = document.querySelector<HTMLElement>('[data-cursor]');
  const dot = element?.querySelector<HTMLElement>('.cursor-dot');
  if (!element || !dot) return;

  const x = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3.out' });
  let visible = false;
  let active = false;

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      x(event.clientX);
      y(event.clientY);
      if (!visible) {
        visible = true;
        gsap.set(element, { x: event.clientX, y: event.clientY });
        gsap.to(element, { opacity: 1, duration: 0.3 });
      }
      const target = event.target instanceof Element ? event.target : null;
      const interactive = Boolean(target?.closest('a, button'));
      if (interactive !== active) {
        active = interactive;
        gsap.to(dot, {
          scale: active ? 4.2 : 1,
          opacity: active ? 0.3 : 1,
          duration: 0.5,
          ease: EASE,
          overwrite: true,
        });
      }
      element.dataset.onInk = String(Boolean(target?.closest('.on-ink')));
    },
    { passive: true },
  );

  document.documentElement.addEventListener('mouseleave', () => {
    visible = false;
    gsap.to(element, { opacity: 0, duration: 0.3 });
  });
}

// ---------------------------------------------------------------------------
// 4. Bandeau clients : bouton de pause (accessible au clavier)
// ---------------------------------------------------------------------------
function marqueeToggle() {
  const button = document.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
  const marquee = document.querySelector<HTMLElement>('[data-marquee]');
  if (!button || !marquee) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const paused = marquee.dataset.paused !== 'true';
    marquee.dataset.paused = String(paused);
    button.textContent = paused ? 'Lecture' : 'Pause';
  });
}
