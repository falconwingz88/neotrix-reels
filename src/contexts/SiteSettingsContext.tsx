import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteSettings {
  glassmorphismOpacity: number;
  glassmorphismColor: string;
  toolsVisible: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSetting: (key: string, value: string) => Promise<void>;
  refetch: () => void;
}

const defaultSettings: SiteSettings = {
  glassmorphismOpacity: 0.1,
  glassmorphismColor: '#ffffff',
  toolsVisible: true,
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const hexToHSL = (hex: string): string => {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');
  
  // Validate hex length
  if (hex.length !== 6) {
    return '0 0% 100%'; // Default to white
  }
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const applyGlassStyles = (opacity: number, color: string) => {
  const root = document.documentElement;
  root.style.setProperty('--glass-opacity', opacity.toString());
  
  // Convert hex color to HSL values
  const hsl = hexToHSL(color);
  root.style.setProperty('--glass-color', hsl);
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const processSettingsData = (data: { key: string; value: string }[]) => {
    const loadedSettings = { ...defaultSettings };
    
    data.forEach((row) => {
      if (row.key === 'glassmorphism_opacity') {
        loadedSettings.glassmorphismOpacity = parseFloat(row.value) || defaultSettings.glassmorphismOpacity;
      } else if (row.key === 'glassmorphism_color') {
        loadedSettings.glassmorphismColor = row.value || defaultSettings.glassmorphismColor;
      } else if (row.key === 'tools_visible') {
        loadedSettings.toolsVisible = row.value === 'true';
      }
    });

    return loadedSettings;
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      if (data) {
        const loadedSettings = processSettingsData(data);
        setSettings(loadedSettings);
        applyGlassStyles(loadedSettings.glassmorphismOpacity, loadedSettings.glassmorphismColor);
      }
    } catch (err) {
      console.error('Error loading site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime changes on site_settings table
    const channel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Site settings changed:', payload);
          
          // Handle the update
          const newRecord = payload.new as { key: string; value: string } | undefined;
          
          if (newRecord && newRecord.key && newRecord.value !== undefined) {
            setSettings(prev => {
              let updated = { ...prev };
              
              if (newRecord.key === 'glassmorphism_opacity') {
                updated.glassmorphismOpacity = parseFloat(newRecord.value) || defaultSettings.glassmorphismOpacity;
              } else if (newRecord.key === 'glassmorphism_color') {
                updated.glassmorphismColor = newRecord.value || defaultSettings.glassmorphismColor;
              } else if (newRecord.key === 'tools_visible') {
                updated.toolsVisible = newRecord.value === 'true';
              }
              
              // Apply glass styles immediately for visual changes
              applyGlassStyles(updated.glassmorphismOpacity, updated.glassmorphismColor);
              
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSetting = async (key: string, value: string) => {
    try {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        // Update existing setting
        const { error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key);

        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('site_settings')
          .insert({ key, value });

        if (error) throw error;
      }

      // Local state will be updated via realtime subscription
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
