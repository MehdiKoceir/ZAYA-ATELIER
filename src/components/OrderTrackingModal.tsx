import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, MessageCircle, MapPin } from 'lucide-react';
import { Order, OrderStatus, Language } from '../types';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const cleanId = query.trim().toUpperCase();
      const response = await fetch(`/api/orders/${cleanId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Aucune commande trouvée avec cette référence. Vérifiez le format (ex: DZ-2609-1024).');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps: { key: OrderStatus; labelFr: string; labelAr: string }[] = [
    { key: 'pending', labelFr: 'Enregistrée', labelAr: 'تم التسجيل' },
    { key: 'confirmed', labelFr: 'Confirmée', labelAr: 'تم التأكيد' },
    { key: 'preparing', labelFr: 'Préparation', labelAr: 'قيد التجهيز' },
    { key: 'shipped', labelFr: 'Expédiée', labelAr: 'تم الشحن' },
    { key: 'out_for_delivery', labelFr: 'En livraison', labelAr: 'مع الموزع' },
    { key: 'delivered', labelFr: 'Livrée', labelAr: 'تم الاستلام' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  const handleHelpWhatsApp = () => {
    if (!order) return;
    const msg = `Salam ZAYA Atelier, je demande des nouvelles de ma commande ${order.id} (${order.customerName}, ${order.wilayaName}).`;
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D5] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 hover:bg-[#EFE9DF] rounded-full text-stone-600 hover:text-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 text-left">
          <div className="flex items-center gap-2 mb-1 text-[#C5A880]">
            <Truck className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold">Suivi National 58 Wilayas</span>
          </div>

          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1918]">
            {t.trackOrderTitle}
          </h2>
          <p className="text-xs text-[#7A7163] mt-1 mb-5">
            {t.trackOrderSubtitle}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: DZ-2609-1024"
              className="flex-1 px-3.5 py-2 bg-white border border-stone-300 text-xs font-mono uppercase text-stone-900 focus:outline-none focus:border-[#C5A880]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2 bg-[#1A1918] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? '...' : t.trackBtn}</span>
            </button>
          </form>

          {/* Quick test references */}
          {!order && !error && (
            <div className="p-3 bg-[#F1EDE7] border border-[#E4DEC7] text-xs text-stone-600 mb-2">
              <span className="font-semibold text-stone-800">Commandes de test disponibles : </span>
              <button
                onClick={() => setQuery('DZ-2609-1024')}
                className="underline hover:text-black font-mono text-stone-900 mx-1"
              >
                DZ-2609-1024
              </button>
              (Alger),
              <button
                onClick={() => setQuery('DZ-2609-1023')}
                className="underline hover:text-black font-mono text-stone-900 mx-1"
              >
                DZ-2609-1023
              </button>
              (Oran),
              <button
                onClick={() => setQuery('DZ-2609-1022')}
                className="underline hover:text-black font-mono text-stone-900 mx-1"
              >
                DZ-2609-1022
              </button>
              (Constantine).
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Details Found */}
          {order && (
            <div className="space-y-6 pt-2 border-t border-[#EAE3D6] animate-in fade-in duration-300">
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F3EFE9] p-3.5 border border-[#E2DDD0]">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider">Commande</div>
                  <div className="font-mono text-base font-bold text-[#1A1918]">{order.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-stone-500 uppercase tracking-wider">Statut Actuel</div>
                  <span className="inline-block px-2.5 py-0.5 bg-[#1A1918] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider">
                    {order.status === 'pending' && 'En attente de confirmation'}
                    {order.status === 'confirmed' && 'Confirmée'}
                    {order.status === 'preparing' && 'En préparation'}
                    {order.status === 'shipped' && 'Expédiée (Yalidine)'}
                    {order.status === 'out_for_delivery' && 'En cours de livraison'}
                    {order.status === 'delivered' && 'Colis Livré'}
                    {order.status === 'cancelled' && 'Annulée'}
                    {order.status === 'returned' && 'Retournée'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              {order.status !== 'cancelled' && order.status !== 'returned' && (
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-stone-200 -z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C5A880] transition-all duration-500 -z-0"
                      style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-[#1A1918] text-[#FAF8F5]'
                                : 'bg-white border-2 border-stone-300 text-stone-400'
                            } ${isCurrent ? 'ring-2 ring-[#C5A880] ring-offset-2' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> : idx + 1}
                          </div>
                          <span className="text-[10px] mt-1.5 font-medium text-stone-700 whitespace-nowrap">
                            {language === 'ar' ? step.labelAr : step.labelFr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Destination & Recipient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 border border-stone-200">
                <div>
                  <div className="text-stone-500 text-[11px]">Destinataire :</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{order.customerName}</div>
                  <div className="text-stone-600 font-mono">{order.phone}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[11px]">Lieu de livraison :</div>
                  <div className="font-semibold text-stone-900 mt-0.5">
                    {order.wilayaName} ({order.wilayaCode}) - {order.commune}
                  </div>
                  <div className="text-stone-600">{order.address}</div>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Articles commandés :
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-10 bg-stone-100 overflow-hidden shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">{item.productName}</div>
                        <div className="text-stone-500 text-[11px]">{item.color} • {item.size} • Qté: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{formatDA(item.total, language)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm font-bold text-[#1A1918] pt-2">
                  <span>Montant COD à régler :</span>
                  <span>{formatDA(order.total, language)}</span>
                </div>
              </div>

              {/* Contact WhatsApp */}
              <button
                onClick={handleHelpWhatsApp}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Modifier mon adresse ou contacter l'atelier sur WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
