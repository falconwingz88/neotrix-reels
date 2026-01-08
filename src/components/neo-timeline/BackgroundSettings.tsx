import { Label } from '@/components/ui/label';

interface BackgroundSettingsProps {
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  onChange: (gradient: { from: string; via: string; to: string }) => void;
}

// Helper to convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Helper to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate gradient from a single base color
const generateGradient = (baseColor: string) => {
  const { h, s } = hexToHsl(baseColor);
  
  // Create three stops: dark, mid, slightly different hue dark
  const from = hslToHex(h, Math.min(s, 30), 4); // very dark
  const via = hslToHex(h, Math.min(s + 10, 60), 18); // mid saturated
  const to = hslToHex((h + 30) % 360, Math.min(s, 35), 8); // shifted hue, dark
  
  return { from, via, to };
};

const BASE_COLORS = [
  { name: 'Midnight Blue', color: '#3b82f6' },
  { name: 'Ocean Teal', color: '#0ea5e9' },
  { name: 'Forest Green', color: '#22c55e' },
  { name: 'Sunset Orange', color: '#f97316' },
  { name: 'Purple Haze', color: '#a855f7' },
  { name: 'Rose Pink', color: '#ec4899' },
  { name: 'Golden', color: '#eab308' },
  { name: 'Deep Space', color: '#6366f1' },
  { name: 'Crimson', color: '#ef4444' },
];

export const BackgroundSettings = ({ gradient, onChange }: BackgroundSettingsProps) => {
  const handleBaseColorChange = (baseColor: string) => {
    const newGradient = generateGradient(baseColor);
    onChange(newGradient);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white mb-3">Background Theme</h4>
      
      {/* Base Color Picker */}
      <div className="space-y-2">
        <Label className="text-white/60 text-xs">Choose a base color</Label>
        <div className="grid grid-cols-3 gap-2">
          {BASE_COLORS.map((preset) => {
            const previewGradient = generateGradient(preset.color);
            return (
              <button
                key={preset.name}
                className="h-12 rounded-lg overflow-hidden hover:ring-2 ring-white/50 transition-all relative group"
                style={{
                  background: `linear-gradient(to bottom right, ${previewGradient.from}, ${previewGradient.via}, ${previewGradient.to})`,
                }}
                onClick={() => handleBaseColorChange(preset.color)}
                title={preset.name}
              >
                <div 
                  className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: preset.color }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <Label className="text-white/60 text-xs">Or pick a custom color</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            defaultValue="#3b82f6"
            onChange={(e) => handleBaseColorChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
          />
          <span className="text-white/60 text-sm">Click to choose any color</span>
        </div>
      </div>

      {/* Preview */}
      <div className="pt-2">
        <Label className="text-white/60 text-xs mb-2 block">Preview</Label>
        <div
          className="h-16 rounded-lg"
          style={{
            background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
          }}
        />
      </div>
    </div>
  );
};
