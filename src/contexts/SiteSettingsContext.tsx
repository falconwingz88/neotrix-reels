import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  glassmorphismOpacity: number;
  glassmorphismColor: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSetting: (key: string, value: string) => void;
  refetch: () => void;
}

const defaultSettings: SiteSettings = {
  glassmorphismOpacity: 0.1,
  glassmorphismColor: '#ffffff',
};

const STORAGE_KEY = 'neo-site-settings';

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          glassmorphismOpacity: parsed.glassmorphism_opacity ?? defaultSettings.glassmorphismOpacity,
          glassmorphismColor: parsed.glassmorphism_color ?? defaultSettings.glassmorphismColor,
        });
      }
    } catch (err) {
      console.error('Error loading site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (key: string, value: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : {};
      current[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

      // Update local state
      if (key === 'glassmorphism_opacity') {
        setSettings(prev => ({
          ...prev,
          glassmorphismOpacity: parseFloat(value) || 0.1,
        }));
      } else if (key === 'glassmorphism_color') {
        setSettings(prev => ({
          ...prev,
          glassmorphismColor: value || '#ffffff',
        }));
      }
    } catch (err) {
      console.error('Error saving site settings:', err);
      throw err;
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchSettings();
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
