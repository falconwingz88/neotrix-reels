import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CustomProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  links: string[];
  credits: string;
  thumbnail?: string;
  fileLink?: string;
  year?: number;
  client?: string;
  createdAt: string;
}

interface ProjectsContextType {
  customProjects: CustomProject[];
  addProject: (project: Omit<CustomProject, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Omit<CustomProject, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  initializeDefaultProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'neotrix_custom_projects';
const INITIALIZED_KEY = 'neotrix_projects_initialized';

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

// Default projects (previously hardcoded)
const DEFAULT_PROJECTS: Omit<CustomProject, 'id' | 'createdAt'>[] = [
  {
    title: 'Caplang',
    description: 'Creative advertising campaign with dynamic visual storytelling and engaging brand narrative.',
    tags: ['VFX'],
    links: ['https://youtu.be/os941LA67aE', 'https://youtu.be/GTk5W7jzSc0'],
    credits: 'Lieve, Masterpiece',
    client: 'Lieve, Masterpiece',
    year: 2025,
  },
  {
    title: 'Paddle Pop',
    description: 'Ice cream brand campaign with playful animations and joyful family moments.',
    tags: ['Liquid'],
    links: ['https://youtu.be/1WAHm5SAbug'],
    credits: 'Leomotions',
    client: 'Leomotions',
    year: 2025,
  },
  {
    title: 'Patigon Spirit',
    description: 'Gaming-inspired content with dynamic action sequences and competitive spirit.',
    tags: ['VFX'],
    links: ['https://youtu.be/P-gxYwF0r0w'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'J&T Express',
    description: 'Logistics company campaign showcasing delivery excellence and customer satisfaction.',
    tags: ['VFX'],
    links: ['https://youtu.be/rzXekAUlEvI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Vuse',
    description: 'Premium tobacco brand campaign with sophisticated visual aesthetics.',
    tags: ['VFX'],
    links: ['https://youtu.be/5YbuwyzvdEo'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Lucky Strike',
    description: 'Iconic tobacco brand campaign with bold visual identity and premium positioning.',
    tags: ['VFX'],
    links: ['https://youtu.be/VOoKutKEQWE'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Tomoro Coffee Cloud Series',
    description: 'Premium coffee brand campaign featuring artisanal brewing and lifestyle moments.',
    tags: ['Liquid'],
    links: ['https://youtu.be/EvFb7pJa8e0'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Valorant VCT Ascension Pacific',
    description: 'Esports tournament campaign with high-energy gaming visuals and competitive atmosphere.',
    tags: ['VFX'],
    links: ['https://youtu.be/OT4MzLnsx1o'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'J&T Express 9th Anniversary',
    description: 'Anniversary celebration campaign highlighting company milestones and future vision.',
    tags: ['VFX'],
    links: ['https://youtu.be/x4H45vuo-4Y'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Hemaviton Action Range',
    description: 'Health supplement campaign focusing on energy, vitality, and active lifestyle.',
    tags: ['VFX'],
    links: ['https://youtu.be/L8ZT3BxSN8s'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Skintific',
    description: 'Skincare brand campaign emphasizing scientific innovation and dermatological excellence.',
    tags: ['Beauty'],
    links: ['https://youtu.be/QD_VqP3lSdk'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Mobile Legends All Star',
    description: 'Gaming tournament showcase with spectacular esports action and competitive highlights.',
    tags: ['VFX'],
    links: ['https://youtu.be/239w3mLbR78'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Siloam Hospital',
    description: 'Healthcare institution campaign highlighting medical excellence and patient care.',
    tags: ['VFX'],
    links: ['https://youtu.be/Mbo_WDsfYeE'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2024,
  },
  {
    title: 'Garuda Miles',
    description: 'Airline loyalty program campaign showcasing travel benefits and premium experiences.',
    tags: ['VFX'],
    links: ['https://youtu.be/-7_nktP0pG4'],
    credits: 'Lieve',
    client: 'Lieve',
    year: 2024,
    fileLink: 'https://drive.google.com/file/d/1VTG1lyTN5GQiqnED_aTyBHKXdus0uLxY/view?usp=drive_link',
  },
  {
    title: 'Ultima II Brand Manifesto',
    description: 'Premium beauty brand manifesto showcasing luxury cosmetics and brand philosophy.',
    tags: ['Beauty'],
    links: ['https://youtu.be/fe_LzsL1x-I'],
    credits: 'Winaya Studio',
    client: 'Winaya Studio',
    year: 2024,
    fileLink: 'https://drive.google.com/file/d/1ppBs7EG7Ung0E-nerqY-hM6_W99V1ajr/view?usp=drive_link',
  },
  {
    title: 'Natur-E',
    description: 'Natural vitamin E supplement campaign emphasizing health and natural wellness.',
    tags: ['VFX'],
    links: ['https://youtu.be/VWRsTt-DQj4'],
    credits: 'Winaya Studio',
    client: 'Winaya Studio',
    year: 2024,
    fileLink: 'https://drive.google.com/file/d/1wOl8lxIsuEtwsIc-suGHwhjl3Q-GPKYD/view?usp=drive_link',
  },
  {
    title: 'RWS Casino',
    description: 'Gaming and entertainment venue campaign with luxurious casino atmosphere.',
    tags: ['VFX'],
    links: ['https://youtu.be/oMSz56zS2uk', 'https://youtu.be/7eDrA8IrLeA'],
    credits: 'hiremistress',
    client: 'hiremistress',
    year: 2024,
  },
  {
    title: 'BBL x Chelsea Islan',
    description: 'Banking service campaign featuring celebrity endorsement and financial solutions.',
    tags: ['Character Animation'],
    links: ['https://youtu.be/x7gmGrbucIU', 'https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc'],
    credits: 'Lieve',
    client: 'Lieve',
    year: 2024,
  },
  {
    title: 'Indomilk x Timnas',
    description: 'Dairy brand collaboration with national football team showcasing sports nutrition.',
    tags: ['Liquid', 'Character Animation'],
    links: ['https://youtube.com/shorts/GMeCmOyHu1g'],
    credits: 'United Creative',
    client: 'United Creative',
    year: 2023,
  },
  {
    title: 'BCA Sekali Jalan',
    description: 'Banking service campaign highlighting convenience and seamless transactions.',
    tags: ['VFX'],
    links: ['https://youtu.be/vYOt2WfiZpM'],
    credits: 'Cuatrodia',
    client: 'Cuatrodia',
    year: 2023,
  },
  {
    title: 'Siladex Flu',
    description: 'Flu medicine campaign emphasizing fast relief and effective treatment.',
    tags: ['VFX'],
    links: ['https://youtu.be/McrguiqkgcI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Himalaya',
    description: 'Natural healthcare brand showcasing herbal wellness and traditional medicine.',
    tags: ['VFX'],
    links: ['https://youtu.be/HK6d6EbWPVE'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Kopi Kenangan Matcha',
    description: 'Coffee brand expansion featuring matcha variants and premium beverage experience.',
    tags: ['Liquid'],
    links: ['https://youtu.be/ZyRs2eIR4Mo'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Flimty x Deddy Corbuzier',
    description: 'Health supplement campaign featuring celebrity endorsement and wellness messaging.',
    tags: ['Character Animation'],
    links: ['https://youtu.be/HbaDfSrCBp4'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Tri Happy Flex',
    description: 'Telecommunications campaign showcasing flexible mobile plans and connectivity.',
    tags: ['VFX'],
    links: ['https://youtu.be/3m5YkPtVX0Y'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Kelaya Hair Treatment',
    description: 'Hair care brand campaign emphasizing natural treatment and hair health.',
    tags: ['Beauty'],
    links: ['https://youtu.be/rJlOEydZCtA'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Kopi Kenangan Harmanas U DA BEST',
    description: 'Coffee brand campaign with upbeat messaging and community celebration.',
    tags: ['Liquid'],
    links: ['https://youtu.be/0dWh5aY-TvI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Wardah Matte Lip Cream',
    description: 'Beauty brand campaign showcasing matte lip products with vibrant colors.',
    tags: ['Beauty'],
    links: ['https://youtu.be/U4APmP1Y-g0'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Tomoro Coffee',
    description: 'Premium coffee brand campaign featuring artisanal brewing and quality beans.',
    tags: ['Liquid'],
    links: ['https://youtu.be/spYNxPKgum8'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Anakonidin',
    description: 'Cold medicine campaign targeting families with effective relief solutions.',
    tags: ['VFX'],
    links: ['https://youtu.be/FCJNiSnXYRU'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Lazada Ramadan',
    description: 'E-commerce platform campaign celebrating Ramadan with special promotions.',
    tags: ['VFX'],
    links: ['https://youtu.be/kLqeoHgZU0o'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Kopi Kenangan Hanya Untukmu',
    description: 'Coffee brand romantic campaign with emotional storytelling and premium positioning.',
    tags: ['Liquid'],
    links: ['https://youtu.be/K-iAQj4PPjY'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'ABC Kopi Susu Gula Aren',
    description: 'Traditional coffee brand featuring palm sugar variant and authentic flavors.',
    tags: ['Liquid'],
    links: ['https://youtu.be/acFS4uJh2F4'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Mandiri Livin x Un1ty',
    description: 'Banking service collaboration with esports team showcasing digital innovation.',
    tags: ['Character Animation'],
    links: ['https://youtu.be/WtgzmsI8mjY'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2023,
  },
  {
    title: 'Active Water',
    description: 'Mineral water brand campaign emphasizing hydration and active lifestyle.',
    tags: ['Liquid'],
    links: ['https://youtu.be/3bzKy6rB0Ho'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Mobile Legends M4',
    description: 'Mobile gaming championship campaign with high-energy esports content.',
    tags: ['VFX'],
    links: ['https://youtu.be/7tCSKIO1Qkc'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Permata Mobile X',
    description: 'Banking application campaign showcasing mobile banking convenience and security.',
    tags: ['VFX'],
    links: ['https://youtu.be/cbZtI3EIVDc'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Rejoice 3in1',
    description: 'Hair care brand campaign featuring multi-benefit shampoo with comprehensive care.',
    tags: ['Beauty'],
    links: ['https://youtu.be/Xr8Ov-AnYcI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Mobile Legends 515 M-World',
    description: 'Gaming festival campaign celebrating Mobile Legends anniversary with global excitement.',
    tags: ['VFX'],
    links: ['https://youtu.be/tGuKYNwy0Q4'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Vivo 23 Series',
    description: 'Smartphone brand campaign showcasing new device features and photography capabilities.',
    tags: ['VFX'],
    links: ['https://youtu.be/lZxkFm66aNE'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Bali United Rewind',
    description: 'Football club campaign highlighting team achievements and fan dedication.',
    tags: ['VFX'],
    links: ['https://youtu.be/h-5XO6HVvO8'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'BigBabol Sploosh',
    description: 'Bubble gum brand campaign with playful animations and fun messaging.',
    tags: ['VFX'],
    links: ['https://youtu.be/Fu81dpokZ14'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Softex Natural Cool',
    description: 'Feminine care brand campaign emphasizing comfort and natural protection.',
    tags: ['VFX'],
    links: ['https://youtu.be/_waEQ2X7m34'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'OPPO A95',
    description: 'Smartphone brand campaign highlighting device performance and design aesthetics.',
    tags: ['VFX'],
    links: ['https://youtu.be/9fK9OX6WW1k'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2022,
  },
  {
    title: 'Lazada x JFW 2021',
    description: 'E-commerce platform collaboration with Jakarta Fashion Week showcasing style and trends.',
    tags: ['VFX'],
    links: ['https://youtu.be/z6ZCKRqdh_M'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'FIBE MINI',
    description: 'Telecommunications brand campaign featuring compact internet solutions.',
    tags: ['VFX'],
    links: ['https://youtu.be/Tk9z8DDCCvw'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'J&T 100 Juta Pelanggan',
    description: 'Logistics company milestone celebration reaching 100 million customers.',
    tags: ['VFX'],
    links: ['https://youtu.be/HEcn-7qUF38'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'The World of Realfood',
    description: 'Food brand campaign showcasing authentic flavors and quality ingredients.',
    tags: ['Liquid'],
    links: ['https://youtu.be/8ZnkKQ_qSVs'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'OPPO Encobuds',
    description: 'Audio accessories campaign highlighting wireless earbuds technology and sound quality.',
    tags: ['VFX'],
    links: ['https://youtu.be/T6Tn_nkdGoA'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'J&T Super',
    description: 'Logistics service premium offering showcasing enhanced delivery solutions.',
    tags: ['VFX'],
    links: ['https://youtu.be/GnvMlHJbq3o'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Mobile Legends 5th Anniversary',
    description: 'Gaming milestone celebration marking five years of Mobile Legends success.',
    tags: ['VFX'],
    links: ['https://youtu.be/z3M6UjXvrCI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'OPPO Reno 6 x PUBG',
    description: 'Smartphone gaming collaboration showcasing device performance in mobile gaming.',
    tags: ['VFX'],
    links: ['https://youtu.be/SVB2ns7rTf8'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Realfood UP',
    description: 'Food brand campaign highlighting nutritional benefits and energy boosting properties.',
    tags: ['Liquid'],
    links: ['https://youtu.be/kN3L3MXCML0'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Telkomsel 5G',
    description: 'Telecommunications 5G network launch campaign showcasing next-generation connectivity.',
    tags: ['VFX'],
    links: ['https://youtu.be/wp0NKJ2acag'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Hemaviton Neuro Forte',
    description: 'Brain health supplement campaign focusing on cognitive enhancement and mental clarity.',
    tags: ['VFX'],
    links: ['https://youtu.be/u8kQbaUx2yY'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'BNI Mobile Banking',
    description: 'Banking application campaign highlighting digital banking convenience and security features.',
    tags: ['VFX'],
    links: ['https://youtu.be/kceDIvOJahw'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'KulKul World',
    description: 'Travel and lifestyle platform campaign showcasing cultural experiences and destinations.',
    tags: ['VFX'],
    links: ['https://youtu.be/-5IlW21DcwI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'OPPO Reno 5 5G - Car',
    description: 'Smartphone campaign featuring automotive-themed visuals and 5G connectivity.',
    tags: ['VFX'],
    links: ['https://youtu.be/-PrXQeot2lc'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Klop Saluto Coklat',
    description: 'Chocolate snack brand campaign with indulgent flavors and satisfying moments.',
    tags: ['VFX'],
    links: ['https://youtu.be/CEF7_ECg_e0'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Wyeth S26',
    description: 'Baby formula brand campaign emphasizing nutrition and infant development.',
    tags: ['VFX'],
    links: ['https://youtu.be/PrD4Py1SBKI'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Chitato Maxx',
    description: 'Snack brand campaign featuring bold flavors and maximum satisfaction.',
    tags: ['VFX'],
    links: ['https://youtu.be/UQrdaDwY_CU'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'Smartfren - Unlimited Daebak',
    description: 'Telecommunications unlimited data campaign with K-pop inspired messaging.',
    tags: ['VFX'],
    links: ['https://youtu.be/M6bXLDcbjYU'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2021,
  },
  {
    title: 'XL Axiata 4.5G',
    description: 'Telecommunications advanced network campaign showcasing enhanced connectivity speeds.',
    tags: ['VFX'],
    links: ['https://youtu.be/_aese95_hpw'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'OPPO Reno 4 F - Beatbox',
    description: 'Smartphone campaign featuring music and beatboxing with device audio capabilities.',
    tags: ['VFX'],
    links: ['https://youtu.be/3xj7R7AHAjU'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'OPPO Reno 4 F - Basketball',
    description: 'Smartphone campaign with basketball theme showcasing device durability and performance.',
    tags: ['VFX'],
    links: ['https://youtu.be/WU-zGbk1EyY'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'Pertamina HUT RI',
    description: 'National oil company Indonesian Independence Day celebration campaign.',
    tags: ['VFX'],
    links: ['https://youtu.be/eyDJdfAkPWc'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'Free Fire x Money Heist',
    description: 'Gaming collaboration with popular Netflix series featuring themed content.',
    tags: ['VFX'],
    links: ['https://youtu.be/ffKrFeehdu0'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'J&T Gapai Mimpimu',
    description: 'Logistics company inspirational campaign about achieving dreams and aspirations.',
    tags: ['VFX'],
    links: ['https://youtu.be/N5vH8q4bEho'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'OPPO Reno 4 Selective',
    description: 'Smartphone campaign highlighting selective focus photography features.',
    tags: ['VFX'],
    links: ['https://youtu.be/jcqoo26CtDM'],
    credits: 'Milkyway Studio',
    client: 'Milkyway Studio',
    year: 2020,
  },
  {
    title: 'Wuling',
    description: 'Automotive brand showcase featuring innovative design and modern mobility solutions.',
    tags: ['VFX'],
    links: [],
    credits: 'Above Space',
    client: 'Above Space',
    year: 2025,
    fileLink: 'https://drive.google.com/file/d/1Ytd-GYd56XpusWyvyNwz0m67dcD4ya-t/view?usp=drive_link',
  },
  {
    title: 'Ultima II x Mikha Tambayong',
    description: 'Beauty brand collaboration featuring celebrity endorsement and premium cosmetics showcase.',
    tags: ['Beauty', 'Character Animation'],
    links: ['https://drive.google.com/file/d/1T6iYkJ0Dz2BqmRttbT70PfSzJvVD8Svi/view?usp=sharing', 'https://drive.google.com/file/d/1NC2q-dPpiYqq0mzgLj8N77WoggXIIiEJ/view?usp=drive_link', 'https://drive.google.com/file/d/1-Z0eNWi9yRd_AVGgaE7coqpDHId46b5F/view?usp=drive_link'],
    credits: 'Lieve',
    client: 'Lieve',
    year: 2025,
    fileLink: 'https://drive.google.com/file/d/1NC2q-dPpiYqq0mzgLj8N77WoggXIIiEJ/view?usp=drive_link',
  },
  {
    title: 'Bibit x Deddy Corbuzier',
    description: 'Investment app campaign featuring celebrity endorsement and financial literacy messaging.',
    tags: ['Character Animation'],
    links: ['https://youtu.be/Jvvk3mlmqpc'],
    credits: 'Adi Victory',
    client: 'Adi Victory',
    year: 2024,
  },
  {
    title: 'Miranda',
    description: 'Beverage brand campaign showcasing refreshing moments and lifestyle integration.',
    tags: ['Liquid'],
    links: [],
    credits: 'Lieve',
    client: 'Lieve',
    year: 2024,
  },
  {
    title: 'Skinmology',
    description: 'Advanced skincare brand focusing on dermatological science and beauty innovation.',
    tags: ['Beauty'],
    links: [],
    credits: 'Felivia Devanie',
    client: 'Felivia Devanie',
    year: 2024,
    fileLink: 'https://drive.google.com/file/d/1tkwHrZv4tpUZXCRrNF1u_q4sMnirTizn/view?usp=drive_link',
  },
];

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [customProjects, setCustomProjects] = useState<CustomProject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProjects));
  }, [customProjects]);

  // Initialize default projects on first load
  useEffect(() => {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    if (!isInitialized && customProjects.length === 0) {
      initializeDefaultProjects();
    }
  }, []);

  const initializeDefaultProjects = () => {
    const projectsWithIds: CustomProject[] = DEFAULT_PROJECTS.map((project, index) => ({
      ...project,
      id: `project-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      thumbnail: project.thumbnail || (project.links[0] ? getYouTubeThumbnail(project.links[0]) : undefined),
    }));
    setCustomProjects(projectsWithIds);
    localStorage.setItem(INITIALIZED_KEY, 'true');
  };

  const addProject = (project: Omit<CustomProject, 'id' | 'createdAt'>) => {
    const newProject: CustomProject = {
      ...project,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, project: Partial<Omit<CustomProject, 'id' | 'createdAt'>>) => {
    setCustomProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...project }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setCustomProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProjectsContext.Provider value={{ customProjects, addProject, updateProject, deleteProject, initializeDefaultProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
