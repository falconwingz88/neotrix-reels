import { useState } from 'react';
import { Search, Filter, X, Users, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectDetailModal } from './ProjectDetailModal';

// Generated thumbnails
import lazadaRamadanThumb from '@/assets/thumbnails/lazada-ramadan.jpg';
import rejoice3in1Thumb from '@/assets/thumbnails/rejoice-3in1.jpg';
import oppoEncobudsThumb from '@/assets/thumbnails/oppo-encobuds.jpg';
import bniMobileBankingThumb from '@/assets/thumbnails/bni-mobile-banking.jpg';
import pertaminaHutRiThumb from '@/assets/thumbnails/pertamina-hut-ri.jpg';
import jntGapaiMimpimUThumb from '@/assets/thumbnails/jnt-gapai-mimpimu.jpg';
import oppoReno4SelectiveThumb from '@/assets/thumbnails/oppo-reno4-selective.jpg';
import oppoReno4BlueThumb from '@/assets/thumbnails/oppo-reno4-blue.jpg';
import bibitDeddyCorbuZierThumb from '@/assets/thumbnails/bibit-deddy-corbuzier.jpg';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  year: number;
  client: string;
  primaryVideoUrl: string;
  allVideos: string[];
  deliveryFiles: string[];
}

// Helper function to extract YouTube video ID and generate thumbnail
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

// Helper function to categorize projects into new tag system
const categorizeProject = (title: string, description: string): string[] => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const tags: string[] = [];
  
  // Beauty category
  if (titleLower.includes('wardah') || titleLower.includes('ultima') || titleLower.includes('scarlett') || 
      titleLower.includes('skincare') || titleLower.includes('beauty') || titleLower.includes('cosmetic') ||
      titleLower.includes('skintific') || titleLower.includes('skinmology') || titleLower.includes('lip') ||
      descLower.includes('beauty') || descLower.includes('skincare') || descLower.includes('cosmetic')) {
    tags.push('Beauty');
  }
  
  // Liquid category (fluid dynamics, liquids, drinks, flowing elements)
  if (titleLower.includes('coffee') || titleLower.includes('kopi') || titleLower.includes('tomoro') ||
      titleLower.includes('abc') || titleLower.includes('water') || titleLower.includes('milk') ||
      titleLower.includes('indomilk') || titleLower.includes('miranda') || titleLower.includes('active water') ||
      descLower.includes('coffee') || descLower.includes('beverage') || descLower.includes('liquid') ||
      descLower.includes('fluid') || descLower.includes('drink')) {
    tags.push('Liquid');
  }
  
  // VFX category (visual effects, gaming, technology, digital)
  if (titleLower.includes('mobile legends') || titleLower.includes('valorant') || titleLower.includes('oppo') ||
      titleLower.includes('vivo') || titleLower.includes('gaming') || titleLower.includes('esports') ||
      titleLower.includes('5g') || titleLower.includes('technology') || titleLower.includes('digital') ||
      titleLower.includes('reno') || titleLower.includes('smartphone') || titleLower.includes('pubg') ||
      descLower.includes('gaming') || descLower.includes('esports') || descLower.includes('technology') ||
      descLower.includes('digital') || descLower.includes('smartphone') || descLower.includes('5g')) {
    tags.push('VFX');
  }
  
  // Character Animation category (people, celebrities, stories, narratives)
  if (titleLower.includes('deddy') || titleLower.includes('chelsea') || titleLower.includes('mikha') ||
      titleLower.includes('celebrity') || titleLower.includes('timnas') || titleLower.includes('un1ty') ||
      descLower.includes('celebrity') || descLower.includes('endorsement') || descLower.includes('character') ||
      descLower.includes('storytelling') || descLower.includes('narrative') || descLower.includes('collaboration')) {
    tags.push('Character Animation');
  }
  
  return tags.length > 0 ? tags : ['VFX']; // Default to VFX if no specific category
};

const PROJECTS: Project[] = [
  {
    id: '2',
    title: 'Caplang',
    description: 'Creative advertising campaign with dynamic visual storytelling and engaging brand narrative.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/os941LA67aE'),
    tags: ['VFX'],
    year: 2025,
    client: 'Lieve, Masterpiece',
    primaryVideoUrl: 'https://youtu.be/os941LA67aE',
    allVideos: ['https://youtu.be/os941LA67aE', 'https://youtu.be/GTk5W7jzSc0'],
    deliveryFiles: []
  },
  {
    id: '5',
    title: 'Wuling',
    description: 'Automotive brand showcase featuring innovative design and modern mobility solutions.',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    tags: ['VFX'],
    year: 2025,
    client: 'Above Space',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1Ytd-GYd56XpusWyvyNwz0m67dcD4ya-t/view?usp=drive_link']
  },
  {
    id: '7',
    title: 'Paddle Pop',
    description: 'Ice cream brand campaign with playful animations and joyful family moments.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/1WAHm5SAbug'),
    tags: ['Liquid'],
    year: 2025,
    client: 'Leomotions',
    primaryVideoUrl: 'https://youtu.be/1WAHm5SAbug',
    allVideos: ['https://youtu.be/1WAHm5SAbug'],
    deliveryFiles: []
  },
  {
    id: '8',
    title: 'Ultima II x Mikha Tambayong',
    description: 'Beauty brand collaboration featuring celebrity endorsement and premium cosmetics showcase.',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    tags: ['Beauty', 'Character Animation'],
    year: 2025,
    client: 'Lieve',
    primaryVideoUrl: 'https://drive.google.com/file/d/1T6iYkJ0Dz2BqmRttbT70PfSzJvVD8Svi/view?usp=sharing',
    allVideos: ['https://drive.google.com/file/d/1T6iYkJ0Dz2BqmRttbT70PfSzJvVD8Svi/view?usp=sharing', 'https://drive.google.com/file/d/1NC2q-dPpiYqq0mzgLj8N77WoggXIIiEJ/view?usp=drive_link', 'https://drive.google.com/file/d/1-Z0eNWi9yRd_AVGgaE7coqpDHId46b5F/view?usp=drive_link'],
    deliveryFiles: ['https://drive.google.com/file/d/1T6iYkJ0Dz2BqmRttbT70PfSzJvVD8Svi/view?usp=sharing', 'https://drive.google.com/file/d/1NC2q-dPpiYqq0mzgLj8N77WoggXIIiEJ/view?usp=drive_link', 'https://drive.google.com/file/d/1-Z0eNWi9yRd_AVGgaE7coqpDHId46b5F/view?usp=drive_link']
  },
  {
    id: '9',
    title: 'Bibit x Deddy Corbuzier',
    description: 'Investment platform campaign featuring influencer collaboration and financial education.',
    thumbnail: bibitDeddyCorbuZierThumb,
    tags: ['Character Animation'],
    year: 2024,
    client: 'Adi Victory',
    primaryVideoUrl: 'https://youtube.com/shorts/mFd3rPt-R-U',
    allVideos: ['https://youtube.com/shorts/mFd3rPt-R-U'],
    deliveryFiles: []
  },
  {
    id: '10',
    title: 'Miranda',
    description: 'Beverage brand campaign showcasing refreshing moments and lifestyle integration.',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    tags: ['Liquid'],
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '13',
    title: 'Patigon Spirit',
    description: 'Gaming-inspired content with dynamic action sequences and competitive spirit.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/P-gxYwF0r0w'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/P-gxYwF0r0w',
    allVideos: ['https://youtu.be/P-gxYwF0r0w'],
    deliveryFiles: []
  },
  {
    id: '14',
    title: 'J&T Express',
    description: 'Logistics company campaign showcasing delivery excellence and customer satisfaction.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/rzXekAUlEvI'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/rzXekAUlEvI',
    allVideos: ['https://youtu.be/rzXekAUlEvI'],
    deliveryFiles: []
  },
  {
    id: '15',
    title: 'Vuse',
    description: 'Premium tobacco brand campaign with sophisticated visual aesthetics.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/5YbuwyzvdEo'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/5YbuwyzvdEo',
    allVideos: ['https://youtu.be/5YbuwyzvdEo'],
    deliveryFiles: []
  },
  {
    id: '16',
    title: 'Lucky Strike',
    description: 'Iconic tobacco brand campaign with bold visual identity and premium positioning.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/VOoKutKEQWE'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/VOoKutKEQWE',
    allVideos: ['https://youtu.be/VOoKutKEQWE'],
    deliveryFiles: []
  },
  {
    id: '17',
    title: 'Tomoro Coffee Cloud Series',
    description: 'Premium coffee brand campaign featuring artisanal brewing and lifestyle moments.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/EvFb7pJa8e0'),
    tags: ['Liquid'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/EvFb7pJa8e0',
    allVideos: ['https://youtu.be/EvFb7pJa8e0'],
    deliveryFiles: []
  },
  {
    id: '18',
    title: 'Valorant VCT Ascension Pacific',
    description: 'Esports tournament campaign with high-energy gaming visuals and competitive atmosphere.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/OT4MzLnsx1o'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/OT4MzLnsx1o',
    allVideos: ['https://youtu.be/OT4MzLnsx1o'],
    deliveryFiles: []
  },
  {
    id: '19',
    title: 'J&T Express 9th Anniversary',
    description: 'Anniversary celebration campaign highlighting company milestones and future vision.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/x4H45vuo-4Y'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/x4H45vuo-4Y',
    allVideos: ['https://youtu.be/x4H45vuo-4Y'],
    deliveryFiles: []
  },
  {
    id: '20',
    title: 'Hemaviton Action Range',
    description: 'Health supplement campaign focusing on energy, vitality, and active lifestyle.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/L8ZT3BxSN8s'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/L8ZT3BxSN8s',
    allVideos: ['https://youtu.be/L8ZT3BxSN8s'],
    deliveryFiles: []
  },
  {
    id: '21',
    title: 'Skintific',
    description: 'Skincare brand campaign emphasizing scientific innovation and dermatological excellence.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/QD_VqP3lSdk'),
    tags: ['Beauty'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/QD_VqP3lSdk',
    allVideos: ['https://youtu.be/QD_VqP3lSdk'],
    deliveryFiles: []
  },
  {
    id: '22',
    title: 'Mobile Legends All Star',
    description: 'Gaming tournament showcase with spectacular esports action and competitive highlights.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/239w3mLbR78'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/239w3mLbR78',
    allVideos: ['https://youtu.be/239w3mLbR78'],
    deliveryFiles: []
  },
  {
    id: '23',
    title: 'Siloam Hospital',
    description: 'Healthcare institution campaign highlighting medical excellence and patient care.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/Mbo_WDsfYeE'),
    tags: ['VFX'],
    year: 2024,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/Mbo_WDsfYeE',
    allVideos: ['https://youtu.be/Mbo_WDsfYeE'],
    deliveryFiles: []
  },
  {
    id: '24',
    title: 'Skinmology',
    description: 'Advanced skincare brand focusing on dermatological science and beauty innovation.',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    tags: ['Beauty'],
    year: 2024,
    client: 'Felivia Devanie',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: ['https://drive.google.com/file/d/1tkwHrZv4tpUZXCRrNF1u_q4sMnirTizn/view?usp=drive_link']
  },
  {
    id: '25',
    title: 'Garuda Miles',
    description: 'Airline loyalty program campaign showcasing travel benefits and premium experiences.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/-7_nktP0pG4'),
    tags: ['VFX'],
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: 'https://youtu.be/-7_nktP0pG4',
    allVideos: ['https://youtu.be/-7_nktP0pG4'],
    deliveryFiles: ['https://drive.google.com/file/d/1VTG1lyTN5GQiqnED_aTyBHKXdus0uLxY/view?usp=drive_link']
  },
  {
    id: '26',
    title: 'Ultima II Brand Manifesto',
    description: 'Premium beauty brand manifesto showcasing luxury cosmetics and brand philosophy.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/fe_LzsL1x-I'),
    tags: ['Beauty'],
    year: 2024,
    client: 'Winaya Studio',
    primaryVideoUrl: 'https://youtu.be/fe_LzsL1x-I',
    allVideos: ['https://youtu.be/fe_LzsL1x-I'],
    deliveryFiles: ['https://drive.google.com/file/d/1ppBs7EG7Ung0E-nerqY-hM6_W99V1ajr/view?usp=drive_link']
  },
  {
    id: '27',
    title: 'Natur-E',
    description: 'Natural vitamin E supplement campaign emphasizing health and natural wellness.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/VWRsTt-DQj4'),
    tags: ['VFX'],
    year: 2024,
    client: 'Winaya Studio',
    primaryVideoUrl: 'https://youtu.be/VWRsTt-DQj4',
    allVideos: ['https://youtu.be/VWRsTt-DQj4'],
    deliveryFiles: ['https://drive.google.com/file/d/1wOl8lxIsuEtwsIc-suGHwhjl3Q-GPKYD/view?usp=drive_link']
  },
  {
    id: '28',
    title: 'RWS Casino',
    description: 'Gaming and entertainment venue campaign with luxurious casino atmosphere.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/oMSz56zS2uk'),
    tags: ['VFX'],
    year: 2024,
    client: 'hiremistress',
    primaryVideoUrl: 'https://youtu.be/oMSz56zS2uk',
    allVideos: ['https://youtu.be/oMSz56zS2uk', 'https://youtu.be/7eDrA8IrLeA'],
    deliveryFiles: ['https://youtu.be/oMSz56zS2uk', 'https://youtu.be/7eDrA8IrLeA']
  },
  {
    id: '29',
    title: 'BBL x Chelsea Islan',
    description: 'Banking service campaign featuring celebrity endorsement and financial solutions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/x7gmGrbucIU'),
    tags: ['Character Animation'],
    year: 2024,
    client: 'Lieve',
    primaryVideoUrl: 'https://youtu.be/x7gmGrbucIU',
    allVideos: ['https://youtu.be/x7gmGrbucIU', 'https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc'],
    deliveryFiles: ['https://youtu.be/x7gmGrbucIU', 'https://youtu.be/jiAVzjXO4Uw', 'https://youtu.be/Fq8lmuzh5e0', 'https://youtu.be/GkTJquLGTzc']
  },
  {
    id: '30',
    title: 'Procold',
    description: 'Cold medicine brand campaign focusing on relief, recovery, and wellness.',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    tags: ['VFX'],
    year: 2024,
    client: 'Maika',
    primaryVideoUrl: '',
    allVideos: [],
    deliveryFiles: []
  },
  {
    id: '31',
    title: 'Indomilk x Timnas',
    description: 'Dairy brand collaboration with national football team showcasing sports nutrition.',
    thumbnail: getYouTubeThumbnail('https://youtube.com/shorts/GMeCmOyHu1g'),
    tags: ['Liquid', 'Character Animation'],
    year: 2023,
    client: 'United Creative',
    primaryVideoUrl: 'https://youtube.com/shorts/GMeCmOyHu1g',
    allVideos: ['https://youtube.com/shorts/GMeCmOyHu1g'],
    deliveryFiles: []
  },
  {
    id: '32',
    title: 'BCA Sekali Jalan',
    description: 'Banking service campaign highlighting convenience and seamless transactions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/vYOt2WfiZpM'),
    tags: ['VFX'],
    year: 2023,
    client: 'Cuatrodia',
    primaryVideoUrl: 'https://youtu.be/vYOt2WfiZpM',
    allVideos: ['https://youtu.be/vYOt2WfiZpM'],
    deliveryFiles: []
  },
  {
    id: '33',
    title: 'Siladex Flu',
    description: 'Flu medicine campaign emphasizing fast relief and effective treatment.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/McrguiqkgcI'),
    tags: ['VFX'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/McrguiqkgcI',
    allVideos: ['https://youtu.be/McrguiqkgcI'],
    deliveryFiles: []
  },
  {
    id: '34',
    title: 'Himalaya',
    description: 'Natural healthcare brand showcasing herbal wellness and traditional medicine.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/HK6d6EbWPVE'),
    tags: ['VFX'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/HK6d6EbWPVE',
    allVideos: ['https://youtu.be/HK6d6EbWPVE'],
    deliveryFiles: []
  },
  {
    id: '35',
    title: 'Kopi Kenangan Matcha',
    description: 'Coffee brand expansion featuring matcha variants and premium beverage experience.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/ZyRs2eIR4Mo'),
    tags: ['Liquid'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/ZyRs2eIR4Mo',
    allVideos: ['https://youtu.be/ZyRs2eIR4Mo'],
    deliveryFiles: []
  },
  {
    id: '36',
    title: 'Flimty x Deddy Corbuzier',
    description: 'Health supplement campaign featuring celebrity endorsement and wellness messaging.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/HbaDfSrCBp4'),
    tags: ['Character Animation'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/HbaDfSrCBp4',
    allVideos: ['https://youtu.be/HbaDfSrCBp4'],
    deliveryFiles: []
  },
  {
    id: '37',
    title: 'Tri Happy Flex',
    description: 'Telecommunications campaign showcasing flexible mobile plans and connectivity.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/3m5YkPtVX0Y'),
    tags: ['VFX'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/3m5YkPtVX0Y',
    allVideos: ['https://youtu.be/3m5YkPtVX0Y'],
    deliveryFiles: []
  },
  {
    id: '38',
    title: 'Kelaya Hair Treatment',
    description: 'Hair care brand campaign emphasizing natural treatment and hair health.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/rJlOEydZCtA'),
    tags: ['Beauty'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/rJlOEydZCtA',
    allVideos: ['https://youtu.be/rJlOEydZCtA'],
    deliveryFiles: []
  },
  {
    id: '39',
    title: 'Kopi Kenangan Harmanas U DA BEST',
    description: 'Coffee brand campaign with upbeat messaging and community celebration.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/0dWh5aY-TvI'),
    tags: ['Liquid'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/0dWh5aY-TvI',
    allVideos: ['https://youtu.be/0dWh5aY-TvI'],
    deliveryFiles: []
  },
  {
    id: '40',
    title: 'Wardah Matte Lip Cream',
    description: 'Beauty brand campaign showcasing matte lip products with vibrant colors.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/U4APmP1Y-g0'),
    tags: ['Beauty'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/U4APmP1Y-g0',
    allVideos: ['https://youtu.be/U4APmP1Y-g0'],
    deliveryFiles: []
  },
  {
    id: '41',
    title: 'Tomoro Coffee',
    description: 'Premium coffee brand campaign featuring artisanal brewing and quality beans.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/spYNxPKgum8'),
    tags: ['Liquid'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/spYNxPKgum8',
    allVideos: ['https://youtu.be/spYNxPKgum8'],
    deliveryFiles: []
  },
  {
    id: '42',
    title: 'Anakonidin',
    description: 'Cold medicine campaign targeting families with effective relief solutions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/FCJNiSnXYRU'),
    tags: ['VFX'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/FCJNiSnXYRU',
    allVideos: ['https://youtu.be/FCJNiSnXYRU'],
    deliveryFiles: []
  },
  {
    id: '43',
    title: 'Lazada Ramadan',
    description: 'E-commerce platform campaign celebrating Ramadan with special promotions.',
    thumbnail: lazadaRamadanThumb,
    tags: ['VFX'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/kLqeoHgZU0o',
    allVideos: ['https://youtu.be/kLqeoHgZU0o'],
    deliveryFiles: []
  },
  {
    id: '44',
    title: 'Kopi Kenangan Hanya Untukmu',
    description: 'Coffee brand romantic campaign with emotional storytelling and premium positioning.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/K-iAQj4PPjY'),
    tags: ['Liquid'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/K-iAQj4PPjY',
    allVideos: ['https://youtu.be/K-iAQj4PPjY'],
    deliveryFiles: []
  },
  {
    id: '45',
    title: 'ABC Kopi Susu Gula Aren',
    description: 'Traditional coffee brand featuring palm sugar variant and authentic flavors.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/acFS4uJh2F4'),
    tags: ['Liquid'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/acFS4uJh2F4',
    allVideos: ['https://youtu.be/acFS4uJh2F4'],
    deliveryFiles: []
  },
  {
    id: '46',
    title: 'Mandiri Livin x Un1ty',
    description: 'Banking service collaboration with esports team showcasing digital innovation.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/WtgzmsI8mjY'),
    tags: ['Character Animation'],
    year: 2023,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/WtgzmsI8mjY',
    allVideos: ['https://youtu.be/WtgzmsI8mjY'],
    deliveryFiles: []
  },
  {
    id: '47',
    title: 'Active Water',
    description: 'Mineral water brand campaign emphasizing hydration and active lifestyle.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/3bzKy6rB0Ho'),
    tags: ['Liquid'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/3bzKy6rB0Ho',
    allVideos: ['https://youtu.be/3bzKy6rB0Ho'],
    deliveryFiles: []
  },
  {
    id: '48',
    title: 'Mobile Legends M4',
    description: 'Mobile gaming championship campaign with high-energy esports content.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/7tCSKIO1Qkc'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/7tCSKIO1Qkc',
    allVideos: ['https://youtu.be/7tCSKIO1Qkc'],
    deliveryFiles: []
  },
  {
    id: '49',
    title: 'Permata Mobile X',
    description: 'Banking application campaign showcasing mobile banking convenience and security.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/cbZtI3EIVDc'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/cbZtI3EIVDc',
    allVideos: ['https://youtu.be/cbZtI3EIVDc'],
    deliveryFiles: []
  },
  {
    id: '50',
    title: 'Rejoice 3in1',
    description: 'Hair care brand campaign featuring multi-benefit shampoo with comprehensive care.',
    thumbnail: rejoice3in1Thumb,
    tags: ['Beauty'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/Xr8Ov-AnYcI',
    allVideos: ['https://youtu.be/Xr8Ov-AnYcI'],
    deliveryFiles: []
  },
  {
    id: '51',
    title: 'Mobile Legends 515 M-World',
    description: 'Gaming festival campaign celebrating Mobile Legends anniversary with global excitement.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/tGuKYNwy0Q4'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/tGuKYNwy0Q4',
    allVideos: ['https://youtu.be/tGuKYNwy0Q4'],
    deliveryFiles: []
  },
  {
    id: '52',
    title: 'Vivo 23 Series',
    description: 'Smartphone brand campaign showcasing new device features and photography capabilities.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/lZxkFm66aNE'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/lZxkFm66aNE',
    allVideos: ['https://youtu.be/lZxkFm66aNE'],
    deliveryFiles: []
  },
  {
    id: '53',
    title: 'Bali United Rewind',
    description: 'Football club campaign highlighting team achievements and fan dedication.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/h-5XO6HVvO8'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/h-5XO6HVvO8',
    allVideos: ['https://youtu.be/h-5XO6HVvO8'],
    deliveryFiles: []
  },
  {
    id: '54',
    title: 'BigBabol Sploosh',
    description: 'Bubble gum brand campaign with playful animations and fun messaging.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/Fu81dpokZ14'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/Fu81dpokZ14',
    allVideos: ['https://youtu.be/Fu81dpokZ14'],
    deliveryFiles: []
  },
  {
    id: '55',
    title: 'Softex Natural Cool',
    description: 'Feminine care brand campaign emphasizing comfort and natural protection.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/_waEQ2X7m34'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/_waEQ2X7m34',
    allVideos: ['https://youtu.be/_waEQ2X7m34'],
    deliveryFiles: []
  },
  {
    id: '56',
    title: 'OPPO A95',
    description: 'Smartphone brand campaign highlighting device performance and design aesthetics.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/9fK9OX6WW1k'),
    tags: ['VFX'],
    year: 2022,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/9fK9OX6WW1k',
    allVideos: ['https://youtu.be/9fK9OX6WW1k'],
    deliveryFiles: []
  },
  {
    id: '57',
    title: 'Lazada x JFW 2021',
    description: 'E-commerce platform collaboration with Jakarta Fashion Week showcasing style and trends.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/z6ZCKRqdh_M'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/z6ZCKRqdh_M',
    allVideos: ['https://youtu.be/z6ZCKRqdh_M'],
    deliveryFiles: []
  },
  {
    id: '58',
    title: 'FIBE MINI',
    description: 'Telecommunications brand campaign featuring compact internet solutions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/Tk9z8DDCCvw'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/Tk9z8DDCCvw',
    allVideos: ['https://youtu.be/Tk9z8DDCCvw'],
    deliveryFiles: []
  },
  {
    id: '59',
    title: 'J&T 100 Juta Pelanggan',
    description: 'Logistics company milestone celebration reaching 100 million customers.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/HEcn-7qUF38'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/HEcn-7qUF38',
    allVideos: ['https://youtu.be/HEcn-7qUF38'],
    deliveryFiles: []
  },
  {
    id: '60',
    title: 'The World of Realfood',
    description: 'Food brand campaign showcasing authentic flavors and quality ingredients.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/8ZnkKQ_qSVs'),
    tags: ['Liquid'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/8ZnkKQ_qSVs',
    allVideos: ['https://youtu.be/8ZnkKQ_qSVs'],
    deliveryFiles: []
  },
  {
    id: '61',
    title: 'OPPO Encobuds',
    description: 'Audio accessories campaign highlighting wireless earbuds technology and sound quality.',
    thumbnail: oppoEncobudsThumb,
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/T6Tn_nkdGoA',
    allVideos: ['https://youtu.be/T6Tn_nkdGoA'],
    deliveryFiles: []
  },
  {
    id: '62',
    title: 'J&T Super',
    description: 'Logistics service premium offering showcasing enhanced delivery solutions.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/GnvMlHJbq3o'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/GnvMlHJbq3o',
    allVideos: ['https://youtu.be/GnvMlHJbq3o'],
    deliveryFiles: []
  },
  {
    id: '63',
    title: 'Mobile Legends 5th Anniversary',
    description: 'Gaming milestone celebration marking five years of Mobile Legends success.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/z3M6UjXvrCI'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/z3M6UjXvrCI',
    allVideos: ['https://youtu.be/z3M6UjXvrCI'],
    deliveryFiles: []
  },
  {
    id: '64',
    title: 'OPPO Reno 6 x PUBG',
    description: 'Smartphone gaming collaboration showcasing device performance in mobile gaming.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/SVB2ns7rTf8'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/SVB2ns7rTf8',
    allVideos: ['https://youtu.be/SVB2ns7rTf8'],
    deliveryFiles: []
  },
  {
    id: '65',
    title: 'Realfood UP',
    description: 'Food brand campaign highlighting nutritional benefits and energy boosting properties.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/kN3L3MXCML0'),
    tags: ['Liquid'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/kN3L3MXCML0',
    allVideos: ['https://youtu.be/kN3L3MXCML0'],
    deliveryFiles: []
  },
  {
    id: '66',
    title: 'Telkomsel 5G',
    description: 'Telecommunications 5G network launch campaign showcasing next-generation connectivity.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/wp0NKJ2acag'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/wp0NKJ2acag',
    allVideos: ['https://youtu.be/wp0NKJ2acag'],
    deliveryFiles: []
  },
  {
    id: '67',
    title: 'Hemaviton Neuro Forte',
    description: 'Brain health supplement campaign focusing on cognitive enhancement and mental clarity.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/u8kQbaUx2yY'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/u8kQbaUx2yY',
    allVideos: ['https://youtu.be/u8kQbaUx2yY'],
    deliveryFiles: []
  },
  {
    id: '68',
    title: 'BNI Mobile Banking',
    description: 'Banking application campaign highlighting digital banking convenience and security features.',
    thumbnail: bniMobileBankingThumb,
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/kceDIvOJahw',
    allVideos: ['https://youtu.be/kceDIvOJahw'],
    deliveryFiles: []
  },
  {
    id: '69',
    title: 'KulKul World',
    description: 'Travel and lifestyle platform campaign showcasing cultural experiences and destinations.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/-5IlW21DcwI'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/-5IlW21DcwI',
    allVideos: ['https://youtu.be/-5IlW21DcwI'],
    deliveryFiles: []
  },
  {
    id: '70',
    title: 'OPPO Reno 5 5G - Car',
    description: 'Smartphone campaign featuring automotive-themed visuals and 5G connectivity.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/-PrXQeot2lc'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/-PrXQeot2lc',
    allVideos: ['https://youtu.be/-PrXQeot2lc'],
    deliveryFiles: []
  },
  {
    id: '71',
    title: 'Klop Saluto Coklat',
    description: 'Chocolate snack brand campaign with indulgent flavors and satisfying moments.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/CEF7_ECg_e0'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/CEF7_ECg_e0',
    allVideos: ['https://youtu.be/CEF7_ECg_e0'],
    deliveryFiles: []
  },
  {
    id: '72',
    title: 'Wyeth S26',
    description: 'Baby formula brand campaign emphasizing nutrition and infant development.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/PrD4Py1SBKI'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/PrD4Py1SBKI',
    allVideos: ['https://youtu.be/PrD4Py1SBKI'],
    deliveryFiles: []
  },
  {
    id: '73',
    title: 'Chitato Maxx',
    description: 'Snack brand campaign featuring bold flavors and maximum satisfaction.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/UQrdaDwY_CU'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/UQrdaDwY_CU',
    allVideos: ['https://youtu.be/UQrdaDwY_CU'],
    deliveryFiles: []
  },
  {
    id: '74',
    title: 'Smartfren - Unlimited Daebak',
    description: 'Telecommunications unlimited data campaign with K-pop inspired messaging.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/M6bXLDcbjYU'),
    tags: ['VFX'],
    year: 2021,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/M6bXLDcbjYU',
    allVideos: ['https://youtu.be/M6bXLDcbjYU'],
    deliveryFiles: []
  },
  {
    id: '75',
    title: 'XL Axiata 4.5G',
    description: 'Telecommunications advanced network campaign showcasing enhanced connectivity speeds.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/_aese95_hpw'),
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/_aese95_hpw',
    allVideos: ['https://youtu.be/_aese95_hpw'],
    deliveryFiles: []
  },
  {
    id: '76',
    title: 'OPPO Reno 4 F - Beatbox',
    description: 'Smartphone campaign featuring music and beatboxing with device audio capabilities.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/3xj7R7AHAjU'),
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/3xj7R7AHAjU',
    allVideos: ['https://youtu.be/3xj7R7AHAjU'],
    deliveryFiles: []
  },
  {
    id: '77',
    title: 'OPPO Reno 4 F - Basketball',
    description: 'Smartphone campaign with basketball theme showcasing device durability and performance.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/WU-zGbk1EyY'),
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/WU-zGbk1EyY',
    allVideos: ['https://youtu.be/WU-zGbk1EyY'],
    deliveryFiles: []
  },
  {
    id: '78',
    title: 'Pertamina HUT RI',
    description: 'National oil company Indonesian Independence Day celebration campaign.',
    thumbnail: pertaminaHutRiThumb,
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/eyDJdfAkPWc',
    allVideos: ['https://youtu.be/eyDJdfAkPWc'],
    deliveryFiles: []
  },
  {
    id: '79',
    title: 'Free Fire x Money Heist',
    description: 'Gaming collaboration with popular Netflix series featuring themed content.',
    thumbnail: getYouTubeThumbnail('https://youtu.be/ffKrFeehdu0'),
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/ffKrFeehdu0',
    allVideos: ['https://youtu.be/ffKrFeehdu0'],
    deliveryFiles: []
  },
  {
    id: '80',
    title: 'J&T Gapai Mimpimu',
    description: 'Logistics company inspirational campaign about achieving dreams and aspirations.',
    thumbnail: jntGapaiMimpimUThumb,
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/N5vH8q4bEho',
    allVideos: ['https://youtu.be/N5vH8q4bEho'],
    deliveryFiles: []
  },
  {
    id: '81',
    title: 'OPPO Reno 4 Selective',
    description: 'Smartphone campaign highlighting selective focus photography features.',
    thumbnail: oppoReno4SelectiveThumb,
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/jcqoo26CtDM',
    allVideos: ['https://youtu.be/jcqoo26CtDM'],
    deliveryFiles: []
  },
  {
    id: '82',
    title: 'OPPO Reno 4 Blue',
    description: 'Smartphone campaign showcasing device design in elegant blue colorway.',
    thumbnail: oppoReno4BlueThumb,
    tags: ['VFX'],
    year: 2020,
    client: 'Milkyway Studio',
    primaryVideoUrl: 'https://youtu.be/v4JXEizyTok',
    allVideos: ['https://youtu.be/v4JXEizyTok'],
    deliveryFiles: []
  }
];

const TAG_OPTIONS = ['Beauty', 'Liquid', 'VFX', 'Character Animation'];
const YEAR_OPTIONS = [2025, 2024, 2023, 2022, 2021, 2020];

export const ProjectsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => project.tags.includes(tag));
    
    const matchesYear = selectedYear === null || project.year === selectedYear;
    
    return matchesSearch && matchesTags && matchesYear;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedYear(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Our Projects</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Explore our portfolio of creative campaigns, visual effects, and brand storytelling across different industries.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 bg-white/5"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4">
            {/* Tag Filters */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year
              </h3>
              <div className="flex flex-wrap gap-2">
                {YEAR_OPTIONS.map(year => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedYear === year
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  >
                    {year}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedTags.length > 0 || selectedYear !== null || searchTerm) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-white/70 text-sm">
        Showing {filteredProjects.length} of {PROJECTS.length} projects
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video bg-gray-800 overflow-hidden">
              <img
                src={project.thumbnail || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400';
                }}
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                  {project.year}
                </span>
              </div>
              <p className="text-sm text-white/70 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Users className="w-3 h-3" />
                <span className="line-clamp-1">{project.client}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white/80 hover:bg-white/20">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                    +{project.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60">No projects found matching your criteria.</p>
          <Button
            onClick={clearFilters}
            variant="ghost"
            className="mt-4 text-white hover:bg-white/10"
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
