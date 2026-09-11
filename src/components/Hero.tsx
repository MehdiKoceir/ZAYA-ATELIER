import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

interface HeroProps {
  language: Language;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onExploreClick }) => {
  const t = translations[language];

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-4 pb-10 sm:pb-16 border-b border-[#EFE9DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text Editorial Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFE9DF] rounded-full text-xs text-[#524B43] tracking-wider uppercase font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Alger • Atelier de Haute Confection</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1918] leading-[1.12]">
                {t.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#61594F] max-w-xl font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Tagline highlight */}
            <div className="border-l-2 border-[#C5A880] pl-4 py-1 text-xs sm:text-sm italic text-[#7C7265]">
              « {t.brandTagline} »
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="px-6 py-3 bg-[#1A1918] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-black transition-all flex items-center gap-2 shadow-md hover:translate-y-[-1px]"
              >
                <span>{t.discoverCollection}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
            </div>

            {/* Reassurance pills */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EAE3D6] text-center sm:text-left">
              <div>
                <div className="text-base sm:text-lg font-serif-luxury font-bold text-[#1A1918]">58</div>
                <div className="text-[11px] text-[#7A7165]">Wilayas Couvertes</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-serif-luxury font-bold text-[#1A1918]">COD</div>
                <div className="text-[11px] text-[#7A7165]">Paiement à la Livraison</div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-serif-luxury font-bold text-[#1A1918]">100%</div>
                <div className="text-[11px] text-[#7A7165]">Finitions Nobles</div>
              </div>
            </div>
          </div>

          {/* Hero Imagery Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Primary tall photo */}
              <div className="col-span-7 relative group overflow-hidden shadow-xl bg-stone-200 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop"
                  alt="ZAYA Atelier Robe & Caftan"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] uppercase tracking-widest text-[#E6C697] font-semibold">Cérémonie & Soir</div>
                  <div className="text-xs sm:text-sm font-medium">Caftan Moderne Émeraude</div>
                </div>
              </div>

              {/* Secondary stacked photo */}
              <div className="col-span-5 space-y-3 sm:space-y-4">
                <div className="overflow-hidden shadow-md bg-stone-200 aspect-[4/5] relative group">
                  <img
                    src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop"
                    alt="Chemise Lin Naturel"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px]">
                    Pur Lin • 4 900 DA
                  </div>
                </div>

                <div className="p-3 bg-[#EAE3D6]/70 rounded-none border border-[#DDD3C4]">
                  <div className="text-[11px] font-semibold text-[#1A1918] uppercase tracking-wider">
                    WhatsApp Direct
                  </div>
                  <div className="text-[11px] text-[#696156] mt-0.5">
                    Commandez directement ou posez vos questions sur vos tailles.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
