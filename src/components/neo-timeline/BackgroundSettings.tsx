import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BackgroundSettingsProps {
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  onChange: (gradient: { from: string; via: string; to: string }) => void;
}

const PRESETS = [
  { name: 'Midnight', from: '#000000', via: '#0f172a', to: '#1e1b4b' },
  { name: 'Ocean', from: '#0f172a', via: '#0c4a6e', to: '#164e63' },
  { name: 'Forest', from: '#052e16', via: '#14532d', to: '#1e3a32' },
  { name: 'Sunset', from: '#1c1917', via: '#7c2d12', to: '#1e1b4b' },
  { name: 'Purple Haze', from: '#0f0f23', via: '#3b0764', to: '#1e1b4b' },
  { name: 'Deep Space', from: '#000000', via: '#111827', to: '#000000' },
];

export const BackgroundSettings = ({ gradient, onChange }: BackgroundSettingsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-white mb-3">Background Gradient</h4>
      
      {/* Presets */}
      <div className="space-y-2">
        <Label className="text-white/60 text-xs">Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="h-12 rounded-lg overflow-hidden hover:ring-2 ring-white/50 transition-all"
              style={{
                background: `linear-gradient(to bottom right, ${preset.from}, ${preset.via}, ${preset.to})`
              }}
              onClick={() => onChange(preset)}
              title={preset.name}
            />
          ))}
        </div>
      </div>
      
      {/* Custom Colors */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <Label className="text-white/60 text-xs">Custom Colors</Label>
        
        <div className="flex items-center gap-3">
          <Label className="text-white/80 text-sm w-12">From</Label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="color"
              value={gradient.from}
              onChange={(e) => onChange({ ...gradient, from: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={gradient.from}
              onChange={(e) => onChange({ ...gradient, from: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xs h-8"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Label className="text-white/80 text-sm w-12">Via</Label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="color"
              value={gradient.via}
              onChange={(e) => onChange({ ...gradient, via: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={gradient.via}
              onChange={(e) => onChange({ ...gradient, via: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xs h-8"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Label className="text-white/80 text-sm w-12">To</Label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="color"
              value={gradient.to}
              onChange={(e) => onChange({ ...gradient, to: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={gradient.to}
              onChange={(e) => onChange({ ...gradient, to: e.target.value })}
              className="bg-white/10 border-white/20 text-white text-xs h-8"
            />
          </div>
        </div>
      </div>
      
      {/* Preview */}
      <div className="pt-2">
        <Label className="text-white/60 text-xs mb-2 block">Preview</Label>
        <div
          className="h-16 rounded-lg"
          style={{
            background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.via}, ${gradient.to})`
          }}
        />
      </div>
    </div>
  );
};
