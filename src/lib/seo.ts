import { Product, Language } from '../types';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
  jsonLd?: Record<string, any>;
  ogSiteName?: string;
  robots?: string;
}

export interface CollectionCategorySEO {
  id: string;
  nameFr: string;
  nameAr: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  keywords: string[];
}

export const COLLECTION_CATEGORIES_SEO: Record<string, CollectionCategorySEO> = {
  all: {
    id: 'all',
    nameFr: 'Toutes les Créations',
    nameAr: 'جميع الإبداعات',
    titleFr: 'Collection Couture & Prêt-à-Porter Féminin | ZAYA Atelier',
    titleAr: 'مجموعة الأزياء الراقية والجاهزة النسائية | دار زايا الجزائر',
    descriptionFr: 'Explorez la collection exclusive ZAYA Atelier : caftans modernes, robes fluides, chemises en pur lin et blazers structurés. Livraison 58 Wilayas avec paiement à la livraison.',
    descriptionAr: 'استكشفي تشكيلة دار زايا الحصرية: قفاطين معاصرة، فساتين انسيابية، قمصان كتان نقي وسترات مفصلة بأرقى معايير الخياطة الجزائرية مع توصيل لـ 58 ولاية.',
    keywords: [
      'mode algerienne',
      'zaya atelier',
      'pret a porter algerie',
      'boutique luxe alger',
      'vetements femme algerie',
      'livraison 58 wilayas'
    ]
  },
  caftans: {
    id: 'caftans',
    nameFr: 'Caftans & Soirée',
    nameAr: 'قفطان وسهرات',
    titleFr: 'Caftans Contemporains & Tenues de Soirée Brodés | ZAYA Atelier',
    titleAr: 'قفاطين عصرية وأزياء سهرة مطرزة يدويًا | دار زايا',
    descriptionFr: 'Sublimez vos cérémonies avec nos caftans modernes brodés main. Étoffes soyeuses, finitions dorées et coupes fluides. Confection artisanale à Alger & livraison express 58 Wilayas.',
    descriptionAr: 'تألقي في سهراتك وأعراسك مع قفاطين زايا العصرية المطرزة يدويًا. أقمشة فاخرة، لمسات أصيلة وقصات انسيابية راقية مع توصيل سريع والدفع عند الاستلام.',
    keywords: [
      'caftan moderne algerie',
      'caftan soiree alger',
      'tenue fete algerienne',
      'caftan brode main',
      'karakou moderne',
      'haute couture algerie'
    ]
  },
  chemises: {
    id: 'chemises',
    nameFr: 'Chemises en Lin',
    nameAr: 'قمصان الكتان',
    titleFr: 'Chemises en Pur Lin Italien & Coupes Fluides | ZAYA Atelier',
    titleAr: 'قمصان من الكتان الإيطالي النقي بقصات عصرية | دار زايا',
    descriptionFr: 'Chemises oversize et tuniques légères confectionnées en pur lin naturel. Respirantes, chics et minimalistes pour votre quotidien raffiné en Algérie. Livraison à domicile.',
    descriptionAr: 'قمصان فضفاضة وتونيكات مريحة مصنوعة من أجود أنواع الكتان الطبيعي. أناقة وانتعاش يومي يناسب المرأة العصرية مع توصيل لجميع الولايات.',
    keywords: [
      'chemise lin femme algerie',
      'chemisier oversize alger',
      'lin naturel algerie',
      'tunique ete algerie',
      'mode sobre chic'
    ]
  },
  vestes: {
    id: 'vestes',
    nameFr: 'Vestes & Blazers',
    nameAr: 'سترات وبليزر',
    titleFr: 'Blazers Structurés & Vestes de Tailleur Couture | ZAYA Atelier',
    titleAr: 'سترات بليزر مفصلة وبدلات نسائية راقية | دار زايا',
    descriptionFr: 'Tailleurs modernes et vestes structurées aux lignes impeccables. Tissus d’exception, épaulettes travaillées et allure affirmée pour le bureau ou les réceptions.',
    descriptionAr: 'بليزرات أنيقة وبدلات رسمية نسائية مصممة بخطوط هندسية متناسقة وخامات راقية لتعزيز ثقتك وإطلالتك في العمل والمناسبات الرسمية.',
    keywords: [
      'blazer femme algerie',
      'veste tailleur alger',
      'costume femme chic',
      'blazer oversize algerie',
      'tailleur alger'
    ]
  },
  pantalons: {
    id: 'pantalons',
    nameFr: 'Pantalons & Ensembles',
    nameAr: 'بناطيل وأطقم',
    titleFr: 'Pantalons Taille Haute & Ensembles Coordonnés | ZAYA Atelier',
    titleAr: 'بناطيل عالية الخصر وأطقم متناسقة أنيقة | دار زايا',
    descriptionFr: 'Pantalons palazzo, coupes cigarettes élégantes et ensembles fluides assortis. Confort absolu, tombé noble et confection minutieuse dans nos ateliers.',
    descriptionAr: 'بناطيل بالازو عصرية، سراويل كلاسيكية وأطقم متناسقة توفر راحة فائقة ومظهرًا أنيقًا ومميزًا لجميع أوقات يومك.',
    keywords: [
      'pantalon palazzo algerie',
      'ensemble femme alger',
      'pantalon taille haute',
      'ensemble chic algerie',
      'mode feminine alger'
    ]
  },
  robes: {
    id: 'robes',
    nameFr: 'Robes Fluides',
    nameAr: 'فساتين عصرية',
    titleFr: 'Robes Longues Fluides & Tenues d’Exception | ZAYA Atelier',
    titleAr: 'فساتين طويلة انسيابية وأزياء راقية | دار زايا',
    descriptionFr: 'Découvrez nos robes longues fluides, soieries délicates et coupes amples élégantes. Un style intemporel fusionnant modernité et pudeur algérienne. Commande en ligne sécurisée.',
    descriptionAr: 'تشكيلة فساتين طويلة واسعة بقماش ناعم وخفيف يجمع بين الحشمة والأناقة العصرية الرفيعة. خدمة عملاء ودفع آمن عند الاستلام.',
    keywords: [
      'robe longue algerie',
      'robe fluide alger',
      'robe soiree algerienne',
      'robe modeste alger',
      'abaya chic algerie'
    ]
  },
  accessoires: {
    id: 'accessoires',
    nameFr: 'Maroquinerie & Sacs',
    nameAr: 'حقائب جلدية',
    titleFr: 'Maroquinerie de Luxe & Sacs en Cuir Véritable | ZAYA Atelier',
    titleAr: 'حقائب نسائية فاخرة من الجلد الطبيعي | دار زايا',
    descriptionFr: 'Sacs à main en cuir pleine fleur, minaudières de fête et maroquinerie d’artisanat d’art. La touche finale de prestige pour toutes vos silhouettes ZAYA.',
    descriptionAr: 'حقائب يد من الجلد الطبيعي وحقائب سهرة صممت بحرفية عالية لتكون اللمسة التكميلية المثالية لإطلالتك الفاخرة.',
    keywords: [
      'sac cuir algerie',
      'maroquinerie luxe alger',
      'sac a main femme alger',
      'pochette soiree algerie',
      'cuir artisanal algerie'
    ]
  }
};

/**
 * Generate unique, detailed SEO metadata for an individual product
 */
export function generateProductSEO(
  product: Product,
  language: Language = 'fr'
): SEOMetadata {
  const isArabic = language === 'ar';
  const productName = isArabic && product.nameAr ? product.nameAr : product.name;
  const productMaterial = isArabic && product.materialAr ? product.materialAr : product.material;
  const productCategory = isArabic && product.categoryAr ? product.categoryAr : product.categoryFr || product.category;
  
  const currentPrice = product.salePrice ?? product.price;
  const formattedPrice = `${currentPrice.toLocaleString('fr-FR')} DA`;
  
  // Create a crisp, uniquely descriptive SEO meta description (120-160 chars)
  const descriptionFr = `${product.name} en ${productMaterial} (${formattedPrice}). ${product.description.slice(0, 75).trim()}... Confection artisanale à Alger, livraison 58 Wilayas et paiement à la livraison.`;
  const descriptionAr = `تسوقي ${productName} من قماش ${productMaterial} بسعر ${formattedPrice} لدى دار زايا. ${product.descriptionAr ? product.descriptionAr.slice(0, 60).trim() + '...' : ''} دفع عند الاستلام لـ 58 ولاية.`;

  const titleFr = `${product.name} | ${productCategory} | ZAYA Atelier Alger`;
  const titleAr = `${productName} | ${productCategory} | دار زايا الجزائر`;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zaya-atelier.dz';
  const canonicalUrl = `${origin}/collection?product=${encodeURIComponent(product.id)}`;
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';

  // Schema.org Product Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: product.images || [mainImage],
    description: isArabic && product.descriptionAr ? product.descriptionAr : product.description,
    sku: product.sku || product.id,
    category: productCategory,
    material: productMaterial,
    brand: {
      '@type': 'Brand',
      name: 'ZAYA Atelier'
    },
    ...(product.reviewCount && product.reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating || 5.0,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    } : {}),
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'DZD',
      price: currentPrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ZAYA Atelier',
        url: origin
      }
    }
  };

  return {
    title: isArabic ? titleAr : titleFr,
    description: isArabic ? descriptionAr : descriptionFr,
    keywords: [
      product.name.toLowerCase(),
      productCategory.toLowerCase(),
      productMaterial.toLowerCase(),
      'mode algerie',
      'zaya atelier',
      'achat vetement alger'
    ],
    canonical: canonicalUrl,
    type: 'product',
    image: mainImage,
    jsonLd
  };
}

/**
 * Generate SEO metadata for a collection category
 */
export function generateCollectionSEO(
  categoryId: string = 'all',
  language: Language = 'fr'
): SEOMetadata {
  const isArabic = language === 'ar';
  const categoryConfig = COLLECTION_CATEGORIES_SEO[categoryId] || COLLECTION_CATEGORIES_SEO.all;
  
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zaya-atelier.dz';
  const canonicalUrl = `${origin}/collection${categoryId !== 'all' ? `?category=${encodeURIComponent(categoryId)}` : ''}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isArabic ? categoryConfig.nameAr : categoryConfig.nameFr,
    headline: isArabic ? categoryConfig.titleAr : categoryConfig.titleFr,
    description: isArabic ? categoryConfig.descriptionAr : categoryConfig.descriptionFr,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'ZAYA Atelier',
      url: origin
    }
  };

  return {
    title: isArabic ? categoryConfig.titleAr : categoryConfig.titleFr,
    description: isArabic ? categoryConfig.descriptionAr : categoryConfig.descriptionFr,
    keywords: categoryConfig.keywords,
    canonical: canonicalUrl,
    type: 'website',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    jsonLd
  };
}

/**
 * Static route SEO metadata registry
 */
export const STATIC_PAGES_SEO: Record<string, {
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  keywords: string[];
}> = {
  '/': {
    titleFr: 'ZAYA Atelier | Maison de Haute Couture & Prêt-à-Porter Alger',
    titleAr: 'دار زايا | دار أزياء راقية وأناقة جزائرية معاصرة',
    descriptionFr: 'Maison de couture algérienne contemporaine. Découvrez nos créations exclusives, caftans modernes et collections intemporelles. Livraison 58 Wilayas & paiement à la livraison.',
    descriptionAr: 'دار أزياء جزائرية معاصرة. اكتشفي إبداعاتنا الحصرية، قفاطين مودرن وتصاميم أصلية تجمع بين الهوية والأناقة مع الدفع عند الاستلام في 58 ولاية.',
    keywords: ['zaya atelier', 'couture algerie', 'mode algerienne', 'caftan alger', 'pret a porter luxe alger']
  },
  '/about': {
    titleFr: 'Notre Atelier & Savoir-Faire Artisanal | ZAYA Atelier',
    titleAr: 'تاريخ دار زايا والحرفية الأصيلة في الجزائر | دار زايا',
    descriptionFr: 'Découvrez l’histoire de la Maison ZAYA : un atelier d’excellence né à Alger valorisant le travail minutieux d’artisanes locales et les matières nobles durables.',
    descriptionAr: 'تعرفي على قصة دار زايا وحرفياتنا في الجزائر، حيث يلتقي التراث العريق بالخياطة المعاصرة والأقمشة الفاخرة المستدامة.',
    keywords: ['atelier alger', 'couture artisanale', 'histoire zaya', 'savoir faire algerien', 'artisanat algerie']
  },
  '/contact': {
    titleFr: 'Contactez la Maison ZAYA | Service Client & Showroom Alger',
    titleAr: 'اتصلي بدار زايا | خدمة العملاء وصالة العرض بالجزائر',
    descriptionFr: 'Prenez rendez-vous dans notre showroom à Alger ou contactez notre service client pour vos commandes sur-mesure et livraisons dans toute l’Algérie.',
    descriptionAr: 'تواصلي مع فريق خدمة العملاء أو احجزي موعدًا في صالة العرض بالجزائر العاصمة للإجابة على استفساراتك واستقبال طلباتك الخاصة.',
    keywords: ['contact zaya atelier', 'showroom alger', 'service client zaya', 'commande sur mesure alger']
  },
  '/sign-in': {
    titleFr: 'Connexion Espace Privilège Client | ZAYA Atelier',
    titleAr: 'تسجيل الدخول إلى حساب الزبائن الخاص | دار زايا',
    descriptionFr: 'Accédez à votre espace client ZAYA pour suivre vos commandes en temps réel, gérer vos adresses de livraison en Algérie et retrouver votre liste d’envies.',
    descriptionAr: 'سجلي دخولك إلى مساحتك الخاصة لمتابعة طلبياتك المباشرة وتتبع شحناتك في كافة ولايات الجزائر وإدارة قائمة رغباتك.',
    keywords: ['espace client zaya', 'connexion zaya', 'suivi commande algerie']
  },
  '/sign-up': {
    titleFr: 'Rejoindre le Cercle ZAYA | Création de Compte Client',
    titleAr: 'الانضمام إلى عائلة دار زايا | إنشاء حساب زبون جديد',
    descriptionFr: 'Rejoignez le Cercle Privilège ZAYA Atelier pour bénéficier d’un suivi simplifié de vos achats, d’offres exclusives et d’un carnet d’adresses 58 Wilayas.',
    descriptionAr: 'أنشئي حسابك الجديد لدى دار زايا لتستمتعي بتجربة تسوق راقية وتتبع فوري لطلبياتك في الـ 58 ولاية وعروض حصرية لأعضائنا.',
    keywords: ['inscription zaya', 'creer compte boutique algerie', 'adhesion cercle zaya']
  },
  '/dashboard': {
    titleFr: 'Mon Espace Client & Commandes | ZAYA Atelier',
    titleAr: 'لوحة التحكم والطلبيات الخاصة بي | دار زايا',
    descriptionFr: 'Gérez vos commandes en cours, téléchargez vos factures détaillées et suivez la livraison de vos colis Yalidine/Stop-desk à travers l’Algérie.',
    descriptionAr: 'إدارة وتتبع طلبياتك الحالية، استعراض الفواتير ومتابعة حالة الطرود مع التوصيل السريع لجميع أنحاء الجزائر.',
    keywords: ['tableau de bord zaya', 'suivi yalidine', 'commandes mode algerie']
  }
};

/**
 * Apply SEO metadata directly into the document's DOM head elements
 */
export function updateDocumentMetadata(meta: SEOMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  document.title = meta.title;

  // Helper for setting or creating meta tags
  const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', meta.description);
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
  }
  if (meta.robots) {
    setMetaTag('name', 'robots', meta.robots);
  }

  // 3. OpenGraph Tags
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:type', meta.type || 'website');
  setMetaTag('property', 'og:site_name', meta.ogSiteName || 'ZAYA Atelier');
  
  const currentUrl = meta.canonical || (typeof window !== 'undefined' ? window.location.href : '');
  if (currentUrl) {
    setMetaTag('property', 'og:url', currentUrl);
  }
  
  if (meta.image) {
    setMetaTag('property', 'og:image', meta.image);
    setMetaTag('name', 'twitter:image', meta.image);
  }

  // 4. Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);

  // 5. Canonical Link
  if (meta.canonical) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', meta.canonical);
  }

  // 6. JSON-LD Structured Data Script
  const SCRIPT_ID = 'zaya-seo-structured-data';
  let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  
  if (meta.jsonLd) {
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(meta.jsonLd, null, 2);
  } else if (scriptTag) {
    scriptTag.remove();
  }
}
