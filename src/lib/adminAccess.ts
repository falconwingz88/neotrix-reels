export type AdminAccessState = 'checking' | 'signed-out' | 'forbidden' | 'allowed';

export const getAdminAccessState = ({
  loading,
  isAuthenticated,
  isAdmin,
}: {
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}): AdminAccessState => {
  if (loading) return 'checking';
  if (!isAuthenticated) return 'signed-out';
  if (!isAdmin) return 'forbidden';
  return 'allowed';
};
