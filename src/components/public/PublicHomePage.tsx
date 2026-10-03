import React, { useState, useMemo } from 'react';
import { Product, Language } from '../../types';
import { AppRoute } from '../../lib/router';
import { ProductCard } from '../ProductCard';
import { PublicFooter } from './PublicFooter';
import { 
  ArrowRight, 
  Crown, 
  ShieldCheck, 
  Truck, 
  Search, 
  X, 
  SlidersHorizontal,
  RefreshCw,
  Phone,
  MessageCircle,
  PackageCheck
} from 'lucide-react';

interface PublicHomePageProps {
  products: Product[];
  language: Language;
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onOpenTracking?: (orderId?: string, phone?: string) => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  products,
  language,
  onNavigate,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
  onOpenTracking,
}) => {
  // Live Search & Category State for Immediate Fast Finding
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Categories list tailored to the boutique catalog
  const categories = [
    { id: 'all', fr: 'Tous les Modèles', ar: 'كل الموديلات' },
    { id: 'caftans', fr: 'Caftans & Soirée', ar: 'قفطان وسهرات' },
    { id: 'chemises', fr: 'Chemises en Lin', ar: 'قمصان الكتان' },
    { id: 'vestes', fr: 'Vestes & Blazers', ar: 'سترات وبليزر' },
    { id: 'pantalons', fr: 'Pantalons & Ensembles', ar: 'أطقم وبناطيل' },
    { id: 'robes', fr: 'Robes Fluides', ar: 'فساتين' },
    { id: 'accessoires', fr: 'Accessoires & Soie', ar: 'إكسسوارات وحرائر' }
  ];

  // Fast client-side filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.material && p.material.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Fast sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1A1918] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. COMPACT LUXURY HEADER BANNER (Direct, Clean & Non-Intrusive)           */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#F4EFEA] to-[#FAF8F5] border-b border-[#EAE4DC] pt-8 pb-7 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] text-[11px] uppercase tracking-[0.2em] font-semibold shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Maison de Confection • Alger</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1A1918]">
            {language === 'ar' ? 'تشكيلة الأزياء الراقية — الجزائر' : 'Collection Haute Couture & Prêt-à-Porter'}
          </h1>

          <p className="text-xs sm:text-sm text-[#635B50] max-w-2xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'اختر قطعتك المفضلة واستلمها حتى باب منزلك مع الدفع عند الاستلام نقداً في كافة الـ 58 ولاية.'
              : 'Commandez vos pièces d’exception en pur lin et soie avec paiement en espèces à la livraison dans les 58 Wilayas.'}
          </p>

          {/* Quick Reassurance Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#524B41]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Livraison 58 Wilayas (Domicile & Relais)</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Paiement en Espèces à la Réception (COD)</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Essayage & Échange Facile 48h</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIRECT FAST-FINDER: SEARCH BAR & CATEGORY TABS                         */}
      {/* Enables customers to find what they need in seconds without deep clicking */}
      {/* ========================================================================= */}
      <section className="sticky top-[80px] z-30 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#EAE4DC] py-3.5 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Top row: Live Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث عن موديل، قفطان، كتان، لون...'
                    : 'Rechercher un modèle, caftan, lin, couleur...'
                }
                className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#D8D0C5] text-xs text-stone-900 rounded-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 shadow-2xs transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                  title="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting & Order Tracking Trigger */}
            <div className="flex items-center gap-2.5 justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 bg-white border border-[#D8D0C5] px-2.5 py-1.5 rounded-sm shadow-2xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Trier les modèles"
                  className="bg-transparent text-xs text-stone-800 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="newest">Nouveautés d'abord</option>
                  <option value="price_asc">Prix croissant (DA)</option>
                  <option value="price_desc">Prix décroissant (DA)</option>
                </select>
              </div>

              {/* Quick Tracking Button for existing buyers */}
              <button
                onClick={() => onOpenTracking?.()}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C6B3F] hover:text-[#1A1918] bg-white border border-[#DDD5CA] hover:border-[#8C6B3F] px-3 py-1.5 rounded-sm transition-colors shadow-2xs cursor-pointer"
                title="Suivre une commande déjà passée"
              >
                <PackageCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden md:inline">Suivre mon colis</span>
                <span className="md:hidden">Suivi</span>
              </button>
            </div>
          </div>

          {/* Category Tabs: Scrollable on mobile, elegant on desktop */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                      : 'bg-white border border-[#E0D8CB] text-stone-700 hover:border-[#1A1918] hover:text-[#1A1918]'
                  }`}
                >
                  <span>{language === 'ar' ? cat.ar : cat.fr}</span>
                  <span className={`text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DIRECT CATALOG: ALL PRODUCTS IMMEDIATELY VISIBLE & ACTIONABLE          */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE4DC] text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">
              {sortedProducts.length} {sortedProducts.length > 1 ? 'modèles disponibles' : 'modèle disponible'}
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <span className="text-stone-400">
                (sur {products.length} au total)
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#8C6B3F] hover:text-stone-900 underline underline-offset-2 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Réinitialiser les filtres</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onSelect={onSelectProduct}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickOrderWhatsApp={(p) => {
                  const price = p.salePrice ?? p.price;
                  const msg = language === 'ar'
                    ? `السلام عليكم أتيليه زايا، أود طلب موديل: ${p.nameAr || p.name} (${price.toLocaleString()} دج) مع التوصيل والدفع عند الاستلام.`
                    : `Salam ZAYA Atelier, je souhaite commander la pièce: ${p.name} (${price.toLocaleString()} DA) avec livraison et paiement à la réception.`;
                  window.open(`https://wa.me/213550001122?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-white border border-[#EAE4DC] p-8 rounded-sm shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                Aucun modèle ne correspond à votre recherche
              </h3>
              <p className="text-xs text-stone-500">
                Essayez d'autres mots-clés (lin, robe, blazer, soie) ou explorez toutes nos catégories.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-black transition-colors cursor-pointer"
            >
              Afficher toute la collection
            </button>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. DISCREET 1-ROW REASSURANCE & WHATSAPP CONCIERGE BAR                     */}
      {/* Simple, compact, and highly reassuring for Algerian shoppers               */}
      {/* ========================================================================= */}
      <section className="bg-white border-t border-[#EAE4DC] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: 58 Wilayas COD */}
          <div className="flex items-start gap-3.5 p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs">
            <div className="w-9 h-9 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif-luxury font-bold text-sm text-[#1A1918]">Livraison dans les 58 Wilayas</h4>
              <p className="text-xs text-[#6B6357]">À domicile ou en point relais. Paiement en espèces à la livraison (COD).</p>
            </div>
          </div>

          {/* Card 2: 48h Size Exchange */}
          <div className="flex items-start gap-3.5 p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs">
            <div className="w-9 h-9 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif-luxury font-bold text-sm text-[#1A1918]">Essayage & Échange Facile</h4>
              <p className="text-xs text-[#6B6357]">Essayez chez vous. Échange de taille rapide et garanti sous 48h.</p>
            </div>
          </div>

          {/* Card 3: WhatsApp Concierge */}
          <div className="flex items-start gap-3.5 p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs">
            <div className="w-9 h-9 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif-luxury font-bold text-sm text-[#1A1918]">Commande & Conseil Direct</h4>
              <p className="text-xs text-[#6B6357]">
                Styliste disponible au <a href="https://wa.me/213550001122" target="_blank" rel="noreferrer" className="font-bold text-[#1A1918] hover:text-[#8C6B3F] underline">0550 00 11 22</a> (WhatsApp).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLEAN FOOTER                                                           */}
      {/* ========================================================================= */}
      <PublicFooter onNavigate={onNavigate} onOpenTracking={onOpenTracking} />
    </div>
  );
};
