import React from 'react';
import { Heart, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { Product, Language } from '../types';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface ProductCardProps {
  product: Product;
  language: Language;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickOrderWhatsApp: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  onQuickOrderWhatsApp
}) => {
  const t = translations[language];

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  // Calculate total stock across all variants
  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
    : Math.max(0, product.stock ?? 0);

  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock < 5;

  const currentImg = product.images[0] || '';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = language === 'ar'
      ? `السلام عليكم أتيليه زايا، أود طلب موديل: ${product.nameAr} (${formatDA(displayPrice, 'ar')}). هل المقاس متوفر للتوصيل؟`
      : `Salam! Bonjour ZAYA Atelier, je souhaite commander: ${product.name} au prix de ${formatDA(displayPrice, 'fr')}. Est-il disponible pour livraison?`;
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer flex flex-col bg-[#FAF8F5] transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-stone-100">
        <img
          src={currentImg}
          alt={language === 'ar' ? product.nameAr : product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#1A1918] text-[#FAF8F5] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5">
              {t.newArrivals}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#A93226] text-white text-[10px] font-semibold tracking-wider px-2 py-0.5">
              PROMO
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span
              id={`badge-low-stock-${product.id}`}
              className="inline-flex items-center gap-1.5 bg-[#251A15]/90 text-[#FCEEE3] border border-[#B3684B]/40 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 backdrop-blur-xs shadow-xs"
              title={
                language === 'ar'
                  ? `كمية محدودة: تبقت ${totalStock} قطع فقط`
                  : language === 'en'
                  ? `Low stock: only ${totalStock} left across all variants`
                  : `Stock limité : plus que ${totalStock} pièces disponibles`
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse shrink-0" />
              <span>
                {language === 'ar'
                  ? `كمية محدودة (${totalStock})`
                  : language === 'en'
                  ? `Low Stock (${totalStock} left)`
                  : `Stock Limité (${totalStock})`}
              </span>
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-stone-800 text-stone-300 text-[10px] font-medium tracking-wide px-2 py-0.5">
              {t.outOfStock}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
            isWishlisted
              ? 'bg-white text-red-600 shadow-sm'
              : 'bg-black/25 text-white hover:bg-white hover:text-stone-900'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions hover overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 bg-white/90 hover:bg-white text-stone-900 text-[11px] font-medium tracking-wider uppercase py-2 px-3 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Détails & Tailles</span>
          </button>

          <button
            onClick={handleWhatsApp}
            title="Commander via WhatsApp"
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-2 flex flex-col gap-1 text-left">
        {/* Category & Collection */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8C8275]">
          <span>{language === 'ar' ? product.categoryAr : product.categoryFr}</span>
          {product.reviewCount !== undefined && product.reviewCount > 0 && (
            <span className="flex items-center gap-0.5 text-amber-600 font-medium font-sans">
              <span className="text-amber-500">★</span>
              <span>{(product.rating || 5.0).toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif-luxury text-sm sm:text-base font-semibold text-[#1A1918] line-clamp-1 group-hover:text-[#8C6D47] transition-colors">
          {language === 'ar' ? product.nameAr : product.name}
        </h3>

        {/* Color swatches & sizes preview */}
        <div className="flex items-center justify-between gap-2 py-0.5">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-3 h-3 rounded-full border border-stone-300 inline-block shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-500">+{product.colors.length - 4}</span>
            )}
          </div>

          <div className="text-[10px] text-[#7A7165] font-mono">
            {product.sizes.join(' · ')}
          </div>
        </div>

        {/* Price in DA */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-sm sm:text-base font-bold text-[#1A1918]">
            {formatDA(displayPrice, language)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#9E9487] line-through">
              {formatDA(product.price, language)}
            </span>
          )}
        </div>

        {/* Subtle urgency notification for low stock */}
        {isLowStock && !isOutOfStock && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#A64B2A] font-medium pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse shrink-0" />
            <span>
              {language === 'ar'
                ? `كمية محدودة: تبقت ${totalStock} قطع فقط`
                : language === 'en'
                ? `Low stock: only ${totalStock} units left across all variants`
                : `Stock limité : plus que ${totalStock} pièce${totalStock > 1 ? 's' : ''} disponible${totalStock > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
