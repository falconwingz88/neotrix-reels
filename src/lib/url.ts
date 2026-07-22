export const getSafeHttpUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
};

export const isSafeHttpUrl = (value: string | null | undefined): boolean => getSafeHttpUrl(value) !== null;
