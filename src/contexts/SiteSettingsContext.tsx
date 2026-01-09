import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  glassmorphismOpacity: number;
  glassmorphismColor: string;
  toolsVisible: boolean;
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
  toolsVisible: true,
};

const STORAGE_KEY = 'neo-site-settings';

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const hexToHSL = (hex: string): string => {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');
  
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

  const fetchSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let loadedSettings = defaultSettings;
      
      if (stored) {
        const parsed = JSON.parse(stored);
        loadedSettings = {
          glassmorphismOpacity: parsed.glassmorphism_opacity ?? defaultSettings.glassmorphismOpacity,
          glassmorphismColor: parsed.glassmorphism_color ?? defaultSettings.glassmorphismColor,
          toolsVisible: parsed.tools_visible ?? defaultSettings.toolsVisible,
        };
        setSettings(loadedSettings);
      }
      
      // Apply CSS variables to document root
      applyGlassStyles(loadedSettings.glassmorphismOpacity, loadedSettings.glassmorphismColor);
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

      // Update local state and apply styles
      if (key === 'glassmorphism_opacity') {
        const opacityValue = parseFloat(value) || 0.1;
        setSettings(prev => {
          applyGlassStyles(opacityValue, prev.glassmorphismColor);
          return { ...prev, glassmorphismOpacity: opacityValue };
        });
      } else if (key === 'glassmorphism_color') {
        const colorValue = value || '#ffffff';
        setSettings(prev => {
          applyGlassStyles(prev.glassmorphismOpacity, colorValue);
          return { ...prev, glassmorphismColor: colorValue };
        });
      } else if (key === 'tools_visible') {
        setSettings(prev => ({
          ...prev,
          toolsVisible: value === 'true',
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
