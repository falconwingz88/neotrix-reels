import { describe, expect, it } from 'vitest';
import { getAdminAccessState } from './adminAccess';

describe('getAdminAccessState', () => {
  it('waits until the locally persisted session has been restored', () => {
    expect(getAdminAccessState({ loading: true, isAuthenticated: false, isAdmin: false })).toBe('checking');
  });

  it('sends signed-out visitors to login', () => {
    expect(getAdminAccessState({ loading: false, isAuthenticated: false, isAdmin: false })).toBe('signed-out');
  });

  it('rejects authenticated users without the admin role', () => {
    expect(getAdminAccessState({ loading: false, isAuthenticated: true, isAdmin: false })).toBe('forbidden');
  });

  it('allows only authenticated administrators', () => {
    expect(getAdminAccessState({ loading: false, isAuthenticated: true, isAdmin: true })).toBe('allowed');
  });
});
