import React from 'react';
import { ShoppingBag, Heart, Search, Sparkles, Truck, ShieldCheck, ArrowRight, Store, UserCheck, MessageCircle, User, Crown } from 'lucide-react';
import { Language } from '../types';
import { translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  onSearchChange: (q: string) => void;
  searchQuery: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTracking,
  isAdmin,
  setIsAdmin,
  onSearchChange,
  searchQuery,
  onSelectCategory
}) => {
  const t = translations[language];
  const isRtl = language === 'ar';
  const { user, openAuthModal, openProfileModal } = useAuth();

  const handleWhatsAppHelp = () => {
    const text = language === 'ar'
      ? 'السلام عليكم أتيليه زايا، أود الاستفسار بخصوص الموديلات المتوفرة والتوصيل.'
      : 'Salam! Bonjour ZAYA Atelier, je souhaite avoir des renseignements sur vos collections et la livraison.';
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, text), '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4DC]">
      {/* Top Banner */}
      <div className="bg-[#1C1A18] text-[#E8E1D5] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs tracking-wide">
            <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t.freeDeliveryBadge}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleWhatsAppHelp}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp: 0550 00 11 22</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#2C2926] px-2 py-0.5 rounded text-[11px]">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-1.5 py-0.5 rounded transition-all ${language === 'fr' ? 'bg-[#C5A880] text-black font-semibold' : 'text-[#C5C0B8] hover:text-white'}`}
              >
                FR
              </button>
              <span className="text-stone-600">|</span>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-1.5 py-0.5 rounded transition-all ${language === 'ar' ? 'bg-[#C5A880] text-black font-semibold' : 'text-[#C5C0B8] hover:text-white'}`}
              >
                العربية
              </button>
              <span className="text-stone-600">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-all ${language === 'en' ? 'bg-[#C5A880] text-black font-semibold' : 'text-[#C5C0B8] hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Admin Switcher Mode */}
            <button
              id="admin-mode-toggle-btn"
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                isAdmin
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'bg-[#2A2724] text-[#E0D8CE] hover:bg-[#3D3833]'
              }`}
            >
              {isAdmin ? (
                <>
                  <Store className="w-3 h-3" />
                  <span>{t.switchStore}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 text-[#C5A880]" />
                  <span>{t.adminDashboard}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-6">
          <div className="cursor-pointer" onClick={() => { onSelectCategory('all'); onSearchChange(''); }}>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-[0.18em] text-[#1A1918]">
                ZAYA
              </span>
              <div className="flex items-center gap-1.5 -mt-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#7E7569] font-medium">
                  ATELIER • ALGER
                </span>
              </div>
            </div>
          </div>

          {/* Quick Category links for desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium uppercase tracking-wider text-[#5A534A]">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#1A1918] transition-colors py-1"
            >
              {t.allProducts}
            </button>
            <button
              onClick={() => onSelectCategory('caftans')}
              className="hover:text-[#1A1918] transition-colors py-1"
            >
              {language === 'ar' ? 'قفطان وسهرات' : 'Caftans & Soirée'}
            </button>
            <button
              onClick={() => onSelectCategory('chemises')}
              className="hover:text-[#1A1918] transition-colors py-1"
            >
              {language === 'ar' ? 'قمصان وبلايز' : 'Chemises en Lin'}
            </button>
            <button
              onClick={() => onSelectCategory('vestes')}
              className="hover:text-[#1A1918] transition-colors py-1"
            >
              {language === 'ar' ? 'سترات وبليزر' : 'Vestes & Blazers'}
            </button>
            <button
              onClick={() => onSelectCategory('accessoires')}
              className="hover:text-[#1A1918] transition-colors py-1"
            >
              {language === 'ar' ? 'حقائب جلدية' : 'Maroquinerie'}
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs relative items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#8A8175] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن موديل، لون، قماش...' : 'Rechercher un modèle, couleur, lin...'}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1EDE7] rounded-full text-xs text-[#1A1918] placeholder-[#8A8175] focus:outline-none focus:ring-1 focus:ring-[#C5A880] transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Track order button */}
          <button
            id="track-order-btn"
            onClick={onOpenTracking}
            className="hidden sm:flex items-center gap-1 text-xs text-[#5A534A] hover:text-[#1A1918] px-2 py-1 transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{t.trackOrder}</span>
          </button>

          {/* User Account / Switchable Sign In / Sign Up Trigger */}
          {user ? (
            <button
              id="header-user-profile-btn"
              onClick={openProfileModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#231F1C] text-[#FAF8F5] border border-[#C5A880]/50 rounded-full text-xs font-medium hover:bg-black hover:border-[#C5A880] transition-all shadow-xs group"
              title="Mon Espace Client Privilégié"
            >
              <div className="w-5 h-5 rounded-full bg-[#C5A880] text-[#1A1918] flex items-center justify-center text-[10px] font-bold shrink-0">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium tracking-wide max-w-[85px] truncate text-[#FDFBF7]">
                {user.name.split(' ')[0]}
              </span>
              <Crown className="w-3 h-3 text-[#E5C158] hidden sm:inline" />
            </button>
          ) : (
            <button
              id="header-auth-btn"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FAF8F5] text-[#1A1918] border border-[#DDD5CA] rounded-full text-xs font-medium hover:bg-[#F2ECE4] hover:border-[#C5A880] transition-all shadow-xs"
              title={language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Se connecter / S’inscrire'}
            >
              <User className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline font-medium tracking-wide">
                {language === 'ar' ? 'دخول / حساب' : 'Connexion'}
              </span>
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#4A443D] hover:text-[#1A1918] transition-colors rounded-full hover:bg-[#EFEAE3]"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#C5A880] text-[#1A1918] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 bg-[#1A1918] text-[#FAF8F5] rounded-full hover:bg-black transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
            <span className="hidden sm:inline text-xs font-medium tracking-wide">
              {language === 'ar' ? 'السلة' : 'Panier'}
            </span>
            <span className="bg-[#C5A880] text-[#1A1918] text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 pb-2.5 pt-0.5">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#8A8175] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'ar' ? 'بحث عن فستان، كتان، بليزر...' : 'Recherche par nom, lin, couleur...'}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F1EDE7] rounded-full text-xs text-[#1A1918] placeholder-[#8A8175] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          />
        </div>
      </div>
    </header>
  );
};
