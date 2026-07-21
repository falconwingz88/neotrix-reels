import { useRef, useState, type MouseEvent, type PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const Reveal = ({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const Magnetic = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const move = (event: MouseEvent) => {
    if (reduced || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    setOffset({ x: (event.clientX - bounds.left - bounds.width / 2) * 0.14, y: (event.clientY - bounds.top - bounds.height / 2) * 0.14 });
  };
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={() => setOffset({ x: 0, y: 0 })} animate={offset} transition={{ type: "spring", stiffness: 260, damping: 20 }} className={className}>
      {children}
    </motion.div>
  );
};
