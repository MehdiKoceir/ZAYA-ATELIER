import React from 'react';
import {
  Crown,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Truck,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AppRoute } from '../../lib/router';

interface PublicFooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenTracking?: () => void;
}

// Custom SVG Icon for TikTok (Lucide style)
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.903 2.885 2.895 2.895 0 0 1-2.895-2.885 2.896 2.896 0 0 1 2.895-2.885c.488 0 .942.115 1.348.318V9.324a6.34 6.34 0 0 0-1.348-.145A6.334 6.334 0 0 0 3 15.513 6.334 6.334 0 0 0 9.334 21.847a6.334 6.334 0 0 0 6.335-6.334V8.528a8.163 8.163 0 0 0 4.92 1.637V6.72a4.83 4.83 0 0 1-1-.034z" />
  </svg>
);

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onOpenTracking }) => {
  const handleTrackClick = () => {
    if (onOpenTracking) {
      onOpenTracking();
    } else {
      onNavigate('/dashboard/orders');
    }
  };

  return (
    <footer className="bg-[#141210] text-[#FAF8F5] border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* ========================================================================= */}
        {/* 1. DEDICATED 'TRACK MY ORDER' QUICK-ACCESS BANNER                         */}
        {/* ========================================================================= */}
        <div className="mb-12 p-6 sm:p-7 bg-gradient-to-r from-stone-900 via-[#1F1C18] to-stone-900 border border-[#C5A880]/30 rounded-xs shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C5A880] text-[#141210] flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[#C5A880] text-[11px] uppercase tracking-[0.2em] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span>Suivi 58 Wilayas Yalidine & Domicile</span>
              </div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-medium text-white tracking-wide">
                Où est ma commande ? (Track My Order)
              </h3>
              <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                Accédez directement au statut d’expédition en temps réel avec votre référence et numéro de téléphone, sans avoir à créer ni ouvrir de compte.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTrackClick}
            className="w-full md:w-auto px-6 py-3.5 bg-[#C5A880] hover:bg-[#D4BC96] text-[#141210] font-bold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 rounded-xs transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0 group"
          >
            <Search className="w-4 h-4 text-[#141210]" />
            <span>Track My Order</span>
            <ArrowRight className="w-4 h-4 text-[#141210] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN FOOTER COLUMNS                                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column with Integrated Social Media Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('/')}>
              <Crown className="w-4 h-4 text-[#C5A880]" />
              <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-white">
                ZAYA
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Maison de haute confection algérienne contemporaine. Des créations durables et raffinées fabriquées avec noblesse et passion au cœur d'Alger.
            </p>

            {/* Social Media Section with Micro-Animations */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                  Réseaux Sociaux & Communauté
                </span>
                <span className="h-px flex-1 bg-stone-800" />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Instagram Button with Gradient Hover Animation */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-2 px-3 py-2 bg-stone-900/90 border border-stone-800 hover:border-pink-500/60 rounded-xs text-stone-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/15 hover:-translate-y-0.5 overflow-hidden"
                  title="Suivez ZAYA Atelier sur Instagram (@zaya.atelier)"
                >
                  <span className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-pink-500/20 to-purple-600/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <Instagram className="w-4 h-4 text-stone-400 group-hover:text-pink-400 group-hover:scale-115 group-hover:rotate-6 transition-all duration-300" />
                  <span className="text-xs font-medium tracking-wide">Instagram</span>
                </a>

                {/* Facebook Button with Blue Hover Animation */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-2 px-3 py-2 bg-stone-900/90 border border-stone-800 hover:border-[#1877F2]/60 rounded-xs text-stone-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-0.5 overflow-hidden"
                  title="Rejoignez Maison ZAYA Alger sur Facebook"
                >
                  <span className="absolute inset-0 bg-[#1877F2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <Facebook className="w-4 h-4 text-stone-400 group-hover:text-blue-400 group-hover:scale-115 group-hover:-rotate-6 transition-all duration-300" />
                  <span className="text-xs font-medium tracking-wide">Facebook</span>
                </a>

                {/* TikTok Button with Electric Hover Animation */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-2 px-3 py-2 bg-stone-900/90 border border-stone-800 hover:border-cyan-400/60 rounded-xs text-stone-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/15 hover:-translate-y-0.5 overflow-hidden"
                  title="Découvrez les essayages et défilés sur TikTok (@zaya.atelier)"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-rose-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <TikTokIcon className="w-4 h-4 text-stone-400 group-hover:text-cyan-300 group-hover:scale-115 group-hover:rotate-12 transition-all duration-300" />
                  <span className="text-xs font-medium tracking-wide">TikTok</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>Nouveautés en vidéo & hashtag <strong>#ZAYAAtelier</strong></span>
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collection')} className="hover:text-white transition-colors cursor-pointer">
                  Toute la Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  La Maison ZAYA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Conciergerie
                </button>
              </li>
            </ul>
          </div>

          {/* Client Space & Dedicated Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
              Espace Client
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/sign-in')} className="hover:text-white transition-colors cursor-pointer">
                  Connexion (Sign In)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sign-up')} className="hover:text-white transition-colors cursor-pointer">
                  Créer un Compte (Sign Up)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Tableau de Bord Privé
                </button>
              </li>
              <li className="pt-1">
                {/* Dedicated in-column Quick Access Button */}
                <button
                  type="button"
                  onClick={handleTrackClick}
                  className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-850 border border-[#C5A880]/50 hover:border-[#C5A880] text-[#C5A880] hover:text-white rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group"
                >
                  <Truck className="w-3.5 h-3.5 text-[#C5A880] group-hover:scale-110 transition-transform" />
                  <span>Track My Order</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A880]">
              Atelier Showroom
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
              <div className="pt-2">
                <a
                  href="https://wa.me/213550001122"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 text-[11px] font-medium rounded-xs transition-all duration-300"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp Atelier 24/7</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DEDICATED SOCIAL ENGAGEMENT CALLOUT STRIP                               */}
        {/* ========================================================================= */}
        <div className="mt-12 p-5 sm:p-6 bg-gradient-to-r from-stone-900/70 via-stone-900/90 to-stone-900/70 border border-stone-800 rounded-xs flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1A1918] border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold text-white tracking-wide">
                Rejoignez le Cercle Privé ZAYA Atelier
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Suivez nos collections, défilés exclusifs et conseils de style sur Instagram, Facebook et TikTok.
              </p>
            </div>
          </div>

          {/* Social Icon Pills with Hover Animations */}
          <div className="flex items-center gap-3">
            {/* Instagram Pill */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-stone-800/90 border border-stone-700/60 hover:border-transparent hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-115 hover:-translate-y-1 shadow-xs hover:shadow-pink-500/30 cursor-pointer group"
              aria-label="Instagram"
              title="Instagram @zaya.atelier"
            >
              <Instagram className="w-4 h-4 group-hover:rotate-6 transition-transform duration-300" />
            </a>

            {/* Facebook Pill */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-stone-800/90 border border-stone-700/60 hover:border-transparent hover:bg-[#1877F2] text-stone-300 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-115 hover:-translate-y-1 shadow-xs hover:shadow-blue-500/30 cursor-pointer group"
              aria-label="Facebook"
              title="Facebook Maison ZAYA"
            >
              <Facebook className="w-4 h-4 group-hover:-rotate-6 transition-transform duration-300" />
            </a>

            {/* TikTok Pill */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-stone-800/90 border border-stone-700/60 hover:border-cyan-400 hover:bg-black text-stone-300 hover:text-cyan-300 flex items-center justify-center transition-all duration-300 transform hover:scale-115 hover:-translate-y-1 shadow-xs hover:shadow-cyan-400/30 cursor-pointer group"
              aria-label="TikTok"
              title="TikTok @zaya.hauteconfection"
            >
              <TikTokIcon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM COPYRIGHT & TRUST REASSURANCES                                  */}
        {/* ========================================================================= */}
        <div className="mt-10 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} ZAYA Atelier Alger. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Paiement COD en Espèces à la Réception</span>
            <span>•</span>
            <span>Expédition 58 Wilayas Yalidine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
