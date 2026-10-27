import ChapterLabel from "../ChapterLabel/ChapterLabel";
import { motion, useReducedMotion } from "motion/react";
import "./LeanTaaSSection.css";

// Replace these three writing areas when the final personal statements are ready.
const connectionCopy = [
  "Placeholder",
  "Placeholder",
];
const contributionCopy = [
  "Placeholder",
  "Placeholder",
  "Placeholder",
];
const closingCopy = "Placeholder";
const pathways = [
  { name: "SYSTEMS", detail: "Understand the architecture", color: "#778D70", path: "M 0 34 H 330 C 440 34 420 160 510 160" },
  { name: "PEOPLE", detail: "Understand what teams need", color: "#C88EA0", path: "M 0 160 H 510" },
  { name: "PROCESS", detail: "Make improvements repeatable", color: "#778D70", path: "M 0 286 H 330 C 440 286 420 160 510 160" },
];

function Convergence() {
  const reduced = useReducedMotion();
  return (
    <motion.div className="ideas-convergence" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}
      role="img" aria-label="Systems: understand the architecture. People: understand what teams need. Process: make improvements repeatable. Together, turning ideas into something people can rely on.">
      <div className="ideas-pathways" aria-hidden="true">
        <svg viewBox="0 0 580 320" preserveAspectRatio="none">
          {pathways.map((item, i) => <motion.path key={item.name} d={item.path} fill="none" stroke={item.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }} />)}
          <motion.path d="M 510 160 H 580" stroke="#C88EA0" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }} transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.1 }} />
          <motion.circle cx="510" cy="160" r="7" fill="#C88EA0" variants={{ hidden: { opacity: reduced ? 1 : 0 }, visible: { opacity: 1 } }} transition={{ duration: 0.2, delay: reduced ? 0 : 1.05 }} />
        </svg>
        <div className="ideas-path-labels">
          {pathways.map((item, i) => <div className="ideas-path-label" key={item.name}>
            <span className="ideas-path-number">0{i + 1}</span><strong>{item.name}</strong><span className="ideas-path-detail">{item.detail}</span>
          </div>)}
        </div>
      </div>
      <motion.div className="ideas-outcome" aria-hidden="true" variants={{ hidden: { opacity: reduced ? 1 : 0 }, visible: { opacity: 1 } }} transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 1.25 }}>
        <span>TURNING IDEAS INTO</span>
        <p>Something people<br /><em>can rely on.</em></p>
      </motion.div>
    </motion.div>
  );
}

export default function LeanTaaSSection() {
  const reduced = useReducedMotion();
  const reveal = {
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: reduced ? 0 : 0.65 },
  };
  return (
    <section id="leantaas" className="ideas-section" aria-labelledby="leantaas-title" tabIndex={-1}>
      <div className="ideas-chapter-heading"><ChapterLabel number="04" title="IDEAS" /><span className="ideas-divider" /><span className="ideas-chapter-meta">THE NEXT CHAPTER</span></div>
      <div className="ideas-connection">
        <div className="ideas-label"><ChapterLabel number="04.1" title="THE CONNECTION" /><span className="ideas-divider" /></div>
        <motion.h2 id="leantaas-title" {...reveal}>The best systems<br /><span>work for people.</span></motion.h2>
        <div className="ideas-connection-grid">
          <motion.div className="ideas-copy ideas-connection-copy" {...reveal}>{connectionCopy.map(p => <p key={p}>{p}</p>)}</motion.div>
          <Convergence />
        </div>
      </div>
      <div className="ideas-contribution">
        <div className="ideas-label"><ChapterLabel number="04.2" title="WHY LEANTAAS" /><span className="ideas-divider" /></div>
        <div className="ideas-contribution-grid">
          <motion.h3 {...reveal}>Where I see myself<br /><span>contributing.</span></motion.h3>
          <motion.div className="ideas-copy ideas-contribution-copy" {...reveal}>{contributionCopy.map(p => <p key={p}>{p}</p>)}</motion.div>
        </div>
      </div>
      <div className="ideas-closing">
        <div className="ideas-label"><ChapterLabel number="04.3" title="WHAT COMES NEXT" /><span className="ideas-divider" /></div>
        <div className="ideas-closing-grid">
          <motion.h3 {...reveal}>I'd love to help build<br /><span>what comes next.</span></motion.h3>
          <motion.div className="ideas-copy ideas-closing-copy" {...reveal}>
            <p>{closingCopy}</p>
            {/* Replace the placeholder anchor with the final contact destination. */}
            <a className="ideas-contact" href="#contact-placeholder">LET'S TALK <span aria-hidden="true">↗</span></a>
            <p id="contact-placeholder" className="ideas-contact-placeholder">[Contact destination to be added.]</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
