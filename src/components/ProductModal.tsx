import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, ShoppingBag, Truck, ShieldCheck, Check, Share2, AlertCircle } from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface ProductModalProps {
  product: Product | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onDirectCheckout: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  language,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onDirectCheckout
}) => {
  const t = translations[language];
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // When product changes, reset defaults
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setSelectedImage(product.images[0] || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Find active variant based on chosen color and size
  const activeVariant: ProductVariant | undefined = product.variants.find(
    v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === selectedSize
  );

  const variantStock = activeVariant ? activeVariant.stock : 0;
  const isAvailable = variantStock > 0;

  // Max quantity capped at stock
  const handleQtyChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= variantStock) {
      setQuantity(next);
    }
  };

  const displayPrice = product.salePrice ?? product.price;

  const totalUnits = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : Math.max(0, product.stock ?? 0);
  const isModelLowStock = totalUnits > 0 && totalUnits < 5;

  const handleWhatsAppOrder = () => {
    const text = language === 'ar'
      ? `السلام عليكم أتيليه زايا، أود طلب الموديل:\n- ${product.nameAr}\n- اللون: ${selectedColor}\n- المقاس: ${selectedSize}\n- السعر: ${formatDA(displayPrice, 'ar')}\n- الكمية: ${quantity}\nيرجى تأكيد التوفر ومصاريف التوصيل لولايتي.`
      : `Salam! Bonjour ZAYA Atelier, je souhaite commander la pièce suivante:\n- Modèle: ${product.name}\n- Couleur: ${selectedColor}\n- Taille: ${selectedSize}\n- Prix unitaire: ${formatDA(displayPrice, 'fr')}\n- Quantité: ${quantity}\nMerci de me confirmer la disponibilité et le tarif de livraison pour ma wilaya.`;
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, text), '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | ZAYA Atelier`,
        text: `Découvrez ${product.name} chez ZAYA Atelier Algiers`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D5] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-[#FAF8F5]/80 hover:bg-[#1A1918] hover:text-white text-[#1A1918] rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Images Section */}
          <div className="md:col-span-6 bg-stone-100 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D5]">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.isNew && (
                <span className="absolute top-3 left-3 bg-[#1A1918] text-[#FAF8F5] text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5">
                  {t.newArrivals}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-16 shrink-0 overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#1A1918]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Section */}
          <div className="md:col-span-6 p-5 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto text-left">
            <div className="space-y-4">
              {/* Category & Collection */}
              <div className="flex items-center justify-between text-xs text-[#8A8073] uppercase tracking-wider">
                <span>{language === 'ar' ? product.collectionAr : product.collectionFr}</span>
                <span className="font-mono text-[11px] text-[#A69E93]">SKU: {product.sku}</span>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1918]">
                  {language === 'ar' ? product.nameAr : product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-xl font-bold text-[#1A1918]">
                    {formatDA(displayPrice, language)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-sm text-[#948A7D] line-through">
                      {formatDA(product.price, language)}
                    </span>
                  )}
                  <span className="text-xs text-stone-500 font-medium">
                    (Paiement en espèces à la livraison)
                  </span>
                </div>

                {/* Low stock model urgency notification */}
                {isModelLowStock && (
                  <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-[#FBF3EC] border border-[#E8C4B4] text-[#9C381E] text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-pulse shrink-0" />
                    <span>
                      {language === 'ar'
                        ? `كمية محدودة جداً: تبقت ${totalUnits} قطع فقط متوفرة عبر جميع المقاسات!`
                        : language === 'en'
                        ? `Low Stock: Only ${totalUnits} unit${totalUnits > 1 ? 's' : ''} left across all variants!`
                        : `Stock limité : plus que ${totalUnits} pièce${totalUnits > 1 ? 's' : ''} disponible${totalUnits > 1 ? 's' : ''} pour ce modèle !`}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#544D44] leading-relaxed">
                {language === 'ar' ? product.descriptionAr : product.description}
              </p>

              {/* Material */}
              <div className="p-2.5 bg-[#F3EFE9] border border-[#E5DEC7] text-xs text-[#4A4237]">
                <span className="font-semibold">{t.material} : </span>
                <span>{language === 'ar' ? product.materialAr : product.material}</span>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1A1918]">{t.selectColor} :</span>
                  <span className="text-[#7A7163]">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-[#1A1918] bg-[#EFEAE2] font-semibold text-[#1A1918]'
                          : 'border-stone-300 hover:border-stone-500 bg-white text-[#524B43]'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector with real stock check */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1A1918]">{t.selectSize} :</span>
                  <span className="text-xs text-[#7A7163]">
                    {isAvailable ? (
                      <span className="text-emerald-700 font-medium">
                        ✓ {variantStock} unité(s) disponible(s)
                      </span>
                    ) : (
                      <span className="text-red-700 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {t.outOfStock}
                      </span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s, i) => {
                    const variantForThisSize = product.variants.find(
                      v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === s
                    );
                    const stockForSize = variantForThisSize ? variantForThisSize.stock : 0;
                    const disabled = stockForSize <= 0;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(s)}
                        disabled={disabled}
                        className={`py-2 text-xs font-mono transition-all border relative flex flex-col items-center justify-center ${
                          selectedSize === s && !disabled
                            ? 'border-[#1A1918] bg-[#1A1918] text-[#FAF8F5] font-bold'
                            : disabled
                            ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through'
                            : 'border-stone-300 bg-white text-stone-800 hover:border-stone-500'
                        }`}
                      >
                        <span>{s}</span>
                        {stockForSize > 0 && stockForSize <= 2 && (
                          <span className="text-[9px] text-amber-600 font-sans">Dernier</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              {isAvailable && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-medium text-[#1A1918]">Quantité :</span>
                  <div className="flex items-center border border-stone-300 bg-white">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      disabled={quantity <= 1}
                      className="px-2.5 py-1 text-sm hover:bg-stone-100 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      disabled={quantity >= variantStock}
                      className="px-2.5 py-1 text-sm hover:bg-stone-100 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Max: {variantStock}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-6 border-t border-[#E8E1D5]">
              <div className="flex items-center gap-2">
                {/* Add to Cart */}
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    if (activeVariant && isAvailable) {
                      onAddToCart(product, activeVariant, quantity);
                    }
                  }}
                  disabled={!isAvailable || !activeVariant}
                  className="flex-1 py-3 px-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-all disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                  <span>{isAvailable ? t.addToCart : t.outOfStock}</span>
                </button>

                {/* Direct COD Order */}
                {isAvailable && activeVariant && (
                  <button
                    id="modal-direct-order-btn"
                    onClick={() => onDirectCheckout(product, activeVariant, quantity)}
                    className="py-3 px-4 bg-[#C5A880] hover:bg-[#B3956E] text-stone-950 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Commander</span>
                  </button>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 border transition-colors ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-stone-300 hover:border-stone-500 text-stone-700 bg-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Instant WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.orderViaWhatsApp}</span>
              </button>

              {/* Share & guarantees */}
              <div className="flex items-center justify-between text-[11px] text-[#786F62] pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Livraison 58 Wilayas (24h - 72h)</span>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 hover:text-stone-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Lien copié !' : 'Partager'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
