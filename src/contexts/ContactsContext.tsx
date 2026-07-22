import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getSafeHttpUrl } from "@/lib/url";

export interface ContactSubmission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  projectStatus: string;
  hasDeck: boolean | null;
  deckLink: string;
  videoVersions: string;
  videoDuration: string;
  deliveryDate: string | null;
  startDate: string | null;
  submittedAt: string;
  location: string;
  submissionKey?: string;
}

type NewContact = Omit<ContactSubmission, "id" | "submittedAt">;

interface ContactsContextType {
  contacts: ContactSubmission[];
  addContact: (contact: NewContact, submissionKey: string) => Promise<string>;
  deleteContact: (id: string) => Promise<void>;
  clearAllContacts: () => Promise<void>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

const fromRow = (record: Record<string, unknown>): ContactSubmission => ({
  id: String(record.id),
  name: String(record.name || ""),
  company: String(record.company || ""),
  email: String(record.email || ""),
  phone: String(record.phone || ""),
  role: String(record.role || ""),
  projectStatus: String(record.project_status || ""),
  hasDeck: record.has_deck === null ? null : Boolean(record.has_deck),
  deckLink: String(record.deck_link || ""),
  videoVersions: String(record.video_versions || ""),
  videoDuration: String(record.video_duration || ""),
  deliveryDate: record.delivery_date ? String(record.delivery_date) : null,
  startDate: record.start_date ? String(record.start_date) : null,
  submittedAt: String(record.submitted_at || record.created_at || new Date().toISOString()),
  location: String(record.location || ""),
  submissionKey: record.submission_key ? String(record.submission_key) : undefined,
});

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!isAdmin) {
      setContacts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("contacts").select("*").order("submitted_at", { ascending: false });
    if (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    } else {
      setContacts(((data || []) as Record<string, unknown>[]).map(fromRow));
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (!authLoading) void fetchContacts();
  }, [authLoading, fetchContacts]);

  const addContact = async (contact: NewContact, submissionKey: string) => {
    const deckLink = contact.deckLink ? getSafeHttpUrl(contact.deckLink) : null;
    if (contact.hasDeck && !deckLink) throw new Error("A valid HTTP(S) deck link is required.");

    const id = submissionKey;
    const { error } = await supabase.from("contacts").insert({
      id,
      submission_key: submissionKey,
      name: contact.name.trim(),
      company: contact.company.trim() || null,
      email: contact.email.trim() || null,
      phone: contact.phone.trim() || null,
      role: contact.role,
      project_status: contact.projectStatus,
      has_deck: contact.hasDeck,
      deck_link: deckLink,
      video_versions: contact.videoVersions || null,
      video_duration: contact.videoDuration || null,
      delivery_date: contact.deliveryDate || null,
      start_date: contact.startDate || null,
      location: contact.location || null,
    } as never);
    if (error && error.code !== "23505") throw error;
    return id;
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw error;
    setContacts((current) => current.filter((contact) => contact.id !== id));
  };

  const clearAllContacts = async () => {
    const { error } = await supabase.from("contacts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    setContacts([]);
  };

  return <ContactsContext.Provider value={{ contacts, addContact, deleteContact, clearAllContacts, loading, refetch: fetchContacts }}>{children}</ContactsContext.Provider>;
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) throw new Error("useContacts must be used within a ContactsProvider");
  return context;
};
