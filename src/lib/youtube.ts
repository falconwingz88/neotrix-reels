const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export const getYouTubeVideoId = (value: string): string | null => {
  if (!value) return null;
  if (ID_PATTERN.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let candidate = "";
    if (host === "youtu.be") candidate = url.pathname.split("/").filter(Boolean)[0] || "";
    if (host.endsWith("youtube.com")) {
      candidate =
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ||
        "";
    }
    return ID_PATTERN.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
};

export const getYouTubeThumbnail = (value: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault") => {
  const id = getYouTubeVideoId(value);
  return id ? "https://i.ytimg.com/vi/" + id + "/" + quality + ".jpg" : "";
};

export const getYouTubeEmbedUrl = (value: string, options: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {}) => {
  const id = getYouTubeVideoId(value);
  if (!id) return "";
  const params = new URLSearchParams({
    enablejsapi: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    showinfo: "0",
    autohide: "1",
    cc_load_policy: "0",
    origin: typeof window === "undefined" ? "https://reels.neotrix.asia" : window.location.origin,
  });
  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("mute", "1");
  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", id);
  }
  return "https://www.youtube-nocookie.com/embed/" + id + "?" + params.toString();
};
