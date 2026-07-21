const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "reels.neotrix.asia") {
      url.protocol = "https:";
      url.hostname = "motion.neotrix.asia";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    const finalSegment = url.pathname.split("/").filter(Boolean).at(-1) || "";
    const isApplicationRoute = !finalSegment.includes(".");

    if (request.method === "GET" && isApplicationRoute && !url.pathname.startsWith("/.well-known/")) {
      const fallbackUrl = new URL("/index.html", request.url);
      return env.ASSETS.fetch(new Request(fallbackUrl, { headers: request.headers }));
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
