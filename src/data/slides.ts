export type SlideType = 'photo' | 'announcement';

export interface Slide {
  id: string;
  type: SlideType;
  imageUrl: string;
  title?: string;
  description?: string;
  duration?: number; // duration in milliseconds
}

export const slides: Slide[] = [
  {
    id: 'room-1',
    type: 'photo',
    imageUrl: '/images_ameliorees/image006_amelioree.jpg',
    duration: 10000,
  },
  {
    id: 'room-2',
    type: 'photo',
    imageUrl: '/images_ameliorees/studio_image002_amelioree.jpg',
    duration: 10000,
  },
  {
    id: 'announcement-1',
    type: 'announcement',
    imageUrl: '/images_ameliorees/image002_amelioree.jpg',
    title: 'Bienvenue à notre Hôtel',
    description: 'Profitez de nos chambres confortables et de notre service exceptionnel. Le petit déjeuner est servi de 7h à 10h.',
    duration: 12000,
  },
  {
    id: 'room-jacuzzi',
    type: 'photo',
    imageUrl: '/images_ameliorees/image015_amelioree.jpg',
    duration: 10000,
  },
  {
    id: 'announcement-2',
    type: 'announcement',
    imageUrl: '/images_ameliorees/studio_image002_amelioree.jpg',
    title: 'Détente & Bien-être',
    description: 'Découvrez nos studios équipés de jacuzzi pour un moment de relaxation inoubliable.',
    duration: 12000,
  }
];
