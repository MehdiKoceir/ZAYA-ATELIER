import React from 'react';
import { Product, Language } from '../../types';
import { AppRoute } from '../../lib/router';
import { ProductCard } from '../ProductCard';
import { PublicFooter } from './PublicFooter';
import { 
  ArrowRight, 
  Crown, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  RefreshCw,
  Phone,
  MessageCircle,
  PackageCheck,
  UserCheck,
  Heart,
  ChevronRight,
  Award,
  Layers,
  CheckCircle2
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
  // Curate a signature preview of 4 highlight models for "Some of our collections"
  const previewProducts = products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4);
  const displayProducts = previewProducts.length >= 4 ? previewProducts : products.slice(0, 4);

  // Category highlights for fast browsing
  const collectionHighlights = [
    {
      id: 'caftans',
      titleFr: 'Caftans & Soirée',
      titleAr: 'قفطان وسهرات',
      descFr: 'Coupes impériales en crêpe de soie avec broderies d’Alger.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'chemises',
      titleFr: 'Chemises en Pur Lin',
      titleAr: 'قمصان الكتان الطبيعي',
      descFr: 'Légèreté, respirabilité et élégance intemporelle.',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'vestes',
      titleFr: 'Vestes & Blazers',
      titleAr: 'سترات وبليزر عصري',
      descFr: 'Lignes architecturales et silhouettes structurées.',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'robes',
      titleFr: 'Robes Fluides',
      titleAr: 'فساتين عصرية',
      descFr: 'Mouvement gracieux et tombé parfait pour le quotidien et les réceptions.',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#1A1918] min-h-screen">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Brand Identity & Direct Pathways                         */}
      {/* ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#F4EFEA] to-[#FAF8F5] border-b border-[#EAE4DC] pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] text-xs uppercase tracking-[0.24em] font-semibold shadow-2xs">
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

            <p className="text-sm sm:text-base text-[#5C5449] max-w-2xl mx-auto leading-relaxed pt-2">
              {language === 'ar'
                ? 'تشكيلة راقية من القفاطين، فساتين السهرات وقمصان الكتان الطبيعي. اطلب الآن مع خدمة الدفع عند الاستلام نقداً في كافة الـ 58 ولاية.'
                : 'Pièces d’exception en pur lin d’Europe, crêpes de soie et coupes architecturales. Commandez en toute sérénité avec paiement en espèces à la livraison (58 Wilayas) et essayage sous 48h.'}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('/collection')}
              className="w-full sm:w-auto px-8 py-4 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{language === 'ar' ? 'استكشف التشكيلة الكاملة' : 'Explorer les Collections'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>

            <button
              onClick={() => onNavigate('/sign-in')}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-[#DDD5CA] text-[#1A1918] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F4EFEA] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-4 h-4 text-[#8C6B3F]" />
              <span>{language === 'ar' ? 'فضاء الزبائن المميزين' : 'Mon Espace Client'}</span>
            </button>
          </div>

          {/* Reassurance Ticker */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#524B41] border-t border-[#EAE4DC] max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Livraison 58 Wilayas (Domicile & Relais)</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Paiement en Espèces au Livreur (COD)</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-[#8C6B3F]" />
              <span>Essayage & Échange Garanti 48h</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. "WHY US" / POURQUOI NOUS CHOISIR ?                                     */}
      {/* Detailed value propositions & trust pillars for the boutique               */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#8C6B3F] font-bold">
              {language === 'ar' ? 'لماذا تختار دار زايا؟' : 'Nos Engagements & Atouts'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1A1918]">
              {language === 'ar' ? 'لماذا تتسوق من أتيليه زايا؟' : 'Pourquoi Choisir ZAYA Atelier ?'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6357] leading-relaxed">
              {language === 'ar'
                ? 'تجربة تسوق جزائرية راقية تجمع بين إتقان الخياطة وضمانات الراحة التامة لزبائننا.'
                : 'Une expérience de haute confection algéroise pensée pour votre confort, de la découpe du tissu jusqu’à la remise en main propre.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reason 1: Haute Confection d'Alger */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Confection Noble à Alger
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Chaque pièce est dessinée et confectionnée avec minutie dans notre atelier à Hydra. Nous sélectionnons exclusivement des lins européens de premier choix et des crêpes de soie au tombé fluide.
              </p>
            </div>

            {/* Reason 2: Paiement à la Livraison (COD) */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Paiement en Espèces à Réception
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Aucun paiement préalable en ligne obligatoire. Vous passez commande sereinement et réglez en dinars directement auprès du livreur après vérification de votre colis (Cash-on-Delivery).
              </p>
            </div>

            {/* Reason 3: Livraison 58 Wilayas */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Livraison Rapide dans les 58 Wilayas
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Couverture intégrale du territoire national à domicile ou en point relais sécurisé Stop-Desk (Yalidine, ZR Express) avec suivi d'acheminement en temps réel.
              </p>
            </div>

            {/* Reason 4: Essayage & Échange Facile */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Essayage Tranquille & Échange 48h
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Essayez votre tenue chez vous. Si la taille, la longueur ou la coupe ne vous apporte pas entière satisfaction, notre équipe organise un échange rapide sous 48h.
              </p>
            </div>

            {/* Reason 5: Styliste & Conseil WhatsApp */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Conciergerie Dédiée WhatsApp
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Une hésitation sur votre taille ou sur les finitions ? Notre styliste d'Hydra vous répond personnellement et instantanément au <strong>0550 00 11 22</strong>.
              </p>
            </div>

            {/* Reason 6: Suivi Transparent & Confidentialité */}
            <div className="p-7 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xs space-y-3.5 hover:border-[#8C6B3F]/50 transition-colors shadow-2xs">
              <div className="w-11 h-11 rounded-full bg-white border border-[#DDD5CA] text-[#8C6B3F] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#1A1918]">
                Transparence & Suivi en Direct
              </h3>
              <p className="text-xs text-[#5C5449] leading-relaxed">
                Suivez votre colis à toute heure avec votre référence et votre numéro de téléphone. Vos coordonnées personnelles sont rigoureusement protégées (Loi algérienne 18-07).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "SOME OF OUR COLLECTIONS" / APERÇU DE NOS COLLECTIONS                  */}
      {/* Highlight categories & curated signature pieces with direct catalog link  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#EAE4DC]">
          <div className="space-y-1.5 text-left">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#8C6B3F] font-bold">
              {language === 'ar' ? 'مختارات الموسم' : 'Créations Phares'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1A1918]">
              {language === 'ar' ? 'تشكيلات دار زايا' : 'Aperçu de nos Collections'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736B60]">
              Découvrez un aperçu de nos coupes signatures disponibles pour expédition immédiate
            </p>
          </div>

          <button
            onClick={() => onNavigate('/collection')}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-[#1A1918] hover:text-[#8C6B3F] transition-colors group cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض كل المعروضات' : 'Toutes les Collections'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A880]" />
          </button>
        </div>

        {/* 4 Category Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {collectionHighlights.map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigate('/collection')}
              className="group cursor-pointer relative overflow-hidden bg-stone-900 border border-[#EAE4DC] rounded-xs aspect-[4/5] flex flex-col justify-end p-5 transition-all shadow-2xs hover:shadow-md"
            >
              <img
                src={col.image}
                alt={col.titleFr}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-1 text-left text-white">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] font-semibold">
                  Atelier ZAYA
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#F4EFEA] transition-colors">
                  {language === 'ar' ? col.titleAr : col.titleFr}
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                  {col.descFr}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#C5A880] font-semibold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>Explorer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Product Cards Preview */}
        <div className="mb-10 text-left">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EAE4DC]">
            <h3 className="font-serif-luxury text-xl font-bold text-[#1A1918]">
              Modèles Emblématiques en Vitrine
            </h3>
            <span className="text-xs text-[#8C6B3F] font-medium">
              4 pièces sélectionnées
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
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
        </div>

        {/* Major Action Banner: Access Full Catalog with Search & Filters */}
        <div className="bg-[#F4EFEA] border border-[#DDD5CA] p-8 sm:p-10 rounded-xs text-center space-y-4 shadow-2xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DDD5CA] rounded-full text-[11px] uppercase tracking-[0.2em] text-[#8C6B3F] font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Catalogue Complet • {products.length} Modèles</span>
          </div>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#1A1918]">
            Envie de Découvrir Toutes Nos Coupes ?
          </h3>
          <p className="text-xs sm:text-sm text-[#635B50] max-w-xl mx-auto leading-relaxed">
            Accédez à la collection complète avec barre de recherche en direct, sélection par tissu (lin, crêpe, soie), filtres par catégorie et guide des tailles.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/collection')}
              className="px-8 py-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>Voir Toute la Collection</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "SIGN IN & CREATE ACCOUNT" / ESPACE CLIENT PRIVILÈGE                   */}
      {/* Dedicated invitation to Sign In and Register with member benefits          */}
      {/* ========================================================================= */}
      <section className="bg-[#1A1918] text-[#FAF8F5] py-16 sm:py-20 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#C5A880] text-xs uppercase tracking-[0.22em] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cercle Privilège ZAYA Atelier</span>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              Créez Votre Compte ou Connectez-Vous
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre espace client pour suivre vos expéditions dans les 58 Wilayas, gérer vos adresses de livraison, et bénéficier d'une remise exclusive de 10% avec le code <strong className="text-[#C5A880]">BIENVENUE10</strong>.
            </p>
          </div>

          {/* Member Privileges 3-Pillar Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2 max-w-3xl mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              <div className="font-serif-luxury font-bold text-sm text-white">Suivi de Commande en Direct</div>
              <p className="text-[11px] text-stone-400">Statut de préparation et expédition Yalidine en temps réel.</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              <div className="font-serif-luxury font-bold text-sm text-white">Commande Express</div>
              <p className="text-[11px] text-stone-400">Vos coordonnées et votre Wilaya mémorisées pour commander en 1 clic.</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
              <div className="font-serif-luxury font-bold text-sm text-white">Factures Téléchargeables</div>
              <p className="text-[11px] text-stone-400">Historique d'achats complet et justificatifs imprimables.</p>
            </div>
          </div>

          {/* Direct Auth CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/sign-up')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A880] text-stone-950 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#d4b992] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Créer mon Compte</span>
            </button>

            <button
              onClick={() => onNavigate('/sign-in')}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-stone-500 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Déjà Cliente ? Se Connecter</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. QUICK ORDER TRACKING TRIGGER (FOR RETURNING BUYERS)                     */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF8F5] border-t border-[#EAE4DC] py-6 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[#8C6B3F]" />
            <span>Vous avez déjà passé commande auprès de la Maison ZAYA ?</span>
          </div>
          <button
            onClick={() => onOpenTracking?.()}
            className="text-xs font-semibold text-[#8C6B3F] hover:text-[#1A1918] underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <span>Vérifier le statut de livraison de votre colis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CLEAN FOOTER                                                           */}
      {/* ========================================================================= */}
      <PublicFooter onNavigate={onNavigate} onOpenTracking={onOpenTracking} />
    </div>
  );
};
