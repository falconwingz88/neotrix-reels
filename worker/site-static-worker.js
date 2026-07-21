const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    const finalSegment = url.pathname.split("/").filter(Boolean).at(-1) || "";
    const isApplicationRoute = !finalSegment.includes(".");

    if (response.status !== 404 || request.method !== "GET" || !isApplicationRoute) {
      return response;
    }

    const fallbackUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, { headers: request.headers }));
  },
};

export default worker;
