import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  clearAllContacts: () => Promise<void>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

// Map database record to frontend interface
const mapDbToContact = (record: any): ContactSubmission => ({
  id: record.id,
  name: record.name,
  role: record.role,
  projectStatus: record.project_status,
  hasDeck: record.has_deck,
  deckLink: record.deck_link || '',
  videoVersions: record.video_versions || '',
  videoDuration: record.video_duration || '',
  deliveryDate: record.delivery_date,
  startDate: record.start_date,
  submittedAt: record.submitted_at,
  location: record.location || '',
});

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        // User may not have admin access - silently fail
        console.log('Could not fetch contacts (may require admin access)');
        setContacts([]);
      } else if (data) {
        setContacts(data.map(mapDbToContact));
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          name: contactData.name,
          role: contactData.role,
          project_status: contactData.projectStatus,
          has_deck: contactData.hasDeck,
          deck_link: contactData.deckLink || null,
          video_versions: contactData.videoVersions || null,
          video_duration: contactData.videoDuration || null,
          delivery_date: contactData.deliveryDate || null,
          start_date: contactData.startDate || null,
          location: contactData.location || null,
        });

      if (error) {
        console.error('Error adding contact:', error);
        throw error;
      }
      
      // Refetch to get the new data (only admins can see it)
      await fetchContacts();
    } catch (err) {
      console.error('Error in addContact:', err);
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }
      
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error in deleteContact:', err);
      throw err;
    }
  };

  const clearAllContacts = async () => {
    try {
      // Delete all contacts - requires admin access via RLS
      const { error } = await supabase
        .from('contacts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (workaround for no .deleteAll())

      if (error) {
        console.error('Error clearing contacts:', error);
        throw error;
      }
      
      setContacts([]);
    } catch (err) {
      console.error('Error in clearAllContacts:', err);
      throw err;
    }
  };

  return (
    <ContactsContext.Provider value={{ 
      contacts, 
      addContact, 
      deleteContact, 
      clearAllContacts, 
      loading,
      refetch: fetchContacts 
    }}>
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
