import { getSafeHttpUrl } from "@/lib/url";

export const getAdminProjectFileUrl = (
  isAdmin: boolean,
  fileLink: string | null | undefined,
): string | null => (isAdmin ? getSafeHttpUrl(fileLink) : null);
