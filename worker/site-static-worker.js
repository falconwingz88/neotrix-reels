const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join('; ');

const withSecurityHeaders = (response, pathname) => {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=(), usb=()');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Strict-Transport-Security', 'max-age=31536000');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/client/')) {
    headers.set('Cache-Control', 'no-store');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "reels.neotrix.asia") {
      url.protocol = "https:";
      url.hostname = "motion.neotrix.asia";
      url.port = "";
      return withSecurityHeaders(Response.redirect(url.toString(), 301), url.pathname);
    }

    const finalSegment = url.pathname.split("/").filter(Boolean).at(-1) || "";
    const isApplicationRoute = !finalSegment.includes(".");

    if (request.method === "GET" && isApplicationRoute && !url.pathname.startsWith("/.well-known/")) {
      const fallbackUrl = new URL("/index.html", request.url);
      const response = await env.ASSETS.fetch(new Request(fallbackUrl, { headers: request.headers }));
      return withSecurityHeaders(response, url.pathname);
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response, url.pathname);
  },
};

export default worker;
