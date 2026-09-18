import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Chemise Oversize en Pur Lin',
    nameAr: 'قميص كتان أوفرسايز فاخر',
    slug: 'chemise-oversize-lin',
    description: 'Une pièce maîtresse décontractée et raffinée, confectionnée dans un lin naturel respirant de première qualité. Coupe ample moderne, col classique et boutons en nacre véritable. Parfaite pour le climat algérien en toute saison.',
    descriptionAr: 'قطعة أنيقة وخفيفة مصنوعة من الكتان الطبيعي الفاخر 100%. قصة واسعة مريحة مع أزرار صدفية أصلية، مثالية للأجواء الصيفية والمناسبات اليومية في الجزائر.',
    price: 4900,
    salePrice: 4200,
    images: [
      '/images/linen_oversize_shirt_1789648499860.jpg'
    ],
    category: 'chemises',
    categoryFr: 'Chemises & Blouses',
    categoryAr: 'قمصان وبلوزات',
    collection: 'ete-alger',
    collectionFr: 'Capsule Lin & Soleil',
    collectionAr: 'تشكيلة الكتان والصيف',
    colors: [
      { name: 'Noir', hex: '#1A1A1A' },
      { name: 'Blanc Pur', hex: '#FFFFFF' },
      { name: 'Beige Sable', hex: '#D2B48C' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Lin Naturel Italien',
    materialAr: '100% كتان إيطالي طبيعي',
    sku: 'ZY-SH-001',
    stock: 22,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    createdAt: '2026-09-01T10:00:00Z',
    variants: [
      { id: 'v-001-1', productId: 'prod-001', color: 'Noir', colorHex: '#1A1A1A', size: 'S', stock: 2, sku: 'ZY-SH-001-BK-S' },
      { id: 'v-001-2', productId: 'prod-001', color: 'Noir', colorHex: '#1A1A1A', size: 'M', stock: 4, sku: 'ZY-SH-001-BK-M' },
      { id: 'v-001-3', productId: 'prod-001', color: 'Noir', colorHex: '#1A1A1A', size: 'L', stock: 2, sku: 'ZY-SH-001-BK-L' },
      { id: 'v-001-4', productId: 'prod-001', color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'S', stock: 3, sku: 'ZY-SH-001-WH-S' },
      { id: 'v-001-5', productId: 'prod-001', color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'M', stock: 5, sku: 'ZY-SH-001-WH-M' },
      { id: 'v-001-6', productId: 'prod-001', color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'L', stock: 0, sku: 'ZY-SH-001-WH-L' }, // Out of stock
      { id: 'v-001-7', productId: 'prod-001', color: 'Beige Sable', colorHex: '#D2B48C', size: 'S', stock: 1, sku: 'ZY-SH-001-BG-S' },
      { id: 'v-001-8', productId: 'prod-001', color: 'Beige Sable', colorHex: '#D2B48C', size: 'M', stock: 3, sku: 'ZY-SH-001-BG-M' },
      { id: 'v-001-9', productId: 'prod-001', color: 'Beige Sable', colorHex: '#D2B48C', size: 'L', stock: 2, sku: 'ZY-SH-001-BG-L' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Caftan Moderne Ceinture Métallique',
    nameAr: 'قفطان عصري مع حزام معدني راقي',
    slug: 'caftan-moderne-ceinture',
    description: 'Une réinterprétation contemporaine de l’héritage algérien. Confectionné dans un crêpe de soie lourd à tombé impérial avec broderie fine ton sur ton et ceinture dorée amovible martelée à la main.',
    descriptionAr: 'تصميم يجمع بين التراث الجزائري الفاخر واللمسة العصرية الراقية. قماش كريب حريري ثقيل بانسيابية ملكية وتطريز متقن مع حزام ذهبي أنيق.',
    price: 14800,
    images: [
      '/images/modern_caftan_dress_1789648482081.jpg'
    ],
    category: 'caftans',
    categoryFr: 'Caftans & Soirée',
    categoryAr: 'قفطان وسهرات',
    collection: 'alger-noir',
    collectionFr: 'Collection Cérémonie & Soir',
    collectionAr: 'تشكيلة المناسبات والسهرات',
    colors: [
      { name: 'Émeraude Royal', hex: '#0B5345' },
      { name: 'Noir Minuit', hex: '#111111' },
      { name: 'Ivoire Crème', hex: '#FDFBF7' }
    ],
    sizes: ['38 (S/M)', '40 (M/L)', '42 (L/XL)'],
    material: 'Crêpe de Soie & Fil d’Or Sfifa',
    materialAr: 'كريب حريري وخيوط السفيفة الذهبية',
    sku: 'ZY-CFT-002',
    stock: 11,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    createdAt: '2026-09-02T11:00:00Z',
    variants: [
      { id: 'v-002-1', productId: 'prod-002', color: 'Émeraude Royal', colorHex: '#0B5345', size: '38 (S/M)', stock: 2, sku: 'ZY-CFT-002-EM-38' },
      { id: 'v-002-2', productId: 'prod-002', color: 'Émeraude Royal', colorHex: '#0B5345', size: '40 (M/L)', stock: 2, sku: 'ZY-CFT-002-EM-40' },
      { id: 'v-002-3', productId: 'prod-002', color: 'Noir Minuit', colorHex: '#111111', size: '38 (S/M)', stock: 3, sku: 'ZY-CFT-002-BK-38' },
      { id: 'v-002-4', productId: 'prod-002', color: 'Noir Minuit', colorHex: '#111111', size: '40 (M/L)', stock: 2, sku: 'ZY-CFT-002-BK-40' },
      { id: 'v-002-5', productId: 'prod-002', color: 'Ivoire Crème', colorHex: '#FDFBF7', size: '38 (S/M)', stock: 1, sku: 'ZY-CFT-002-IV-38' },
      { id: 'v-002-6', productId: 'prod-002', color: 'Ivoire Crème', colorHex: '#FDFBF7', size: '40 (M/L)', stock: 1, sku: 'ZY-CFT-002-IV-40' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Blazer Croisé Laine Structuré "El Casbah"',
    nameAr: 'سترة بليزر صوفية مزدوجة الصدر',
    slug: 'blazer-croise-laine',
    description: 'Blazer d’architecte à la silhouette affirmée. Épaulettes structurées, boutonnage croisé à six boutons corne, doublure en satin soyeux. L’élégance urbaine absolue pour vos réunions et dîners.',
    descriptionAr: 'بليزر كلاسيكي عصري بقصة محكمة وكتفين مدمجين، أزرار عاجية وبطانة ستان ناعمة، يمنحك إطلالة راقية في العمل والمناسبات.',
    price: 11500,
    images: [
      '/images/wool_blazer_charcoal_1789648529813.jpg'
    ],
    category: 'vestes',
    categoryFr: 'Vestes & Blazers',
    categoryAr: 'سترات وبليزر',
    collection: 'intemporels',
    collectionFr: 'Les Intemporels ZAYA',
    collectionAr: 'التشكيلة الدائمة',
    colors: [
      { name: 'Taupe Cendré', hex: '#8B8589' },
      { name: 'Noir Charbon', hex: '#1C1C1C' }
    ],
    sizes: ['36', '38', '40', '42'],
    material: 'Drap de Laine Vierge & Satin',
    materialAr: 'صوف خالص وبطانة ستان',
    sku: 'ZY-BZ-003',
    stock: 14,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-08-25T14:00:00Z',
    variants: [
      { id: 'v-003-1', productId: 'prod-003', color: 'Taupe Cendré', colorHex: '#8B8589', size: '36', stock: 2, sku: 'ZY-BZ-003-TP-36' },
      { id: 'v-003-2', productId: 'prod-003', color: 'Taupe Cendré', colorHex: '#8B8589', size: '38', stock: 3, sku: 'ZY-BZ-003-TP-38' },
      { id: 'v-003-3', productId: 'prod-003', color: 'Taupe Cendré', colorHex: '#8B8589', size: '40', stock: 1, sku: 'ZY-BZ-003-TP-40' },
      { id: 'v-003-4', productId: 'prod-003', color: 'Noir Charbon', colorHex: '#1C1C1C', size: '36', stock: 2, sku: 'ZY-BZ-003-BK-36' },
      { id: 'v-003-5', productId: 'prod-003', color: 'Noir Charbon', colorHex: '#1C1C1C', size: '38', stock: 4, sku: 'ZY-BZ-003-BK-38' },
      { id: 'v-003-6', productId: 'prod-003', color: 'Noir Charbon', colorHex: '#1C1C1C', size: '40', stock: 2, sku: 'ZY-BZ-003-BK-40' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Pantalon Palazzo Plissé Fluide',
    nameAr: 'بنطال بالازو بليسيه انسيابي',
    slug: 'pantalon-palazzo-plisse',
    description: 'Taille haute élastiquée ultra confortable, plissé permanent raffiné qui allonge la silhouette. Matière aérienne ne froissant jamais, idéale pour voyager ou flâner à Sidi Yahia.',
    descriptionAr: 'خصر عالي مريح مع ثنيات دائمة أنيقة تمنح قواماً رشيقاً وممشوقاً. قماش خفيف وناعم لا يتجعد أبداً، مناسب للتنقل والإطلالات اليومية.',
    price: 6200,
    images: [
      '/images/palazzo_pants_model_1789648513258.jpg'
    ],
    category: 'pantalons',
    categoryFr: 'Pantalons & Ensembles',
    categoryAr: 'سراويل وأطقم',
    collection: 'ete-alger',
    collectionFr: 'Capsule Lin & Soleil',
    collectionAr: 'تشكيلة الكتان والصيف',
    colors: [
      { name: 'Moka Chaud', hex: '#5E4839' },
      { name: 'Beige Nacré', hex: '#E7DFD5' },
      { name: 'Noir', hex: '#151515' }
    ],
    sizes: ['S', 'M', 'L'],
    material: 'Crêpe Japonais Infroissable',
    materialAr: 'كريب ياباني فاخر مقاوم للتجعد',
    sku: 'ZY-PZ-004',
    stock: 18,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    createdAt: '2026-09-03T16:00:00Z',
    variants: [
      { id: 'v-004-1', productId: 'prod-004', color: 'Moka Chaud', colorHex: '#5E4839', size: 'S', stock: 2, sku: 'ZY-PZ-004-MK-S' },
      { id: 'v-004-2', productId: 'prod-004', color: 'Moka Chaud', colorHex: '#5E4839', size: 'M', stock: 3, sku: 'ZY-PZ-004-MK-M' },
      { id: 'v-004-3', productId: 'prod-004', color: 'Beige Nacré', colorHex: '#E7DFD5', size: 'S', stock: 4, sku: 'ZY-PZ-004-BG-S' },
      { id: 'v-004-4', productId: 'prod-004', color: 'Beige Nacré', colorHex: '#E7DFD5', size: 'M', stock: 4, sku: 'ZY-PZ-004-BG-M' },
      { id: 'v-004-5', productId: 'prod-004', color: 'Noir', colorHex: '#151515', size: 'S', stock: 2, sku: 'ZY-PZ-004-BK-S' },
      { id: 'v-004-6', productId: 'prod-004', color: 'Noir', colorHex: '#151515', size: 'M', stock: 3, sku: 'ZY-PZ-004-BK-M' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Kimono Abaya Minimaliste en Crêpe de Soie',
    nameAr: 'عباية كيمونو عصرية من كريب الحرير',
    slug: 'kimono-abaya-minimaliste',
    description: 'Coupe épurée inspirée du design contemporain. Manches kimono évasées, finitions invisibles faites à la main, fentes latérales délicates. Se porte aussi bien ouverte sur un jean que ceinturée en soirée.',
    descriptionAr: 'قصة واسعة انسيابية بأكمام كيمونو رحبة وتشطيب يدوي متقن. يمكن ارتداؤها مفتوحة لمظهر يومي شبابي أو مع حزام للمناسبات.',
    price: 9800,
    images: [
      '/images/abaya_kimono_silk_1789648470680.jpg'
    ],
    category: 'caftans',
    categoryFr: 'Caftans & Soirée',
    categoryAr: 'قفطان وسهرات',
    collection: 'intemporels',
    collectionFr: 'Les Intemporels ZAYA',
    collectionAr: 'التشكيلة الدائمة',
    colors: [
      { name: 'Vert Sauge', hex: '#77815C' },
      { name: 'Bleu Nuit', hex: '#1C2833' },
      { name: 'Terre Cuite', hex: '#A0522D' }
    ],
    sizes: ['Standard 1 (155-165cm)', 'Standard 2 (165-175cm)'],
    material: 'Crêpe Georgette de Soie',
    materialAr: 'كريب جورجيت حريري فاخر',
    sku: 'ZY-AB-005',
    stock: 4,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    createdAt: '2026-09-05T09:00:00Z',
    variants: [
      { id: 'v-005-1', productId: 'prod-005', color: 'Vert Sauge', colorHex: '#77815C', size: 'Standard 1 (155-165cm)', stock: 1, sku: 'ZY-AB-005-VS-1' },
      { id: 'v-005-2', productId: 'prod-005', color: 'Vert Sauge', colorHex: '#77815C', size: 'Standard 2 (165-175cm)', stock: 1, sku: 'ZY-AB-005-VS-2' },
      { id: 'v-005-3', productId: 'prod-005', color: 'Bleu Nuit', colorHex: '#1C2833', size: 'Standard 1 (155-165cm)', stock: 1, sku: 'ZY-AB-005-BN-1' },
      { id: 'v-005-4', productId: 'prod-005', color: 'Bleu Nuit', colorHex: '#1C2833', size: 'Standard 2 (165-175cm)', stock: 1, sku: 'ZY-AB-005-BN-2' },
      { id: 'v-005-5', productId: 'prod-005', color: 'Terre Cuite', colorHex: '#A0522D', size: 'Standard 1 (155-165cm)', stock: 0, sku: 'ZY-AB-005-TC-1' }
    ]
  },
  {
    id: 'prod-006',
    name: 'Sac Besace Cuir Véritable "Al-Djazair"',
    nameAr: 'حقيبة يد جلد طبيعي أصلي صناعة جزائرية',
    slug: 'sac-besace-cuir-djazair',
    description: 'Façonné dans un atelier de maroquinerie d’art à Alger. Cuir de vachette pleine fleur au tannage végétal, fermoir mousqueton doré vieilli, bandoulière réglable. Un hommage au savoir-faire local.',
    descriptionAr: 'صنعت يدوياً في ورشة جلدية عريقة بالجزائر العاصمة. جلد بقري طبيعي 100% مدبوغ بمواد نباتية ومزين بإبزيم ذهبي متين.',
    price: 8900,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop'
    ],
    category: 'accessoires',
    categoryFr: 'Accessoires & Maroquinerie',
    categoryAr: 'إكسسوارات وحقائب',
    collection: 'intemporels',
    collectionFr: 'Les Intemporels ZAYA',
    collectionAr: 'التشكيلة الدائمة',
    colors: [
      { name: 'Cognac Ambré', hex: '#9E4714' },
      { name: 'Noir Ebène', hex: '#1C1C1C' }
    ],
    sizes: ['Format Unique'],
    material: '100% Cuir Pleine Fleur & Laiton',
    materialAr: '100% جلد طبيعي مع نحاس أصلي',
    sku: 'ZY-BG-006',
    stock: 3,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-08-20T10:00:00Z',
    variants: [
      { id: 'v-006-1', productId: 'prod-006', color: 'Cognac Ambré', colorHex: '#9E4714', size: 'Format Unique', stock: 2, sku: 'ZY-BG-006-CG-U' },
      { id: 'v-006-2', productId: 'prod-006', color: 'Noir Ebène', colorHex: '#1C1C1C', size: 'Format Unique', stock: 1, sku: 'ZY-BG-006-BK-U' }
    ]
  },
  {
    id: 'prod-007',
    name: 'Robe Longue Satinée Drapée "Zine"',
    nameAr: 'فستان سهرة ستان فاخر مع درابيه',
    slug: 'robe-longue-satinee-zine',
    description: 'Élégance sculpturale pour les soirées et célébrations. Décolleté bénitier subtil, drapé asymétrique flatteur et fente latérale mesurée. Confection luxueuse dans un satin soyeux et lumineux.',
    descriptionAr: 'فستان سهرة ساحر من الستان اللامع بقصة درابيه أنثوية راقية وتفاصيل مميزة، يضفي إطلالة ملكية في الأعراس والمناسبات الكبرى.',
    price: 13200,
    salePrice: 11900,
    images: [
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=1200&auto=format&fit=crop'
    ],
    category: 'robes',
    categoryFr: 'Robes & Ensembles',
    categoryAr: 'فساتين وأطقم',
    collection: 'alger-noir',
    collectionFr: 'Collection Cérémonie & Soir',
    collectionAr: 'تشكيلة المناسبات والسهرات',
    colors: [
      { name: 'Rouge Brique', hex: '#8B2500' },
      { name: 'Champagne Doré', hex: '#F7E7CE' },
      { name: 'Vert Forêt', hex: '#1E4620' }
    ],
    sizes: ['36 (S)', '38 (M)', '40 (L)'],
    material: 'Satin Duchesse Soyeux',
    materialAr: 'ستان دوشيس حريري ناعم',
    sku: 'ZY-DR-007',
    stock: 12,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    createdAt: '2026-09-06T15:30:00Z',
    variants: [
      { id: 'v-007-1', productId: 'prod-007', color: 'Rouge Brique', colorHex: '#8B2500', size: '36 (S)', stock: 2, sku: 'ZY-DR-007-RB-36' },
      { id: 'v-007-2', productId: 'prod-007', color: 'Rouge Brique', colorHex: '#8B2500', size: '38 (M)', stock: 3, sku: 'ZY-DR-007-RB-38' },
      { id: 'v-007-3', productId: 'prod-007', color: 'Champagne Doré', colorHex: '#F7E7CE', size: '36 (S)', stock: 2, sku: 'ZY-DR-007-CH-36' },
      { id: 'v-007-4', productId: 'prod-007', color: 'Champagne Doré', colorHex: '#F7E7CE', size: '38 (M)', stock: 2, sku: 'ZY-DR-007-CH-38' },
      { id: 'v-007-5', productId: 'prod-007', color: 'Vert Forêt', colorHex: '#1E4620', size: '38 (M)', stock: 2, sku: 'ZY-DR-007-VF-38' },
      { id: 'v-007-6', productId: 'prod-007', color: 'Vert Forêt', colorHex: '#1E4620', size: '40 (L)', stock: 1, sku: 'ZY-DR-007-VF-40' }
    ]
  },
  {
    id: 'prod-008',
    name: 'Pull Col Montant Maille Fine Côtelée',
    nameAr: 'كنزة صوفية ناعمة بياقة عالية',
    slug: 'pull-col-montant-maille',
    description: 'Tricot fin et chaud, toucher cachemire d’une douceur incomparable. Silhouette ajustée, poignets allongés élégants, idéal sous un trench ou avec notre pantalon palazzo.',
    descriptionAr: 'كنزة خفيفة ودافئة بملمس الكشمير فائق النعومة، قصة ملائمة للجسم وياقة مرتفعة، تناسب إطلالات العمل والخريف والشتاء.',
    price: 5400,
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1200&auto=format&fit=crop'
    ],
    category: 'chemises',
    categoryFr: 'Chemises & Blouses',
    categoryAr: 'قمصان وبلوزات',
    collection: 'intemporels',
    collectionFr: 'Les Intemporels ZAYA',
    collectionAr: 'التشكيلة الدائمة',
    colors: [
      { name: 'Caramel Doré', hex: '#AF6E4D' },
      { name: 'Crème Écru', hex: '#FFFDD0' },
      { name: 'Chocolat Intense', hex: '#3D2817' }
    ],
    sizes: ['S', 'M', 'L'],
    material: 'Laine Mérinos & Modal Toucher Cachemire',
    materialAr: 'صوف ميرينو ومودال فائق النعومة',
    sku: 'ZY-SW-008',
    stock: 15,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    createdAt: '2026-08-15T12:00:00Z',
    variants: [
      { id: 'v-008-1', productId: 'prod-008', color: 'Caramel Doré', colorHex: '#AF6E4D', size: 'S', stock: 3, sku: 'ZY-SW-008-CR-S' },
      { id: 'v-008-2', productId: 'prod-008', color: 'Caramel Doré', colorHex: '#AF6E4D', size: 'M', stock: 4, sku: 'ZY-SW-008-CR-M' },
      { id: 'v-008-3', productId: 'prod-008', color: 'Crème Écru', colorHex: '#FFFDD0', size: 'S', stock: 3, sku: 'ZY-SW-008-EC-S' },
      { id: 'v-008-4', productId: 'prod-008', color: 'Crème Écru', colorHex: '#FFFDD0', size: 'M', stock: 3, sku: 'ZY-SW-008-EC-M' },
      { id: 'v-008-5', productId: 'prod-008', color: 'Chocolat Intense', colorHex: '#3D2817', size: 'M', stock: 2, sku: 'ZY-SW-008-CH-M' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', nameFr: 'Tous les modèles', nameAr: 'جميع الموديلات', count: 8 },
  { id: 'chemises', nameFr: 'Chemises & Blouses', nameAr: 'قمصان وبلوزات', count: 2 },
  { id: 'caftans', nameFr: 'Caftans & Soirée', nameAr: 'قفطان وسهرات', count: 2 },
  { id: 'vestes', nameFr: 'Vestes & Blazers', nameAr: 'سترات وبليزر', count: 1 },
  { id: 'pantalons', nameFr: 'Pantalons & Ensembles', nameAr: 'سراويل وأطقم', count: 1 },
  { id: 'robes', nameFr: 'Robes & Ensembles', nameAr: 'فساتين وأطقم', count: 1 },
  { id: 'accessoires', nameFr: 'Maroquinerie & Accessoires', nameAr: 'إكسسوارات وحقائب', count: 1 },
];

export const COLLECTIONS = [
  { id: 'all', nameFr: 'Toutes les collections', nameAr: 'كل التشكيلات' },
  { id: 'ete-alger', nameFr: 'Capsule Lin & Soleil', nameAr: 'تشكيلة الكتان والصيف' },
  { id: 'alger-noir', nameFr: 'Collection Cérémonie & Soir', nameAr: 'تشكيلة المناسبات والسهرات' },
  { id: 'intemporels', nameFr: 'Les Intemporels ZAYA', nameAr: 'التشكيلة الدائمة' }
];

export const INITIAL_DISCOUNTS = [
  {
    id: 'disc-01',
    code: 'BIENVENUE10',
    type: 'percentage' as const,
    value: 10,
    minOrder: 4000,
    active: true,
    usedCount: 14
  },
  {
    id: 'disc-02',
    code: 'SAHRA1000',
    type: 'fixed' as const,
    value: 1000,
    minOrder: 10000,
    active: true,
    usedCount: 8
  },
  {
    id: 'disc-03',
    code: 'LIVRAISON_ALGER',
    type: 'fixed' as const,
    value: 400,
    minOrder: 8000,
    active: true,
    usedCount: 22
  }
];
