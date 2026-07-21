import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const CursorHalo = () => {
  const [point, setPoint] = useState({ x: -100, y: -100, visible: false });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer:fine)").matches) return;
    const move = (event: PointerEvent) => setPoint({ x: event.clientX, y: event.clientY, visible: true });
    const leave = () => setPoint((value) => ({ ...value, visible: false }));
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [reduced]);
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      animate={{ x: point.x - 150, y: point.y - 150, opacity: point.visible ? 0.32 : 0 }}
      transition={{ type: "spring", stiffness: 55, damping: 18, mass: 0.25 }}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-[300px] rounded-full bg-[#7DEBFF] blur-[110px] mix-blend-screen lg:block"
    />
  );
};

export const PublicLayout = () => {
  const location = useLocation();
  const reduced = useReducedMotion();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return (
    <div className="public-shell min-h-screen overflow-clip bg-[#0A0B0C] text-[#F4F0E8]">
      <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-[#B8FF35] px-4 py-2 text-sm text-black focus:translate-y-0">Skip to content</a>
      <Header />
      <CursorHalo />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main-content"
          key={location.pathname}
          initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? undefined : { opacity: 0, y: -12, filter: "blur(5px)" }}
          transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};
