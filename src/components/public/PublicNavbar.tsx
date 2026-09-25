import React from 'react';
import { Crown, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AppRoute } from '../../lib/router';

interface PublicNavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenTracking?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenTracking,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4DC] transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#1A1918] text-[#FAF8F5] text-[11px] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] sm:text-[11px] font-medium tracking-wide">
            <button
              onClick={onOpenTracking}
              className="flex items-center gap-1.5 text-[#C5A880] hover:text-white transition-colors cursor-pointer"
              title="Suivre mon colis dans les 58 Wilayas"
            >
              <Truck className="w-3 h-3 text-[#C5A880]" />
              <span>Livraison 58 Wilayas • <span className="underline decoration-[#C5A880]/60 underline-offset-2">Suivre mon colis</span></span>
            </button>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-stone-300">
              <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
              <span>Paiement à la Livraison (COD)</span>
            </span>
            <span className="hidden lg:inline text-stone-500">•</span>
            <span className="hidden lg:inline text-stone-300">
              Conciergerie WhatsApp: <strong className="text-white">0550 00 11 22</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-[10px] text-stone-300">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'fr' ? 'text-white font-bold bg-white/15' : 'hover:text-white'
                }`}
              >
                FR
              </button>
              <span className="text-stone-600">|</span>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'ar' ? 'text-white font-bold bg-white/15' : 'hover:text-white'
                }`}
              >
                العربية
              </button>
              <span className="text-stone-600">|</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'text-white font-bold bg-white/15' : 'hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Public Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-left cursor-pointer flex items-center gap-2.5" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center shrink-0 shadow-2xs">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif-luxury text-2xl sm:text-2xl font-bold tracking-[0.22em] text-[#1A1918] leading-none">
                ZAYA
              </div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#8C8275] mt-0.5 font-medium">
                ATELIER • ALGER
              </p>
            </div>
          </div>
        </div>

        {/* Actions (Right) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            /* Logged in state -> Quick access to Customer Dashboard */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-[#1A1918] text-[#FAF8F5] rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-black transition-all shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Mon Espace Client</span>
              </button>

              <button
                onClick={() => onNavigate('/dashboard')}
                className="sm:hidden p-2 text-[#1A1918] hover:text-[#C5A880]"
                title="Espace Client"
              >
                <Crown className="w-5 h-5 text-[#C5A880]" />
              </button>
            </div>
          ) : (
            /* Unauthenticated state -> Sign In & Create Account */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/sign-in')}
                className="text-xs uppercase tracking-wider font-semibold text-[#1A1918] hover:text-[#A66C44] px-2.5 py-1.5 transition-colors"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>

              <button
                onClick={() => onNavigate('/sign-up')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A1918] text-[#FAF8F5] rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-black transition-all shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>{language === 'ar' ? 'إنشاء حساب' : 'Create Account'}</span>
              </button>
            </div>
          )}

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#1A1918] hover:text-[#A66C44] transition-colors"
            title="Panier"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#1A1918] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
