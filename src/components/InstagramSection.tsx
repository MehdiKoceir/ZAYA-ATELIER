import React from 'react';
import { Instagram, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, Language } from '../types';
import { translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface InstagramSectionProps {
  language: Language;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ language, onSelectProduct, products }) => {
  const t = translations[language];

  const looks = [
    {
      img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop',
      caption: 'L’élégance décontractée en pur lin naturel. Confectionné pour les après-midis d’Alger.',
      productId: 'prod-001',
      tag: '#ZAYALin'
    },
    {
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop',
      caption: 'Caftan Moderne Émeraude. La fusion parfaite entre patrimoine et contemporanéité.',
      productId: 'prod-002',
      tag: '#ZAYACouture'
    },
    {
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
      caption: 'Le Blazer El Casbah en laine fine. Une carrure affirmée pour vos rendez-vous.',
      productId: 'prod-003',
      tag: '#ZAYABlazer'
    },
    {
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
      caption: 'Besace en cuir d’Algérie véritable, teinte ambrée et finitions dorées.',
      productId: 'prod-006',
      tag: '#ZAYALeather'
    }
  ];

  return (
    <section className="py-12 bg-[#F6F2EA] border-t border-[#EAE3D6] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#C5A880] mb-1">
              <Instagram className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-semibold">@zaya.atelier</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1918]">
              {t.followUs}
            </h2>
            <p className="text-xs text-[#7A7163] mt-0.5">
              {t.followUsSubtitle}
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
          >
            <span>Rejoindre la communauté</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {looks.map((look, i) => {
            const linkedProduct = products.find(p => p.id === look.productId);

            return (
              <div
                key={i}
                className="group relative overflow-hidden bg-stone-200 aspect-[3/4] shadow-sm cursor-pointer"
                onClick={() => linkedProduct && onSelectProduct(linkedProduct)}
              >
                <img
                  src={look.img}
                  alt={look.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-white text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-wider text-[#E6C697]">{look.tag}</span>
                    <Instagram className="w-3.5 h-3.5" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] line-clamp-2 leading-tight text-stone-200">
                      {look.caption}
                    </p>
                    <button className="w-full py-1.5 bg-white/95 text-stone-900 text-[10px] uppercase font-bold tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-1">
                      <span>Commander ce look</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
