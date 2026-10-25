import { useEffect, useLayoutEffect, useEffectEvent, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import "./KineticHero.css";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useHeroReducedMotion() {
  // Subscribe directly so changing the OS preference also stops active springs.
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

type ScatteredWord = {
  text: string;
  className: string;
  delay: number;
  rotation: number;
  color: string;
};

const scatteredWords: ScatteredWord[] = [
  { text: "people", className: "word-people", delay: 0, rotation: -13, color: "#38312f" },
  { text: "systems", className: "word-systems", delay: 0.06, rotation: 11, color: "#d596a7" },
  { text: "ideas", className: "word-ideas", delay: 0.12, rotation: -10, color: "#94a58a" },
  { text: "process", className: "word-process", delay: 0.18, rotation: -8, color: "#d596a7" },
];

const wordCurves: Record<string, { width: number; path: string; angles: string }> = {
  people: { width: 310, path: "M 10 112 C 90 58, 196 133, 300 82", angles: "-7 3 -4 6 -3 8" },
  systems: { width: 380, path: "M 10 78 C 120 137, 245 53, 370 110", angles: "5 -5 4 -3 6 -4 5" },
  ideas: { width: 250, path: "M 10 112 C 80 112, 140 57, 240 91", angles: "-6 5 -3 6 -4" },
  process: { width: 365, path: "M 10 103 C 115 54, 240 134, 355 77", angles: "-4 5 -5 3 -3 6 -4" },
};

function FluidWord({ text, progress }: { text: string; progress: MotionValue<number> }) {
  const pathId = useId();
  const lettering = useRef<SVGTextElement>(null);
  const curve = wordCurves[text];
  const flatPath = `M 10 100 C ${curve.width * 2 / 3} 100, ${curve.width * 4 / 3} 100, ${curve.width * 2} 100`;
  const path = useTransform(progress, [0, 0.78, 1], [curve.path, flatPath, flatPath]);
  const angles = useTransform(progress, p => curve.angles.split(" ").map(a => Number(a) * (1 - smooth(p / 0.78))).join(" "));
  const tracking = useTransform(progress, p => -9.5 + smooth(p / 0.78) * 21.5);
  const textTransform = useTransform(progress, p => p >= 0.82 ? "uppercase" as const : "none" as const);
  const shadow = useTransform(progress, p => `drop-shadow(3px 5px 5px rgba(56, 49, 47, ${0.10 * (1 - smooth(p / 0.7))}))`);

  // SVG presentation attributes lose to stylesheet rules; update the actual text styles.
  useMotionValueEvent(angles, "change", value => lettering.current?.setAttribute("rotate", value));
  useMotionValueEvent(tracking, "change", value => { if (lettering.current) lettering.current.style.letterSpacing = `${value}px`; });
  useMotionValueEvent(textTransform, "change", value => { if (lettering.current) lettering.current.style.textTransform = value; });

  return (
    <motion.svg
      className="fluid-word"
      viewBox={`0 0 ${curve.width} 150`}
      style={{ width: `${curve.width / 100}em`, filter: shadow }}
      role="img"
      aria-label={text}
      focusable="false"
    >
      <defs>
        <motion.path id={pathId} d={path} />
      </defs>
      <text ref={lettering} rotate={curve.angles} style={{ letterSpacing: "-9.5px", textTransform: "none" }}>
        <textPath href={`#${pathId}`}>
          {text}
        </textPath>
      </text>
    </motion.svg>
  );
}

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

type Cursor = { x: number; y: number } | null;
const pointerSpring = { stiffness: 180, damping: 24, mass: 0.8 };

function ScatteredWordView({ word, cursor, progress, active }: {
  word: ScatteredWord; cursor: MotionValue<Cursor>; progress: MotionValue<number>; active: boolean;
}) {
  const anchor = useRef<HTMLSpanElement>(null);

  const reducedMotion = useHeroReducedMotion();
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const rotationTarget = useMotionValue(0);
  const x = useSpring(xTarget, pointerSpring);
  const y = useSpring(yTarget, pointerSpring);
  const rotate = useSpring(rotationTarget, pointerSpring);
  const destinationX = useMotionValue(0);
  const destinationY = useMotionValue(0);
  const color = useTransform(progress, [0, 0.38, 0.85, 1], [word.color, word.color, "#716b65", "#716b65"]);
  const destinationScale = useMotionValue(1);
  const travelTarget = useTransform(progress, p => smooth((p - 0.1 - word.delay * 0.35) / 0.57));
  const travelSpring = useSpring(travelTarget, { stiffness: 220, damping: 30, mass: 0.6 });
  useMotionValueEvent(travelTarget, "change", value => { if (reducedMotion) travelSpring.jump(value); });
  const travel = reducedMotion ? travelTarget : travelSpring;
  const magneticX = useTransform(() => destinationX.get() * travel.get() + Math.sin(Math.PI * travel.get()) * (word.rotation < 0 ? 28 : -28));
  const magneticY = useTransform(() => destinationY.get() * travel.get() - Math.sin(Math.PI * travel.get()) * 32);
  const magneticRotation = useTransform(() => word.rotation * (1 - travel.get()));
  const scale = useTransform(() => 1 + (destinationScale.get() - 1) * travel.get());

  useLayoutEffect(() => {
    const element = anchor.current;
    const canvas = element?.closest(".hero-canvas");
    if (!element || !canvas) return;

    const measure = () => {
      const target = canvas.querySelector<HTMLElement>(`[data-word-slot="${word.text}"]`);
      const container = element.offsetParent;
      if (!target || !(container instanceof HTMLElement)) return;
      const origin = container.getBoundingClientRect();
      const end = target.getBoundingClientRect();
      const font = parseFloat(getComputedStyle(element).fontSize);
      const size = parseFloat(getComputedStyle(target).fontSize);
      const ratio = size / font;
      destinationScale.set(ratio);
      // Account for center-origin scaling and the SVG baseline, keeping the same node.
      destinationX.set(end.left - (origin.left + element.offsetLeft) - element.offsetWidth * (1 - ratio) / 2 - size * 0.1);
      destinationY.set(end.top - (origin.top + element.offsetTop) - element.offsetHeight * (1 - ratio) / 2 - size * 0.05);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    document.fonts.ready.then(() => { if (element.isConnected) measure(); });
    return () => observer.disconnect();
  }, [word.text, destinationX, destinationY, destinationScale]);

  useMotionValueEvent(cursor, "change", (point) => {
    if (!point || !active || reducedMotion) {
      xTarget.set(0);
      yTarget.set(0);
      rotationTarget.set(0);
      return;
    }
    const bounds = anchor.current?.getBoundingClientRect();
    if (!bounds) return;
    // Measure the stationary anchor, never the moving child: no feedback jitter.
    const dx = bounds.left + bounds.width / 2 - point.x;
    const dy = bounds.top + bounds.height / 2 - point.y;
    const edgeDistance = Math.hypot(
      Math.max(bounds.left - point.x, 0, point.x - bounds.right),
      Math.max(bounds.top - point.y, 0, point.y - bounds.bottom),
    );
    const falloff = (radius: number) => {
      const t = Math.max(0, 1 - edgeDistance / radius);
      return t * t * (3 - 2 * t);
    };
    const influence = 0.82 * falloff(200) + 0.18 * falloff(340);
    // Soft normalization makes crossing the center continuous, even at zero distance.
    const distance = Math.hypot(dx, dy, 90);
    xTarget.set((dx / distance) * 36 * influence);
    yTarget.set((dy / distance) * 36 * influence);
    rotationTarget.set((dx / distance) * 5 * influence);
  });

  useEffect(() => {
    if (!active || reducedMotion) {
      xTarget.set(0);
      yTarget.set(0);
      rotationTarget.set(0);
      if (reducedMotion) {
        x.jump(0);
        y.jump(0);
        rotate.jump(0);
      }
    }
  }, [active, reducedMotion, xTarget, yTarget, rotationTarget, x, y, rotate]);

  return (
    <motion.span
      ref={anchor}
      className={`chaos-word ${word.className}`}
      style={{ x: magneticX, y: magneticY, rotate: magneticRotation, scale, color }}
    >
      {/* Separate transforms let pointer springs settle throughout the exit animation. */}
      <motion.span className="word-physics" style={{ x, y, rotate }}>
        <FluidWord text={word.text} progress={progress} />
      </motion.span>
    </motion.span>
  );
}

export default function KineticHero() {
  const [organized, setOrganized] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const controller = useRef({ running: false, organized: false });
  const reducedMotion = useHeroReducedMotion();

  const [transitioning, setTransitioning] = useState(false);
  const progress = useMotionValue(0);
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const footer = useRef<HTMLElement>(null);
  const scatteredFooterHeight = useRef(0);
  const footerHeight = useMotionValue<number | string>("auto");
  const footerPlayback = useRef<ReturnType<typeof animate> | null>(null);
  const fragmentsOpacity = useTransform(progress, p => 1 - smooth((p - 0.08) / 0.57));
  const fragmentsScale = useTransform(progress, p => 1 - smooth(p) * 0.035);
  const headlineMask = (p: number, start: number) => {
    const reveal = smooth((p - start) / 0.37);
    // Negative tracking lets the last glyph overhang its line box.
    // Expand the completed mask without changing the approved text geometry.
    const edge = `calc(${(1 - reveal) * 50}% - ${reveal * 0.12}em)`;
    return `inset(-0.12em ${edge} -0.15em ${edge})`;
  };
  const revealFirst = useTransform(progress, p => headlineMask(p, 0.40));
  const revealSecond = useTransform(progress, p => headlineMask(p, 0.44));
  const revealThird = useTransform(progress, p => headlineMask(p, 0.48));
  const columnOpacity = useTransform(progress, p => smooth((p - 0.55) / 0.3));
  const headlineOpacity = useTransform(progress, p => smooth((p - 0.38) / 0.18));

  const reorganize = (next: boolean) => {
    if (controller.current.running || controller.current.organized === next) return;
    controller.current = { running: true, organized: next };
    cursor.set(null);
    if (footer.current) {
      const height = footer.current.getBoundingClientRect().height;
      if (next) scatteredFooterHeight.current = height;
      footerHeight.set(height);
      footerPlayback.current?.stop();
      const compactHeight = parseFloat(getComputedStyle(footer.current).minHeight);
      footerPlayback.current = animate(footerHeight, next ? compactHeight : scatteredFooterHeight.current, {
        duration: reducedMotion ? 0 : 1.7,
        ease: [0.22, 1, 0.36, 1],
      });
    }
    setOrganized(next);
    setTransitioning(true);
    playback.current?.stop();
    playback.current = animate(progress, next ? 1 : 0, {
      duration: reducedMotion ? 0 : 1.7,
      ease: "linear",
      onComplete: () => {
        controller.current.running = false;
        setTransitioning(false);
      },
    });
  };
  useEffect(() => () => {
    playback.current?.stop();
    footerPlayback.current?.stop();
  }, []);
  useEffect(() => {
    if (reducedMotion) {
      playback.current?.complete();
      footerPlayback.current?.complete();
    }
  }, [reducedMotion]);
  const cursor = useMotionValue<Cursor>(null);
  const hoverCapable = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      hoverCapable.current = media.matches;
      if (!media.matches) cursor.set(null);
    };
    const reset = () => cursor.set(null);
    update();
    media.addEventListener("change", update);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, true);
    window.addEventListener("resize", reset);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("resize", reset);
    };
  }, [cursor]);

  const triggerFromScroll = useEffectEvent(() => reorganize(true));
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    let wheelDistance = 0;
    let lastWheel = 0;
    let touchY: number | null = null;
    const visible = () => {
      const bounds = element.getBoundingClientRect();
      return bounds.top > -60 && bounds.top < window.innerHeight * 0.25 && bounds.bottom > window.innerHeight * 0.7;
    };
    const excluded = (target: EventTarget | null) => target instanceof Element && !!target.closest("input, textarea, select, [contenteditable], [data-native-scroll]");
    const request = (event: Event) => {
      const state = controller.current;
      if (!visible() || (state.organized && !state.running)) return;
      if (state.running && !state.organized) return;
      if (event.cancelable) event.preventDefault();
      if (!state.running) triggerFromScroll();
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || excluded(event.target) || event.deltaY <= 0 || Math.abs(event.deltaX) > event.deltaY) return;
      const now = performance.now();
      if (now - lastWheel > 220) wheelDistance = 0;
      lastWheel = now;
      wheelDistance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (wheelDistance >= 45 || controller.current.running) request(event);
    };
    const start = (event: TouchEvent) => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const move = (event: TouchEvent) => {
      if (touchY === null || event.touches.length !== 1 || excluded(event.target)) return;
      const distance = touchY - event.touches[0].clientY;
      if (distance > 40) request(event);
    };
    const end = () => { touchY = null; };
    const key = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || excluded(event.target)) return;
      if (event.target instanceof Element && event.target.closest("button, a, [role=button]")) return;
      if (["ArrowDown", "PageDown", " "].includes(event.key)) request(event);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", end);
    window.addEventListener("keydown", key);
    return () => {
      element.removeEventListener("wheel", wheel);
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", end);
      window.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <div className="kinetic-page">
      <section
        ref={hero}
        style={{ touchAction: !organized || transitioning ? "pan-x pinch-zoom" : "auto" }}
        className="kinetic-hero"
        aria-label="An introduction to Gia"
        onPointerMove={(event) => {
          if (!organized && !transitioning && !reducedMotion && hoverCapable.current && event.pointerType === "mouse") {
            cursor.set({ x: event.clientX, y: event.clientY });
          } else {
            cursor.set(null);
          }
        }}
        onPointerLeave={() => cursor.set(null)}
        onPointerCancel={() => cursor.set(null)}
      >
        {/* Navigation */}
        <header className="hero-nav">
          <div className="nav-brand">
            <span className="brand-name">Gia S.</span>
            <span className="brand-divider">/</span>
            <span className="brand-description">
              an interactive letter
            </span>
          </div>

          <div className="nav-right">
            <span className="nav-label">AN INTRODUCTION</span>
            <span className="nav-line" />
            <span className="nav-number">
              {organized ? "02" : "01"}
            </span>
          </div>
        </header>

        {/* Typography canvas */}
        <div className="hero-canvas">
          <div className="chaos-container">
                {/* Bars and cropped letter contours follow the before-state reference. */}
                <motion.svg
                  style={{ opacity: fragmentsOpacity, scale: fragmentsScale }}
                  className="chaos-fragments"
                  viewBox="0 0 1000 650"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g fill="#94a58a">
                    <path opacity=".48" d="M-40 32 210 20 213 80-37 96Z" />
                    <path opacity=".25" d="m660 87 130-25 12 65-130 24Z" />
                    <path opacity=".27" d="m45 295 220-30 6 71-218 35Z" />
                    <path opacity=".2" d="m175 410 425-85 15 90-422 90Z" />
                    <path opacity=".2" d="m720 510 160-20 53 190-96 12Z" />
                  </g>
                  <g fill="#d596a7">
                    <path opacity=".13" d="m345-10 160-26 39 196-157 31Z" />
                    <path opacity=".16" d="m160 210 438-68 14 75-440 70Z" />
                    <path opacity=".18" d="m825 91 55-12 56 256-57 10Z" />
                    <path opacity=".16" d="m620 414 113-39 17 55-111 43Z" />
                    <path opacity=".13" d="m410 500 69-19 54 209-71 17Z" />
                  </g>
                  <g fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="300" letterSpacing="-25">
                    <text x="900" y="225" fill="#38312f" opacity=".07" transform="rotate(-9 900 225)">e</text>
                    <text x="-80" y="565" fill="#d596a7" opacity=".18" transform="rotate(14 -80 565)">e</text>
                    <text x="245" y="690" fill="#38312f" opacity=".07" transform="rotate(-25 245 690)">a</text>
                  </g>
                </motion.svg>

                {scatteredWords.map((word) => (
                  <ScatteredWordView key={word.text} word={word} cursor={cursor} progress={progress} active={!organized && !transitioning} />
                ))}
          </div>
          <motion.aside className="editorial-column" aria-hidden="true" style={{ opacity: columnOpacity }}>
            {scatteredWords.map(word => <span key={word.text} data-word-slot={word.text} />)}
          </motion.aside>
          <div className="organized-container" aria-hidden={!organized}>
            <motion.div className="final-headline" style={{ opacity: headlineOpacity }}>
              <motion.span className="headline-line headline-first" style={{ clipPath: revealFirst }}>There's a</motion.span>
              <motion.span className="headline-line headline-second" style={{ clipPath: revealSecond }}>better</motion.span>
              <motion.span className="headline-line headline-third" style={{ clipPath: revealThird }}>way.</motion.span>
            </motion.div>
          </div>
        </div>

        {/* Bottom content */}
        <motion.footer ref={footer} className="hero-footer" style={{ height: footerHeight }}>
          <AnimatePresence mode="wait" initial={false}>
            {!organized ? (
              <motion.div
                key="action"
                className="footer-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  className="hero-action"
                  onClick={() => reorganize(true)}
                  disabled={transitioning}
                  aria-label="Organize the typography"
                >
                  <span className="hero-action-kicker">SOMETHING FEELS OFF?</span>
                  <span className="hero-action-title">
                    Make it make sense <span className="hero-action-arrow" aria-hidden="true">&#8599;</span>
                  </span>
                </button>

              </motion.div>
            ) : (
              <motion.div
                key="message"
                className="footer-organized"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : 1.05,
                  duration: reducedMotion ? 0 : 0.35,
                }}
              >
                <p className="hero-tagline">
                  Finding it is what I love doing.
                </p>

                <button
                  className="hero-reset"
                  onClick={() => reorganize(false)}
                  disabled={transitioning}
                >
                  ↺ Replay
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="footer-meta">
            <span>{organized ? "SCROLL TO MEET GIA" : "THE BEGINNING"}</span>
            <span className="footer-meta-line" />
          </div>
        </motion.footer>
      </section>
    </div>
  );
}