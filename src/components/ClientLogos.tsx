export const ClientLogos = () => {
  // Mock client logos - in a real app these would be your actual client logos
  const logos = [
    { name: "Wall's", url: 'https://logos-world.net/wp-content/uploads/2020/09/Walls-Logo.png' },
    { name: 'BCA', url: 'https://logos-world.net/wp-content/uploads/2021/02/BCA-Logo.png' },
    { name: 'Wuling Motors', url: 'https://logos-world.net/wp-content/uploads/2021/04/Wuling-Logo.png' },
    { name: 'Rexona', url: 'https://logos-world.net/wp-content/uploads/2020/12/Rexona-Logo.png' },
    { name: 'Hansaplast', url: 'https://logos-world.net/wp-content/uploads/2021/03/Hansaplast-Logo.png' },
    { name: 'Grab', url: 'https://logos-world.net/wp-content/uploads/2020/11/Grab-Logo.png' },
    { name: 'Vivo', url: 'https://logos-world.net/wp-content/uploads/2020/07/Vivo-Logo.png' },
    { name: 'Oppo', url: 'https://logos-world.net/wp-content/uploads/2020/07/Oppo-Logo.png' },
    { name: 'Bibit', url: 'https://logos-world.net/wp-content/uploads/2022/01/Bibit-Logo.png' },
    { name: 'Realfood', url: 'https://realfood.co.id/wp-content/uploads/2021/03/logo-realfood.png' },
    { name: 'Skin Game', url: 'https://logos-world.net/wp-content/uploads/2021/05/Skin-Game-Logo.png' },
    { name: 'Smartfren', url: 'https://logos-world.net/wp-content/uploads/2021/02/Smartfren-Logo.png' },
    { name: 'Garuda Indonesia', url: 'https://logos-world.net/wp-content/uploads/2020/09/Garuda-Indonesia-Logo.png' },
    { name: 'Mobile Legends', url: 'https://logos-world.net/wp-content/uploads/2021/01/Mobile-Legends-Logo.png' },
    { name: 'Make Over', url: 'https://images.seeklogo.com/logo-png/46/1/make-over-logo-png_seeklogo-466190.png' },
    { name: 'Ultima II', url: 'https://www.ultimaii.com/public/images/logo.png' },
    { name: 'Miranda Hair Care', url: 'https://logos-world.net/wp-content/uploads/2021/04/Miranda-Logo.png' },
    { name: 'Kept Kenangan', url: 'https://logos-world.net/wp-content/uploads/2021/06/Kept-Kenangan-Logo.png' },
    { name: 'Nature-e', url: 'https://logos-world.net/wp-content/uploads/2021/03/Nature-e-Logo.png' },
    { name: 'Skinmology', url: 'https://logos-world.net/wp-content/uploads/2021/05/Skinmology-Logo.png' },
    { name: 'Bio Beauty Lab', url: 'https://logos-world.net/wp-content/uploads/2021/04/Bio-Beauty-Lab-Logo.png' },
    { name: 'Valorant', url: 'https://logos-world.net/wp-content/uploads/2020/06/Valorant-Logo.png' },
    { name: 'Garudafood', url: 'https://logos-world.net/wp-content/uploads/2021/03/Garudafood-Logo.png' }
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