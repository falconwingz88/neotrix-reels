export const CLIENT_LOGO_SCALE_OPTIONS = [
  { value: "small", label: "Compact", description: "For tall or visually heavy marks" },
  { value: "normal", label: "Balanced", description: "Default presentation" },
  { value: "2x", label: "Large", description: "For logos with generous clear space" },
  { value: "3x", label: "Extra large", description: "Maximum safe size inside the tile" },
] as const;

export type ClientLogoScale = (typeof CLIENT_LOGO_SCALE_OPTIONS)[number]["value"];

export interface ClientLogoDisplayRecord {
  id: string;
  name: string;
  url: string;
  scale: string | null;
  sort_order: number | null;
}

const SIZE_BY_SCALE: Record<ClientLogoScale, Readonly<{ width: number; height: number }>> = {
  small: { width: 88, height: 32 },
  normal: { width: 112, height: 40 },
  "2x": { width: 128, height: 48 },
  "3x": { width: 140, height: 56 },
};

export const normalizeClientLogoScale = (scale: string | null | undefined): ClientLogoScale =>
  CLIENT_LOGO_SCALE_OPTIONS.some((option) => option.value === scale)
    ? (scale as ClientLogoScale)
    : "normal";

export const getClientLogoSize = (scale: string | null | undefined) =>
  SIZE_BY_SCALE[normalizeClientLogoScale(scale)];

export const getClientLogoScaleLabel = (scale: string | null | undefined) =>
  CLIENT_LOGO_SCALE_OPTIONS.find((option) => option.value === normalizeClientLogoScale(scale))?.label ?? "Balanced";

export const splitClientLogoRows = <T>(logos: T[]): T[][] => [
  logos.filter((_, index) => index % 2 === 0),
  logos.filter((_, index) => index % 2 === 1),
].filter((row) => row.length > 0);
