import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, Lock } from 'lucide-react';
import { CartItem, Language } from '../types';
import { formatDA, translations } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  cart?: CartItem[];
  onUpdateQty?: (variantId: string, quantity: number) => void;
  onUpdateQuantity?: (variantId: string, quantity: number) => void;
  onRemoveItem: (variantId: string) => void;
  onCheckout?: () => void;
  onProceedToCheckout?: () => void;
  language: Language;
  discountCode?: string;
  discountAmount?: number;
  onApplyDiscount?: (code: string) => Promise<boolean>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  cart,
  onUpdateQty,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onProceedToCheckout,
  language,
  discountCode,
  discountAmount = 0,
  onApplyDiscount
}) => {
  const { user } = useAuth();
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const t = translations[language];

  const cartItems = items || cart || [];
  const handleUpdate = onUpdateQty || onUpdateQuantity || (() => {});
  const handleCheckout = onCheckout || onProceedToCheckout || (() => {});

  if (!isOpen) return null;

  const subtotal = (cartItems || []).reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
  const total = Math.max(0, subtotal - (discountAmount || 0));

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim() || !onApplyDiscount) return;

    setPromoLoading(true);
    setPromoError(null);
    try {
      const success = await onApplyDiscount(promoInput.trim());
      if (success) {
        setPromoInput('');
      } else {
        setPromoError('Code promo invalide ou inactif');
      }
    } catch (err: any) {
      setPromoError(err.message || 'Erreur lors de la validation du code');
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#EAE3D6] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1A1918]" />
            <h2 className="font-serif-luxury text-lg font-bold text-[#1A1918]">
              {t.cartTitle} ({(cartItems || []).reduce((s, i) => s + (i.quantity || 0), 0)})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#EFE9DF] rounded-full text-stone-600 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EFE9DF] flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif-luxury text-base font-medium text-[#1A1918]">{t.cartEmpty}</p>
              <p className="text-xs text-stone-500 max-w-xs">
                Explorez nos créations faites avec des étoffes nobles et ajoutez vos coups de cœur.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#1A1918] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-3.5 pb-4 border-b border-[#EFE9DF] text-left"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 shrink-0 bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif-luxury text-xs sm:text-sm font-semibold text-[#1A1918] line-clamp-1">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.variantId)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#7A7165] mt-1 space-x-2">
                      <span>Couleur: <strong className="text-stone-800">{item.color}</strong></span>
                      <span>•</span>
                      <span>Taille: <strong className="text-stone-800 font-mono">{item.size}</strong></span>
                    </div>

                    <div className="text-xs font-semibold text-[#1A1918] mt-1">
                      {formatDA(item.unitPrice, language)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-300 bg-white">
                      <button
                        onClick={() => handleUpdate(item.variantId, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdate(item.variantId, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#1A1918]">
                      {formatDA(item.unitPrice * item.quantity, language)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#F3EFE9] border-t border-[#EAE3D6] space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder={t.promoPlaceholder}
                  className="flex-1 px-3 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-3 py-1.5 bg-[#1A1918] text-white text-xs font-medium uppercase tracking-wider hover:bg-black disabled:opacity-40"
                >
                  {promoLoading ? '...' : t.applyPromo}
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}
              {discountCode && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2 py-1 border border-emerald-200">
                  <span className="flex items-center gap-1 font-mono font-semibold">
                    <Tag className="w-3 h-3" /> {discountCode}
                  </span>
                  <span>-{formatDA(discountAmount, language)}</span>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-[#E2DDD3]">
              <div className="flex justify-between text-[#635B50]">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-stone-800">{formatDA(subtotal, language)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.discount}</span>
                  <span className="font-semibold">-{formatDA(discountAmount, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7E7467] text-[11px]">
                <span>{t.delivery}</span>
                <span className="italic">{t.deliveryCalculatedAtCheckout}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-[#1A1918] pt-2 border-t border-[#DED7CB]">
                <span>{t.total}</span>
                <span>{formatDA(total, language)}</span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-white/60 p-2 border border-stone-200">
              <Truck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Paiement au choix : Espèces (COD), BaridiMob / CCP ou Carte CIB</span>
            </div>

            {!user && (
              <div className="flex items-center gap-2 p-2 bg-[#F4EFEA] border border-[#DDD5CA] text-[11px] text-[#6B6356]">
                <Lock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Connexion ou inscription requise pour commander</span>
              </div>
            )}

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={handleCheckout}
              className="w-full py-3 px-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:translate-y-[-1px]"
            >
              {user ? (
                <>
                  <span>{t.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C5A880]" />
                  <span>Se connecter pour commander</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
