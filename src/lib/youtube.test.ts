import { describe, expect, it } from "vitest";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getYouTubeVideoId } from "./youtube";

describe("YouTube utilities", () => {
  it.each([
    ["https://youtu.be/LP5ybY7O2zc", "LP5ybY7O2zc"],
    ["https://www.youtube.com/watch?v=LP5ybY7O2zc&t=12", "LP5ybY7O2zc"],
    ["https://youtube.com/shorts/LP5ybY7O2zc?feature=share", "LP5ybY7O2zc"],
    ["https://www.youtube.com/embed/LP5ybY7O2zc", "LP5ybY7O2zc"],
    ["LP5ybY7O2zc", "LP5ybY7O2zc"],
  ])("parses %s", (input, expected) => expect(getYouTubeVideoId(input)).toBe(expected));

  it("rejects malformed and unrelated URLs", () => {
    expect(getYouTubeVideoId("https://example.com/watch?v=LP5ybY7O2zc")).toBeNull();
    expect(getYouTubeVideoId("not-video")).toBeNull();
  });

  it("builds privacy-enhanced media URLs", () => {
    expect(getYouTubeThumbnail("https://youtu.be/LP5ybY7O2zc")).toContain("LP5ybY7O2zc/maxresdefault.jpg");
    const previewUrl = getYouTubeEmbedUrl("LP5ybY7O2zc", { autoplay: true, muted: true, loop: true });
    expect(previewUrl).toContain("youtube-nocookie.com/embed/LP5ybY7O2zc");
    expect(previewUrl).toContain("autoplay=1");
    expect(previewUrl).toContain("mute=1");
    expect(previewUrl).toContain("loop=1");
    expect(previewUrl).toContain("playlist=LP5ybY7O2zc");
    expect(previewUrl).toContain("controls=0");
    expect(previewUrl).toContain("disablekb=1");
    expect(previewUrl).toContain("fs=0");
    expect(previewUrl).toContain("cc_load_policy=0");
  });
});
