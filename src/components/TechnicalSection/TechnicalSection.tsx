import ChapterLabel from "../ChapterLabel/ChapterLabel";
import ChapterRule from "../ChapterLabel/ChapterRule";
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
  photoCaption: string;
  accent: string;
  imagePosition?: string;
  mainRegion: SafeRegion;
  teamRegion: SafeRegion;
  details: string[];
  paragraphs: string[];
};

const experiences: Experience[] = [
  {
    id: "apple",
    number: "01",
    name: "Apple",
    category: "SOFTWARE ENGINEERING",
    image: "/images/apple-rainbow.png",
    teamImage: "/images/apple-team.png",
    photoCaption: "My lovely (extended) team after our last dinner together!",
    accent: "#C88EA0",
    imagePosition: "center 53%",
    mainRegion: [0.58, 0.47, 0.77, 0.61],
    teamRegion: [0.10, 0.07, 0.87, 0.74],
    paragraphs: [
          "At Apple, I was drawn to the challenge of defining an ambiguous problem: where could AI make the biggest impact on an internal testing visualization platform?",
          "I interviewed team managers to understand their workflows and figure out where a new feature could fit. That led me to develop AI Insights, a test suite summarizer that highlighted improvements, concerns, and regressions compared to previous weeks in just seconds.",
          "I owned the feature's end-to-end development, from designing the data model and APIs to prompt engineering and building the React interface. I introduced a human-in-the-loop approval process and refined how the feature fit into the platform's architecture.",
          "This was my first opportunity to conduct real stakeholder interviews! I discovered how much I enjoy working with people and building technology that works for them. Getting to see the impact of my work and knowing its development continued after I left made the experience even more valuable."
    ],
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
    photoCaption: "My partner in crime and one of our mentors.",
    accent: "#778D70",
    imagePosition: "center 37%",
    mainRegion: [0.08, 0.03, 0.94, 0.37],
    teamRegion: [0, 0.03, 0.79, 0.60],
    paragraphs: [
          "At M&T, I was drawn to the challenge of working with systems I had never encountered before. My task was to migrate an application's CI/CD pipelines from Azure DevOps to GitLab, which meant studying unfamiliar scripts, translating them into YAML, and spending many, many pipeline runs reading through logs.",
          "Before this internship, I had never really worked under the hood. But with each running pipeline, I grew more confident and independent. I ended up migrating two applications instead of one, which earned me the opportunity to tackle a security vulnerability the team didn’t yet know how to resolve.",
          "I left knowing that researching implementation approaches and understanding the systems you're working with are often half the battle. Even when I don't know where to start, I can figure it out!"
    ],
    details: [
      "Azure DevOps → GitLab",
      "CI/CD migration",
      "Deployment pipelines",
    ],
  },
  {
    id: "cubesat",
    number: "03",
    name: "DAPPEr",
    category: "SATELLITE RESEARCH",
    image: "/images/cubesat-board.png",
    teamImage: "/images/cubesat-team.png",
    photoCaption: "My partner and I passing the torch to the new team!",
    accent: "#B68C78",
    imagePosition: "center",
    mainRegion: [0.2, 0.2, 0.8, 0.7],
    teamRegion: [0, 0.01, 0.76, 0.82],
    paragraphs: [
          "Working on the DAPPEr (Delaware Atmospheric Plasma Probe Experiment) team introduced me to an entirely different side of computer science. I was surrounded by unfamiliar hardware, technical documentation, and systems I had never encountered before.",
          "A lot of my work involved researching, creating flight packet structures, and mapping communication diagrams. I spent a good chunk of my time reading and understanding how everything fit together. One of our biggest accomplishments was connecting an Arduino board to the satellite's Attitude Determination and Control System (ADCS) and successfully confirming communication between them.",
          "This experience taught me that problem-solving doesn't always mean jumping straight into implementation. Sometimes, the most important step is taking the time to understand the system first."
    ],
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
        <p>{experience.photoCaption}</p>
      </figcaption>
    </figure>
  );
}

export default function TechnicalSection() {
  const [activeId, setActiveId] = useState<ExperienceId | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const accordion = accordionRef.current;
    if (!accordion || !activeId) return;
    const panel = accordion.querySelector<HTMLElement>(".technical-panel.is-active");
    const content = panel?.querySelector<HTMLElement>(".technical-panel-content");
    const heading = content?.querySelector<HTMLElement>(".technical-expanded-heading");
    const writing = content?.querySelector<HTMLElement>(".technical-expanded-writing");
    const layout = content?.querySelector<HTMLElement>(".technical-expanded-layout");
    const photos = content?.querySelector<HTMLElement>(".technical-expanded-visuals");
    if (!panel || !content || !heading || !writing || !layout || !photos) return;
    const measure = () => {
      if (!panel.classList.contains("is-active")) return;
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const panelStyle = getComputedStyle(panel);
      const contentStyle = getComputedStyle(content);
      const layoutStyle = getComputedStyle(layout);
      const gap = parseFloat(getComputedStyle(accordion).columnGap) || 0;
      const grow = parseFloat(getComputedStyle(accordion).getPropertyValue("--technical-active-grow"));
      // Measure at the destination width, not the narrow intermediate animation width.
      const panelWidth = mobile ? accordion.clientWidth : (accordion.clientWidth - gap * 2) * grow / (grow + 2);
      const contentWidth = panelWidth - parseFloat(contentStyle.paddingLeft) - parseFloat(contentStyle.paddingRight);
      const writingWidth = mobile ? contentWidth : (contentWidth - parseFloat(layoutStyle.columnGap)) / 1.95;
      const naturalHeight = (element: HTMLElement, width: number) => {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;
        Object.assign(clone.style, { position: "absolute", visibility: "hidden", pointerEvents: "none", width: `${width}px`, height: "auto", top: "0", left: "0", transition: "none", transform: "none" });
        content.append(clone);
        const height = clone.getBoundingClientRect().height;
        clone.remove();
        return height;
      };
      const headingHeight = naturalHeight(heading, contentWidth) + parseFloat(getComputedStyle(heading).marginBottom);
      const writingHeight = naturalHeight(writing, writingWidth);
      const photoHeight = photos.getBoundingClientRect().height;
      const layoutHeight = mobile ? photoHeight + parseFloat(layoutStyle.rowGap) + writingHeight : Math.max(photoHeight, writingHeight);
      const height = Math.ceil(parseFloat(contentStyle.top) + headingHeight + layoutHeight + parseFloat(contentStyle.paddingBottom) + parseFloat(panelStyle.borderTopWidth) + 2);
      accordion.style.setProperty("--technical-expanded-height", `${height}px`);
    };
    measure();
    let previousWidth = accordion.clientWidth;
    const observer = new ResizeObserver(() => {
      if (accordion.clientWidth !== previousWidth) {
        previousWidth = accordion.clientWidth;
        measure();
      }
    });
    observer.observe(accordion);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(() => { if (accordion.isConnected) measure(); });
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [activeId]);

  const toggleExperience = (id: ExperienceId) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section className="technical-section" id="technical" aria-labelledby="technical-title" tabIndex={-1}>
      <div className="technical-container">

        {/* INTRODUCTION */}

        <div className="technical-intro">
          <div className="technical-section-label">
            <ChapterLabel number="01" title="SYSTEMS" />
            <ChapterRule className="technical-label-line" />
          </div>

          <h2 id="technical-title" className="technical-headline">
            I like the
            <br />
            <span>detective work.</span>
          </h2>

          <div className="technical-intro-bottom">
            <p className="technical-intro-statement">
              Especially when I don't know
              <br />
              where to start.
            </p>

            <div className="technical-intro-copy">
              <span>EVERY SYSTEM HAS A STORY</span>
              <p>
                The satisfaction of turning hieroglyphics into plain English is what drew me to computer science in the first place.
              </p>
            </div>
          </div>
        </div>

        {/* ACCORDION INTRO */}

        <div className="technical-accordion-heading">
          <ChapterLabel number="01.1" title="EXPERIENCES" />
          <span>CLICK TO EXPLORE ↘</span>
        </div>

        {/* HORIZONTAL ACCORDION */}

        <div
          ref={accordionRef}
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

                      {experience.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}

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
            <ChapterLabel number="01.2" title="IT'S NOT ONLY WORK" />
          </span>

          <p>
            For me, the people have always been
            <br />
            <span>just as important as the work.</span>
          </p>

          <a href="#people" className="technical-next-link">
            NEXT CHAPTER: THE PEOPLE <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}