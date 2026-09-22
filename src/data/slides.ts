export type SlideType = 'photo' | 'announcement';

export interface Slide {
  id: string;
  type: SlideType;
  imageUrl: string;
  title?: string;
  description?: string;
  duration?: number; // duration in milliseconds (default 5000ms)
  category?: string;
}

export const slides: Slide[] = [
  {
    id: 'slide-01',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/01_facade_devanture_seven_b.jpg',
    title: 'Bienvenue à Seven B Hôtel',
    description: 'Votre havre de paix, de confort et d\'élégance à Cotonou. Réception et service d\'accueil disponibles 24h/24.',
    duration: 6000,
    category: 'Accueil'
  },
  {
    id: 'slide-02',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/02_reception_accueil_prestige.jpg',
    title: 'Service & Conciergerie 24h/24',
    description: 'Une équipe dévouée pour assurer votre sérénité tout au long de votre séjour.',
    duration: 5000,
    category: 'Services'
  },
  {
    id: 'slide-03',
    type: 'photo',
    imageUrl: '/selection_photos_tv/03_grand_salon_cuir_bordeaux.jpg',
    title: 'Grand Salon d\'Honneur',
    description: 'Salons en cuir bordeaux de grand standing et espace de vie spacieux.',
    duration: 5000,
    category: 'Suites'
  },
  {
    id: 'slide-04',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/04_salon_design_contemporain.jpg',
    title: 'Design Contemporain & High-Tech',
    description: 'Profitez d\'écrans TV connectés et d\'une connexion Wi-Fi très haut débit offerte.',
    duration: 5000,
    category: 'Confort'
  },
  {
    id: 'slide-05',
    type: 'photo',
    imageUrl: '/selection_photos_tv/05_espace_diner_salle_a_manger.jpg',
    title: 'Espace Dîner & Convivialité',
    description: 'Pour vos repas en toute intimité dans nos appartements deux chambres et salon.',
    duration: 5000,
    category: 'Gastronomie'
  },
  {
    id: 'slide-06',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/06_chambre_prestige_parentale.jpg',
    title: 'Suites & Chambres Prestige',
    description: 'Literie King Size d\'un confort absolu, insonorisation et climatisation optimale.',
    duration: 5000,
    category: 'Chambres'
  },
  {
    id: 'slide-07',
    type: 'photo',
    imageUrl: '/selection_photos_tv/07_chambre_confort_harmonie.jpg',
    title: 'Chambre Confort & Intimité',
    description: 'Une ambiance feutrée conçue pour votre repos et votre bien-être.',
    duration: 5000,
    category: 'Chambres'
  },
  {
    id: 'slide-08',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/08_espace_balneo_jacuzzi_privatif.jpg',
    title: 'Détente & Jacuzzi Privatif',
    description: 'Vivez un moment de pure relaxation dans nos studios équipés de bain à remous balnéo.',
    duration: 6000,
    category: 'Bien-être'
  },
  {
    id: 'slide-09',
    type: 'photo',
    imageUrl: '/selection_photos_tv/09_chambre_africaine_wax_authentique.jpg',
    title: 'Authenticité & Touche Wax Chic',
    description: 'Le charme et la chaleur des motifs africains traditionnels revisités.',
    duration: 5000,
    category: 'Chambres'
  },
  {
    id: 'slide-10',
    type: 'photo',
    imageUrl: '/selection_photos_tv/10_panoramique_lounge_seven_b.jpg',
    title: 'Perspective Panoramique',
    description: 'Des volumes d\'exception pensés pour votre séjour.',
    duration: 5000,
    category: 'Espaces'
  },
  {
    id: 'slide-11',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/11_carte_localisation_point_rouge.jpg',
    title: 'Emplacement Privilégié',
    description: 'Seven B — Maison Claude LISSANON, Rue 12578, Akogbato, Cotonou. À quelques minutes de la plage et de l\'aéroport.',
    duration: 6000,
    category: 'Localisation'
  }
];
