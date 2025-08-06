import { useRef, useEffect, useState } from 'react';

export const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const logos = [
    { name: 'BCA_white.png', url: '/Client Logos/BCA_white.png' },
    { name: 'BNI-MOBILE_white.png', url: '/Client Logos/BNI-MOBILE_white.png' },
    { name: 'BNI_white.png', url: '/Client Logos/BNI_white.png' },
    { name: 'JT-Express_logo_white.png', url: '/Client Logos/JT-Express_logo_white.png' },
    { name: 'Logo_fatigon_spirit_white.png', url: '/Client Logos/Logo_fatigon_spirit_white.png' },
    { name: 'RWS-Sentosa_white.png', url: '/Client Logos/RWS-Sentosa_white.png' },
    { name: 'Smartfren_white.png', url: '/Client Logos/Smartfren_white.png' },
    { name: 'bbl_white.png', url: '/Client Logos/bbl_white.png' },
    { name: 'bibit-logo_brandlogos.net_mdpay_white.png', url: '/Client Logos/bibit-logo_brandlogos.net_mdpay_white.png' },
    { name: 'caplang_white.png', url: '/Client Logos/caplang_white.png' },
    { name: 'fibe-mini_white.png', url: '/Client Logos/fibe-mini_white.png' },
    { name: 'flimty_white.png', url: '/Client Logos/flimty_white.png' },
    { name: 'freefire_white.png', url: '/Client Logos/freefire_white.png' },
    { name: 'garuda_white.png', url: '/Client Logos/garuda_white.png' },
    { name: 'indofood-kulkuil_white.png', url: '/Client Logos/indofood-kulkuil_white.png' },
    { name: 'indomilk_white.png', url: '/Client Logos/indomilk_white.png' },
    { name: 'kelaya_white.png', url: '/Client Logos/kelaya_white.png' },
    { name: 'livin-by-mandiri_white.png', url: '/Client Logos/livin-by-mandiri_white.png' },
    { name: 'luvky-strikes_white.png', url: '/Client Logos/luvky-strikes_white.png' },
    { name: 'miranda_white.png', url: '/Client Logos/miranda_white.png' },
    { name: 'mobile-legends_white.png', url: '/Client Logos/mobile-legends_white.png' },
    { name: 'nature-e_white.png', url: '/Client Logos/nature-e_white.png' },
    { name: 'oppo_white.png', url: '/Client Logos/oppo_white.png' },
    { name: 'paddle-pop_white.png', url: '/Client Logos/paddle-pop_white.png' },
    { name: 'permata-bank_white.png', url: '/Client Logos/permata-bank_white.png' },
    { name: 'pertamina_white.png', url: '/Client Logos/pertamina_white.png' },
    { name: 'procold_white.png', url: '/Client Logos/procold_white.png' },
    { name: 'rejoice_white.png', url: '/Client Logos/rejoice_white.png' },
    { name: 'siladex_white.png', url: '/Client Logos/siladex_white.png' },
    { name: 'siloam-hospital_white.png', url: '/Client Logos/siloam-hospital_white.png' },
    { name: 'skinmology_white.png', url: '/Client Logos/skinmology_white.png' },
    { name: 'skintific_white.png', url: '/Client Logos/skintific_white.png' },
    { name: 'softex_white.png', url: '/Client Logos/softex_white.png' },
    { name: 'telkomsel_white.png', url: '/Client Logos/telkomsel_white.png' },
    { name: 'tomoro_white.png', url: '/Client Logos/tomoro_white.png' },
    { name: 'tri_white.png', url: '/Client Logos/tri_white.png' },
    { name: 'ultima-II_white.png', url: '/Client Logos/ultima-II_white.png' },
    { name: 'valo_white.png', url: '/Client Logos/valo_white.png' },
    { name: 'vivo_white.png', url: '/Client Logos/vivo_white.png' },
    { name: 'wardah_white.png', url: '/Client Logos/wardah_white.png' },
    { name: 'wuling_white.png', url: '/Client Logos/wuling_white.png' },
    { name: 'wyeth_white.png', url: '/Client Logos/wyeth_white.png' },
    { name: 'xl_white.png', url: '/Client Logos/xl_white.png' }
  ];

  // Create 3 rows with infinite continuous looping
  const createLogoRows = () => {
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
            {rowLogos.map((logo, logoIndex) => {
              // Define 3x enlarged logos
              const is3xLogo = logo.name.toLowerCase().includes('skintific');
              
              // Define 2x enlarged logos
              const is2xLogo = [
                'bibit-logo_brandlogos.net_mdpay_white.png',
                'fibe-mini_white.png', 
                'siloam-hospital_white.png',
                'miranda_white.png',
                'xl_white.png',
                'oppo_white.png'
              ].includes(logo.name);
              
              // Define smaller logos that need to be scaled down
              const isSmallerLogo = [
                'indofood-kulkuil_white.png',
                'wuling_white.png',
                'freefire_white.png'
              ].includes(logo.name);
              
              return (
                <div
                  key={`${rowIndex}-${logoIndex}`}
                  className="flex-shrink-0 flex items-center justify-center bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300 p-2 w-20 h-10 md:w-32 md:h-16"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className={`max-w-full max-h-full object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300 ${
                      is3xLogo 
                        ? 'scale-[3]' 
                        : is2xLogo
                        ? 'scale-[2]'
                        : isSmallerLogo
                        ? 'scale-75'
                        : ''
                    }`}
                    onError={(e) => {
                      // Fallback to text if image fails to load
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
              );
            })}
          </div>
        ))}
        <div className="pb-6 md:pb-8"></div>
      </div>
    </div>
  );
};