import { describe, expect, it } from 'vitest';
import worker from './site-static-worker.js';

const env = {
  ASSETS: {
    fetch: async (request) => new Response(new URL(request.url).pathname, {
      headers: { 'content-type': 'text/html' },
    }),
  },
};

describe('site worker security', () => {
  it('adds browser security headers and disables caching for admin routes', async () => {
    const response = await worker.fetch(new Request('https://motion.neotrix.asia/admin'), env);
    expect(response.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('preserves path and query parameters in the permanent legacy redirect', async () => {
    const response = await worker.fetch(
      new Request('https://reels.neotrix.asia/projects/example?tag=3d&year=2026'),
      env,
    );
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://motion.neotrix.asia/projects/example?tag=3d&year=2026');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
  });
});
