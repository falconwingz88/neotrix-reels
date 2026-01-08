import { Check } from 'lucide-react';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ colors, selectedColor, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full transition-all hover:scale-110 flex items-center justify-center ${
            selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        >
          {selectedColor === color && (
            <Check className="w-4 h-4 text-white" />
          )}
        </button>
      ))}
    </div>
  );
};
