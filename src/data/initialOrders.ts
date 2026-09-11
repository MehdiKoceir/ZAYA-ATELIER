import { Order, CustomerCRM, StockMovement } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'DZ-2609-1024',
    customerName: 'Sarah Benali',
    phone: '0550123456',
    wilayaCode: 16,
    wilayaName: 'Alger',
    commune: 'Hydra',
    address: 'Résidence Les Pins, Apt 14, Sidi Yahia',
    deliveryMethod: 'home',
    deliveryFee: 400,
    subtotal: 19700,
    discount: 1000,
    discountCode: 'SAHRA1000',
    total: 19100,
    status: 'preparing',
    paymentMethod: 'COD',
    customerNotes: 'Veuillez appeler avant de livrer s’il vous plaît (après 16h)',
    internalNotes: 'Cliente fidèle. Emballage cadeau ZAYA demandé.',
    createdAt: '2026-09-10T14:22:00Z',
    items: [
      {
        productId: 'prod-002',
        variantId: 'v-002-1',
        productName: 'Caftan Moderne Ceinture Métallique',
        color: 'Émeraude Royal',
        size: '38 (S/M)',
        quantity: 1,
        unitPrice: 14800,
        total: 14800,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&auto=format&fit=crop'
      },
      {
        productId: 'prod-001',
        variantId: 'v-001-2',
        productName: 'Chemise Oversize en Pur Lin',
        color: 'Noir',
        size: 'M',
        quantity: 1,
        unitPrice: 4900,
        total: 4900,
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=300&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'pending', timestamp: '2026-09-10T14:22:00Z', note: 'Commande reçue sur le site' },
      { status: 'confirmed', timestamp: '2026-09-10T14:45:00Z', note: 'Confirmée par téléphone avec la cliente' },
      { status: 'preparing', timestamp: '2026-09-10T16:00:00Z', note: 'Préparation du colis à l’atelier' }
    ]
  },
  {
    id: 'DZ-2609-1023',
    customerName: 'Amina Mansouri',
    phone: '0661987654',
    wilayaCode: 31,
    wilayaName: 'Oran',
    commune: 'Bir El Djir',
    address: 'Boulevard Millenium, Bureau Yalidine Express',
    deliveryMethod: 'desk',
    deliveryFee: 400,
    subtotal: 11500,
    discount: 0,
    total: 11900,
    status: 'shipped',
    paymentMethod: 'COD',
    customerNotes: 'Livraison au bureau Yalidine Millenium Oran',
    internalNotes: 'Bordereau Yalidine #YAL-8839201 généré',
    createdAt: '2026-09-09T18:10:00Z',
    items: [
      {
        productId: 'prod-003',
        variantId: 'v-003-2',
        productName: 'Blazer Croisé Laine Structuré "El Casbah"',
        color: 'Taupe Cendré',
        size: '38',
        quantity: 1,
        unitPrice: 11500,
        total: 11500,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=300&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'pending', timestamp: '2026-09-09T18:10:00Z', note: 'Commande passée' },
      { status: 'confirmed', timestamp: '2026-09-09T19:00:00Z', note: 'Confirmation automatique WhatsApp' },
      { status: 'preparing', timestamp: '2026-09-10T09:30:00Z', note: 'Emballage terminé' },
      { status: 'shipped', timestamp: '2026-09-10T11:00:00Z', note: 'Remis au transporteur Yalidine' }
    ]
  },
  {
    id: 'DZ-2609-1022',
    customerName: 'Meriem Haddad',
    phone: '0770554433',
    wilayaCode: 25,
    wilayaName: 'Constantine',
    commune: 'Ali Mendjeli',
    address: 'UV 05, Bâtiment C12, Porte 4',
    deliveryMethod: 'home',
    deliveryFee: 650,
    subtotal: 6200,
    discount: 0,
    total: 6850,
    status: 'delivered',
    paymentMethod: 'COD',
    customerNotes: 'Sonnez à l’interphone Haddad',
    internalNotes: 'Paiement en espèces 6850 DA encaissé par le livreur',
    createdAt: '2026-09-07T11:30:00Z',
    items: [
      {
        productId: 'prod-004',
        variantId: 'v-004-3',
        productName: 'Pantalon Palazzo Plissé Fluide',
        color: 'Beige Nacré',
        size: 'S',
        quantity: 1,
        unitPrice: 6200,
        total: 6200,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'pending', timestamp: '2026-09-07T11:30:00Z' },
      { status: 'confirmed', timestamp: '2026-09-07T12:00:00Z' },
      { status: 'preparing', timestamp: '2026-09-07T15:00:00Z' },
      { status: 'shipped', timestamp: '2026-09-08T08:30:00Z' },
      { status: 'out_for_delivery', timestamp: '2026-09-09T09:00:00Z' },
      { status: 'delivered', timestamp: '2026-09-09T13:45:00Z', note: 'Colis remis en main propre' }
    ]
  },
  {
    id: 'DZ-2609-1021',
    customerName: 'Yassine Boudiaf',
    phone: '0555882211',
    wilayaCode: 9,
    wilayaName: 'Blida',
    commune: 'Boufarik',
    address: 'Cité 500 Logements, Bloc 12',
    deliveryMethod: 'home',
    deliveryFee: 500,
    subtotal: 8900,
    discount: 890,
    discountCode: 'BIENVENUE10',
    total: 8510,
    status: 'delivered',
    paymentMethod: 'COD',
    customerNotes: 'Cadeau pour mon épouse',
    internalNotes: 'Succès - cliente très satisfaite, avis 5 étoiles sur Instagram',
    createdAt: '2026-09-06T09:15:00Z',
    items: [
      {
        productId: 'prod-006',
        variantId: 'v-006-1',
        productName: 'Sac Besace Cuir Véritable "Al-Djazair"',
        color: 'Cognac Ambré',
        size: 'Format Unique',
        quantity: 1,
        unitPrice: 8900,
        total: 8900,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'pending', timestamp: '2026-09-06T09:15:00Z' },
      { status: 'confirmed', timestamp: '2026-09-06T09:40:00Z' },
      { status: 'preparing', timestamp: '2026-09-06T11:00:00Z' },
      { status: 'shipped', timestamp: '2026-09-06T14:30:00Z' },
      { status: 'delivered', timestamp: '2026-09-07T11:20:00Z' }
    ]
  },
  {
    id: 'DZ-2609-1020',
    customerName: 'Lyna Cherif',
    phone: '0670112233',
    wilayaCode: 19,
    wilayaName: 'Sétif',
    commune: 'Sétif',
    address: 'Quartier Bel-Air, Rue 1er Novembre',
    deliveryMethod: 'home',
    deliveryFee: 700,
    subtotal: 13200,
    discount: 0,
    total: 13900,
    status: 'pending',
    paymentMethod: 'COD',
    customerNotes: 'Merci de vérifier si la taille 38 correspond bien à un 38 français',
    internalNotes: 'À appeler pour confirmation de taille avant expédition',
    createdAt: '2026-09-11T08:45:00Z',
    items: [
      {
        productId: 'prod-007',
        variantId: 'v-007-2',
        productName: 'Robe Longue Satinée Drapée "Zine"',
        color: 'Rouge Brique',
        size: '38 (M)',
        quantity: 1,
        unitPrice: 13200,
        total: 13200,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=300&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'pending', timestamp: '2026-09-11T08:45:00Z', note: 'Nouvelle commande COD en attente de confirmation' }
    ]
  }
];

export const INITIAL_CUSTOMERS: CustomerCRM[] = [
  {
    id: 'cust-01',
    name: 'Sarah Benali',
    phone: '0550123456',
    wilaya: 'Alger (16)',
    commune: 'Hydra',
    totalOrders: 4,
    totalSpent: 48500,
    lastOrderDate: '2026-09-10',
    status: 'vip'
  },
  {
    id: 'cust-02',
    name: 'Amina Mansouri',
    phone: '0661987654',
    wilaya: 'Oran (31)',
    commune: 'Bir El Djir',
    totalOrders: 2,
    totalSpent: 24300,
    lastOrderDate: '2026-09-09',
    status: 'regular'
  },
  {
    id: 'cust-03',
    name: 'Meriem Haddad',
    phone: '0770554433',
    wilaya: 'Constantine (25)',
    commune: 'Ali Mendjeli',
    totalOrders: 1,
    totalSpent: 6850,
    lastOrderDate: '2026-09-07',
    status: 'new'
  },
  {
    id: 'cust-04',
    name: 'Yassine Boudiaf',
    phone: '0555882211',
    wilaya: 'Blida (09)',
    commune: 'Boufarik',
    totalOrders: 3,
    totalSpent: 27900,
    lastOrderDate: '2026-09-06',
    status: 'regular'
  },
  {
    id: 'cust-05',
    name: 'Lyna Cherif',
    phone: '0670112233',
    wilaya: 'Sétif (19)',
    commune: 'Sétif',
    totalOrders: 1,
    totalSpent: 13900,
    lastOrderDate: '2026-09-11',
    status: 'new'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-01',
    productId: 'prod-002',
    variantId: 'v-002-1',
    productName: 'Caftan Moderne Ceinture',
    variantLabel: 'Émeraude Royal / 38 (S/M)',
    change: -1,
    newStock: 2,
    reason: 'order',
    referenceId: 'DZ-2609-1024',
    timestamp: '2026-09-10T14:22:00Z'
  },
  {
    id: 'mov-02',
    productId: 'prod-001',
    variantId: 'v-001-2',
    productName: 'Chemise Oversize Lin',
    variantLabel: 'Noir / M',
    change: -1,
    newStock: 4,
    reason: 'order',
    referenceId: 'DZ-2609-1024',
    timestamp: '2026-09-10T14:22:00Z'
  },
  {
    id: 'mov-03',
    productId: 'prod-003',
    variantId: 'v-003-2',
    productName: 'Blazer Croisé Laine',
    variantLabel: 'Taupe Cendré / 38',
    change: -1,
    newStock: 3,
    reason: 'order',
    referenceId: 'DZ-2609-1023',
    timestamp: '2026-09-09T18:10:00Z'
  },
  {
    id: 'mov-04',
    productId: 'prod-001',
    variantId: 'v-001-5',
    productName: 'Chemise Oversize Lin',
    variantLabel: 'Blanc Pur / M',
    change: +5,
    newStock: 5,
    reason: 'restock',
    referenceId: 'RECEPTION-ATELIER-04',
    timestamp: '2026-09-08T11:00:00Z'
  }
];
