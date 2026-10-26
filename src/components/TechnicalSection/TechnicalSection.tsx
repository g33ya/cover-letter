import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./TechnicalSection.css";

type SafeRegion = readonly [number, number, number, number];

type ExperienceId = "apple" | "mt" | "cubesat";

type Experience = {
  id: ExperienceId;
  number: string;
  name: string;
  category: string;
  image: string;
  teamImage: string;
  accent: string;
  imagePosition?: string;
  mainRegion: SafeRegion;
  teamRegion: SafeRegion;
  details: string[];
};

const experiences: Experience[] = [
  {
    id: "apple",
    number: "01",
    name: "Apple",
    category: "SOFTWARE ENGINEERING",
    image: "/images/apple-rainbow.png",
    teamImage: "/images/apple-team.png",
    accent: "#C88EA0",
    imagePosition: "center 53%",
    mainRegion: [0.58, 0.47, 0.77, 0.61],
    teamRegion: [0.10, 0.07, 0.87, 0.74],
    details: [
      "Full-stack development",
      "AI integration",
      "Internal engineering tools",
    ],
  },
  {
    id: "mt",
    number: "02",
    name: "M&T Bank",
    category: "DEVOPS & INFRASTRUCTURE",
    image: "/images/mt-migration.png",
    teamImage: "/images/mt-team.png",
    accent: "#778D70",
    imagePosition: "center 37%",
    mainRegion: [0.08, 0.03, 0.94, 0.37],
    teamRegion: [0, 0.03, 0.79, 0.60],
    details: [
      "Azure DevOps → GitLab",
      "CI/CD migration",
      "Deployment pipelines",
    ],
  },
  {
    id: "cubesat",
    number: "03",
    name: "CubeSat",
    category: "SATELLITE RESEARCH",
    image: "/images/cubesat-board.png",
    teamImage: "/images/cubesat-team.png",
    accent: "#B68C78",
    imagePosition: "center",
    mainRegion: [0.2, 0.2, 0.8, 0.7],
    teamRegion: [0, 0.01, 0.76, 0.82],
    details: [
      "Technical documentation",
      "Arduino",
      "ADCS communication",
    ],
  },
];

// Hand-tuned subject bounds from the original photographs, including headroom.
// Keep the largest possible crop while ensuring the entire protected region fits.
function SubjectPhoto({ src, alt, region }: { src: string; alt: string; region: SafeRegion }) {
  const ref = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const image = ref.current;
    const frame = image?.parentElement;
    if (!image || !frame) return;
    const crop = () => {
      const { naturalWidth: iw, naturalHeight: ih } = image;
      const { clientWidth: fw, clientHeight: fh } = frame;
      if (!iw || !ih || !fw || !fh) return;
      const [left, top, right, bottom] = region;
      const cover = Math.max(fw / iw, fh / ih);
      const scale = Math.min(cover, fw / (iw * (right - left)), fh / (ih * (bottom - top)));
      const width = iw * scale;
      const height = ih * scale;
      const offset = (size: number, viewport: number, start: number, end: number) => {
        if (size <= viewport) return (viewport - size) / 2;
        const min = Math.max(viewport - size, -start * size);
        const max = Math.min(0, viewport - end * size);
        return Math.max(min, Math.min(max, viewport / 2 - (start + end) / 2 * size));
      };
      Object.assign(image.style, {
        width: `${width}px`, height: `${height}px`,
        left: `${offset(width, fw, left, right)}px`, top: `${offset(height, fh, top, bottom)}px`,
      });
    };
    crop();
    image.addEventListener("load", crop);
    const observer = new ResizeObserver(crop);
    observer.observe(frame);
    return () => { observer.disconnect(); image.removeEventListener("load", crop); };
  }, [region]);
  return <img ref={ref} className="technical-subject-photo" src={src} alt={alt} data-safe-region={region.join(",")} />;
}

function ExperiencePhotos({ experience }: { experience: Experience }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const figure = ref.current;
    const team = figure?.querySelector<HTMLImageElement>(".technical-expanded-team img");
    const caption = figure?.querySelector("figcaption");
    if (!figure || !team || !caption) return;
    const balance = () => {
      if (!team.naturalWidth) return;
      const gap = parseFloat(getComputedStyle(figure).rowGap);
      const available = figure.clientHeight - caption.getBoundingClientRect().height - gap * 2;
      const naturalHeight = figure.clientWidth * team.naturalHeight / team.naturalWidth;
      const required = naturalHeight * (experience.teamRegion[3] - experience.teamRegion[1]);
      // Borrow space from the main image only when the group needs more headroom.
      const height = Math.max(0, Math.min(available * 0.7, naturalHeight, Math.max(available * 0.4, required)));
      figure.style.setProperty("--team-photo-height", `${height}px`);
    };
    balance();
    team.addEventListener("load", balance);
    const observer = new ResizeObserver(balance);
    observer.observe(figure);
    observer.observe(caption);
    return () => { observer.disconnect(); team.removeEventListener("load", balance); };
  }, [experience]);
  return (
    <figure ref={ref} className="technical-expanded-visuals">
      <div className="technical-expanded-main-photo">
        <SubjectPhoto src={experience.image} alt={`${experience.name} experience`} region={experience.mainRegion} />
      </div>
      <div className="technical-expanded-team">
        <SubjectPhoto src={experience.teamImage} alt={`My team during my ${experience.name} experience`} region={experience.teamRegion} />
      </div>
      <figcaption className="technical-photo-caption" onClick={event => event.stopPropagation()}>
        <span>THE PEOPLE BEHIND THE WORK</span>
        <p>[Your photo caption]</p>
      </figcaption>
    </figure>
  );
}

export default function TechnicalSection() {
  const [activeId, setActiveId] = useState<ExperienceId | null>(null);

  const toggleExperience = (id: ExperienceId) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section className="technical-section" id="technical" aria-labelledby="technical-title" tabIndex={-1}>
      <div className="technical-container">

        {/* INTRODUCTION */}

        <div className="technical-intro">
          <div className="technical-section-label">
            <span className="technical-label-line" />
            CHAPTER 01 / THE WORK
          </div>

          <h2 id="technical-title" className="technical-headline">
            I like figuring
            <br />
            <span>things out.</span>
          </h2>

          <div className="technical-intro-bottom">
            <p className="technical-intro-statement">
              Especially when I don't know
              <br />
              where to start.
            </p>

            <div className="technical-intro-copy">
              <span>YOUR WORDS GO HERE</span>
              <p>
                [Write about your curiosity, your love of learning,
                and how technical challenges make you feel like
                a detective.]
              </p>
            </div>
          </div>
        </div>

        {/* ACCORDION INTRO */}

        <div className="technical-accordion-heading">
          <span>THREE EXPERIENCES, THREE DIFFERENT CHALLENGES</span>
          <span>CLICK TO EXPLORE ↘</span>
        </div>

        {/* HORIZONTAL ACCORDION */}

        <div
          className={`technical-accordion ${
            activeId ? "has-active" : ""
          }`}
        >
          {experiences.map((experience) => {
            const isActive = activeId === experience.id;
            const isInactive = activeId !== null && !isActive;

            return (
              <article
                key={experience.id}
                className={[
                  "technical-panel",
                  isActive ? "is-active" : "",
                  isInactive ? "is-inactive" : "",
                ].join(" ")}
                style={
                  {
                    "--panel-accent": experience.accent,
                  } as CSSProperties
                }
                onClick={(event) => {
                  const target = event.target as Element;
                  if (target.closest("button, a, input, textarea, select, [contenteditable], .technical-expanded-writing, img, figcaption") &&
                      (isActive || target.closest("button, a, input, textarea, select, [contenteditable]"))) return;
                  const selection = window.getSelection();
                  if (selection && !selection.isCollapsed && event.currentTarget.contains(selection.anchorNode)) return;
                  toggleExperience(experience.id);
                }}
              >
                {/* PANEL HEADER */}

                <button
                  type="button"
                  className="technical-panel-trigger"
                  onClick={(event) => { event.stopPropagation(); toggleExperience(experience.id); }}
                  aria-label={`${isActive ? "Collapse" : "Expand"} ${experience.name} experience`}
                  aria-expanded={isActive}
                  aria-controls={`technical-content-${experience.id}`}
                >
                  <span className="technical-panel-number">
                    {experience.number} / 03
                  </span>

                  <span className="technical-panel-toggle">
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                {/* COLLAPSED / DEFAULT PREVIEW */}

                <div className="technical-panel-preview">
                  <div className="technical-preview-photo">
                    <img src={experience.image} alt="" style={{ objectPosition: experience.imagePosition }} />
                  </div>

                  <div className="technical-preview-info">
                    <span>{experience.category}</span>
                    <h3>{experience.name}</h3>


                  </div>
                </div>

                {/* EXPANDED CONTENT */}

                <div
                  id={`technical-content-${experience.id}`}
                  className="technical-panel-content"
                  aria-hidden={!isActive}
                  {...(!isActive ? { inert: true } : {})}
                >
                  <div className="technical-expanded-heading">
                    <span>{experience.category}</span>
                    <h3>{experience.name}.</h3>
                  </div>

                  <div className="technical-expanded-layout">

                    {/* LEFT — PHOTOGRAPHY */}

                    <ExperiencePhotos experience={experience} />

                    {/* RIGHT — WRITING */}

                    <div className="technical-expanded-writing" onClick={event => event.stopPropagation()}>
                      <span className="technical-writing-label">
                        MY EXPERIENCE
                      </span>

                      <p>
                        [Paragraph 1: What drew you into this
                        challenge? What were you trying to understand
                        or accomplish?]
                      </p>

                      <p>
                        [Paragraph 2: What did you work on, what
                        did you learn, and why did the experience
                        matter to you?]
                      </p>

                      <div className="technical-expanded-details">
                        <span>WHAT I WORKED WITH</span>

                        <ul>
                          {experience.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMPRESSED LABEL */}

                <div className="technical-vertical-label" aria-hidden="true">
                  <span>{experience.name}</span>
                  <span>↗</span>
                </div>
              </article>
            );
          })}
        </div>

        {/* TRANSITION */}

        <div className="technical-transition">
          <span className="technical-transition-label">
            BUT THE WORK IS ONLY PART OF IT
          </span>

          <p>
            The more I learned about building things,
            <br />
            the more I appreciated{" "}
            <span>who I was building them with.</span>
          </p>

          <a href="#people" className="technical-next-link">
            NEXT CHAPTER: THE PEOPLE <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}