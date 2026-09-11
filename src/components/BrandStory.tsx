import React from 'react';
import { ShieldCheck, Truck, Sparkles, Scissors, Clock, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

interface BrandStoryProps {
  language: Language;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-t border-[#EAE3D6] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Atelier collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-[4/5] bg-stone-200 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop"
                  alt="Détail Atelier de Confection"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-[#EFE9DF] border border-[#DDD3C4] text-xs">
                <div className="font-serif-luxury font-bold text-stone-900 text-sm">
                  Atelier Val d’Hydra
                </div>
                <div className="text-stone-600 mt-0.5">
                  Conception, patronage et finitions soignées réalisées dans notre atelier d'Alger.
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-6">
              <div className="p-4 bg-[#1A1918] text-[#FAF8F5] text-xs">
                <div className="text-[#C5A880] uppercase tracking-widest font-semibold text-[10px]">
                  Matières Nobles
                </div>
                <div className="font-serif-luxury text-sm font-bold mt-1">
                  100% Lin Pur & Laine
                </div>
                <p className="text-stone-300 text-[11px] mt-1">
                  Sélection rigoureuse des étoffes garantissant tenue, confort et respirabilité.
                </p>
              </div>

              <div className="aspect-[4/5] bg-stone-200 overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
                  alt="Veste Haute Couture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Narrative copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#8C8275] font-semibold">
                L’Héritage & La Vision
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1A1918]">
                {t.boutiqueStoryTitle}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5C5449] leading-relaxed">
              {t.boutiqueStoryText}
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EAE3D6]">
              <div className="space-y-1.5">
                <div className="w-8 h-8 bg-[#EFE9DF] rounded-full flex items-center justify-center text-[#C5A880]">
                  <Scissors className="w-4 h-4 text-stone-900" />
                </div>
                <div className="font-serif-luxury font-bold text-sm text-[#1A1918]">
                  Coupes Modernes
                </div>
                <p className="text-[11px] text-stone-600">
                  Des silhouettes épurées conçues pour le quotidien et les grandes occasions.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 bg-[#EFE9DF] rounded-full flex items-center justify-center text-[#C5A880]">
                  <Truck className="w-4 h-4 text-stone-900" />
                </div>
                <div className="font-serif-luxury font-bold text-sm text-[#1A1918]">
                  58 Wilayas COD
                </div>
                <p className="text-[11px] text-stone-600">
                  Paiement sécurisé en espèces dès réception à votre domicile ou en bureau.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 bg-[#EFE9DF] rounded-full flex items-center justify-center text-[#C5A880]">
                  <Clock className="w-4 h-4 text-stone-900" />
                </div>
                <div className="font-serif-luxury font-bold text-sm text-[#1A1918]">
                  Échanges 48h
                </div>
                <p className="text-[11px] text-stone-600">
                  Assistance réactive sur WhatsApp pour tout ajustement ou échange de taille.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
