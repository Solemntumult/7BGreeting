export type SlideType = 'photo' | 'announcement' | 'fractionne' | 'map';

export interface SlideData {
  id: string;
  type: SlideType;
  imageUrl: string;
  title?: string;
  description?: string;
  duration?: number;
  category?: string;
  active?: boolean;
  order?: number;
  metadata?: {
    panels?: Array<{
      title: string;
      imageUrl: string;
      tag: string;
    }>;
  };
}

export type Slide = SlideData;

export const OFFICIAL_SEQUENCE: SlideData[] = [
  // 1. Mosaïque d'entrée (Devanture, Réception, Salons, Dîner, Chambres - sans douche)
  {
    id: 'seq-00-mosaique-entree',
    type: 'fractionne',
    imageUrl: '/selection_photos_tv/01_facade_devanture_seven_b.webp',
    title: 'Bienvenue à Seven B Guest House',
    description: 'L\'excellence de l\'hospitalité et du confort au cœur de Cotonou',
    duration: 7000,
    category: 'Bienvenue',
    active: true,
    order: 1,
    metadata: {
      panels: [
        { title: 'Devanture', imageUrl: '/selection_photos_tv/01_facade_devanture_seven_b.webp', tag: 'Accueil' },
        { title: 'Réception', imageUrl: '/selection_photos_tv/02_reception_accueil_prestige.webp', tag: 'Service 24h' },
        { title: 'Salons', imageUrl: '/selection_photos_tv/salon_image005_hd.webp', tag: 'Séjour' },
        { title: 'Espace Dîner', imageUrl: '/selection_photos_tv/espace_diner_image011.webp', tag: 'Repas' },
        { title: 'Chambres', imageUrl: '/selection_photos_tv/chambre_lit_prestige.webp', tag: 'Nuits' },
      ]
    }
  },

  // 2. Devanture
  {
    id: 'seq-01-devanture',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/01_facade_devanture_seven_b.webp',
    title: 'Bienvenue à Seven B Guest House',
    description: 'Un cadre d\'exception et un accueil chaleureux disponible 24h/24, 7j/7',
    duration: 7000,
    category: 'Accueil',
    active: true,
    order: 2
  },

  // 3. Salons Contemporains
  {
    id: 'seq-02-salons',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/salon_image005_hd.webp',
    title: 'Salons Contemporains & Espaces de Vie',
    description: 'Design moderne, confort raffiné et connectivité pour vos moments de détente',
    duration: 7000,
    category: 'Salons & Suites',
    active: true,
    order: 3
  },

  // 4. Espace Dîner
  {
    id: 'seq-03-diner',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/espace_diner_image011.webp',
    title: 'Espaces Dîner & Convivialité',
    description: 'Partagez des repas chaleureux dans l\'intimité de votre appartement',
    duration: 7000,
    category: 'Convivialité',
    active: true,
    order: 4
  },

  // 5. Chambres (Photo de lit avec rideaux jaunes et chemins de lit)
  {
    id: 'seq-04-chambres',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/chambre_lit_prestige.webp',
    title: 'Suites & Chambres Prestige',
    description: 'Literie grand confort et ambiance raffinée pour des nuits paisibles et sereines',
    duration: 7000,
    category: 'Chambres',
    active: true,
    order: 5
  },

  // 6. Salle de bain avec Jacuzzi (Placé immédiatement après les chambres)
  {
    id: 'seq-05-jacuzzi',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/08_espace_balneo_jacuzzi_privatif.webp',
    title: 'Salle de bain avec Jacuzzi',
    description: 'Offrez-vous un instant de bien-être et de relaxation absolue',
    duration: 7000,
    category: 'Bien-être',
    active: true,
    order: 6
  },

  // 7. Événements 1
  {
    id: 'seq-06-evenements-1',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/evenement_reception_01.webp',
    title: 'Vos Événements & Réceptions à Seven B',
    description: 'Séminaires, cocktails d\'entreprises, anniversaires et rencontres professionnelles',
    duration: 7000,
    category: 'Événements',
    active: true,
    order: 7
  },

  // 8. Événements 2
  {
    id: 'seq-07-evenements-2',
    type: 'announcement',
    imageUrl: '/selection_photos_tv/evenement_reception_02.webp',
    title: 'Organisation Clé en Main & Service Traiteur',
    description: 'Une équipe dédiée pour faire de chacune de vos célébrations une réussite inoubliable',
    duration: 7000,
    category: 'Célébrations',
    active: true,
    order: 8
  },

  // 9. Localisation (À la fin)
  {
    id: 'seq-08-localisation',
    type: 'map',
    imageUrl: '/selection_photos_tv/carte_bg.svg',
    title: 'Où sommes-nous ?',
    description: 'Maison Claude LISSANON, Rue 12578, Akogbato — Cotonou, Bénin',
    duration: 7000,
    category: 'Localisation',
    active: true,
    order: 9
  }
];
