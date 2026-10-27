import ChapterLabel from "../ChapterLabel/ChapterLabel";
import { motion, useReducedMotion } from "motion/react";
import "./LeanTaaSSection.css";

// Replace these three writing areas when the final personal statements are ready.
const connectionCopy = [
  "The work I enjoy most has a common thread: I love getting under the hood of unfamiliar systems, figuring out how everything fits together, and finding ways to make things work better.",
  "But I've also learned that understanding the technology is only half the picture. It's just as important to understand the people using it, the challenges they face, and how they work together.",
  "I'm excited about how closely this role works with the people using those solutions. I love learning how other teams operate, understanding what's important to them, and finding ways to make their work easier.",
];
const contributionCopy = [
  "What excites me most about GTM Engineering at LeanTaaS is how much variety there seems to be in the problems you're solving. From our conversations, I got the impression that there's no shortage of ideas or initiative. There are already tools being built, processes being improved, and opportunities to connect things that don't quite work together yet.",
  "There's something so satisfying about taking an idea that's already useful and figuring out how to make it even better. Whether that means understanding an unfamiliar codebase, improving an integration, or turning an early prototype into something more reliable, those are exactly the kinds of challenges I enjoy working through.",
  "I'm also excited about the opportunity to learn how different teams and business processes operate. I've always enjoyed understanding how things work, and I find it so rewarding to uncover where something could be improved and figure out how to make someone's job a little easier.",
  "LeanTaaS feels like an opportunity to bring together the parts of my experiences I've enjoyed most: engineering, collaboration, and improving the systems that connect everything. And knowing that this work supports something much bigger than any one team or community—helping more people access the care they need—makes that opportunity even more meaningful to me.",
];
const closingCopy = "I still have so much to learn. Honestly, that's what excites me the most! I'd love the opportunity to work alongside people who challenge me, contribute my own ideas, and keep growing as both an engineer and a teammate. Thank you for taking the time to get to know me!";
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
