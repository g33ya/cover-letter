import { motion, useReducedMotion } from "motion/react";
import "./PeopleSection.css";

const revealTransition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function PeopleSection() {
  const reducedMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: reducedMotion ? 0 : 36,
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
      ...revealTransition,
      duration: reducedMotion ? 0 : revealTransition.duration,
      delay: reducedMotion ? 0 : delay,
    },
  });

  return (
    <section
      id="people"
      className="people-section"
      aria-labelledby="people-title"
    >
      {/* PART 1 — INTRODUCTION */}
      <div className="people-intro">
        <div className="people-intro-content">
          <motion.div {...reveal()}>
            <span className="people-eyebrow">
              02 / PEOPLE
            </span>
          </motion.div>

          <motion.h2
            id="people-title"
            className="people-main-title"
            {...reveal(0.1)}
          >
            It starts
            <br />
            with
            <br />
            <span>people.</span>
          </motion.h2>

          <motion.div
            className="people-intro-bottom"
            {...reveal(0.2)}
          >
            <span className="people-small-label">
              THE HUMAN SIDE
            </span>

            <p>
              I've always loved bringing
              <br />
              people together.
            </p>
          </motion.div>
        </div>

        <motion.figure
          className="people-main-photo"
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            ...revealTransition,
            duration: reducedMotion ? 0 : 1,
            delay: reducedMotion ? 0 : 0.15,
          }}
        >
          <img
            src="/images/department-casual.png"
            alt="Gia and fellow University of Delaware students gathered on the steps outside a campus house."
            loading="eager"
          />
        </motion.figure>
      </div>

      {/* PART 2 — THE STORY */}
      <div className="people-story">
        <div className="people-section-heading">
          <span>02 / STORY</span>
          <div className="people-heading-rule" />
          <span>PEOPLE / COMMUNITY / CONNECTION</span>
        </div>

        <div className="people-story-grid">
          <motion.div
            className="people-story-content"
            {...reveal()}
          >
            <h3>
              Creating spaces
              <br />
              <span>for connection.</span>
            </h3>

            <div className="people-story-copy">
              <p>
                Placeholder
              </p>

              <p>
                Placeholder
              </p>

              <p>
                Placeholder
              </p>

              <p>
                Placeholder
              </p>
            </div>

            <div className="people-story-caption">
              Community, in all its forms.
            </div>
          </motion.div>

          <motion.figure
            className="people-outdoor-photo"
            {...reveal(0.15)}
          >
            <img
              src="/images/department-outdoor.png"
              alt="Gia and a large group of Computer Science department students gathered outdoors."
              loading="lazy"
            />
          </motion.figure>
        </div>
      </div>

      {/* PART 3 — TRANSITION */}
      <div className="people-transition">
        <div className="people-section-heading">
          <span>03 / TRANSITION</span>
          <div className="people-heading-rule" />
          <span>PEOPLE / LEADERSHIP / WHAT'S NEXT</span>
        </div>

        <div className="people-transition-grid">
          <motion.div
            className="people-transition-content"
            {...reveal()}
          >
            <h3>
              I liked the
              <br />
              behind-the-scenes
              <br />
              <span>part, too.</span>
            </h3>

            <p>
              Placeholder.
            </p>

            <p>
              Placeholder.
            </p>

            <p className="people-transition-emphasis">
              Placeholder.
            </p>
          </motion.div>

          <motion.figure
            className="people-formal-photo"
            {...reveal(0.15)}
          >
            <img
              src="/images/department-formal.png"
              alt="Gia and fellow students at a University of Delaware Computer and Information Sciences event."
              loading="lazy"
            />
          </motion.figure>
        </div>

        <div className="people-next">
          <span>UP NEXT</span>
          <a href="#henhacks">
            HENHACKS
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}