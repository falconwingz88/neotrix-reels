import { describe, expect, it } from "vitest";
import { getAdminProjectFileUrl } from "@/lib/projectFiles";

describe("getAdminProjectFileUrl", () => {
  it("never exposes a project file URL to a public visitor", () => {
    expect(getAdminProjectFileUrl(false, "https://drive.google.com/file/d/example")).toBeNull();
  });

  it("returns a safe project file URL to an admin", () => {
    expect(getAdminProjectFileUrl(true, "https://drive.google.com/file/d/example"))
      .toBe("https://drive.google.com/file/d/example");
  });

  it("rejects unsafe file URLs even for an admin", () => {
    expect(getAdminProjectFileUrl(true, "javascript:alert(1)"))
      .toBeNull();
  });
});
