import { describe, expect, it } from 'vitest';
import { getSafeHttpUrl, isSafeHttpUrl } from './url';

describe('safe external URLs', () => {
  it('allows HTTP and HTTPS links', () => {
    expect(isSafeHttpUrl('https://example.com/deck')).toBe(true);
    expect(isSafeHttpUrl('http://example.com/deck')).toBe(true);
  });

  it('rejects executable and non-web schemes', () => {
    expect(getSafeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(getSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(getSafeHttpUrl('file:///etc/passwd')).toBeNull();
  });

  it('rejects malformed and empty values', () => {
    expect(getSafeHttpUrl('not a url')).toBeNull();
    expect(getSafeHttpUrl('')).toBeNull();
  });
});
