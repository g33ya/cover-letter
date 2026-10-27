import ChapterLabel from "../ChapterLabel/ChapterLabel";
import ChapterRule from "../ChapterLabel/ChapterRule";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./PeopleSection.css";

const revealTransition = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
};

function BandVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const update = () => {
      const shouldPlay = visible && !document.hidden && !reducedMotion;
      if (shouldPlay) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
      update();
    }, { threshold: [0, 0.3] });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <figure className="people-band-media">
      <video
        id="people-band-video"
        ref={videoRef}
        src="/videos/professor-student-band.mov"
        poster="/images/professor-student-band-poster.jpg"
        width={1170} height={652}
        muted loop playsInline preload="metadata"
        aria-label="Professor-student band performing together, with Gia singing. Silent video."
      />
      <figcaption className="people-collage-caption">I even sang in a student-professor band!</figcaption>
    </figure>
  );
}

export default function PeopleSection() {
  const reducedMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: reducedMotion ? 0 : 20,
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
      tabIndex={-1}
      className="people-section"
      aria-labelledby="people-title"
    >
      {/* PART 1 — INTRODUCTION */}
      <div className="people-intro">
        <div className="people-intro-content">
          <motion.div {...reveal()}>
            <span className="people-eyebrow">
              <ChapterLabel number="02" title="PEOPLE" />
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
              I've always loved building
              <br />
              community.
            </p>
          </motion.div>
        </div>

        <motion.figure
          className="people-main-photo"
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            ...revealTransition,
            duration: reducedMotion ? 0 : 0.75,
            delay: reducedMotion ? 0 : 0.15,
          }}
        >
          <img
            src="/images/department-casual.png"
            width={1132}
            height={867}
            alt="Gia and fellow University of Delaware students gathered on the steps outside a campus house."
            loading="eager"
          />
        </motion.figure>
      </div>

      {/* PART 2 — THE STORY */}
      <div className="people-story">
        <div className="people-section-heading">
          <ChapterLabel number="02.1" title="STORY" />
          <ChapterRule className="people-heading-rule" />
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
                Before I even set foot on the University of Delaware campus, I emailed the professor running the CIS department's community-building organization. I knew I had to get involved! I convinced them to give me a chance, freshman that I was. My driving force has always been to help others.
              </p>

              <p>
                The more time I spent at UD, the more I noticed what students in our department were missing. And whenever I saw something we could improve, I wanted to do something about it! Together, we organized everything from project showcases and résumé reviews to Halloween costume contests and field days. We wanted to give students every opportunity to learn and connect.
              </p>
            </div>

            <div className="people-story-caption">
              Community, in all its forms.
            </div>
          </motion.div>

          <motion.div className="people-story-collage" {...reveal(0.15)}>
            <figure className="people-outdoor-photo">
              <img
                src="/images/department-outdoor.png"
                width={1170}
                height={762}
                alt="Gia and a large group of Computer Science department students gathered outdoors."
                loading="lazy"
              />
            </figure>

            <div className="people-community-media">
              <figure className="people-event-media">
                <img src="/images/department-event.png" width={1170} height={868}
                  alt="A packed department classroom with students and faculty gathered together for a community event."
                  loading="lazy" />
                <figcaption className="people-collage-caption">Our "Meet the Professors" event turnout</figcaption>
              </figure>
              <BandVideo />
            </div>
          </motion.div>
        </div>
      </div>

      {/* PART 3 — TRANSITION */}
      <div className="people-transition">
        <div className="people-section-heading">
          <ChapterLabel number="02.2" title="TRANSITION" />
          <ChapterRule className="people-heading-rule" />
          <span>PEOPLE / LEADERSHIP / WHAT'S NEXT</span>
        </div>

        <div className="people-transition-grid">
          <motion.div
            className="people-transition-content"
            {...reveal()}
          >
            <h3>
              Ambition is
              <br />
              <span>contagious.</span>
            </h3>

            <p>
              Being surrounded by passionate peers and professors pushed me to grow in ways I couldn't have on my own. 
            </p>

            <p>
              I learned that collaboration isn't just about what you accomplish together; <span className="people-transition-emphasis">it's about sharing some of that fire, learning from the people around you, and inspiring each other to do something bigger.</span>
            </p>
          </motion.div>

          <motion.figure
            className="people-formal-photo"
            {...reveal(0.15)}
          >
            <img
              src="/images/department-formal.png"
              width={1170}
              height={1529}
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
