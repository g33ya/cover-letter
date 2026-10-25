import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import "./HenHacksSection.css";

const ease = [0.22, 1, 0.36, 1] as const;

const milestones = [
  { label: "FOUNDING YEAR", detail: "Organizer" },
  { label: "REGISTRATION", detail: "Head · Two years" },
  { label: "2025", detail: "Coordinator" },
];

const workflow = [
  {
    label: "Assign",
    description: "Clear ownership for every task.",
  },
  {
    label: "Track",
    description: "Shared visibility into progress.",
  },
  {
    label: "Communicate",
    description: "Consistent expectations and updates.",
  },
  {
    label: "Deliver",
    description: "A coordinated event experience.",
  },
];

function subscribeMotionPreference(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const resolve = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

function WorkflowRow({ item, index, progress }: {
  item: typeof workflow[number]; index: number; progress: MotionValue<number>;
}) {
  const alignment = useTransform(progress, p => resolve((p - index * 0.06) / 0.68));
  const x = useTransform(alignment, p => [ -10, 7, -6, 9 ][index] * (1 - p));
  const y = useTransform(alignment, p => [ 4, -3, 2, -4 ][index] * (1 - p));
  const rotate = useTransform(alignment, p => (index % 2 === 0 ? -1.2 : 1.2) * (1 - p));
  const rule = useTransform(progress, p => resolve((p - 0.12 - index * 0.14) / 0.32));
  const descriptionOpacity = useTransform(rule, p => 0.9 + p * 0.1);
  const descriptionX = useTransform(rule, p => 4 * (1 - p));

  return (
    <div className="hh-workflow-row" role="listitem">
      <span className="hh-workflow-dot" aria-hidden="true" />
      <motion.span className="hh-workflow-name" style={{ x, y, rotate }}>{item.label}</motion.span>
      <motion.span className="hh-workflow-rule" style={{ scaleX: rule }} aria-hidden="true" />
      <motion.span className="hh-workflow-description" style={{ opacity: descriptionOpacity, x: descriptionX }}>
        {item.description}
      </motion.span>
    </div>
  );
}

function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reducedMotion = useSyncExternalStore(
    subscribeMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const progress = useMotionValue(reducedMotion ? 1 : 0);
  const verticalRule = useTransform(progress, p => resolve((p - 0.04) / 0.76));

  useEffect(() => {
    if (reducedMotion) {
      progress.jump(1);
      return;
    }
    if (!inView) return;
    const animation = animate(progress, 1, { duration: 1.1, ease: "linear" });
    return () => animation.stop();
  }, [inView, reducedMotion, progress]);

  return (
    <div ref={ref} className="hh-workflow" role="list" aria-label="An organized workflow">
      <motion.span className="hh-workflow-spine" style={{ scaleY: verticalRule }} aria-hidden="true" />
      {workflow.map((item, index) => <WorkflowRow key={item.label} item={item} index={index} progress={progress} />)}
    </div>
  );
}

export default function HenHacksSection() {
  const reducedMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: reducedMotion ? 0 : 35,
    },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      once: true,
      amount: 0.15,
    },
    transition: {
      duration: reducedMotion ? 0 : 0.8,
      delay: reducedMotion ? 0 : delay,
      ease,
    },
  });

  return (
    <section
      id="henhacks"
      className="henhacks-section"
      aria-labelledby="henhacks-title"
    >
      {/* =========================
          01 — INTRODUCTION
      ========================= */}

      <div className="hh-intro">
        <motion.div
          className="hh-intro-copy"
          {...reveal()}
        >
          <div className="hh-section-label">
            <span>03</span>
            <span className="hh-label-rule" />
            <span>HENHACKS</span>
          </div>

          <h2 id="henhacks-title" className="hh-title">
            A little
            <br />
            organized
            <br />
            <span>chaos.</span>
          </h2>

          <p className="hh-intro-lead">
            From founding-year organizer
            <br />
            to 2025 coordinator.
          </p>

          <p className="hh-intro-body">
            HenHacks became one of the most rewarding parts
            of my college experience. I joined during its
            founding year, spent two years leading registration,
            and eventually stepped into the coordinator role
            in 2025.
          </p>

          <div className="hh-timeline">
            {milestones.map((milestone, index) => (
              <motion.div
                className="hh-milestone"
                key={milestone.label}
                initial={{
                  opacity: 0,
                  y: reducedMotion ? 0 : 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0 : 0.55,
                  delay: reducedMotion ? 0 : index * 0.16,
                  ease,
                }}
              >
                <span className="hh-milestone-dot" />
                <span className="hh-milestone-label">
                  {milestone.label}
                </span>
                <span className="hh-milestone-detail">
                  {milestone.detail}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.figure
          className="hh-intro-photo"
          {...reveal(0.12)}
        >
          <img
            src="/images/henhacks-presenting.jpg"
            alt="Gia speaking into a microphone during a HenHacks event."
            loading="lazy"
          />
        </motion.figure>
      </div>

      {/* =========================
          02 — EVENT SCALE
      ========================= */}

      <div className="hh-scale">
        <div className="hh-section-heading">
          <span>03.2</span>
          <span className="hh-heading-rule" />
          <span>THE BIGGER PICTURE</span>
        </div>

        <motion.figure
          className="hh-auditorium"
          {...reveal()}
        >
          <img
            src="/images/henhacks-auditorium.jpg"
            alt="A packed university auditorium filled with HenHacks participants."
            loading="lazy"
          />
        </motion.figure>

        <div className="hh-scale-grid">
          <motion.div
            className="hh-scale-copy"
            {...reveal()}
          >
            <h3>
              A lot of people.
              <br />
              <span>Even more moving pieces.</span>
            </h3>

            <p>
              Placeholder.
            </p>

            <p>
              Placeholder.
            </p>

            <p>
              Placeholder.
            </p>
          </motion.div>

          <motion.figure
            className="hh-team-photo"
            {...reveal(0.12)}
          >
            <img
              src="/images/henhacks-team.png"
              alt="Gia and fellow HenHacks organizers wearing matching pink event shirts."
              loading="lazy"
            />
            <figcaption>
              THE PEOPLE WHO MADE IT HAPPEN
            </figcaption>
          </motion.figure>
        </div>
      </div>

      {/* =========================
          03 — PROCESS IMPROVEMENT
      ========================= */}

      <div id="process" className="hh-process">
        <div className="hh-section-heading">
          <span>03.3</span>
          <span className="hh-heading-rule" />
          <span>TURNING CHAOS INTO CLARITY</span>
        </div>

        <div className="hh-process-grid">
          <motion.div
            className="hh-process-copy"
            {...reveal()}
          >
            <h3>
              From scattered
              <br />
              tasks to shared
              <br />
              <span>clarity.</span>
            </h3>

            <p>
              Placeholder.
            </p>

            <p>
              Placeholder.
            </p>

            <p>
              Placeholder.
            </p>

            <p className="hh-process-emphasis">
              Placeholder.
            </p>
          </motion.div>

          <Workflow />

          <motion.figure
            className="hh-candid-photo"
            {...reveal(0.15)}
          >
            <img
              src="/images/henhacks-candid.jpeg"
              alt="Gia and a fellow HenHacks organizer wearing playful crowns during the event."
              loading="lazy"
            />
            <figcaption>
              A LITTLE FUN ALONG THE WAY.
            </figcaption>
          </motion.figure>
        </div>

        <div className="hh-next">
          <span>UP NEXT</span>
          <a href="#curiosity">
            CURIOSITY & ENGINEERING
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}