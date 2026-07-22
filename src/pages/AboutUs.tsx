import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Motion";
import { Seo } from "@/components/Seo";
import aldyImage from "@/assets/aldy.jpg";
import elvinaImage from "@/assets/elvina.jpeg";

const founders = [
  { name: "Fernaldy Wiranata", short: "Aldy", role: "Co-Founder / Studio Head", email: "aldy@neotrix.asia", image: aldyImage },
  { name: "Elvina Lie", short: "Elvina", role: "Co-Founder / Executive Producer", email: "elvina@neotrix.asia", image: elvinaImage },
];

const values = [
  ["01", "Craft before spectacle", "Every effect earns its place. The idea stays legible, even when the frame becomes impossible."],
  ["02", "Small team, full ownership", "Direction and production stay close, so intent survives from first board to final render."],
  ["03", "Technology in service of taste", "New tools matter when they improve the work—not when they become the work."],
];

const AboutUs = () => (
  <>
    <Seo title="About the Studio" description="Meet Neotrix, a Jakarta 3D animation and VFX studio built for ambitious commercial ideas." path="/about-us" />
    <section className="page-wrap pb-20 pt-32 sm:pt-40 lg:pb-32">
      <Reveal>
        <p className="eyebrow">Neotrix / Studio profile</p>
        <h1 className="mt-6 max-w-[12ch] text-[clamp(4rem,10.5vw,10.5rem)] font-medium leading-[.85] tracking-[-0.07em]">A small studio with a <span className="text-[#7DEBFF]">wide imagination.</span></h1>
      </Reveal>
      <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[.55fr_1.45fr]">
        <p className="eyebrow">What we are</p>
        <Reveal><p className="max-w-5xl text-[clamp(2rem,4.5vw,5.2rem)] font-medium leading-[1.02] tracking-[-0.052em]">Neotrix is a Jakarta-based 3D production studio creating commercial animation, VFX, character work, and product films for agencies and brands around the world.</p></Reveal>
      </div>
    </section>

    <section className="bg-[#F4F0E8] py-16 text-black sm:py-20 lg:py-24">
      <div className="page-wrap">
        <div className="mx-auto mb-10 flex max-w-[800px] items-end justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45">Leadership</p><h2 className="mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Two perspectives.<br />One standard.</h2></div><span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-black/35 sm:block">Jakarta / Indonesia</span></div>
        <div className="mx-auto grid max-w-[800px] gap-6 md:grid-cols-2 lg:gap-8">
          {founders.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.08}>
              <article className="group">
                <div className="relative aspect-[4/4.75] overflow-hidden rounded-[1.25rem] bg-black/10 sm:rounded-[1.5rem]">
                  <img src={founder.image} alt={founder.name} loading="lazy" decoding="async" className="size-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0" />
                  <span className="absolute right-4 top-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/65">0{index + 1}</span>
                </div>
                <div className="flex items-start justify-between gap-5 pt-4"><div><h3 className="text-xl font-medium tracking-[-0.03em] sm:text-2xl">{founder.name}</h3><p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-black/45">{founder.role}</p></div><a href={"mailto:" + founder.email} className="grid size-10 place-items-center rounded-full border border-black/15 transition-colors hover:bg-black hover:text-white" aria-label={"Email " + founder.short}><ArrowUpRight className="size-3.5" /></a></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="page-wrap py-20 sm:py-28 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[.55fr_1.45fr]"><p className="eyebrow">How we work</p><div className="divide-y divide-white/10 border-y border-white/10">{values.map(([number, title, copy]) => <Reveal key={number} className="grid gap-4 py-8 sm:grid-cols-[3rem_.7fr_1fr] sm:items-start sm:py-10"><span className="font-mono text-[9px] text-[#B8FF35]">{number}</span><h3 className="text-2xl tracking-[-0.035em] sm:text-3xl">{title}</h3><p className="leading-relaxed text-white/50">{copy}</p></Reveal>)}</div></div>
      <div className="mt-24 grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101214] lg:grid-cols-[1fr_1.25fr]">
        <div className="p-7 sm:p-10"><MapPin className="size-5 text-[#7DEBFF]" /><h2 className="mt-12 text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Rooted in Jakarta.<br />Working everywhere.</h2><p className="mt-6 max-w-md leading-relaxed text-white/50">Jl. Surya Utama No. 15 Blok P, North Kedoya, Kebon Jeruk, Jakarta 11520, Indonesia.</p><a href="https://maps.app.goo.gl/UXYXpbP1peTPHEAz9" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#B8FF35]">Open map <ArrowUpRight className="size-3.5" /></a></div>
        <div className="min-h-80"><iframe title="Neotrix studio location" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className="h-full min-h-80 w-full border-0 grayscale invert-[.9] contrast-125" src="https://www.google.com/maps?q=Jl.%20Surya%20Utama%20No.15%20Jakarta&output=embed" /></div>
      </div>
    </section>
    <Link to="/contact" className="group block bg-[#B8FF35] px-5 py-20 text-black sm:px-10 sm:py-28"><div className="mx-auto flex max-w-[1480px] items-end justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/45">Make something with us</p><p className="mt-5 text-[clamp(3.5rem,10vw,10rem)] font-medium leading-[.82] tracking-[-0.072em]">Say hello.</p></div><ArrowUpRight className="size-9 transition-transform group-hover:rotate-45 sm:size-14" /></div></Link>
  </>
);

export default AboutUs;
