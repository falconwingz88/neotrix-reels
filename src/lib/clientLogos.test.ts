import { describe, expect, it } from "vitest";
import {
  getClientLogoScaleLabel,
  getClientLogoSize,
  normalizeClientLogoScale,
  splitClientLogoRows,
} from "@/lib/clientLogos";

describe("client logo presentation", () => {
  it("splits ordered logos into two balanced alternating rows", () => {
    expect(splitClientLogoRows([1, 2, 3, 4, 5])).toEqual([[1, 3, 5], [2, 4]]);
  });

  it("keeps legacy size values bounded and readable", () => {
    expect(normalizeClientLogoScale("2x")).toBe("2x");
    expect(getClientLogoScaleLabel("3x")).toBe("Extra large");
    expect(getClientLogoSize("3x")).toEqual({ width: 140, height: 56 });
  });

  it("falls back safely when the database contains an unknown scale", () => {
    expect(normalizeClientLogoScale("giant")).toBe("normal");
    expect(getClientLogoScaleLabel(null)).toBe("Balanced");
  });
});
