import React from 'react';
import { Crown, Instagram, Phone, MapPin } from 'lucide-react';
import { AppRoute } from '../../lib/router';

interface PublicFooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#141210] text-[#FAF8F5] border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
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
            <div className="pt-2 flex items-center gap-3 text-stone-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:text-white rounded-full transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/213550001122"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-900 hover:text-white rounded-full transition-colors"
                title="WhatsApp Direct"
              >
                <Phone className="w-4 h-4" />
              </a>
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

          {/* Client Space & Services */}
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
              <li>
                <button onClick={() => onNavigate('/dashboard/orders')} className="hover:text-white transition-colors cursor-pointer">
                  Suivi de Commande (58 Wilayas)
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
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
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
