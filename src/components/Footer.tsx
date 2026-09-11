import React from 'react';
import { Truck, ShieldCheck, MapPin, Phone, MessageCircle, Instagram, Heart, ArrowUp } from 'lucide-react';
import { Language } from '../types';
import { translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface FooterProps {
  language: Language;
  onOpenTracking: () => void;
  onOpenAIAssistant: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenTracking,
  onOpenAIAssistant,
  onOpenAdmin,
  onSelectCategory
}) => {
  const t = translations[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181615] text-[#E0D8CE] pt-14 pb-8 border-t border-[#292523] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-[#FAF8F5]">
                ZAYA
              </span>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                ATELIER • ALGER
              </div>
            </div>

            <p className="text-xs text-[#9E9588] max-w-sm leading-relaxed">
              Maison de création de mode contemporaine algérienne. Des coupes intemporelles et des matières nobles au service de l’élégance quotidienne.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#B8AF9F]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Atelier & Showroom : Val d'Hydra, Alger, Algérie</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Service Client : +213 (0) 550 00 11 22</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp : Disponible 7j/7 pour vos commandes</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#9E9588]">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-white transition-colors">
                  Tous les modèles
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('caftans')} className="hover:text-white transition-colors">
                  Caftans & Tenues de Soirée
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('chemises')} className="hover:text-white transition-colors">
                  Chemises & Blouses en Lin
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('vestes')} className="hover:text-white transition-colors">
                  Blazers & Vestes Laine
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('accessoires')} className="hover:text-white transition-colors">
                  Maroquinerie Artisanale
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Reassurance */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">
              Commandes & Suivi
            </h4>
            <ul className="space-y-2 text-xs text-[#9E9588]">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{t.trackOrder} (58 Wilayas)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAIAssistant} className="hover:text-white transition-colors">
                  Assistance Clientèle & FAQ
                </button>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink(BOUTIQUE_PHONE, 'Salam ZAYA, je souhaite des informations sur les délais')}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Commander via WhatsApp
                </a>
              </li>
              <li>
                <span className="text-[#877E71] block">Échange de taille garanti sous 48h</span>
              </li>
              <li>
                <span className="text-[#877E71] block">Paiement en espèces à la livraison (COD)</span>
              </li>
            </ul>
          </div>

          {/* Boutique Management / Admin Access */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">
              Espace Gestion
            </h4>
            <p className="text-xs text-[#9E9588] leading-relaxed">
              Réservé aux gérants et gestionnaires de l'atelier ZAYA.
            </p>
            <button
              onClick={onOpenAdmin}
              className="mt-2 px-3.5 py-2 bg-[#2E2A27] hover:bg-[#3D3833] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider border border-[#4D453E] transition-all flex items-center gap-2"
            >
              <span>{t.adminDashboard}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292523] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807669]">
          <div>
            © {new Date().getFullYear()} ZAYA Atelier Algérie. Tous droits réservés.
          </div>

          <div className="flex items-center gap-6">
            <span>Conçu & Confectionné pour l’Algérie</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#C5A880] hover:text-white transition-colors"
            >
              <span>Haut de page</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
