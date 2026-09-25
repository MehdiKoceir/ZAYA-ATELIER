import React, { useState } from 'react';
import { Product, Language } from '../../types';
import { AppRoute } from '../../lib/router';
import { formatDA } from '../../lib/i18n';
import { ProductCard } from '../ProductCard';
import { 
  ArrowRight, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Mail, 
  CheckCircle2, 
  ChevronRight,
  Instagram,
  Phone,
  MapPin,
  MessageCircle,
  RefreshCw,
  Award,
  Hash,
  Search
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [checkerOrderId, setCheckerOrderId] = useState('');
  const [checkerPhone, setCheckerPhone] = useState('');

  // Curate 4 featured signature pieces
  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleHomeTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkerOrderId.trim()) return;
    if (onOpenTracking) {
      onOpenTracking(checkerOrderId.trim(), checkerPhone.trim());
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1A1918]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Clean, Calming Light Background (Eye-Friendly & Sellable) */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 border-b border-[#EAE4DC] bg-gradient-to-b from-[#F4EFEA] to-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Royal Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] text-xs uppercase tracking-[0.22em] font-semibold shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Maison de Haute Confection • Alger</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1918] leading-[1.15]">
              L'Élégance Pure, <br />
              <span className="italic font-light text-[#8C6B3F]">
                {language === 'ar' ? 'أناقة فاخرة صُنعت في الجزائر' : 'Façonnée avec Noblesse à Alger'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#5C5449] font-normal leading-relaxed max-w-2xl mx-auto pt-2">
              {language === 'ar'
                ? 'تشكيلة راقية من القفاطين، فساتين السهرات وقمصان الكتان الطبيعي. اطلب الآن مع خدمة الدفع عند الاستلام نقداً مع التوصيل لكافة الـ 58 ولاية.'
                : 'Pièces d’exception en pur lin d’Europe, crêpes de soie et coupes architecturales. Commandez en toute sérénité avec paiement en espèces à la livraison (58 Wilayas) et essayage sous 48h.'}
            </p>
          </div>

          {/* Direct CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/collection')}
              className="w-full sm:w-auto px-8 py-4 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{language === 'ar' ? 'عرض التشكيلة والطلب' : 'Explorer la Collection'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>

            <button
              onClick={() => onNavigate('/sign-in')}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-[#DDD5CA] text-[#1A1918] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F4EFEA] transition-all text-center cursor-pointer shadow-2xs"
            >
              <span>{language === 'ar' ? 'فضاء الزبائن المميزين' : 'Mon Espace Client'}</span>
            </button>
          </div>

          {/* Three Reassurance Pillars (Eye-Friendly Minimalist Bar) */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#EAE4DC] text-left">
            <div className="p-4 bg-white border border-[#EAE4DC] rounded-xs flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C5A880] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury font-bold text-sm text-[#1A1918]">Livraison 58 Wilayas</p>
                <p className="text-[11px] text-[#736B60]">À domicile ou en point relais Yalidine</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EAE4DC] rounded-xs flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C5A880] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury font-bold text-sm text-[#1A1918]">Paiement à la Livraison</p>
                <p className="text-[11px] text-[#736B60]">Règlement en espèces à réception (COD)</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EAE4DC] rounded-xs flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C5A880] flex items-center justify-center shrink-0 border border-[#EAE4DC]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury font-bold text-sm text-[#1A1918]">Confection d'Alger</p>
                <p className="text-[11px] text-[#736B60]">Matières nobles & finitions soignées</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PUBLIC ORDER STATUS CHECKER (No login required - Order ID + Phone) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#F8F5F0] border-b border-[#EAE4DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-[#E0D8CB] p-6 sm:p-9 rounded-xs shadow-xs text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE4DC]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[#8C6B3F] text-[11px] font-semibold uppercase tracking-[0.22em]">
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'تتبع فوري بدون تسجيل دخول' : 'Suivi Express Sans Connexion'}</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1A1918]">
                  {language === 'ar' ? 'أين وصلت طلبيتك من دار زايا؟' : 'Vérifier le Statut de Votre Commande'}
                </h2>
                <p className="text-xs text-[#736B60] max-w-xl leading-relaxed">
                  {language === 'ar'
                    ? 'أدخل رقم طلبك ورقم هاتفك للاطلاع المباشر على حالة التحضير والشحن في الـ 58 ولاية دون الحاجة لتسجيل الدخول.'
                    : 'Suivez l’acheminement de votre colis en temps réel à l’aide de votre référence et de votre numéro de téléphone, sans avoir besoin de créer ou d’ouvrir un compte.'}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-600 bg-[#FAF8F5] px-3.5 py-2.5 border border-[#E8E1D5] rounded-xs shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <div className="text-left">
                  <div className="font-semibold text-stone-800">58 Wilayas</div>
                  <div className="text-[10px] text-stone-500">Stop-desk & Domicile</div>
                </div>
              </div>
            </div>

            {/* Checker Form */}
            <form onSubmit={handleHomeTrackingSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Order ID Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {language === 'ar' ? 'رقم الطلب' : 'Référence de Commande'} <span className="text-[#8C6B3F]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={checkerOrderId}
                      onChange={(e) => setCheckerOrderId(e.target.value.toUpperCase())}
                      placeholder="Ex: DZ-2609-1024"
                      className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F5] border border-stone-300 text-xs font-mono uppercase text-stone-900 focus:outline-none focus:border-[#C5A880] focus:bg-white rounded-xs shadow-2xs transition-all"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف' : 'Numéro de Téléphone'} <span className="text-[#8C6B3F]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={checkerPhone}
                      onChange={(e) => setCheckerPhone(e.target.value)}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full pl-10 pr-3.5 py-3 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#C5A880] focus:bg-white rounded-xs shadow-2xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                {/* 1-click test examples */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Exemples rapides :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckerOrderId('DZ-2609-1024');
                      setCheckerPhone('0550 12 34 56');
                      onOpenTracking?.('DZ-2609-1024', '0550 12 34 56');
                    }}
                    className="px-2.5 py-1 bg-[#FAF8F5] border border-stone-300 hover:border-[#C5A880] hover:text-[#8C6B3F] font-mono text-[11px] text-stone-700 rounded-xs transition-colors cursor-pointer"
                  >
                    DZ-2609-1024 (Alger)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckerOrderId('DZ-2609-1023');
                      setCheckerPhone('0661 98 76 54');
                      onOpenTracking?.('DZ-2609-1023', '0661 98 76 54');
                    }}
                    className="px-2.5 py-1 bg-[#FAF8F5] border border-stone-300 hover:border-[#C5A880] hover:text-[#8C6B3F] font-mono text-[11px] text-stone-700 rounded-xs transition-colors cursor-pointer"
                  >
                    DZ-2609-1023 (Oran)
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#1A1918] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-xs shrink-0"
                >
                  <Search className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'تتبع الشحنة الآن' : 'Suivre mon Colis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED COLLECTION: Essential Signature Products */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE4DC]">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#8C6B3F] font-semibold">
              Sélection Iconique
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1A1918]">
              Pièces d'Exception
            </h2>
            <p className="text-xs text-[#736B60]">
              Disponibles pour expédition immédiate dans les 58 Wilayas
            </p>
          </div>

          <button
            onClick={() => onNavigate('/collection')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#1A1918] hover:text-[#8C6B3F] transition-colors group cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض كامل المعروضات' : 'Voir Toute la Collection'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Clean 4-Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
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

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/collection')}
            className="px-8 py-3.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-black transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Accéder au Catalogue Complet ({products.length} Modèles)</span>
            <ChevronRight className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CLIENT TRUST & PEACE OF MIND (Simple, Text & Icon Cards, NO Clutter) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#F4EFEA] border-y border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#8C6B3F] font-semibold">
              Garanties & Sérénité
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1A1918]">
              Une Expérience d'Achat en Toute Confiance
            </h2>
            <p className="text-xs text-[#736B60]">
              Notre équipe à Hydra (Alger) veille sur chaque commande de la coupe jusqu'à la livraison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#EAE4DC] rounded-xs space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8C6B3F] flex items-center justify-center border border-[#EAE4DC]">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#1A1918]">
                Paiement en Espèces au Livreur
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Aucune carte bancaire requise. Vous passez votre commande en ligne et réglez le montant en espèces uniquement à la remise de votre colis.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE4DC] rounded-xs space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8C6B3F] flex items-center justify-center border border-[#EAE4DC]">
                <RefreshCw className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#1A1918]">
                Échange de Taille sous 48h
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Essayez votre pièce tranquillement chez vous. Si la taille ou la coupe ne vous convient pas parfaitement, nous organisons un échange rapide.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE4DC] rounded-xs space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8C6B3F] flex items-center justify-center border border-[#EAE4DC]">
                <MessageCircle className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-base text-[#1A1918]">
                Conciergerie & Conseil WhatsApp
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Besoin d'aide pour choisir votre taille ou connaître les disponibilités ? Notre styliste d'Alger vous répond instantanément au <strong>0550 00 11 22</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. FOOTER: Soothing, Professional Neutral Tone */}
      {/* ========================================================================= */}
      <footer className="bg-[#1A1918] text-[#FAF8F5] border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#C5A880]" />
                <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-white">
                  ZAYA
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Maison de haute confection algérienne contemporaine. Des créations durables et raffinées fabriquées avec noblesse et passion.
              </p>
              <p className="text-[11px] text-[#C5A880] font-medium pt-1">
                Expédition sécurisée dans les 58 Wilayas (Algérie)
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">
                    Accueil
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/collection')} className="hover:text-white transition-colors">
                    Toutes les Pièces
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                    À Propos de l'Atelier
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                    Contact & Boutique
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Area */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
                Espace Client
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => onNavigate('/sign-in')} className="hover:text-white transition-colors">
                    Connexion Espace Privilège
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/sign-up')} className="hover:text-white transition-colors">
                    Créer Mon Compte Client
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenTracking ? onOpenTracking() : onNavigate('/dashboard/orders')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Suivi de Commande Sans Connexion
                  </button>
                </li>
              </ul>
            </div>

            {/* Atelier Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
                Atelier & Boutique Alger
              </h4>
              <div className="space-y-2 text-xs text-stone-400">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>Boulevard du 11 Décembre, Val d'Hydra, Alger</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>0550 00 11 22</span>
                </p>
                <p className="text-[11px] text-stone-500 pt-1">
                  Du Samedi au Jeudi : 10h00 - 19h30
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
            <p>© {new Date().getFullYear()} Maison ZAYA Atelier Alger. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-stone-400">
              <span>Paiement en Espèces à la Livraison</span>
              <span>•</span>
              <span>Livraison 58 Wilayas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
