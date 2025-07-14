export const ClientLogos = () => {
  // Mock client logos - in a real app these would be your actual client logos
  const logos = [
    { name: 'Netflix', url: 'https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png' },
    { name: 'Adobe', url: 'https://logos-world.net/wp-content/uploads/2020/03/Adobe-Logo.png' },
    { name: 'Microsoft', url: 'https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png' },
    { name: 'Apple', url: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png' },
    { name: 'Google', url: 'https://logos-world.net/wp-content/uploads/2020/04/Google-Logo.png' },
    { name: 'Amazon', url: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png' },
    { name: 'Meta', url: 'https://logos-world.net/wp-content/uploads/2021/10/Meta-Logo.png' },
    { name: 'Tesla', url: 'https://logos-world.net/wp-content/uploads/2020/11/Tesla-Logo.png' },
    { name: 'Nike', url: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png' },
    { name: 'Coca Cola', url: 'https://logos-world.net/wp-content/uploads/2020/04/Coca-Cola-Logo.png' },
    { name: 'Samsung', url: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png' },
    { name: 'Intel', url: 'https://logos-world.net/wp-content/uploads/2020/03/Intel-Logo.png' },
    { name: 'Sony', url: 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png' },
    { name: 'Disney', url: 'https://logos-world.net/wp-content/uploads/2020/11/Disney-Logo.png' },
    { name: 'Spotify', url: 'https://logos-world.net/wp-content/uploads/2020/06/Spotify-Logo.png' },
    { name: 'Airbnb', url: 'https://logos-world.net/wp-content/uploads/2020/10/Airbnb-Logo.png' },
    { name: 'Uber', url: 'https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png' },
    { name: 'LinkedIn', url: 'https://logos-world.net/wp-content/uploads/2020/04/LinkedIn-Logo.png' },
    { name: 'Twitter', url: 'https://logos-world.net/wp-content/uploads/2020/04/Twitter-Logo.png' },
    { name: 'YouTube', url: 'https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo.png' },
    { name: 'Instagram', url: 'https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png' }
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