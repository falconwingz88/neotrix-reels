import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  glassmorphismOpacity: number;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSetting: (key: string, value: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  glassmorphismOpacity: 0.1,
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      const newSettings = { ...defaultSettings };
      data?.forEach((setting: { key: string; value: string }) => {
        if (setting.key === 'glassmorphism_opacity') {
          newSettings.glassmorphismOpacity = parseFloat(setting.value) || 0.1;
        }
      });

      setSettings(newSettings);
    } catch (err) {
      console.error('Error in fetchSettings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      throw error;
    }

    // Update local state
    if (key === 'glassmorphism_opacity') {
      setSettings(prev => ({
        ...prev,
        glassmorphismOpacity: parseFloat(value) || 0.1,
      }));
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchSettings();
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSetting, refetch }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
