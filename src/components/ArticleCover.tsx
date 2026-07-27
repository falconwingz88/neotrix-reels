import type { ImgHTMLAttributes } from "react";

type ArticleCoverProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  width?: number;
  height?: number;
};

/** Keeps portrait project screenshots readable inside a consistent landscape frame. */
export const ArticleCover = ({ src, alt, className = "", loading = "lazy", width = 1200, height = 675 }: ArticleCoverProps) => (
  <div className={`relative overflow-hidden bg-[#111315] ${className}`}>
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading={loading}
      decoding="async"
      className="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-2xl"
    />
    <div className="absolute inset-0 bg-black/25" />
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      className="relative size-full object-contain object-center p-2 sm:p-4"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/[.04]" />
  </div>
);
