import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ClientLogo {
  id: string;
  name: string;
  url: string;
  scale: string;
}

interface ClientLogoSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ClientLogoSelector = ({ value, onChange, className }: ClientLogoSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('id, name, url, scale')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (!error && data) {
        setLogos(data);
      }
      setLoading(false);
    };

    fetchLogos();
  }, []);

  const filteredLogos = useMemo(() => {
    if (!searchTerm) return logos;
    return logos.filter(logo => 
      logo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logos, searchTerm]);

  const selectedLogo = logos.find(logo => logo.name === value);

  const getScaleClass = (scale: string) => {
    switch (scale) {
      case '3x': return 'scale-150';
      case '2x': return 'scale-125';
      case 'small': return 'scale-75';
      default: return '';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white",
            !value && "text-white/40",
            className
          )}
        >
          {selectedLogo ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <img
                  src={selectedLogo.url}
                  alt={selectedLogo.name}
                  className={cn("max-w-full max-h-full object-contain filter brightness-0 invert", getScaleClass(selectedLogo.scale))}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="truncate">{selectedLogo.name}</span>
            </div>
          ) : (
            "Select client logo..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-zinc-900 border-white/20" align="start">
        <div className="p-2 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logos..."
              className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-white/50">Loading...</div>
          ) : filteredLogos.length === 0 ? (
            <div className="p-4 text-center text-white/50">
              {searchTerm ? 'No logos found' : 'No client logos available'}
            </div>
          ) : (
            <div className="p-1">
              {value && (
                <button
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-left text-white/60 hover:bg-white/10 rounded-md text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear selection
                </button>
              )}
              {filteredLogos.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => {
                    onChange(logo.name);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-white/10 rounded-md",
                    value === logo.name && "bg-white/10"
                  )}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-white/5 rounded">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className={cn("max-w-full max-h-full object-contain filter brightness-0 invert", getScaleClass(logo.scale))}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <span className="text-white text-sm flex-1 truncate">{logo.name}</span>
                  {value === logo.name && (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
