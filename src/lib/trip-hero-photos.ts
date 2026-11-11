type TripHeroPhoto = {
  src: string;
  alt: string;
  objectPosition?: string;
  source: string;
  credit: string;
};

export const TRIP_HERO_PHOTOS: Record<string, TripHeroPhoto | undefined> = {
  "tonga-jubartes": {
    src: "/images/hero/t5.webp",
    alt: "Baleia jubarte abaixo da superfície do mar",
    objectPosition: "center 64%",
    source: "https://unsplash.com/photos/a-humpback-whale-swims-in-the-deep-blue-ocean-mM_e5LFdTp0",
    credit: "Jubarte, Unsplash",
  },
  "chicama-surfe": {
    src: "/images/hero/s11.webp",
    alt: "Vista aérea de surfistas sobre o mar azul",
    source: "https://www.pexels.com/photo/people-surfing-on-the-sea-5006975/",
    credit: "Surf, Pexels",
  },
  "kite-a-bordo": {
    src: "/images/hero/k1.webp",
    alt: "Iate e praticante de kitesurf em águas turquesa",
    source: "https://www.pexels.com/photo/yacht-in-exotic-sea-14762450/",
    credit: "Viagem a bordo, Sergio Hurtado, Pexels",
  },
  "providencia-tubaroes": {
    src: "/images/hero/p2.webp",
    alt: "Mergulhadora cercada por tubarões em água cristalina",
    objectPosition: "center 40%",
    source: "https://www.pexels.com/photo/diver-swimming-amidst-sharks-in-clear-ocean-32036972/",
    credit: "Mergulho, Maria Camacho Mas, Pexels",
  },
};
