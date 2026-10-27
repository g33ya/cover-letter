import { motion, useReducedMotion } from "motion/react";

export default function ChapterRule({ className }: { className: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ scaleX: reducedMotion ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left center" }}
    />
  );
}
