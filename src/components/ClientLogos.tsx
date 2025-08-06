export const ClientLogos = () => {
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
    { name: 'Client 26', url: '/lovable-uploads/1862eea6-85c6-4c44-b5ec-62a8ebc9d947.png' },
    { name: 'Client 27', url: '/lovable-uploads/3ce45d7a-dcbb-490d-859b-4a364b6f8993.png' },
    { name: 'softex', url: '/lovable-uploads/f2668c32-5c66-4bcf-8f07-3b39e2c6d223.png' },
    { name: 'Client 29', url: '/lovable-uploads/71914277-6e91-4d0f-a005-8ae1ffd16cbc.png' },
    { name: 'Client 30', url: '/lovable-uploads/2756c1d1-fb25-46c7-bf7b-2d7ebd3ff86b.png' }
  ];

  // Create rows without repetition and with proper scrolling
  const createLogoRows = () => {
    const rows = [];
    const logosPerRow = Math.ceil(logos.length / 3);
    
    for (let row = 0; row < 3; row++) {
      const startIndex = row * logosPerRow;
      const endIndex = Math.min(startIndex + logosPerRow, logos.length);
      const rowLogos = logos.slice(startIndex, endIndex);
      rows.push(rowLogos);
    }
    return rows;
  };

  const logoRows = createLogoRows();

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-4 md:p-8 shadow-2xl overflow-hidden">
      <div className="mb-4 md:mb-8 text-center">
        <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Trusted by Industry Leaders</h2>
        <p className="text-sm md:text-base text-white/70 px-4">Proud to collaborate with amazing brands worldwide</p>
      </div>

      <div className="space-y-3 md:space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30">
        {logoRows.map((rowLogos, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-3 md:gap-8 overflow-x-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 pb-2"
          >
            {rowLogos.map((logo, logoIndex) => {
              const isLargerLogo = logo.name === 'bibit' || logo.name === 'softex' || logo.url.includes('7a01c707') || logo.url.includes('f2668c32') || logo.url.includes('234e264c');
              return (
                <div
                  key={`${rowIndex}-${logoIndex}`}
                  className={`flex-shrink-0 ${
                    isLargerLogo 
                      ? 'w-28 h-14 md:w-40 md:h-20' 
                      : 'w-20 h-10 md:w-32 md:h-16'
                  } flex items-center justify-center bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300`}
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className={`${
                      isLargerLogo 
                        ? 'max-w-24 max-h-12 md:max-w-36 md:max-h-16' 
                        : 'max-w-16 max-h-8 md:max-w-24 md:max-h-12'
                    } object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300`}
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.logo-text')) {
                        const textDiv = document.createElement('div');
                        textDiv.className = 'logo-text text-white/70 font-semibold text-sm text-center px-2';
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
      </div>
    </div>
  );
};