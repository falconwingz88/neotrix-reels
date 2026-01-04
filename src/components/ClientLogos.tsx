import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClientLogo {
  id: string;
  name: string;
  url: string;
  scale: string;
  sort_order: number;
}

export const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logos from database
  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (!error && data) {
        setLogos(data as ClientLogo[]);
      }
      setLoading(false);
    };

    fetchLogos();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('client_logos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_logos'
        },
        () => {
          fetchLogos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Create 3 rows with infinite continuous looping
  const createLogoRows = () => {
    if (logos.length === 0) return [];
    
    const logosPerRow = Math.ceil(logos.length / 3);
    const rows = [];
    
    for (let row = 0; row < 3; row++) {
      const startIndex = row * logosPerRow;
      const endIndex = Math.min(startIndex + logosPerRow, logos.length);
      let rowLogos = logos.slice(startIndex, endIndex);
      
      // If row is short, fill it with logos from the beginning to ensure seamless loop
      while (rowLogos.length < logosPerRow) {
        const remainingCount = logosPerRow - rowLogos.length;
        const fillLogos = logos.slice(0, Math.min(remainingCount, logos.length));
        rowLogos = [...rowLogos, ...fillLogos];
      }
      
      // Create 6 duplicates for truly seamless infinite scrolling with no gaps
      const duplicatedRow = [
        ...rowLogos, ...rowLogos, ...rowLogos, 
        ...rowLogos, ...rowLogos, ...rowLogos
      ];
      rows.push(duplicatedRow);
    }
    return rows;
  };

  const logoRows = createLogoRows();

  // Add horizontal scroll functionality
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        e.preventDefault();
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel);
      return () => currentRef.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const getScaleClass = (scale: string) => {
    switch (scale) {
      case '3x':
        return 'scale-[3]';
      case '2x':
        return 'scale-[2]';
      case 'small':
        return 'scale-75';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-8 p-8">
        <div className="text-center text-white/50">Loading logos...</div>
      </div>
    );
  }

  if (logos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-8">
      <div className="p-4 md:p-8 pb-0">
        <div className="mb-2 md:mb-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Trusted by Industry Leaders</h2>
          <p className="text-sm md:text-base text-white/70 px-4">Proud to collaborate with amazing brands worldwide</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="space-y-3 md:space-y-6 overflow-x-auto scrollbar-hide -mt-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {logoRows.map((rowLogos, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex gap-3 md:gap-6 animate-scroll-horizontal w-fit px-4 md:px-8 ${
              rowIndex === 1 ? 'ml-8 md:ml-16' : rowIndex === 2 ? 'ml-4 md:ml-8' : ''
            }`}
            style={{
              animationDelay: `${rowIndex * -20}s`,
              animationDuration: '220s'
            }}
          >
            {rowLogos.map((logo, logoIndex) => (
              <div
                key={`${rowIndex}-${logoIndex}`}
                className="flex-shrink-0 flex items-center justify-center bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300 p-2 w-20 h-10 md:w-32 md:h-16"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className={`max-w-full max-h-full object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300 ${getScaleClass(logo.scale)}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.logo-text')) {
                      const textDiv = document.createElement('div');
                      textDiv.className = 'logo-text text-white/70 font-semibold text-xs text-center px-1';
                      textDiv.textContent = logo.name;
                      parent.appendChild(textDiv);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="pb-6 md:pb-8"></div>
      </div>
    </div>
  );
};
