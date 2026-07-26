import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0A0B0C] text-[#F4F0E8]">
    <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7DEBFF]">Neotrix / Jakarta</p>
          <p className="mt-5 max-w-xl text-[clamp(2rem,5vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
            Making ideas impossible to forget.
          </p>
        </div>
        <div className="grid content-start gap-3 font-mono text-xs uppercase tracking-[0.12em] text-white/55">
          <p className="mb-2 text-white/28">Navigate</p>
          <Link className="hover:text-[#B8FF35]" to="/projects">Selected work</Link>
          <Link className="hover:text-[#B8FF35]" to="/about-us">About the studio</Link>
          <Link className="hover:text-[#B8FF35]" to="/articles">Articles</Link>
          <Link className="hover:text-[#B8FF35]" to="/join-us">Join the team</Link>
          <Link className="hover:text-[#B8FF35]" to="/contact">Start a project</Link>
          <Link className="mt-2 text-white/35 hover:text-[#7DEBFF]" to="/admin-login">Admin access</Link>
        </div>
        <div className="grid content-start gap-3 font-mono text-xs uppercase tracking-[0.12em] text-white/55">
          <p className="mb-2 text-white/28">Connect</p>
          <a className="flex items-center gap-1 hover:text-[#7DEBFF]" href="mailto:contact@neotrix.asia">Email <ArrowUpRight className="size-3" /></a>
          <a className="flex items-center gap-1 hover:text-[#7DEBFF]" href="https://instagram.com/neotrix.asia" target="_blank" rel="noreferrer">Instagram <ArrowUpRight className="size-3" /></a>
          <p className="mt-4 normal-case tracking-normal text-white/55">West Jakarta · Indonesia<br />Working worldwide</p>
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Neotrix</span>
        <span>3D animation · VFX · Product film</span>
      </div>
    </div>
    </footer>
  );
};
