import { useEffect, useMemo } from 'react';
import { Product, Language } from '../types';
import {
  SEOMetadata,
  generateProductSEO,
  generateCollectionSEO,
  STATIC_PAGES_SEO,
  updateDocumentMetadata
} from '../lib/seo';

export interface UseSEOOptions {
  route?: string;
  category?: string;
  product?: Product | null;
  language?: Language;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  customJsonLd?: Record<string, any>;
  robots?: string;
}

/**
 * Resolves the appropriate SEO metadata based on current application route,
 * collection category, or active product.
 */
export function resolveSEOMetadata(options: UseSEOOptions): SEOMetadata {
  const language = options.language || 'fr';
  const isArabic = language === 'ar';

  // 1. If an active product is provided, prioritize individual product SEO
  if (options.product) {
    const base = generateProductSEO(options.product, language);
    if (options.customTitle) base.title = options.customTitle;
    if (options.customDescription) base.description = options.customDescription;
    if (options.customImage) base.image = options.customImage;
    if (options.customJsonLd) base.jsonLd = options.customJsonLd;
    if (options.robots) base.robots = options.robots;
    return base;
  }

  // 2. If viewing a collection page or category
  if (options.route === '/collection' || options.category) {
    const categoryId = options.category || 'all';
    const base = generateCollectionSEO(categoryId, language);
    if (options.customTitle) base.title = options.customTitle;
    if (options.customDescription) base.description = options.customDescription;
    if (options.customImage) base.image = options.customImage;
    if (options.customJsonLd) base.jsonLd = options.customJsonLd;
    if (options.robots) base.robots = options.robots;
    return base;
  }

  // 3. Static route SEO
  const routeKey = options.route?.startsWith('/dashboard') ? '/dashboard' : (options.route || '/');
  const staticConfig = STATIC_PAGES_SEO[routeKey] || STATIC_PAGES_SEO['/'];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zaya-atelier.dz';
  const canonicalUrl = `${origin}${options.route || '/'}`;

  const title = options.customTitle || (isArabic ? staticConfig.titleAr : staticConfig.titleFr);
  const description = options.customDescription || (isArabic ? staticConfig.descriptionAr : staticConfig.descriptionFr);

  return {
    title,
    description,
    keywords: staticConfig.keywords,
    canonical: canonicalUrl,
    type: 'website',
    image: options.customImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    robots: options.robots,
    jsonLd: options.customJsonLd || {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ZAYA Atelier',
      url: origin,
      description
    }
  };
}

/**
 * Dynamic SEO hook to manage page-specific `<title>`, `<meta name="description">`,
 * OpenGraph, Twitter cards, and Schema.org JSON-LD tags.
 */
export function useSEO(options: UseSEOOptions): SEOMetadata {
  const metadata = useMemo(() => {
    return resolveSEOMetadata(options);
  }, [
    options.route,
    options.category,
    options.product?.id,
    options.product?.price,
    options.product?.salePrice,
    options.product?.stock,
    options.language,
    options.customTitle,
    options.customDescription,
    options.customImage,
    options.robots,
    options.customJsonLd
  ]);

  useEffect(() => {
    updateDocumentMetadata(metadata);
  }, [metadata]);

  return metadata;
}
