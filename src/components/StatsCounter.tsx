import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const Count = ({ target }: { target: number | null }) => {
  const [value, setValue] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!ref.current || target === null) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced) return setValue(target);
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - started) / 1200, 1);
        setValue(Math.max(1, Math.round(target * (1 - Math.pow(1 - progress, 3)))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduced, target]);
  return <span ref={ref}>{value === null ? "—" : value}</span>;
};

export const StatsCounter = ({ projects, clients }: { projects: number | null; clients: number | null }) => (
  <div className="grid grid-cols-2 border-y border-white/10">
    <div className="border-r border-white/10 px-5 py-10 sm:px-10 sm:py-16">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/38">Projects rendered</p>
      <p className="mt-4 text-[clamp(3.5rem,10vw,9rem)] font-medium leading-none tracking-[-0.065em]"><Count target={projects} /><sup className="ml-2 align-top text-[0.24em] text-[#B8FF35]">+</sup></p>
    </div>
    <div className="px-5 py-10 sm:px-10 sm:py-16">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/38">Brand collaborations</p>
      <p className="mt-4 text-[clamp(3.5rem,10vw,9rem)] font-medium leading-none tracking-[-0.065em]"><Count target={clients} /><sup className="ml-2 align-top text-[0.24em] text-[#7DEBFF]">+</sup></p>
    </div>
  </div>
);
