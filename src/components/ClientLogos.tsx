import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getClientLogoSize, splitClientLogoRows, type ClientLogoDisplayRecord } from "@/lib/clientLogos";

export type ClientLogo = ClientLogoDisplayRecord;

const fallback = [
  ["BCA", "/client-logos/BCA_white.png"],
  ["BNI", "/client-logos/BNI_white.png"],
  ["J&T Express", "/client-logos/JT-Express_logo_white.png"],
  ["Telkomsel", "/client-logos/telkomsel_white.png"],
  ["Garuda", "/client-logos/garuda_white.png"],
  ["Oppo", "/client-logos/oppo_white.png"],
  ["Wuling", "/client-logos/wuling_white.png"],
  ["Vivo", "/client-logos/vivo_white.png"],
  ["Indofood", "/client-logos/indofood-kulkuil_white.png"],
  ["Free Fire", "/client-logos/freefire_white.png"],
  ["Mobile Legends", "/client-logos/mobile-legends_white.png"],
  ["Wardah", "/client-logos/wardah_white.png"],
].map(([name, url], index) => ({ id: "fallback-" + index, name, url, scale: "normal", sort_order: index }));

export const useClientLogos = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    void supabase.from("client_logos").select("id,name,url,scale,sort_order").eq("is_active", true).order("sort_order").then(({ data, error }) => {
      if (!active) return;
      setLogos(error || !data?.length ? fallback : (data as ClientLogo[]));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  return { logos, loading };
};

interface ClientLogosProps {
  logos: ClientLogo[];
  preview?: boolean;
}

export const ClientLogos = ({ logos, preview = false }: ClientLogosProps) => {
  const rows = useMemo(() => splitClientLogoRows(logos), [logos]);
  if (!logos.length) return null;
  return (
    <section
      aria-label={preview ? "Homepage collaborator preview" : "Selected clients"}
      className={cn(
        "overflow-hidden border-y border-black/10 bg-[#F4F0E8] text-black",
        preview ? "rounded-2xl py-7 sm:py-8" : "py-10 sm:py-14",
      )}
    >
      <div className={cn("mx-auto flex max-w-[1480px] items-center px-5 font-mono text-[9px] uppercase tracking-[0.18em] text-black/65 sm:px-8 lg:px-10", preview ? "mb-6" : "mb-9 sm:mb-11")}>
        <span>Selected collaborators</span>
        {preview && <span className="ml-auto text-black/40">Live homepage preview</span>}
      </div>
      <div className="space-y-10 sm:space-y-12">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "logo-marquee flex w-max items-center gap-12 pr-12 sm:gap-16 sm:pr-16",
              rowIndex === 1 && "logo-marquee-reverse",
            )}
          >
            {[...row, ...row].map((logo, index) => (
              <div key={logo.id + "-" + index} className="grid h-16 w-36 flex-none place-items-center sm:h-20 sm:w-44">
                <div className="grid max-h-full max-w-full place-items-center overflow-hidden" style={getClientLogoSize(logo.scale)}>
                  <img
                    src={logo.url}
                    alt={index < row.length ? logo.name : ""}
                    aria-hidden={index >= row.length}
                    loading="lazy"
                    decoding="async"
                    width="176"
                    height="80"
                    style={getClientLogoSize(logo.scale)}
                    className="block object-contain brightness-0 opacity-55 transition-[opacity,filter] duration-300 hover:opacity-85 hover:saturate-150"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
