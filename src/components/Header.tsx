import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LogOut, Menu, Shield, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import neotrixLogo from "@/assets/neotrix-logo-white.png";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/reels", label: "Reels" },
  { to: "/about-us", label: "Studio" },
  { to: "/articles", label: "Articles" },
  { to: "/join-us", label: "Careers" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { isAdmin, isAuthenticated, logout } = useAuth();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-6 sm:pt-5"
    >
      <nav
        aria-label="Primary navigation"
        className={"mx-auto flex max-w-[1480px] items-center justify-between border px-3 transition-all duration-500 sm:px-4 " +
          (compact ? "h-14 rounded-2xl border-white/10 bg-[#0a0b0c]/82 shadow-2xl backdrop-blur-xl" : "h-16 rounded-[1.35rem] border-white/10 bg-black/25 backdrop-blur-md")}
      >
        <Link to="/" className="group relative z-10 flex min-w-28 items-center" aria-label="Neotrix home">
          <img src={neotrixLogo} alt="Neotrix" width="150" height="24" className="h-5 w-auto opacity-95 transition-opacity group-hover:opacity-70" />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                "relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors " +
                (isActive ? "text-[#B8FF35]" : "text-[#F4F0E8]/62 hover:text-[#F4F0E8]")
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <motion.span layoutId="nav-dot" className="absolute inset-x-4 -bottom-0.5 h-px bg-[#B8FF35]" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="relative z-10 flex min-w-28 items-center justify-end gap-2">
          {isAdmin && (
            <Link to="/admin" className="hidden rounded-full p-2 text-[#B8FF35] transition-colors hover:bg-white/10 sm:block" aria-label="Admin dashboard">
              <Shield className="size-4" />
            </Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="hidden rounded-full p-2 text-white/45 transition-colors hover:text-white sm:block" aria-label="Log out">
              <LogOut className="size-4" />
            </button>
          )}
          <Link to="/contact" className="hidden items-center gap-2 rounded-full bg-[#F4F0E8] px-4 py-2.5 text-[12px] font-semibold text-[#0A0B0C] transition-transform hover:scale-[1.03] md:flex">
            Start a project <ArrowUpRight className="size-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-white/12 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="mx-auto mt-2 max-w-[1480px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111315]/96 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="grid">
              {links.map((link, index) => (
                <Link key={link.to} to={link.to} className="flex items-center justify-between border-b border-white/8 px-3 py-4 text-2xl text-[#F4F0E8]">
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] text-white/35">0{index + 1}</span>
                </Link>
              ))}
              <Link to="/contact" className="mt-3 flex items-center justify-between rounded-2xl bg-[#B8FF35] px-4 py-4 font-semibold text-black">
                Start a project <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
