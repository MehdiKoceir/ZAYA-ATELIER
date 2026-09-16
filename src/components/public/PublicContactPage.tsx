import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, Crown } from 'lucide-react';
import { AppRoute } from '../../lib/router';

interface PublicContactPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const PublicContactPage: React.FC<PublicContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: 'Alger (16)',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;
    setSent(true);
    setFormData({ name: '', phone: '', wilaya: 'Alger (16)', message: '' });
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-[#8C8275] font-semibold">
            <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Conciergerie Privée</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#1A1918]">
            Nous Contacter
          </h1>
          <p className="text-xs sm:text-sm text-[#736B60]">
            Une question sur une coupe, un guide des tailles personnalisé ou une commande spéciale ? Notre équipe d'Alger est à votre entière écoute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 bg-white border border-[#EAE4DC] rounded-xl space-y-5">
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1918]">
                Atelier Showroom Alger
              </h3>

              <div className="space-y-4 text-xs text-[#5C5449]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1918]">Adresse Atelier :</p>
                    <p>Résidence Les Pins, Boulevard du 11 Décembre</p>
                    <p>Val d'Hydra, Alger, Algérie</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1918]">Service Client :</p>
                    <p>0550 00 11 22 / 0770 99 88 77</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1A1918]">Horaires d'Ouverture :</p>
                    <p>Du Samedi au Jeudi : 10h00 - 19h30</p>
                    <p>Fermé le Vendredi</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2 border-t border-[#EAE4DC]">
                <a
                  href="https://wa.me/213550001122?text=Salam%20ZAYA%20Atelier,%20je%20souhaite%20une%20information."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discussion Instantanée WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="p-5 bg-[#F4EFEA] border border-[#EAE4DC] rounded-xl text-xs text-[#6B6357] space-y-1.5">
              <p className="font-bold text-[#1A1918]">Livraison 58 Wilayas :</p>
              <p>Livraison rapide sous 24h à 72h selon votre wilaya par notre partenaire certifié Yalidine Express.</p>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="md:col-span-7 bg-white border border-[#EAE4DC] p-6 sm:p-8 rounded-xl shadow-xs">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1918] mb-2">
              Envoyer un message à la créatrice
            </h3>
            <p className="text-xs text-[#736B60] mb-6">
              Remplissez le formulaire ci-dessous et nous vous répondrons par téléphone ou WhatsApp dans les plus brefs délais.
            </p>

            {sent ? (
              <div className="p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#166534] mx-auto" />
                <h4 className="font-serif-luxury text-lg text-[#166534] font-bold">
                  Message Transmis avec Succès
                </h4>
                <p className="text-xs text-[#15803D]">
                  Merci pour votre confiance. La conciergerie ZAYA Atelier vous recontactera très rapidement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1A1918] uppercase tracking-wider mb-1">
                      Votre Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Sarah Benali"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1A1918] uppercase tracking-wider mb-1">
                      Téléphone (Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] uppercase tracking-wider mb-1">
                    Wilaya de Résidence
                  </label>
                  <input
                    type="text"
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    placeholder="Ex: Alger (16), Oran (31), Constantine (25)..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] uppercase tracking-wider mb-1">
                    Votre Message ou Demande de Taille *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Posez votre question sur les disponibilités, les conseils d'entretien, retouches ou livraisons..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1918] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
