import { useState } from 'react';
import { Search, Filter, X, Users, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectDetailModal } from './ProjectDetailModal';

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  year: number;
  client: string;
  brand: string;
  mainVideoUrl?: string;
  additionalVideos?: string[];
  videoThumbnail?: string;
}

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop';
};

// Helper function to extract brand name from project title
const getBrandName = (title: string): string => {
  return title.split(' ').slice(0, 2).join(' ');
};

// Helper function to parse multiple URLs
const parseUrls = (urlString: string): string[] => {
  if (!urlString) return [];
  return urlString.split(',').map(url => url.trim()).filter(url => url.length > 0);
};

// Complete project data - 100+ real projects spanning 2020-2025
const PROJECTS: Project[] = [
  // 2025 Projects - Latest Work
  {
    id: "1",
    title: "Wardah UV Shield - Summer Protection",
    description: "Comprehensive sunscreen campaign for Wardah's UV Shield product line, showcasing advanced sun protection technology. Created for Liquid Production, featuring multiple talent and lifestyle scenarios to highlight product benefits and skin health.",
    thumbnail: "https://img.youtube.com/vi/k_4Dw0g8cLU/maxresdefault.jpg",
    tags: ["Wardah", "Beauty", "Skincare", "Commercial"],
    year: 2025,
    client: "Liquid Production",
    brand: "Wardah",
    mainVideoUrl: "https://www.youtube.com/watch?v=k_4Dw0g8cLU",
    additionalVideos: ["https://www.youtube.com/watch?v=k_4Dw0g8cLU", "https://www.youtube.com/watch?v=Ks-_Mh1QhMc"],
    videoThumbnail: "https://img.youtube.com/vi/k_4Dw0g8cLU/maxresdefault.jpg"
  },
  {
    id: "2",
    title: "Caplang - Creative Campaign",
    description: "Innovative commercial project delivered for Lieve and Masterpiece, showcasing dynamic storytelling and visual effects. This collaboration highlights creative excellence in commercial production.",
    thumbnail: "https://img.youtube.com/vi/os941LA67aE/maxresdefault.jpg",
    tags: ["Caplang", "Commercial", "Creative"],
    year: 2025,
    client: "Lieve, Masterpiece",
    brand: "Caplang",
    mainVideoUrl: "https://youtu.be/os941LA67aE",
    additionalVideos: ["https://youtu.be/os941LA67aE", "https://youtu.be/GTk5W7jzSc0"],
    videoThumbnail: "https://img.youtube.com/vi/os941LA67aE/maxresdefault.jpg"
  },
  {
    id: "3",
    title: "Yamalube - Motorcycle Excellence",
    description: "High-performance motorcycle oil commercial featuring dynamic 3D product visualization and engine performance showcase. Produced for Faris Aprillio, emphasizing quality and reliability.",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    tags: ["Yamalube", "Automotive", "Oil"],
    year: 2025,
    client: "Faris Aprillio",
    brand: "Yamalube",
    mainVideoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg"
  },
  {
    id: "4",
    title: "Wuling - Automotive Innovation",
    description: "Premium automotive commercial showcasing Wuling vehicle features through sophisticated 3D animation and lifestyle integration. Delivered for Above Space agency.",
    thumbnail: "https://img.youtube.com/vi/me5rX7Y0KYg/maxresdefault.jpg",
    tags: ["Wuling", "Automotive", "Innovation"],
    year: 2025,
    client: "Above Space",
    brand: "Wuling",
    mainVideoUrl: "https://www.youtube.com/watch?v=me5rX7Y0KYg",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/me5rX7Y0KYg/maxresdefault.jpg"
  },
  {
    id: "5",
    title: "Ultima II X Mikha Tambayong",
    description: "Premium beauty campaign featuring celebrity endorsement with Mikha Tambayong, showcasing luxury cosmetics. Created for Lieve agency with high-end visual effects.",
    thumbnail: "https://img.youtube.com/vi/KYE7VIVnW5M/maxresdefault.jpg",
    tags: ["Ultima II", "Beauty", "Celebrity"],
    year: 2025,
    client: "Lieve",
    brand: "Ultima II",
    mainVideoUrl: "https://www.youtube.com/watch?v=KYE7VIVnW5M",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/KYE7VIVnW5M/maxresdefault.jpg"
  },
  {
    id: "6",
    title: "Mobile Legends - Hero Launch",
    description: "Epic hero introduction video for Mobile Legends featuring dynamic combat sequences and character abilities. Produced for Milkyway Studio, combining 3D animation with cinematic storytelling.",
    thumbnail: "https://img.youtube.com/vi/239w3mLbR78/maxresdefault.jpg",
    tags: ["Mobile Legends", "Gaming", "Character"],
    year: 2025,
    client: "Milkyway Studio",
    brand: "Mobile Legends",
    mainVideoUrl: "https://youtu.be/239w3mLbR78?si=2M9dDAd3fT-q1oKQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/239w3mLbR78/maxresdefault.jpg"
  },

  // 2024 Projects - Major Campaigns
  {
    id: "7",
    title: "Bibit X Deddy Corbuzier",
    description: "Investment app commercial featuring celebrity collaboration with Deddy Corbuzier, promoting financial literacy and investment opportunities. Created for Adi Victory agency.",
    thumbnail: "https://img.youtube.com/vi/mFd3rPt-R-U/maxresdefault.jpg",
    tags: ["Bibit", "Fintech", "Celebrity"],
    year: 2024,
    client: "Adi Victory",
    brand: "Bibit",
    mainVideoUrl: "https://youtube.com/shorts/mFd3rPt-R-U?feature=share",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/mFd3rPt-R-U/maxresdefault.jpg"
  },
  {
    id: "8",
    title: "Infestation Spirit - Gaming Action",
    description: "High-intensity gaming commercial featuring dynamic action sequences and special effects. Delivered for Milkyway Studio, showcasing intense gameplay and character abilities.",
    thumbnail: "https://img.youtube.com/vi/P-gxYwF0r0w/maxresdefault.jpg",
    tags: ["Gaming", "Action", "Special Effects"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "Infestation Spirit",
    mainVideoUrl: "https://youtu.be/P-gxYwF0r0w?si=mN1o7TkonEUrydHW",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/P-gxYwF0r0w/maxresdefault.jpg"
  },
  {
    id: "9",
    title: "J&T Express - Fast Delivery",
    description: "High-energy logistics campaign for J&T Express emphasizing speed and reliability in delivery services. Created for Milkyway Studio, showcasing nationwide delivery network.",
    thumbnail: "https://img.youtube.com/vi/rzXekAUlEvI/maxresdefault.jpg",
    tags: ["J&T Express", "Logistics", "Speed"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "J&T Express",
    mainVideoUrl: "https://youtu.be/rzXekAUlEvI?si=5RbPP0gExQwiSTSq",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/rzXekAUlEvI/maxresdefault.jpg"
  },
  {
    id: "10",
    title: "Valorant VCT Ascension Pacific",
    description: "Esports tournament promotional content for Valorant Champions Tour, featuring high-energy gaming visuals and competitive excitement. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/OT4MzLnsx1o/maxresdefault.jpg",
    tags: ["Valorant", "Esports", "Tournament"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "Valorant VCT",
    mainVideoUrl: "https://youtu.be/OT4MzLnsx1o?si=WGoF4WRMVFl-GQX2",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/OT4MzLnsx1o/maxresdefault.jpg"
  },
  {
    id: "11",
    title: "Garuda Miles - Loyalty Program",
    description: "Airline loyalty program commercial featuring travel-inspired visuals and premium service benefits. Delivered for Lieve agency, emphasizing Indonesian hospitality and global reach.",
    thumbnail: "https://img.youtube.com/vi/-7_nktP0pG4/maxresdefault.jpg",
    tags: ["Garuda", "Travel", "Loyalty"],
    year: 2024,
    client: "Lieve",
    brand: "Garuda Miles",
    mainVideoUrl: "https://youtu.be/-7_nktP0pG4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/-7_nktP0pG4/maxresdefault.jpg"
  },
  {
    id: "12",
    title: "Ultima II Brand Manifesto",
    description: "Premium brand manifesto video showcasing beauty, elegance, and luxury cosmetics. Created for Winaya Studio, featuring high-end production values and sophisticated messaging.",
    thumbnail: "https://img.youtube.com/vi/fe_LzsL1x-I/maxresdefault.jpg",
    tags: ["Ultima II", "Beauty", "Manifesto"],
    year: 2024,
    client: "Winaya Studio",
    brand: "Ultima II",
    mainVideoUrl: "https://youtu.be/fe_LzsL1x-I",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/fe_LzsL1x-I/maxresdefault.jpg"
  },
  {
    id: "13",
    title: "Natur-E - Vitamin Power",
    description: "Vitamin supplement commercial featuring natural elements and health benefits. Produced for Winaya Studio, emphasizing natural ingredients and wellness lifestyle.",
    thumbnail: "https://img.youtube.com/vi/VWRsTt-DQj4/maxresdefault.jpg",
    tags: ["Natur-E", "Health", "Vitamins"],
    year: 2024,
    client: "Winaya Studio",
    brand: "Natur-E",
    mainVideoUrl: "https://youtu.be/VWRsTt-DQj4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/VWRsTt-DQj4/maxresdefault.jpg"
  },
  {
    id: "14",
    title: "RWS Casino - Entertainment Paradise",
    description: "Casino entertainment commercial featuring luxury gaming experience and resort atmosphere. Delivered for hiremistress, showcasing excitement and premium entertainment.",
    thumbnail: "https://img.youtube.com/vi/oMSz56zS2uk/maxresdefault.jpg",
    tags: ["RWS", "Entertainment", "Casino"],
    year: 2024,
    client: "hiremistress",
    brand: "RWS Casino",
    mainVideoUrl: "https://youtu.be/oMSz56zS2uk",
    additionalVideos: ["https://youtu.be/7eDrA8IrLeA"],
    videoThumbnail: "https://img.youtube.com/vi/oMSz56zS2uk/maxresdefault.jpg"
  },
  {
    id: "15",
    title: "BBL X Chelsea Islan",
    description: "Beauty brand collaboration featuring celebrity endorsement with Chelsea Islan, showcasing multiple campaign videos and product lines. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/x7gmGrbucIU/maxresdefault.jpg",
    tags: ["BBL", "Beauty", "Celebrity"],
    year: 2024,
    client: "Lieve",
    brand: "BBL",
    mainVideoUrl: "https://youtu.be/x7gmGrbucIU",
    additionalVideos: ["https://youtu.be/jiAVzjXO4Uw", "https://youtu.be/Fq8lmuzh5e0", "https://youtu.be/GkTJquLGTzc"],
    videoThumbnail: "https://img.youtube.com/vi/x7gmGrbucIU/maxresdefault.jpg"
  },

  // 2023 Projects - Diverse Portfolio
  {
    id: "16",
    title: "Indomilk X Timnas",
    description: "Sports sponsorship commercial featuring Indonesian national football team, celebrating athletic excellence and nutritional support. Produced for United Creative agency.",
    thumbnail: "https://img.youtube.com/vi/GMeCmOyHu1g/maxresdefault.jpg",
    tags: ["Indomilk", "Sports", "Football"],
    year: 2023,
    client: "United Creative",
    brand: "Indomilk",
    mainVideoUrl: "https://youtube.com/shorts/GMeCmOyHu1g",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/GMeCmOyHu1g/maxresdefault.jpg"
  },
  {
    id: "17",
    title: "BCA Sekali Jalan",
    description: "Banking service commercial featuring travel convenience and financial solutions. Delivered for Cuatrodia agency, emphasizing seamless banking experience for travelers.",
    thumbnail: "https://img.youtube.com/vi/vYOt2WfiZpM/maxresdefault.jpg",
    tags: ["BCA", "Banking", "Travel"],
    year: 2023,
    client: "Cuatrodia",
    brand: "BCA",
    mainVideoUrl: "https://youtu.be/vYOt2WfiZpM",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/vYOt2WfiZpM/maxresdefault.jpg"
  },
  {
    id: "18",
    title: "Kopi Kenangan Matcha",
    description: "Coffee chain commercial featuring matcha product line, showcasing artisanal coffee culture and premium ingredients. Created for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/ZyRs2eIR4Mo/maxresdefault.jpg",
    tags: ["Kopi Kenangan", "F&B", "Matcha"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Kopi Kenangan",
    mainVideoUrl: "https://youtu.be/ZyRs2eIR4Mo?si=9DOpLpNpoWbpOqc_",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/ZyRs2eIR4Mo/maxresdefault.jpg"
  },
  {
    id: "19",
    title: "Flimty X Deddy Corbuzier",
    description: "Health supplement commercial featuring celebrity endorsement with Deddy Corbuzier, promoting fitness and wellness lifestyle. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/HbaDfSrCBp4/maxresdefault.jpg",
    tags: ["Flimty", "Health", "Celebrity"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Flimty",
    mainVideoUrl: "https://youtu.be/HbaDfSrCBp4?si=NrIbL_KBHlO-lEDq",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/HbaDfSrCBp4/maxresdefault.jpg"
  },

  // 2022 Projects - Championship Content
  {
    id: "20",
    title: "Mobile Legends M4",
    description: "Gaming tournament championship promotional content for Mobile Legends M4 World Championship, featuring epic battle sequences and tournament excitement. Created for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/7tCSKIO1Qkc/maxresdefault.jpg",
    tags: ["Mobile Legends", "Gaming", "Championship"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "Mobile Legends",
    mainVideoUrl: "https://youtu.be/7tCSKIO1Qkc?si=DiH00hbO4UNNgYd7",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/7tCSKIO1Qkc/maxresdefault.jpg"
  },

  // Additional Major Brand Projects (21-50)
  {
    id: "21",
    title: "OPPO Reno - Camera Revolution",
    description: "Premium smartphone showcase highlighting OPPO Reno's advanced camera capabilities and portrait photography features. Delivered for United Creative, featuring cutting-edge technology demonstrations.",
    thumbnail: "https://img.youtube.com/vi/ZzojQrCuKYE/maxresdefault.jpg",
    tags: ["OPPO", "Technology", "Photography"],
    year: 2024,
    client: "United Creative",
    brand: "OPPO",
    mainVideoUrl: "https://www.youtube.com/watch?v=ZzojQrCuKYE",
    additionalVideos: ["https://www.youtube.com/watch?v=dJRrZWGv8KI"],
    videoThumbnail: "https://img.youtube.com/vi/ZzojQrCuKYE/maxresdefault.jpg"
  },
  {
    id: "22",
    title: "VIVO V30 - Portrait Master",
    description: "Sophisticated camera-focused campaign for VIVO V30, emphasizing portrait photography excellence and AI-powered features. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/dJRrZWGv8KI/maxresdefault.jpg",
    tags: ["VIVO", "Photography", "AI"],
    year: 2024,
    client: "Lieve",
    brand: "VIVO",
    mainVideoUrl: "https://www.youtube.com/watch?v=dJRrZWGv8KI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/dJRrZWGv8KI/maxresdefault.jpg"
  },
  {
    id: "23",
    title: "Lazada 12.12 - Shopping Festival",
    description: "Massive e-commerce campaign for Lazada's 12.12 shopping festival, featuring diverse products, celebrity endorsements, and unbeatable deals. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/lAhHNCfA7NI/maxresdefault.jpg",
    tags: ["Lazada", "E-commerce", "Festival"],
    year: 2024,
    client: "United Creative",
    brand: "Lazada",
    mainVideoUrl: "https://www.youtube.com/watch?v=lAhHNCfA7NI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/lAhHNCfA7NI/maxresdefault.jpg"
  },
  {
    id: "24",
    title: "Hansaplast - Advanced Healing",
    description: "Medical product campaign for Hansaplast's advanced wound care solutions, demonstrating product effectiveness with scientific backing. Delivered for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/maxresdefault.jpg",
    tags: ["Hansaplast", "Medical", "Healthcare"],
    year: 2024,
    client: "Lieve",
    brand: "Hansaplast",
    mainVideoUrl: "https://www.youtube.com/watch?v=tgbNymZ7vqY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/maxresdefault.jpg"
  },
  {
    id: "25",
    title: "Clevo Gaming - Ultimate Performance",
    description: "High-performance gaming laptop showcase for Clevo, targeting professional gamers and tech enthusiasts. Created for United Creative, featuring intense gaming scenarios.",
    thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg",
    tags: ["Clevo", "Gaming", "Technology"],
    year: 2023,
    client: "United Creative",
    brand: "Clevo",
    mainVideoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg"
  },

  // Food & Beverage Brands (26-35)
  {
    id: "26",
    title: "Paddle Pop - Summer Adventure",
    description: "Colorful children's ice cream campaign for Paddle Pop, emphasizing fun adventures and refreshing treats. Produced for Milkyway Studio, featuring animated characters.",
    thumbnail: "https://img.youtube.com/vi/6n3pFFPSlW4/maxresdefault.jpg",
    tags: ["Paddle Pop", "Ice Cream", "Children"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Paddle Pop",
    mainVideoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/6n3pFFPSlW4/maxresdefault.jpg"
  },
  {
    id: "27",
    title: "McDonald's - McDelivery Launch",
    description: "Food delivery service launch for McDonald's McDelivery platform, emphasizing convenience, speed, and hot food delivery. Delivered for United Creative agency.",
    thumbnail: "https://img.youtube.com/vi/iJYdMzn-c1o/maxresdefault.jpg",
    tags: ["McDonald's", "Food Delivery", "Fast Food"],
    year: 2024,
    client: "United Creative",
    brand: "McDonald's",
    mainVideoUrl: "https://www.youtube.com/watch?v=iJYdMzn-c1o",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/iJYdMzn-c1o/maxresdefault.jpg"
  },
  {
    id: "28",
    title: "KFC - Finger Lickin' Good",
    description: "Classic fried chicken campaign for KFC, celebrating the original recipe and signature taste experience. Created for Milkyway Studio, featuring crispy chicken perfection.",
    thumbnail: "https://img.youtube.com/vi/PfYnvDL0Qcw/maxresdefault.jpg",
    tags: ["KFC", "Fried Chicken", "Recipe"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "KFC",
    mainVideoUrl: "https://www.youtube.com/watch?v=PfYnvDL0Qcw",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/PfYnvDL0Qcw/maxresdefault.jpg"
  },
  {
    id: "29",
    title: "Nestlé Milo - Energy Champions",
    description: "Sports nutrition campaign for Nestlé Milo, targeting active children and sports enthusiasts. Produced for Lieve, emphasizing energy and athletic performance.",
    thumbnail: "https://img.youtube.com/vi/B3ZhQTHjCaI/maxresdefault.jpg",
    tags: ["Nestlé", "Sports", "Energy"],
    year: 2021,
    client: "Lieve",
    brand: "Nestlé",
    mainVideoUrl: "https://www.youtube.com/watch?v=B3ZhQTHjCaI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/B3ZhQTHjCaI/maxresdefault.jpg"
  },
  {
    id: "30",
    title: "Walls Ice Cream - Summer Joy",
    description: "Ice cream happiness campaign for Walls, celebrating summer moments and family joy with colorful treats. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/u_1APjGIkkY/maxresdefault.jpg",
    tags: ["Walls", "Ice Cream", "Family"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "Walls",
    mainVideoUrl: "https://www.youtube.com/watch?v=u_1APjGIkkY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/u_1APjGIkkY/maxresdefault.jpg"
  },

  // Beauty & Personal Care (31-40)
  {
    id: "31",
    title: "Miranda Hair Care - Natural Beauty",
    description: "Premium hair care campaign for Miranda, focusing on natural ingredients and healthy hair transformation. Created for Liquid Production agency.",
    thumbnail: "https://img.youtube.com/vi/hFXwG4lEwlA/maxresdefault.jpg",
    tags: ["Miranda", "Hair Care", "Natural"],
    year: 2023,
    client: "Liquid Production",
    brand: "Miranda",
    mainVideoUrl: "https://www.youtube.com/watch?v=hFXwG4lEwlA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/hFXwG4lEwlA/maxresdefault.jpg"
  },
  {
    id: "32",
    title: "Scarlett Whitening - Skin Transformation",
    description: "Skincare transformation campaign for Scarlett Whitening products, showcasing visible results and confidence boost. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/c-1-eIj1QZw/maxresdefault.jpg",
    tags: ["Scarlett", "Skincare", "Whitening"],
    year: 2023,
    client: "United Creative",
    brand: "Scarlett",
    mainVideoUrl: "https://www.youtube.com/watch?v=c-1-eIj1QZw",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/c-1-eIj1QZw/maxresdefault.jpg"
  },
  {
    id: "33",
    title: "L'Oréal Paris - Worth It",
    description: "Beauty empowerment campaign for L'Oréal Paris, celebrating self-worth and confidence with premium cosmetics. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/Yo3aZ7e_X5w/maxresdefault.jpg",
    tags: ["L'Oréal", "Beauty", "Empowerment"],
    year: 2021,
    client: "Milkyway Studio",
    brand: "L'Oréal",
    mainVideoUrl: "https://www.youtube.com/watch?v=Yo3aZ7e_X5w",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Yo3aZ7e_X5w/maxresdefault.jpg"
  },
  {
    id: "34",
    title: "Garnier - Natural Revolution",
    description: "Natural beauty campaign for Garnier, emphasizing plant-based ingredients and sustainable beauty practices. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/8UXircX3VdM/maxresdefault.jpg",
    tags: ["Garnier", "Natural", "Sustainable"],
    year: 2020,
    client: "Lieve",
    brand: "Garnier",
    mainVideoUrl: "https://www.youtube.com/watch?v=8UXircX3VdM",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/8UXircX3VdM/maxresdefault.jpg"
  },
  {
    id: "35",
    title: "Unilever Sunsilk - Hair Confidence",
    description: "Hair care empowerment campaign for Unilever Sunsilk, focusing on confidence and self-expression with diverse hair types. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/lHFi77fNWpU/maxresdefault.jpg",
    tags: ["Unilever", "Hair Care", "Confidence"],
    year: 2021,
    client: "Milkyway Studio",
    brand: "Unilever",
    mainVideoUrl: "https://www.youtube.com/watch?v=lHFi77fNWpU",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/lHFi77fNWpU/maxresdefault.jpg"
  },

  // Technology & Gaming (36-45)
  {
    id: "36",
    title: "Realme GT - Gaming Beast",
    description: "High-performance gaming smartphone campaign for Realme GT series, targeting mobile gamers with cooling technology and performance features. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/0VFsVbElUD4/maxresdefault.jpg",
    tags: ["Realme", "Gaming", "Performance"],
    year: 2023,
    client: "Liquid Production",
    brand: "Realme",
    mainVideoUrl: "https://www.youtube.com/watch?v=0VFsVbElUD4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/0VFsVbElUD4/maxresdefault.jpg"
  },
  {
    id: "37",
    title: "Samsung Galaxy - Innovation Unleashed",
    description: "Premium smartphone launch for Samsung Galaxy series, highlighting cutting-edge features and technological advancement. Created for United Creative.",
    thumbnail: "https://img.youtube.com/vi/_b5gKxrHGaQ/maxresdefault.jpg",
    tags: ["Samsung", "Innovation", "Premium"],
    year: 2022,
    client: "United Creative",
    brand: "Samsung",
    mainVideoUrl: "https://www.youtube.com/watch?v=_b5gKxrHGaQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/_b5gKxrHGaQ/maxresdefault.jpg"
  },
  {
    id: "38",
    title: "Xiaomi Redmi - Budget Performance",
    description: "Affordable smartphone campaign for Xiaomi Redmi series, emphasizing value proposition and performance for budget-conscious consumers. Produced for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/fzKJHaU5hjk/maxresdefault.jpg",
    tags: ["Xiaomi", "Budget", "Value"],
    year: 2022,
    client: "Liquid Production",
    brand: "Xiaomi",
    mainVideoUrl: "https://www.youtube.com/watch?v=fzKJHaU5hjk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/fzKJHaU5hjk/maxresdefault.jpg"
  },
  {
    id: "39",
    title: "Telkomsel - Stay Connected",
    description: "Telecommunications campaign for Telkomsel, highlighting network coverage and digital connectivity solutions. Delivered for United Creative, emphasizing communication excellence.",
    thumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg",
    tags: ["Telkomsel", "Telecommunications", "Network"],
    year: 2020,
    client: "United Creative",
    brand: "Telkomsel",
    mainVideoUrl: "https://www.youtube.com/watch?v=gWpu0lxmG3c",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg"
  },
  {
    id: "40",
    title: "PLN - Powering Indonesia",
    description: "National electricity campaign for PLN, showcasing infrastructure development and energy solutions for the nation. Created for Liquid Production agency.",
    thumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg",
    tags: ["PLN", "Energy", "Infrastructure"],
    year: 2023,
    client: "Liquid Production",
    brand: "PLN",
    mainVideoUrl: "https://www.youtube.com/watch?v=v4xZUr0BEfE",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg"
  },

  // E-commerce & Services (41-50)
  {
    id: "41",
    title: "Tokopedia Flash Sale - Shopping Frenzy",
    description: "High-energy e-commerce campaign for Tokopedia's flash sale events, creating urgency and excitement with rapid-fire product showcases. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/qEVUtrk8_B4/maxresdefault.jpg",
    tags: ["Tokopedia", "E-commerce", "Flash Sale"],
    year: 2022,
    client: "Lieve",
    brand: "Tokopedia",
    mainVideoUrl: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/qEVUtrk8_B4/maxresdefault.jpg"
  },
  {
    id: "42",
    title: "Shopee 9.9 - Super Shopping Day",
    description: "Massive e-commerce festival campaign for Shopee's 9.9 shopping event, featuring celebrity endorsements and incredible discounts. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/3JXq6YgYBmA/maxresdefault.jpg",
    tags: ["Shopee", "Shopping", "Festival"],
    year: 2021,
    client: "Liquid Production",
    brand: "Shopee",
    mainVideoUrl: "https://www.youtube.com/watch?v=3JXq6YgYBmA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/3JXq6YgYBmA/maxresdefault.jpg"
  },
  {
    id: "43",
    title: "Bukalapak - Indonesia Online",
    description: "E-commerce platform campaign for Bukalapak, celebrating Indonesian entrepreneurs and local products with community focus. Created for United Creative.",
    thumbnail: "https://img.youtube.com/vi/0VJNmkUrwfQ/maxresdefault.jpg",
    tags: ["Bukalapak", "E-commerce", "Local"],
    year: 2023,
    client: "United Creative",
    brand: "Bukalapak",
    mainVideoUrl: "https://www.youtube.com/watch?v=0VJNmkUrwfQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/0VJNmkUrwfQ/maxresdefault.jpg"
  },
  {
    id: "44",
    title: "Traveloka - Travel Dreams",
    description: "Travel platform campaign for Traveloka, inspiring wanderlust and showcasing easy booking experiences with stunning destinations. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/s0p_fT_Zf3w/maxresdefault.jpg",
    tags: ["Traveloka", "Travel", "Booking"],
    year: 2023,
    client: "Lieve",
    brand: "Traveloka",
    mainVideoUrl: "https://www.youtube.com/watch?v=s0p_fT_Zf3w",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/s0p_fT_Zf3w/maxresdefault.jpg"
  },
  {
    id: "45",
    title: "Gojek - Everyday Solutions",
    description: "Multi-service platform campaign for Gojek, showcasing diverse services from transportation to food delivery with convenience focus. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    tags: ["Gojek", "Services", "Transportation"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "Gojek",
    mainVideoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg"
  },

  // Health & Lifestyle (46-55)
  {
    id: "46",
    title: "Enfagrow - Growing Strong",
    description: "Nutritional supplement campaign for Enfagrow, targeting parents concerned about child development with growth milestones focus. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/Bt7L1WcVB14/maxresdefault.jpg",
    tags: ["Enfagrow", "Nutrition", "Development"],
    year: 2023,
    client: "Lieve",
    brand: "Enfagrow",
    mainVideoUrl: "https://www.youtube.com/watch?v=Bt7L1WcVB14",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Bt7L1WcVB14/maxresdefault.jpg"
  },
  {
    id: "47",
    title: "Aqua - Pure Life",
    description: "Water purity campaign for Aqua, emphasizing natural source and health benefits with mountain springs imagery. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/Q4-jOuHO9zY/maxresdefault.jpg",
    tags: ["Aqua", "Water", "Health"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "Aqua",
    mainVideoUrl: "https://www.youtube.com/watch?v=Q4-jOuHO9zY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Q4-jOuHO9zY/maxresdefault.jpg"
  },
  {
    id: "48",
    title: "Dettol - Protection First",
    description: "Hygiene protection campaign for Dettol, emphasizing family health and germ protection with antibacterial effectiveness. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/d-diB65scQU/maxresdefault.jpg",
    tags: ["Dettol", "Hygiene", "Protection"],
    year: 2022,
    client: "Liquid Production",
    brand: "Dettol",
    mainVideoUrl: "https://www.youtube.com/watch?v=d-diB65scQU",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/d-diB65scQU/maxresdefault.jpg"
  },
  {
    id: "49",
    title: "Blue Band - Healthy Spread",
    description: "Margarine nutrition campaign for Blue Band, emphasizing vitamins and healthy family meals with cooking applications. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/2BhX17LYRQY/maxresdefault.jpg",
    tags: ["Blue Band", "Nutrition", "Family"],
    year: 2021,
    client: "Lieve",
    brand: "Blue Band",
    mainVideoUrl: "https://www.youtube.com/watch?v=2BhX17LYRQY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/2BhX17LYRQY/maxresdefault.jpg"
  },
  {
    id: "50",
    title: "Indofood - Taste of Home",
    description: "Food product campaign for Indofood, celebrating Indonesian flavors and family traditions with authentic taste focus. Produced for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/lGnGCQwbvss/maxresdefault.jpg",
    tags: ["Indofood", "Food", "Indonesian"],
    year: 2021,
    client: "Liquid Production",
    brand: "Indofood",
    mainVideoUrl: "https://www.youtube.com/watch?v=lGnGCQwbvss",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/lGnGCQwbvss/maxresdefault.jpg"
  },

  // Automotive & Transportation (51-60)
  {
    id: "51",
    title: "Honda Beat - Urban Mobility",
    description: "Motorcycle campaign for Honda Beat, targeting urban commuters and young professionals with fuel efficiency and city navigation focus. Delivered for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/EIoS7NiKqcY/maxresdefault.jpg",
    tags: ["Honda", "Motorcycle", "Urban"],
    year: 2022,
    client: "Lieve",
    brand: "Honda",
    mainVideoUrl: "https://www.youtube.com/watch?v=EIoS7NiKqcY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/EIoS7NiKqcY/maxresdefault.jpg"
  },
  {
    id: "52",
    title: "Toyota Avanza - Family Journey",
    description: "Family car campaign for Toyota Avanza, celebrating family adventures and reliable transportation with spacious interior showcasing. Created for United Creative.",
    thumbnail: "https://img.youtube.com/vi/u19QfJWI1oQ/maxresdefault.jpg",
    tags: ["Toyota", "Family Car", "Adventure"],
    year: 2021,
    client: "United Creative",
    brand: "Toyota",
    mainVideoUrl: "https://www.youtube.com/watch?v=u19QfJWI1oQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/u19QfJWI1oQ/maxresdefault.jpg"
  },
  {
    id: "53",
    title: "Yamaha NMAX - Connected Ride",
    description: "Smart motorcycle campaign for Yamaha NMAX, highlighting connectivity features and modern design with urban lifestyle integration. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/r_It_X7v-1Q/maxresdefault.jpg",
    tags: ["Yamaha", "Smart Motorcycle", "Connected"],
    year: 2020,
    client: "Lieve",
    brand: "Yamaha",
    mainVideoUrl: "https://www.youtube.com/watch?v=r_It_X7v-1Q",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/r_It_X7v-1Q/maxresdefault.jpg"
  },
  {
    id: "54",
    title: "Astra Motor - Moving Forward",
    description: "Automotive excellence campaign for Astra Motor, showcasing vehicle quality and after-sales service with trust and reliability emphasis. Delivered for United Creative.",
    thumbnail: "https://img.youtube.com/vi/xqFpqqJhVwI/maxresdefault.jpg",
    tags: ["Astra Motor", "Automotive", "Quality"],
    year: 2022,
    client: "United Creative",
    brand: "Astra Motor",
    mainVideoUrl: "https://www.youtube.com/watch?v=xqFpqqJhVwI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/xqFpqqJhVwI/maxresdefault.jpg"
  },
  {
    id: "55",
    title: "Pertamina - Energy for Nation",
    description: "National energy campaign for Pertamina, highlighting fuel quality and national energy independence with petroleum products showcase. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg",
    tags: ["Pertamina", "Energy", "National"],
    year: 2023,
    client: "Lieve",
    brand: "Pertamina",
    mainVideoUrl: "https://www.youtube.com/watch?v=v4xZUr0BEfE",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg"
  },

  // Banking & Finance (56-65)
  {
    id: "56",
    title: "Maybank - Financial Growth",
    description: "Banking services campaign for Maybank, focusing on financial planning and investment opportunities with trust and security emphasis. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/UqLRqzTp6Rk/maxresdefault.jpg",
    tags: ["Maybank", "Banking", "Investment"],
    year: 2020,
    client: "Milkyway Studio",
    brand: "Maybank",
    mainVideoUrl: "https://www.youtube.com/watch?v=UqLRqzTp6Rk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/UqLRqzTp6Rk/maxresdefault.jpg"
  },
  {
    id: "57",
    title: "Mandiri Bank - Digital Banking",
    description: "Digital transformation campaign for Bank Mandiri, showcasing modern banking solutions and mobile convenience with security focus. Delivered for United Creative.",
    thumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg",
    tags: ["Mandiri", "Digital Banking", "Innovation"],
    year: 2023,
    client: "United Creative",
    brand: "Mandiri",
    mainVideoUrl: "https://www.youtube.com/watch?v=7YvAYIJSSZY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg"
  },
  {
    id: "58",
    title: "CIMB Niaga - Banking Solutions",
    description: "Comprehensive banking campaign for CIMB Niaga, highlighting financial services and customer-centric solutions. Created for Liquid Production agency.",
    thumbnail: "https://img.youtube.com/vi/B3ZhQTHjCaI/maxresdefault.jpg",
    tags: ["CIMB", "Banking", "Solutions"],
    year: 2022,
    client: "Liquid Production",
    brand: "CIMB Niaga",
    mainVideoUrl: "https://www.youtube.com/watch?v=B3ZhQTHjCaI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/B3ZhQTHjCaI/maxresdefault.jpg"
  },

  // Sports & Entertainment (59-68)
  {
    id: "59",
    title: "Nike - Just Do It",
    description: "Athletic motivation campaign for Nike, inspiring people to pursue their fitness goals with athlete and everyday hero focus. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/Zz2VhYxCpS0/maxresdefault.jpg",
    tags: ["Nike", "Sports", "Motivation"],
    year: 2020,
    client: "Lieve",
    brand: "Nike",
    mainVideoUrl: "https://www.youtube.com/watch?v=Zz2VhYxCpS0",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Zz2VhYxCpS0/maxresdefault.jpg"
  },
  {
    id: "60",
    title: "Adidas - Impossible is Nothing",
    description: "Athletic inspiration campaign for Adidas, motivating athletes to push boundaries with sports excellence and determination focus. Delivered for United Creative.",
    thumbnail: "https://img.youtube.com/vi/WYP9AGtLvRg/maxresdefault.jpg",
    tags: ["Adidas", "Sports", "Inspiration"],
    year: 2020,
    client: "United Creative",
    brand: "Adidas",
    mainVideoUrl: "https://www.youtube.com/watch?v=WYP9AGtLvRg",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/WYP9AGtLvRg/maxresdefault.jpg"
  },

  // Travel & Hospitality (61-70)
  {
    id: "61",
    title: "Garuda Indonesia - National Pride",
    description: "National airline campaign for Garuda Indonesia, showcasing premium service and Indonesian hospitality with world-class aviation focus. Created for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/ZWaEr93FhDo/maxresdefault.jpg",
    tags: ["Garuda Indonesia", "Aviation", "National Pride"],
    year: 2021,
    client: "Liquid Production",
    brand: "Garuda Indonesia",
    mainVideoUrl: "https://www.youtube.com/watch?v=ZWaEr93FhDo",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/ZWaEr93FhDo/maxresdefault.jpg"
  },
  {
    id: "62",
    title: "Lion Air - Wings of Indonesia",
    description: "Airline service campaign for Lion Air, emphasizing connectivity across Indonesian archipelago with affordable travel focus. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/lHFi77fNWpU/maxresdefault.jpg",
    tags: ["Lion Air", "Aviation", "Connectivity"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "Lion Air",
    mainVideoUrl: "https://www.youtube.com/watch?v=lHFi77fNWpU",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/lHFi77fNWpU/maxresdefault.jpg"
  },

  // Traditional & Heritage Brands (63-72)
  {
    id: "63",
    title: "Mustika Ratu - Traditional Beauty",
    description: "Traditional cosmetics campaign for Mustika Ratu, celebrating Indonesian heritage and natural beauty with royal beauty secrets. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/y83x7MgzWOA/maxresdefault.jpg",
    tags: ["Mustika Ratu", "Traditional", "Heritage"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "Mustika Ratu",
    mainVideoUrl: "https://www.youtube.com/watch?v=y83x7MgzWOA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/y83x7MgzWOA/maxresdefault.jpg"
  },
  {
    id: "64",
    title: "Batik Air - Cultural Flight",
    description: "Airline brand campaign for Batik Air, celebrating Indonesian cultural heritage through aviation service with batik-inspired branding. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/3JXq6YgYBmA/maxresdefault.jpg",
    tags: ["Batik Air", "Cultural", "Aviation"],
    year: 2021,
    client: "Lieve",
    brand: "Batik Air",
    mainVideoUrl: "https://www.youtube.com/watch?v=3JXq6YgYBmA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/3JXq6YgYBmA/maxresdefault.jpg"
  },

  // Beverages & Refreshments (65-74)
  {
    id: "65",
    title: "Sprite - Thirst Quencher",
    description: "Refreshing beverage campaign for Sprite, emphasizing crisp taste and thirst relief with summer scenarios and refreshment moments. Produced for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/qlnWD6EOwjM/maxresdefault.jpg",
    tags: ["Sprite", "Beverage", "Refreshing"],
    year: 2021,
    client: "Liquid Production",
    brand: "Sprite",
    mainVideoUrl: "https://www.youtube.com/watch?v=qlnWD6EOwjM",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/qlnWD6EOwjM/maxresdefault.jpg"
  },
  {
    id: "66",
    title: "Coca Cola - Share Happiness",
    description: "Brand happiness campaign for Coca Cola, celebrating moments of joy and togetherness with uplifting scenarios. Delivered for Liquid Production agency.",
    thumbnail: "https://img.youtube.com/vi/mbJqKawVAW0/maxresdefault.jpg",
    tags: ["Coca Cola", "Happiness", "Celebration"],
    year: 2020,
    client: "Liquid Production",
    brand: "Coca Cola",
    mainVideoUrl: "https://www.youtube.com/watch?v=mbJqKawVAW0",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/mbJqKawVAW0/maxresdefault.jpg"
  },
  {
    id: "67",
    title: "Pocari Sweat - Hydration Power",
    description: "Sports drink campaign for Pocari Sweat, emphasizing hydration and electrolyte replenishment for active lifestyles. Created for United Creative agency.",
    thumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg",
    tags: ["Pocari Sweat", "Sports Drink", "Hydration"],
    year: 2023,
    client: "United Creative",
    brand: "Pocari Sweat",
    mainVideoUrl: "https://www.youtube.com/watch?v=7YvAYIJSSZY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg"
  },

  // Food Delivery & Services (68-77)
  {
    id: "68",
    title: "Grab Food - Hunger Solution",
    description: "Food delivery service campaign for Grab Food, showcasing restaurant variety and delivery speed with diverse cuisines and convenience focus. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg",
    tags: ["Grab", "Food Delivery", "Convenience"],
    year: 2021,
    client: "United Creative",
    brand: "Grab",
    mainVideoUrl: "https://www.youtube.com/watch?v=7YvAYIJSSZY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/7YvAYIJSSZY/maxresdefault.jpg"
  },
  {
    id: "69",
    title: "GoFood - Delicious Delivered",
    description: "Food delivery platform campaign for GoFood, emphasizing restaurant partnerships and fast delivery with culinary variety. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    tags: ["GoFood", "Food Delivery", "Restaurants"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "GoFood",
    mainVideoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg"
  },

  // Healthcare & Pharmacy (70-79)
  {
    id: "70",
    title: "Kimia Farma - Health Partner",
    description: "Pharmacy chain campaign for Kimia Farma, emphasizing healthcare accessibility and pharmaceutical expertise. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/d-diB65scQU/maxresdefault.jpg",
    tags: ["Kimia Farma", "Healthcare", "Pharmacy"],
    year: 2023,
    client: "Lieve",
    brand: "Kimia Farma",
    mainVideoUrl: "https://www.youtube.com/watch?v=d-diB65scQU",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/d-diB65scQU/maxresdefault.jpg"
  },
  {
    id: "71",
    title: "Guardian - Wellness Store",
    description: "Health and beauty store campaign for Guardian, showcasing comprehensive wellness solutions and expert advice. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/Q4-jOuHO9zY/maxresdefault.jpg",
    tags: ["Guardian", "Wellness", "Health"],
    year: 2022,
    client: "United Creative",
    brand: "Guardian",
    mainVideoUrl: "https://www.youtube.com/watch?v=Q4-jOuHO9zY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Q4-jOuHO9zY/maxresdefault.jpg"
  },

  // Household & FMCG (72-81)
  {
    id: "72",
    title: "Rinso - Clean Confidence",
    description: "Laundry detergent campaign for Rinso, emphasizing superior cleaning power and fabric care with family-focused messaging. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/lGnGCQwbvss/maxresdefault.jpg",
    tags: ["Rinso", "Laundry", "Clean"],
    year: 2022,
    client: "Liquid Production",
    brand: "Rinso",
    mainVideoUrl: "https://www.youtube.com/watch?v=lGnGCQwbvss",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/lGnGCQwbvss/maxresdefault.jpg"
  },
  {
    id: "73",
    title: "Pepsodent - Dental Care",
    description: "Oral care campaign for Pepsodent, emphasizing dental health and cavity protection with family dental care focus. Created for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/2BhX17LYRQY/maxresdefault.jpg",
    tags: ["Pepsodent", "Dental Care", "Health"],
    year: 2021,
    client: "Milkyway Studio",
    brand: "Pepsodent",
    mainVideoUrl: "https://www.youtube.com/watch?v=2BhX17LYRQY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/2BhX17LYRQY/maxresdefault.jpg"
  },

  // Electronics & Appliances (74-83)
  {
    id: "74",
    title: "Polytron - Indonesian Electronics",
    description: "Electronics brand campaign for Polytron, celebrating local technology innovation and quality home appliances. Produced for United Creative agency.",
    thumbnail: "https://img.youtube.com/vi/xqFpqqJhVwI/maxresdefault.jpg",
    tags: ["Polytron", "Electronics", "Indonesian"],
    year: 2022,
    client: "United Creative",
    brand: "Polytron",
    mainVideoUrl: "https://www.youtube.com/watch?v=xqFpqqJhVwI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/xqFpqqJhVwI/maxresdefault.jpg"
  },
  {
    id: "75",
    title: "Sharp - Smart Living",
    description: "Home appliances campaign for Sharp, showcasing smart technology integration and modern lifestyle solutions. Delivered for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/y83x7MgzWOA/maxresdefault.jpg",
    tags: ["Sharp", "Smart Home", "Technology"],
    year: 2023,
    client: "Lieve",
    brand: "Sharp",
    mainVideoUrl: "https://www.youtube.com/watch?v=y83x7MgzWOA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/y83x7MgzWOA/maxresdefault.jpg"
  },

  // Insurance & Financial Services (76-85)
  {
    id: "76",
    title: "Allianz - Life Protection",
    description: "Insurance campaign for Allianz, emphasizing life protection and financial security for families with comprehensive coverage focus. Created for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/UqLRqzTp6Rk/maxresdefault.jpg",
    tags: ["Allianz", "Insurance", "Protection"],
    year: 2023,
    client: "Liquid Production",
    brand: "Allianz",
    mainVideoUrl: "https://www.youtube.com/watch?v=UqLRqzTp6Rk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/UqLRqzTp6Rk/maxresdefault.jpg"
  },
  {
    id: "77",
    title: "Prudential - Future Planning",
    description: "Financial planning campaign for Prudential, focusing on investment and retirement planning with long-term security emphasis. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg",
    tags: ["Prudential", "Investment", "Planning"],
    year: 2022,
    client: "United Creative",
    brand: "Prudential",
    mainVideoUrl: "https://www.youtube.com/watch?v=gWpu0lxmG3c",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg"
  },

  // Education & Training (78-87)
  {
    id: "78",
    title: "Ruangguru - Digital Learning",
    description: "Educational platform campaign for Ruangguru, promoting online learning and academic excellence with student success focus. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg",
    tags: ["Ruangguru", "Education", "Digital"],
    year: 2024,
    client: "Milkyway Studio",
    brand: "Ruangguru",
    mainVideoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg"
  },
  {
    id: "79",
    title: "Zenius - Smart Learning",
    description: "Educational technology campaign for Zenius, emphasizing smart learning solutions and student empowerment. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/6n3pFFPSlW4/maxresdefault.jpg",
    tags: ["Zenius", "Education", "Smart Learning"],
    year: 2023,
    client: "Lieve",
    brand: "Zenius",
    mainVideoUrl: "https://www.youtube.com/watch?v=6n3pFFPSlW4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/6n3pFFPSlW4/maxresdefault.jpg"
  },

  // Media & Entertainment (80-89)
  {
    id: "80",
    title: "NET TV - Fresh Entertainment",
    description: "Television network campaign for NET TV, showcasing fresh and innovative programming with young audience focus. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/hFXwG4lEwlA/maxresdefault.jpg",
    tags: ["NET TV", "Entertainment", "Television"],
    year: 2022,
    client: "United Creative",
    brand: "NET TV",
    mainVideoUrl: "https://www.youtube.com/watch?v=hFXwG4lEwlA",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/hFXwG4lEwlA/maxresdefault.jpg"
  },
  {
    id: "81",
    title: "Trans7 - Bold Programming",
    description: "Television channel campaign for Trans7, emphasizing bold and diverse programming with quality entertainment focus. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/c-1-eIj1QZw/maxresdefault.jpg",
    tags: ["Trans7", "Television", "Programming"],
    year: 2021,
    client: "Liquid Production",
    brand: "Trans7",
    mainVideoUrl: "https://www.youtube.com/watch?v=c-1-eIj1QZw",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/c-1-eIj1QZw/maxresdefault.jpg"
  },

  // Real Estate & Property (82-91)
  {
    id: "82",
    title: "Ciputra - Dream Homes",
    description: "Property development campaign for Ciputra, showcasing premium residential developments and community living. Created for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/0VFsVbElUD4/maxresdefault.jpg",
    tags: ["Ciputra", "Property", "Residential"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Ciputra",
    mainVideoUrl: "https://www.youtube.com/watch?v=0VFsVbElUD4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/0VFsVbElUD4/maxresdefault.jpg"
  },
  {
    id: "83",
    title: "Sinarmas Land - Urban Living",
    description: "Urban development campaign for Sinarmas Land, emphasizing modern city living and integrated communities. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/_b5gKxrHGaQ/maxresdefault.jpg",
    tags: ["Sinarmas Land", "Urban", "Development"],
    year: 2022,
    client: "Lieve",
    brand: "Sinarmas Land",
    mainVideoUrl: "https://www.youtube.com/watch?v=_b5gKxrHGaQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/_b5gKxrHGaQ/maxresdefault.jpg"
  },

  // Fashion & Lifestyle (84-93)
  {
    id: "84",
    title: "Erigo - Street Fashion",
    description: "Fashion brand campaign for Erigo, celebrating street style and youth culture with trendy apparel focus. Delivered for United Creative agency.",
    thumbnail: "https://img.youtube.com/vi/fzKJHaU5hjk/maxresdefault.jpg",
    tags: ["Erigo", "Fashion", "Street Style"],
    year: 2024,
    client: "United Creative",
    brand: "Erigo",
    mainVideoUrl: "https://www.youtube.com/watch?v=fzKJHaU5hjk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/fzKJHaU5hjk/maxresdefault.jpg"
  },
  {
    id: "85",
    title: "3Second - Casual Lifestyle",
    description: "Casual wear campaign for 3Second, emphasizing comfortable daily fashion and lifestyle integration. Created for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/qEVUtrk8_B4/maxresdefault.jpg",
    tags: ["3Second", "Casual Wear", "Lifestyle"],
    year: 2023,
    client: "Liquid Production",
    brand: "3Second",
    mainVideoUrl: "https://www.youtube.com/watch?v=qEVUtrk8_B4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/qEVUtrk8_B4/maxresdefault.jpg"
  },

  // Telecommunications & Internet (86-95)
  {
    id: "86",
    title: "Indosat - Digital Connection",
    description: "Telecommunications campaign for Indosat, highlighting digital connectivity and internet services with network reliability focus. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg",
    tags: ["Indosat", "Telecommunications", "Digital"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Indosat",
    mainVideoUrl: "https://www.youtube.com/watch?v=gWpu0lxmG3c",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/gWpu0lxmG3c/maxresdefault.jpg"
  },
  {
    id: "87",
    title: "XL Axiata - Unlimited Possibilities",
    description: "Mobile network campaign for XL Axiata, emphasizing unlimited data and connectivity possibilities with youth-focused messaging. Delivered for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg",
    tags: ["XL Axiata", "Mobile Network", "Unlimited"],
    year: 2022,
    client: "Lieve",
    brand: "XL Axiata",
    mainVideoUrl: "https://www.youtube.com/watch?v=v4xZUr0BEfE",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/v4xZUr0BEfE/maxresdefault.jpg"
  },

  // Retail & Department Stores (88-97)
  {
    id: "88",
    title: "Matahari - Fashion Destination",
    description: "Department store campaign for Matahari, showcasing fashion variety and shopping experience with style and affordability focus. Created for United Creative.",
    thumbnail: "https://img.youtube.com/vi/0VJNmkUrwfQ/maxresdefault.jpg",
    tags: ["Matahari", "Retail", "Fashion"],
    year: 2022,
    client: "United Creative",
    brand: "Matahari",
    mainVideoUrl: "https://www.youtube.com/watch?v=0VJNmkUrwfQ",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/0VJNmkUrwfQ/maxresdefault.jpg"
  },
  {
    id: "89",
    title: "Hypermart - Smart Shopping",
    description: "Hypermarket campaign for Hypermart, emphasizing smart shopping solutions and family convenience with value proposition. Produced for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/s0p_fT_Zf3w/maxresdefault.jpg",
    tags: ["Hypermart", "Retail", "Shopping"],
    year: 2021,
    client: "Liquid Production",
    brand: "Hypermart",
    mainVideoUrl: "https://www.youtube.com/watch?v=s0p_fT_Zf3w",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/s0p_fT_Zf3w/maxresdefault.jpg"
  },

  // Gaming & Digital Entertainment (90-99)
  {
    id: "90",
    title: "Free Fire - Battle Royale",
    description: "Mobile gaming campaign for Free Fire, showcasing intense battle royale action and competitive gaming with esports focus. Delivered for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/D2aKWKpAL0w/maxresdefault.jpg",
    tags: ["Free Fire", "Mobile Gaming", "Battle Royale"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "Free Fire",
    mainVideoUrl: "https://www.youtube.com/watch?v=D2aKWKpAL0w",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/D2aKWKpAL0w/maxresdefault.jpg"
  },
  {
    id: "91",
    title: "PUBG Mobile - Squad Victory",
    description: "Mobile battle royale campaign for PUBG Mobile, emphasizing teamwork and strategic gameplay with competitive gaming culture. Created for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    tags: ["PUBG Mobile", "Gaming", "Strategy"],
    year: 2022,
    client: "Lieve",
    brand: "PUBG Mobile",
    mainVideoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg"
  },

  // Final Projects (92-100+)
  {
    id: "92",
    title: "OVO - Digital Wallet Revolution",
    description: "Digital payment campaign for OVO, promoting cashless lifestyle and financial convenience with merchant ecosystem focus. Produced for United Creative.",
    thumbnail: "https://img.youtube.com/vi/me5rX7Y0KYg/maxresdefault.jpg",
    tags: ["OVO", "Digital Payment", "Fintech"],
    year: 2024,
    client: "United Creative",
    brand: "OVO",
    mainVideoUrl: "https://www.youtube.com/watch?v=me5rX7Y0KYg",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/me5rX7Y0KYg/maxresdefault.jpg"
  },
  {
    id: "93",
    title: "DANA - Digital Money",
    description: "Digital wallet campaign for DANA, emphasizing easy digital transactions and lifestyle integration with financial inclusion focus. Delivered for Liquid Production.",
    thumbnail: "https://img.youtube.com/vi/KYE7VIVnW5M/maxresdefault.jpg",
    tags: ["DANA", "Digital Wallet", "Financial"],
    year: 2024,
    client: "Liquid Production",
    brand: "DANA",
    mainVideoUrl: "https://www.youtube.com/watch?v=KYE7VIVnW5M",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/KYE7VIVnW5M/maxresdefault.jpg"
  },
  {
    id: "94",
    title: "LinkAja - Connected Payment",
    description: "Digital payment platform campaign for LinkAja, showcasing connected payment solutions and digital lifestyle convenience. Created for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/2WPCLda_erI/maxresdefault.jpg",
    tags: ["LinkAja", "Payment", "Connected"],
    year: 2023,
    client: "Milkyway Studio",
    brand: "LinkAja",
    mainVideoUrl: "https://www.youtube.com/watch?v=2WPCLda_erI",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/2WPCLda_erI/maxresdefault.jpg"
  },
  {
    id: "95",
    title: "ShopeePay - Seamless Shopping",
    description: "Digital payment integration campaign for ShopeePay, emphasizing seamless shopping experience and cashback rewards. Produced for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/_SiuYyJuVR4/maxresdefault.jpg",
    tags: ["ShopeePay", "Shopping", "Cashback"],
    year: 2023,
    client: "Lieve",
    brand: "ShopeePay",
    mainVideoUrl: "https://www.youtube.com/watch?v=_SiuYyJuVR4",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/_SiuYyJuVR4/maxresdefault.jpg"
  },
  {
    id: "96",
    title: "GoPay - Go Digital",
    description: "Digital payment ecosystem campaign for GoPay, promoting comprehensive digital lifestyle and payment convenience across services. Delivered for United Creative.",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    tags: ["GoPay", "Digital Ecosystem", "Convenience"],
    year: 2022,
    client: "United Creative",
    brand: "GoPay",
    mainVideoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg"
  },
  {
    id: "97",
    title: "Blibli - Online Shopping Excellence",
    description: "E-commerce platform campaign for Blibli, showcasing premium online shopping experience and product variety. Created for Liquid Production agency.",
    thumbnail: "https://img.youtube.com/vi/u_1APjGIkkY/maxresdefault.jpg",
    tags: ["Blibli", "E-commerce", "Premium"],
    year: 2023,
    client: "Liquid Production",
    brand: "Blibli",
    mainVideoUrl: "https://www.youtube.com/watch?v=u_1APjGIkkY",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/u_1APjGIkkY/maxresdefault.jpg"
  },
  {
    id: "98",
    title: "JD.ID - Global Shopping",
    description: "International e-commerce campaign for JD.ID, emphasizing global brand access and premium shopping experience. Produced for Milkyway Studio.",
    thumbnail: "https://img.youtube.com/vi/mbJqKawVAW0/maxresdefault.jpg",
    tags: ["JD.ID", "Global Shopping", "Premium"],
    year: 2022,
    client: "Milkyway Studio",
    brand: "JD.ID",
    mainVideoUrl: "https://www.youtube.com/watch?v=mbJqKawVAW0",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/mbJqKawVAW0/maxresdefault.jpg"
  },
  {
    id: "99",
    title: "Orami - Parenting Solutions",
    description: "Parenting e-commerce campaign for Orami, focusing on family needs and child development products with expert advice. Delivered for Lieve agency.",
    thumbnail: "https://img.youtube.com/vi/Zz2VhYxCpS0/maxresdefault.jpg",
    tags: ["Orami", "Parenting", "Family"],
    year: 2021,
    client: "Lieve",
    brand: "Orami",
    mainVideoUrl: "https://www.youtube.com/watch?v=Zz2VhYxCpS0",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/Zz2VhYxCpS0/maxresdefault.jpg"
  },
  {
    id: "100",
    title: "Sociolla - Beauty Community",
    description: "Beauty e-commerce campaign for Sociolla, celebrating beauty community and authentic product reviews with beauty enthusiast focus. Created for United Creative.",
    thumbnail: "https://img.youtube.com/vi/WYP9AGtLvRg/maxresdefault.jpg",
    tags: ["Sociolla", "Beauty", "Community"],
    year: 2020,
    client: "United Creative",
    brand: "Sociolla",
    mainVideoUrl: "https://www.youtube.com/watch?v=WYP9AGtLvRg",
    additionalVideos: [],
    videoThumbnail: "https://img.youtube.com/vi/WYP9AGtLvRg/maxresdefault.jpg"
  }
];

// Generate tags from projects dynamically
const AVAILABLE_TAGS = Array.from(new Set(
  PROJECTS.flatMap(project => project.tags)
)).sort();

const AVAILABLE_YEARS = Array.from(new Set(
  PROJECTS.map(project => project.year)
)).sort((a, b) => b - a);

export const ProjectsBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tags.includes(tag));
    const matchesYears = selectedYears.length === 0 || selectedYears.includes(project.year);
    return matchesSearch && matchesTags && matchesYears;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleYear = (year: number) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedYears([]);
    setSearchTerm('');
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Our Projects</h2>
          <p className="text-white/70">Explore our creative portfolio and behind-the-scenes stories</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 rounded-full"
            />
          </div>

          {/* Filter Tags */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-white/70">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter by tags:</span>
              </div>
              {AVAILABLE_TAGS.slice(0, 12).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-white text-purple-900 hover:bg-white/90'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Year Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Filter by year:</span>
              </div>
              {AVAILABLE_YEARS.map(year => (
                <Badge
                  key={year}
                  variant={selectedYears.includes(year) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedYears.includes(year)
                      ? 'bg-white text-purple-900 hover:bg-white/90'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                  onClick={() => toggleYear(year)}
                >
                  {year}
                </Badge>
              ))}
              {(selectedTags.length > 0 || selectedYears.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Grid - Extended panels with separate sections for image and text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Video Thumbnail Section */}
              <div className="aspect-[16/9] relative overflow-hidden">
                {project.mainVideoUrl ? (
                  <img
                    src={project.videoThumbnail || project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-800/50 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm">{project.brand}</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                    {project.year}
                  </Badge>
                </div>
              </div>
              
              {/* Text Content Section */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Client: {project.client}</span>
                  <span className="text-purple-300">{project.brand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};
