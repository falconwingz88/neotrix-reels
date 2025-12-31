import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ContactSubmission {
  id: string;
  name: string;
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
}

interface ContactsContextType {
  contacts: ContactSubmission[];
  addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => void;
  deleteContact: (id: string) => void;
  clearAllContacts: () => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

const STORAGE_KEY = 'neotrix_contacts';

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<ContactSubmission[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
    const newContact: ContactSubmission = {
      ...contactData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const clearAllContacts = () => {
    setContacts([]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact, deleteContact, clearAllContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};
