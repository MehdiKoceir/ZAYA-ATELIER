import React, { useState } from 'react';
import { Product, Language } from '../../types';
import { AppRoute } from '../../lib/router';
import { ProductCard } from '../ProductCard';
import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

interface PublicCollectionPageProps {
  products: Product[];
  language: Language;
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
}

export const PublicCollectionPage: React.FC<PublicCollectionPageProps> = ({
  products,
  language,
  onNavigate,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const categories = [
    { id: 'all', fr: 'Tous les Modèles', ar: 'جميع الموديلات' },
    { id: 'caftans', fr: 'Caftans & Soirée', ar: 'قفطان وسهرات' },
    { id: 'chemises', fr: 'Chemises en Lin', ar: 'قمصان الكتان' },
    { id: 'vestes', fr: 'Vestes & Blazers', ar: 'سترات وبليزر' },
    { id: 'pantalons', fr: 'Pantalons & Ensembles', ar: 'بناطيل وأطقم' },
    { id: 'robes', fr: 'Robes Fluides', ar: 'فساتين عصرية' },
    { id: 'accessoires', fr: 'Maroquinerie', ar: 'حقائب جلدية' }
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.nameAr.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.material.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#8C8275] font-semibold">
            Catalogue ZAYA
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#1A1918]">
            La Collection Intemporelle
          </h1>
          <p className="text-xs sm:text-sm text-[#736B60]">
            Pièces taillées dans les plus belles matières pour une allure algérienne contemporaine.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-4 mb-8">
          {/* Search bar & Sort selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, matière (lin, crêpe...), ou coupe..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-stone-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-500">Trier:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#DDD5CA] px-3 py-2 rounded-lg text-xs text-[#1A1918] font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all rounded-lg cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#EFE9DF] text-[#524B43] hover:bg-[#E5DDD0]'
                }`}
              >
                {language === 'ar' ? cat.ar : cat.fr}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#EAE4DC] rounded-xl p-8 space-y-3">
            <p className="font-serif-luxury text-xl text-stone-800">
              Aucun modèle trouvé pour cette sélection
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Modifiez votre recherche ou explorez une autre catégorie de notre atelier.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2.5 bg-[#1A1918] text-white text-xs uppercase font-semibold tracking-wider rounded-lg"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onSelect={onSelectProduct}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickOrderWhatsApp={(p) => {
                  const msg = `Salam ZAYA Atelier, je souhaite commander: ${p.name}`;
                  window.open(`https://wa.me/213550001122?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
