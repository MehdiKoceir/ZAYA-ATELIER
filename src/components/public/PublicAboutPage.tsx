import React from 'react';
import { Crown, Sparkles, ShieldCheck, Heart, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppRoute } from '../../lib/router';

interface PublicAboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const PublicAboutPage: React.FC<PublicAboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Hero Editorial Header */}
      <section className="relative py-24 bg-[#141210] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C5A880] font-medium">
            <Crown className="w-4 h-4" />
            <span>Maison de Haute Confection</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-white leading-tight">
            L'Histoire de ZAYA Atelier
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Une rencontre entre la précision de la coupe contemporaine et l'âme noble du patrimoine vestimentaire algérien.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Atelier Story */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-16">
          {/* Block 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C8275] font-semibold">
                Origine & Vision
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1A1918]">
                Née à Alger, Pensée pour le Monde
              </h2>
              <p className="text-sm text-[#5C5449] leading-relaxed">
                Fondée en 2024 dans le quartier historique et élégant d'Hydra à Alger, la maison ZAYA est née d’un constat simple : la femme algérienne et méditerranéenne moderne mérite une garde-robe alliant confort thermique, noblesse des fibres naturelles et prestance indiscutable.
              </p>
              <p className="text-sm text-[#5C5449] leading-relaxed">
                Chaque pièce est dessinée, coupée et assemblée avec une rigueur absolue dans nos ateliers partenaires algériens, valorisant des artisans d'art locaux au savoir-faire inestimable.
              </p>
            </div>
            <div className="md:col-span-6 aspect-[4/3] bg-stone-200 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
                alt="Atelier ZAYA Alger"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 bg-white border border-[#EAE4DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#DDD5CA] flex items-center justify-center text-[#C5A880]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1918]">
                Matières Nobles Uniquement
              </h3>
              <p className="text-xs text-[#6B6357] leading-relaxed">
                Pur lin respirant certifié, crêpe de soie lourd, satin duchesse et cuirs pleine fleur pour des pièces qui durent des décennies.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE4DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#DDD5CA] flex items-center justify-center text-[#C5A880]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1918]">
                Coupes Précises
              </h3>
              <p className="text-xs text-[#6B6357] leading-relaxed">
                Des lignes épurées qui tombent avec naturel et mettent en valeur toutes les silhouettes sans jamais contraindre le mouvement.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE4DC] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#DDD5CA] flex items-center justify-center text-[#C5A880]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1918]">
                Service & Proximité 58 Wilayas
              </h3>
              <p className="text-xs text-[#6B6357] leading-relaxed">
                Paiement à la livraison après inspection de votre colis, expédition suivie par Yalidine et assistance conciergerie dédiée sur WhatsApp.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-10 bg-[#1A1918] text-[#FAF8F5] text-center space-y-4">
            <h3 className="font-serif-luxury text-2xl font-light">
              Découvrez les créations de la saison
            </h3>
            <p className="text-xs text-stone-300 max-w-md mx-auto">
              Chaque série est produite en quantités restreintes pour garantir l'exclusivité et la qualité de confection.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/collection')}
                className="px-8 py-3 bg-[#FAF8F5] text-[#1A1918] text-xs uppercase font-bold tracking-widest hover:bg-[#EAE2D5] transition-all inline-flex items-center gap-2"
              >
                <span>Explorer la Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
