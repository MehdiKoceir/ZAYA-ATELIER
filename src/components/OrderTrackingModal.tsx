import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  MessageCircle,
  MapPin,
  Phone,
  Hash,
  Printer,
  RotateCcw,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../types';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';
import { OrderInvoiceModal } from './dashboard/OrderInvoiceModal';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialOrderId?: string;
  initialPhone?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  language,
  initialOrderId = '',
  initialPhone = ''
}) => {
  const [orderId, setOrderId] = useState<string>(initialOrderId);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);

  const t = translations[language];

  const quickSamples = [
    { id: 'DZ-2609-1024', phone: '0550123456', displayPhone: '0550 12 34 56', city: 'Alger (Hydra)', status: 'En préparation' },
    { id: 'DZ-2609-1023', phone: '0661987654', displayPhone: '0661 98 76 54', city: 'Oran (Stop-Desk)', status: 'Expédiée' },
    { id: 'DZ-2609-1022', phone: '0770554433', displayPhone: '0770 55 44 33', city: 'Constantine', status: 'Livrée' },
  ];

  const executeLookup = async (targetId: string, targetPhone: string) => {
    const cleanId = targetId.trim().toUpperCase();
    const cleanPhone = targetPhone.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);

    try {
      const url = `/api/orders/${encodeURIComponent(cleanId)}${cleanPhone ? `?phone=${encodeURIComponent(cleanPhone)}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Aucune commande trouvée. Vérifiez votre référence et votre numéro de téléphone.');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const idToUse = initialOrderId || '';
      const phoneToUse = initialPhone || '';
      setOrderId(idToUse);
      setPhone(phoneToUse);

      if (idToUse) {
        executeLookup(idToUse, phoneToUse);
      } else {
        setOrder(null);
        setError(null);
      }
    }
  }, [isOpen, initialOrderId, initialPhone]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    executeLookup(orderId, phone);
  };

  const handleSelectSample = (sampleId: string, samplePhone: string) => {
    setOrderId(sampleId);
    setPhone(samplePhone);
    executeLookup(sampleId, samplePhone);
  };

  const steps: { key: OrderStatus; labelFr: string; labelAr: string; descFr: string }[] = [
    { key: 'pending', labelFr: 'Enregistrée', labelAr: 'تم التسجيل', descFr: 'Commande reçue sur notre plateforme' },
    { key: 'confirmed', labelFr: 'Confirmée', labelAr: 'تم التأكيد', descFr: 'Validée par notre atelier' },
    { key: 'preparing', labelFr: 'Préparation', labelAr: 'قيد التجهيز', descFr: 'Confection & emballage soigné' },
    { key: 'shipped', labelFr: 'Expédiée', labelAr: 'تم الشحن', descFr: 'Prise en charge par Yalidine' },
    { key: 'out_for_delivery', labelFr: 'En livraison', labelAr: 'مع الموزع', descFr: 'Livreur en route vers votre adresse' },
    { key: 'delivered', labelFr: 'Livrée', labelAr: 'تم الاستلام', descFr: 'Remise en mains propres' }
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
    const msg = `Salam ZAYA Atelier, je demande le suivi de ma commande ${order.id} (${order.customerName}, ${order.wilayaName}).`;
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative w-full max-w-2xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D5] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 text-left rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-[#EFE9DF] rounded-full text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 sm:p-8">
            {/* Badge & Title */}
            <div className="flex items-center gap-2 mb-1.5 text-[#8C6B3F]">
              <Truck className="w-4 h-4 text-[#C5A880]" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                Suivi National • 58 Wilayas Algérie
              </span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1A1918]">
              {language === 'ar' ? 'تتبع حالة الشحنة المباشر' : 'Suivi de Commande en Direct'}
            </h2>
            <p className="text-xs text-[#736B60] mt-1 mb-6 leading-relaxed">
              {language === 'ar'
                ? 'أدخل رقم طلبك ورقم هاتفك للاطلاع على مسار الشحنة الفعلي دون الحاجة لتسجيل الدخول.'
                : 'Consultez l’acheminement de votre colis en temps réel sans mot de passe, en indiquant votre référence et votre numéro de téléphone.'}
            </p>

            {/* Search Form with Order ID + Phone Number */}
            <form onSubmit={handleSearchSubmit} className="space-y-3 mb-6 bg-white p-4 border border-[#E8E1D5] rounded-xs shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Order Reference Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    {language === 'ar' ? 'رقم الطلب' : 'Référence Commande'} <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                      placeholder="Ex: DZ-2609-1024"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50/60 border border-stone-300 text-xs font-mono uppercase text-stone-900 focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all rounded-xs"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Numéro de Téléphone'} <span className="text-stone-400 font-normal">({language === 'ar' ? 'للتحقق' : 'vérification'})</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50/60 border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#C5A880] focus:bg-white transition-all rounded-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Confidentialité garantie (Loi 18-07)</span>
                </span>

                <button
                  type="submit"
                  disabled={loading || !orderId.trim()}
                  className="px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-xs"
                >
                  <Search className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{loading ? 'Recherche...' : (language === 'ar' ? 'تتبع الشحنة' : 'Suivre mon Colis')}</span>
                </button>
              </div>
            </form>

            {/* Quick 1-Click Samples for Testing */}
            {!order && !loading && (
              <div className="p-3.5 bg-[#F4EFEA] border border-[#E2DDD0] rounded-xs mb-4">
                <div className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Commandes de démonstration (1-clic) :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {quickSamples.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample.id, sample.phone)}
                      className="p-2 text-left bg-white border border-[#DDD5CA] hover:border-[#C5A880] hover:bg-[#FAF8F5] transition-all rounded-xs text-xs cursor-pointer group"
                    >
                      <div className="font-mono font-bold text-[#1A1918] group-hover:text-[#8C6B3F]">
                        {sample.id}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {sample.displayPhone} • {sample.city}
                      </div>
                      <div className="text-[10px] text-[#8C6B3F] font-medium mt-0.5">
                        {sample.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 mb-4 rounded-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold">Impossible de charger le suivi</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            {/* Order Details Found */}
            {order && (
              <div className="space-y-6 pt-2 border-t border-[#EAE3D6] animate-in fade-in duration-300">
                {/* Status Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F3EFE9] p-4 border border-[#E2DDD0] rounded-xs">
                  <div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-[0.18em]">Référence Commande</div>
                    <div className="font-mono text-lg font-bold text-[#1A1918]">{order.id}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#C5A880]" />
                      <span>{new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-stone-500 uppercase tracking-[0.18em] mb-1">État d'Expédition</div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1918] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-full shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                      {order.status === 'pending' && 'Enregistrée (Validation)'}
                      {order.status === 'confirmed' && 'Confirmée par l’Atelier'}
                      {order.status === 'preparing' && 'En Préparation à l’Atelier'}
                      {order.status === 'shipped' && 'Expédiée (Yalidine Express)'}
                      {order.status === 'out_for_delivery' && 'En Cours de Distribution'}
                      {order.status === 'delivered' && 'Colis Livré avec Succès'}
                      {order.status === 'cancelled' && 'Commande Annulée'}
                      {order.status === 'returned' && 'Colis Retourné'}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                {order.status !== 'cancelled' && order.status !== 'returned' && (
                  <div className="py-2 px-1">
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
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted
                                  ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                                  : 'bg-white border-2 border-stone-300 text-stone-400'
                              } ${isCurrent ? 'ring-2 ring-[#C5A880] ring-offset-2' : ''}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> : idx + 1}
                            </div>
                            <span className="text-[10px] mt-1.5 font-medium text-stone-800 whitespace-nowrap hidden sm:inline">
                              {language === 'ar' ? step.labelAr : step.labelFr}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recipient & Shipping Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 border border-[#E8E1D5] rounded-xs shadow-2xs">
                  <div className="space-y-1">
                    <div className="text-stone-500 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Destinataire Vérifié</span>
                    </div>
                    <div className="font-semibold text-stone-900 text-sm">{order.customerName}</div>
                    <div className="text-stone-600 font-mono">{order.phone}</div>
                    {order.alternatePhone && (
                      <div className="text-stone-500 text-[11px] font-mono">Tél 2: {order.alternatePhone}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-stone-500 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Destination (58 Wilayas)</span>
                    </div>
                    <div className="font-semibold text-stone-900">
                      Wilaya {order.wilayaCode} - {order.wilayaName} ({order.commune})
                    </div>
                    <div className="text-stone-600">{order.address}</div>
                    <div className="text-[11px] text-[#8C6B3F] font-medium pt-0.5">
                      Mode : {order.deliveryMethod === 'desk' ? 'Stop-Desk Yalidine (Retrait au bureau)' : 'Livraison directe à Domicile'}
                    </div>
                  </div>
                </div>

                {/* Articles in Order */}
                <div className="space-y-2 bg-white p-4 border border-[#E8E1D5] rounded-xs shadow-2xs">
                  <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Articles de la Commande ({order.items.length})</span>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-2.5 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-stone-100 overflow-hidden shrink-0 border border-stone-200 rounded-xs">
                            <img src={item.image} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-medium text-stone-900">{item.productName}</div>
                            <div className="text-stone-500 text-[11px]">{item.color} • Taille {item.size} • Quantité : {item.quantity}</div>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900 shrink-0">{formatDA(item.total, language)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-stone-200 space-y-1.5">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Mode de règlement :</span>
                      <span className="font-semibold text-stone-900">
                        {order.paymentMethod === 'edahabia' ? 'Carte Edahabia (Payé via SATIM)' :
                         order.paymentMethod === 'cib' ? 'Carte Bancaire CIB (Payé via SATIM)' :
                         order.paymentMethod === 'baridimob' ? 'BaridiMob / Virement CCP' :
                         order.paymentMethod === 'bank_transfer' ? 'Virement Bancaire' :
                         'Espèces à la livraison (Paiement au livreur)'}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Frais de livraison :</span>
                      <span>{order.deliveryFee === 0 ? 'Offert' : formatDA(order.deliveryFee, language)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-[#1A1918] pt-1 border-t border-stone-100">
                      <span>
                        {order.paymentMethod === 'edahabia' || order.paymentMethod === 'cib'
                          ? 'Total Réglé en Ligne :'
                          : 'Total à Régler au Livreur :'}
                      </span>
                      <span className="text-[#8C6B3F] text-base">{formatDA(order.total, language)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Invoice, WhatsApp, and New Search */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInvoice(true)}
                      className="w-full py-2.5 px-4 bg-white border border-[#DDD5CA] hover:border-[#1A1918] hover:bg-[#FAF8F5] text-stone-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs shadow-2xs"
                    >
                      <Printer className="w-4 h-4 text-[#8C6B3F]" />
                      <span>Imprimer la Facture (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleHelpWhatsApp}
                      className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Conciergerie WhatsApp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOrder(null);
                      setError(null);
                      setOrderId('');
                      setPhone('');
                    }}
                    className="w-full py-2 text-center text-xs text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rechercher une autre commande</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal for Printable PDF */}
      {showInvoice && order && (
        <OrderInvoiceModal
          order={order}
          language={language}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
};
