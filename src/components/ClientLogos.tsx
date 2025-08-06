import { useRef, useEffect } from 'react';

export const ClientLogos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const logos = [
    { name: 'Client 1', url: '/lovable-uploads/fb7e9daf-3e5f-40d3-873a-b690e1100b10.png' },
    { name: 'Client 2', url: '/lovable-uploads/7cb981fa-8be6-49d2-9cf5-295b2a29eef5.png' },
    { name: 'Client 3', url: '/lovable-uploads/d3a71186-b503-4a49-8999-e16762066c3f.png' },
    { name: 'Client 4', url: '/lovable-uploads/302156f1-3077-4a13-a7f1-98e585a6c401.png' },
    { name: 'Client 5', url: '/lovable-uploads/c873c688-4a8e-4f52-8ac6-b1d13fee0b59.png' },
    { name: 'Client 6', url: '/lovable-uploads/6a3106ca-9090-4592-976d-cf41f3ec2d52.png' },
    { name: 'Client 7', url: '/lovable-uploads/a9bd11dc-8e86-4084-ba6c-c4b519c4dc55.png' },
    { name: 'Client 8', url: '/lovable-uploads/efe37e94-8e87-40ea-85c4-121b244b1427.png' },
    { name: 'Client 9', url: '/lovable-uploads/d614c8fa-3f0d-44a0-b3ca-45b238298595.png' },
    { name: 'Client 10', url: '/lovable-uploads/f5783866-79e3-4ef7-88dc-729dcfa71ae7.png' },
    { name: 'Client 11', url: '/lovable-uploads/ee91b94a-553a-4308-8fcd-8a34bbfd333a.png' },
    { name: 'Client 12', url: '/lovable-uploads/a5d81720-e555-45b6-b063-0a7ce6be3c36.png' },
    { name: 'Client 13', url: '/lovable-uploads/7a01c707-10d2-4706-9c4c-8a140226c4ba.png' },
    { name: 'Client 14', url: '/lovable-uploads/62616f4d-160d-4d6b-9f3a-b971f73ccb12.png' },
    { name: 'Client 15', url: '/lovable-uploads/c92b1d48-44cc-4952-9226-1c9f52e814d9.png' },
    { name: 'Client 16', url: '/lovable-uploads/4785b1ed-6bdc-4ed6-ade4-b818cbff251e.png' },
    { name: 'Client 17', url: '/lovable-uploads/68dd3971-d74e-4980-a92f-c618cddda3b6.png' },
    { name: 'Client 18', url: '/lovable-uploads/cb87f0d3-4e82-4e3f-9469-cc1693dfa263.png' },
    { name: 'Client 19', url: '/lovable-uploads/095c66ca-08f0-405a-a24e-5d161594a887.png' },
    { name: 'Client 20', url: '/lovable-uploads/19f383c4-5d82-479c-bab9-7464db949e5e.png' },
    { name: 'Client 21', url: '/lovable-uploads/62178f14-7e0f-495c-a601-8db7e697bcdf.png' },
    { name: 'Client 22', url: '/lovable-uploads/382d7f57-bb77-4a9f-82b6-de8631727482.png' },
    { name: 'Client 23', url: '/lovable-uploads/df62878e-d432-420e-a780-ebe5485418f6.png' },
    { name: 'Client 24', url: '/lovable-uploads/541e8688-7445-4d35-b794-fe71c48a9102.png' },
    { name: 'bibit', url: '/lovable-uploads/234e264c-694e-4db8-aac2-0174d4b8bec3.png' },
    { name: 'siloam hospitals', url: '/lovable-uploads/1862eea6-85c6-4c44-b5ec-62a8ebc9d947.png' },
    { name: 'fibe mini', url: '/lovable-uploads/3ce45d7a-dcbb-490d-859b-4a364b6f8993.png' },
    { name: 'softex', url: '/lovable-uploads/f2668c32-5c66-4bcf-8f07-3b39e2c6d223.png' },
    { name: 'Client 29', url: '/lovable-uploads/71914277-6e91-4d0f-a005-8ae1ffd16cbc.png' },
    { name: 'Client 30', url: '/lovable-uploads/2756c1d1-fb25-46c7-bf7b-2d7ebd3ff86b.png' },
    { name: 'smartfren', url: '/lovable-uploads/f59bd0d6-8e68-4572-a8ac-c343d5809706.png' },
    { name: 'telkomsel', url: '/lovable-uploads/763593e8-727b-4109-8947-ea1cedbaa341.png' },
    { name: 'oppo', url: '/lovable-uploads/d3628a73-bbd2-4b9f-a795-0113e14fb67d.png' },
    { name: 'xl axiata', url: '/lovable-uploads/e9e1d247-d0b1-45d2-92e7-0a884e515fe9.png' },
    { name: 'miranda', url: '/lovable-uploads/ff077092-9132-49d7-be93-f0256e820d03.png' },
    { name: 'New Logo 6', url: '/lovable-uploads/cb01ed98-88be-4a06-b601-8d535a89c727.png' },
    { name: 'New Logo 7', url: '/lovable-uploads/1b0f52d4-a869-4962-8121-e0d21ed28dbd.png' },
    { name: 'New Logo 8', url: '/lovable-uploads/457f7fd0-1fac-400a-bb08-e08d7bea91c9.png' },
    { name: 'New Logo 9', url: '/lovable-uploads/5a8474a3-705d-4568-93a9-f34b5a5b432e.png' },
    { name: 'New Logo 10', url: '/lovable-uploads/5d7d4cb7-04c1-4ce3-8a72-42f86dbf5c1b.png' },
    { name: 'Latest Logo 1', url: '/lovable-uploads/f7a3e855-8b55-4227-9244-d89e78a3fc66.png' },
    { name: 'Latest Logo 2', url: '/lovable-uploads/77fe2d7b-22d9-4f85-95c1-e5d1b68af629.png' },
    { name: 'Latest Logo 3', url: '/lovable-uploads/9132013d-52a6-4c9b-b425-3648b501b408.png' }
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
              animationDelay: `${rowIndex * -30}s`,
              animationDuration: '120s'
            }}
          >
            {rowLogos.map((logo, logoIndex) => {
              const isLargerLogo = [
                'bibit', 'smartfren', 'telkomsel', 'oppo', 
                'xl axiata', 'softex', 'fibe mini', 'miranda'
              ].includes(logo.name.toLowerCase());
              
              return (
                <div
                  key={`${rowIndex}-${logoIndex}`}
                  className="flex-shrink-0 w-20 h-10 md:w-32 md:h-16 flex items-center justify-center bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300 p-2"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className={`object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300 ${
                      isLargerLogo 
                        ? 'w-full h-full scale-150' 
                        : 'max-w-12 max-h-5 md:max-w-20 md:max-h-10'
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