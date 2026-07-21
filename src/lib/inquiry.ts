export type ContactDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

export type ContactErrors = Partial<Record<keyof ContactDetails | "contact", string>>;

export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

export const validateContactDetails = (details: ContactDetails): ContactErrors => {
  const errors: ContactErrors = {};
  if (!details.name.trim()) errors.name = "Tell us who we are speaking with.";
  if (details.name.trim().length > 120) errors.name = "Name must be 120 characters or fewer.";
  if (details.company.trim().length > 160) errors.company = "Company must be 160 characters or fewer.";
  const email = details.email.trim();
  const phone = normalizePhone(details.phone);
  if (!email && !phone) errors.contact = "Add an email address or WhatsApp / phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (phone && (phone.replace(/\D/g, "").length < 8 || phone.replace(/\D/g, "").length > 16)) errors.phone = "Enter a valid phone number.";
  return errors;
};

export const hasContactErrors = (errors: ContactErrors) => Object.keys(errors).length > 0;

export const inquiryFingerprint = (details: ContactDetails, role: string, projectStatus: string) =>
  [details.name, details.company, details.email, normalizePhone(details.phone), role, projectStatus]
    .map((value) => value.trim().toLocaleLowerCase())
    .join("|");

export const createInquirySubmissionGuard = () => {
  const completed = new Map<string, string>();
  const inFlight = new Map<string, Promise<string>>();
  return {
    submit: (key: string, action: () => Promise<string>) => {
      const saved = completed.get(key);
      if (saved) return Promise.resolve(saved);
      const pending = inFlight.get(key);
      if (pending) return pending;
      const request = action()
        .then((id) => {
          completed.set(key, id);
          return id;
        })
        .finally(() => inFlight.delete(key));
      inFlight.set(key, request);
      return request;
    },
  };
};
