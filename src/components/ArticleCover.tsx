import type { ImgHTMLAttributes } from "react";

type ArticleCoverProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  width?: number;
  height?: number;
};

/** Keeps every downloaded editorial photograph in a clean, consistent landscape frame. */
export const ArticleCover = ({ src, alt, className = "", loading = "lazy", width = 1200, height = 675 }: ArticleCoverProps) => (
  <div className={`relative overflow-hidden bg-[#111315] ${className}`}>
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      className="relative size-full object-cover object-center"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/[.04]" />
  </div>
);
