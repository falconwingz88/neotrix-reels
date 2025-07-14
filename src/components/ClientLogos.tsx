export const ClientLogos = () => {
  // Mock client logos - in a real app these would be your actual client logos
  const logos = [
    { name: "Wall's", url: 'https://cdn.worldvectorlogo.com/logos/walls-1.svg' },
    { name: 'BCA', url: 'https://cdn.worldvectorlogo.com/logos/bca-1.svg' },
    { name: 'Wuling Motors', url: 'https://cdn.worldvectorlogo.com/logos/wuling-1.svg' },
    { name: 'Rexona', url: 'https://cdn.worldvectorlogo.com/logos/rexona.svg' },
    { name: 'Hansaplast', url: 'https://cdn.worldvectorlogo.com/logos/hansaplast.svg' },
    { name: 'Grab', url: 'https://cdn.worldvectorlogo.com/logos/grab-1.svg' },
    { name: 'Vivo', url: 'https://cdn.worldvectorlogo.com/logos/vivo-2.svg' },
    { name: 'Oppo', url: 'https://cdn.worldvectorlogo.com/logos/oppo-2.svg' },
    { name: 'Bibit', url: 'https://cdn.worldvectorlogo.com/logos/bibit.svg' },
    { name: 'Realfood', url: 'https://cdn.worldvectorlogo.com/logos/realfood.svg' },
    { name: 'Skin Game', url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=120&h=60&fit=crop&crop=center' },
    { name: 'Smartfren', url: 'https://cdn.worldvectorlogo.com/logos/smartfren.svg' },
    { name: 'Garuda Indonesia', url: 'https://cdn.worldvectorlogo.com/logos/garuda-indonesia-1.svg' },
    { name: 'Mobile Legends', url: 'https://cdn.worldvectorlogo.com/logos/mobile-legends-1.svg' },
    { name: 'Make Over', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=60&fit=crop&crop=center' },
    { name: 'Ultima II', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&h=60&fit=crop&crop=center' },
    { name: 'Miranda Hair Care', url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=120&h=60&fit=crop&crop=center' },
    { name: 'Kept Kenangan', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=60&fit=crop&crop=center' },
    { name: 'Nature-e', url: 'https://images.unsplash.com/photo-1574263867128-e8e1fb5bd8ad?w=120&h=60&fit=crop&crop=center' },
    { name: 'Skinmology', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=60&fit=crop&crop=center' },
    { name: 'Bio Beauty Lab', url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=120&h=60&fit=crop&crop=center' },
    { name: 'Valorant', url: 'https://cdn.worldvectorlogo.com/logos/valorant-1.svg' },
    { name: 'Garudafood', url: 'https://cdn.worldvectorlogo.com/logos/garudafood.svg' }
  ];

  // Create enough rows to show 3 vertical rows with different logos
  const createLogoRows = () => {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const rowLogos = [];
      // Double the logos for seamless scrolling
      for (let i = 0; i < logos.length * 2; i++) {
        rowLogos.push(logos[i % logos.length]);
      }
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

      <div className="space-y-3 md:space-y-6">
        {logoRows.map((rowLogos, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-3 md:gap-8 animate-scroll-horizontal"
            style={{
              animationDelay: `${rowIndex * -10}s`, // Offset each row
              animationDuration: '60s' // Slow scrolling
            }}
          >
            {rowLogos.map((logo, logoIndex) => (
              <div
                key={`${rowIndex}-${logoIndex}`}
                className="flex-shrink-0 w-20 h-10 md:w-32 md:h-16 flex items-center justify-center bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-w-16 max-h-8 md:max-w-24 md:max-h-12 object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};