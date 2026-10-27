import ChapterLabel from "../ChapterLabel/ChapterLabel";
import ChapterRule from "../ChapterLabel/ChapterRule";
import { motion, useReducedMotion } from "motion/react";
import "./LeanTaaSSection.css";

// Replace these three writing areas when the final personal statements are ready.
const connectionCopy = [
  "The work I enjoy most has a common thread: I love getting under the hood of unfamiliar systems, figuring out how everything fits together, and finding ways to make things work better.",
  "But I've also learned that understanding the technology is only half the picture. It's just as important to understand the people using it, the challenges they face, and how they work together.",
  "I'm excited about how closely I’d work with the people using the tools we build. I love learning how other teams operate and understanding what's important to them.",
];
const contributionCopy = [
  "What excites me most about GTM Engineering at LeanTaaS is how much variety there seems to be in the problems you're solving. From our conversations, I got the impression that there's no shortage of ideas or initiative. There are already tools being built, processes being improved, and opportunities to connect things that don't quite work together yet.",
  "I was even more drawn to LeanTaaS's emphasis on scrappy, repeatable execution. I've learned firsthand how satisfying it is to take something that works and make it more reliable, organized, and sustainable. Whether that's improving an integration, building on an early prototype, or documenting a process so someone else can pick it up, I love finding ways to turn good ideas into lasting solutions.",
  "Your emphasis on being One Team and continuously learning resonates with me, too. Some of my favorite experiences have come from working alongside people with different perspectives, learning how they approach problems, and figuring out how I can make their work easier.",
  "But what makes LeanTaaS especially meaningful to me is the mission behind it all. I've seen how much of a difference better systems can make within a community. The opportunity to apply that same mindset to something much bigger, helping healthcare organizations work more effectively and making care more accessible, is something I would love to be part of.",
];
const closingCopy = "I still have so much to learn. I'd love the opportunity to work alongside people who challenge me, contribute my own ideas, and keep growing as both an engineer and a teammate. Thank you for taking the time to get to know me!";
const pathways = [
  { name: "SYSTEMS", detail: "Understand the architecture", color: "#1769A5", path: "M 0 34 H 330 C 440 34 420 160 510 160" },
  { name: "PEOPLE", detail: "Understand what teams need", color: "#12466F", path: "M 0 160 H 510" },
  { name: "PROCESS", detail: "Make improvements repeatable", color: "#4EA89C", path: "M 0 286 H 330 C 440 286 420 160 510 160" },
];

function Convergence() {
  const reduced = useReducedMotion();
  return (
    <motion.div className="ideas-convergence" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}
      role="img" aria-label="Systems: understand the architecture. People: understand what teams need. Process: make improvements repeatable. Together, turning ideas into something people can rely on.">
      <div className="ideas-pathways" aria-hidden="true">
        <svg className="ideas-paths-desktop" viewBox="0 0 580 320" preserveAspectRatio="none">
          {pathways.map((item, i) => <motion.path key={item.name} d={item.path} fill="none" stroke={item.color} strokeWidth="1.5"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }} />)}
          <motion.path d="M 510 160 H 580" stroke="#4EA89C" strokeWidth="1.5"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }} transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.1 }} />
          <motion.circle cx="510" cy="160" r="7" fill="#4EA89C" stroke="#12466F" strokeWidth="1.5" variants={{ hidden: { opacity: reduced ? 1 : 0 }, visible: { opacity: 1 } }} transition={{ duration: 0.2, delay: reduced ? 0 : 1.05 }} />
        </svg>
        <svg className="ideas-paths-mobile" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
          {pathways.map((item, i) => <motion.path key={item.name}
            d={[
              "M 48 0 V 20 C 48 64 160 44 160 96",
              "M 160 0 V 96",
              "M 272 0 V 20 C 272 64 160 44 160 96",
            ][i]}
            fill="none" stroke={item.color} strokeWidth="1.5"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }} />)}
          <motion.path d="M 160 96 V 120" stroke="#4EA89C" strokeWidth="1.5"
            variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 1.1 }} />
          <motion.circle cx="160" cy="96" r="5" fill="#4EA89C" stroke="#12466F" strokeWidth="1.5"
            variants={{ hidden: { opacity: reduced ? 1 : 0 }, visible: { opacity: 1 } }}
            transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : 1.05 }} />
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
      <div className="ideas-chapter-heading"><ChapterLabel number="04" title="IDEAS" /><ChapterRule className="ideas-divider" /><span className="ideas-chapter-meta">THE NEXT CHAPTER</span></div>
      <div className="ideas-connection">
        <motion.h2 id="leantaas-title" {...reveal}>The best systems<br /><span>work for people.</span></motion.h2>
        <div className="ideas-connection-grid">
          <motion.div className="ideas-copy ideas-connection-copy" {...reveal}>{connectionCopy.map(p => <p key={p}>{p}</p>)}</motion.div>
          <Convergence />
        </div>
      </div>
      <div className="ideas-contribution">
        <div className="ideas-label"><ChapterLabel number="04.1" title="WHY LEANTAAS" /><ChapterRule className="ideas-divider" /></div>
        <div className="ideas-contribution-grid">
          <motion.h3 {...reveal}>Where I see myself<br /><span>contributing.</span></motion.h3>
          <motion.div className="ideas-copy ideas-contribution-copy" {...reveal}>{contributionCopy.map(p => <p key={p}>{p}</p>)}</motion.div>
        </div>
      </div>
      <div className="ideas-closing">
        <div className="ideas-label"><ChapterLabel number="04.2" title="WHAT COMES NEXT" /><ChapterRule className="ideas-divider" /></div>
        <div className="ideas-closing-grid">
          <motion.h3 {...reveal}>I'd love to help build<br /><span>what comes next.</span></motion.h3>
          <motion.div className="ideas-copy ideas-closing-copy" {...reveal}>
            <p>{closingCopy}</p>
            <a className="ideas-contact" href="mailto:giov.scozzaro@gmail.com">LET'S TALK <span aria-hidden="true">↗︎</span></a>
            <div className="ideas-contact-options">
              <span>giov.scozzaro@gmail.com</span>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=giov.scozzaro%40gmail.com" target="_blank" rel="noopener noreferrer">Open in Gmail <span aria-hidden="true">↗︎</span></a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
