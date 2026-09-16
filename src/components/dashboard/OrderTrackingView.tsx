import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  RefreshCw,
  Package,
  Building2,
  Home,
  Check,
  ShieldCheck,
  Calendar,
  CreditCard,
  Banknote,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../../types';
import { AppRoute } from '../../lib/router';
import { formatDA, buildWhatsAppLink, BOUTIQUE_PHONE } from '../../lib/i18n';
import { ALGERIAN_WILAYAS } from '../../data/wilayas';

interface OrderTrackingViewProps {
  initialOrderId?: string;
  userOrders: Order[];
  language: Language;
  onNavigate: (route: AppRoute) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderId,
  userOrders,
  language,
  onNavigate,
}) => {
  const [searchId, setSearchId] = useState<string>(initialOrderId || (userOrders.length > 0 ? userOrders[0].id : ''));
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // 6 Stepper stages tailored for 58 Wilayas Algerian delivery
  const steps: {
    key: OrderStatus;
    titleFr: string;
    titleAr: string;
    descFr: string;
    descAr: string;
  }[] = [
    {
      key: 'pending',
      titleFr: 'Commande Enregistrée',
      titleAr: 'تم تسجيل الطلب',
      descFr: 'Commande encodée dans le système ZAYA',
      descAr: 'تم تسجيل تفاصيل الطلب في نظام الورشة'
    },
    {
      key: 'confirmed',
      titleFr: 'Validation Téléphonique',
      titleAr: 'تأكيد هاتفي',
      descFr: 'Appel de confirmation passé par notre conseillère',
      descAr: 'تم تأكيد المقاس والعنوان هاتفياً'
    },
    {
      key: 'preparing',
      titleFr: 'Atelier & Emballage',
      titleAr: 'قيد التجهيز والتغليف',
      descFr: 'Contrôle qualité et mise sous pli protecteur',
      descAr: 'فحص الجودة والتغليف الفاخر للقطعة'
    },
    {
      key: 'shipped',
      titleFr: 'Prise en charge Hub Yalidine',
      titleAr: 'تم الشحن عبر ياليدين',
      descFr: 'Colis confié au réseau d\'expédition 58 Wilayas',
      descAr: 'تم تسليم الطرد لمركز الفرز الوطني'
    },
    {
      key: 'out_for_delivery',
      titleFr: 'En cours de Tournée',
      titleAr: 'مع الموزع للتسليم',
      descFr: 'Livreur en route vers votre commune',
      descAr: 'الموزع في طريقه إلى عنوانكم'
    },
    {
      key: 'delivered',
      titleFr: 'Colis Réceptionné',
      titleAr: 'تم الاستلام بنجاح',
      descFr: 'Remise en main propre effectuée',
      descAr: 'تم الاستلام والدفع للموزع بنجاح'
    }
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      case 'cancelled':
      case 'returned':
        return -1;
      default: return 0;
    }
  };

  const executeSearch = useCallback(async (idToQuery: string) => {
    const clean = idToQuery.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
      const data = await response.json();

      if (!response.ok || !data.success || !data.order) {
        throw new Error(
          data.error ||
          `Aucune commande trouvée pour la référence "${clean}". Vérifiez le format (ex: DZ-2609-1024).`
        );
      }

      setOrder(data.order);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Erreur lors de la récupération des données de suivi.');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount or when initialOrderId changes, automatically search if query available
  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      executeSearch(initialOrderId);
    } else if (userOrders.length > 0 && !order) {
      setSearchId(userOrders[0].id);
      executeSearch(userOrders[0].id);
    }
  }, [initialOrderId, userOrders, executeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchId);
  };

  const handleQuickSelect = (id: string) => {
    setSearchId(id);
    executeSearch(id);
  };

  const handleRefresh = () => {
    if (searchId) {
      executeSearch(searchId);
    }
  };

  // Find wilaya data from order
  const orderWilaya = order
    ? ALGERIAN_WILAYAS.find(w => w.code === order.wilayaCode)
    : null;

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  const handleWhatsAppContact = () => {
    if (!order) return;
    const msg = `Salam ZAYA Atelier, je demande des nouvelles sur l'état de ma commande ${order.id} (${order.customerName}, Wilaya de ${order.wilayaName}).`;
    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66C44] mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Réseau National Yalidine Express • 58 Wilayas</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1918]">
            Suivi des Expéditions en Temps Réel
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Entrez votre numéro de commande pour connaître avec précision l'avancement de votre colis : confection en atelier, prise en charge au hub Yalidine et tournée locale dans votre Wilaya.
          </p>
        </div>

        {order && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3.5 py-2 bg-white border border-[#DDD5CA] text-stone-700 text-xs font-medium rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              title="Vérifier le statut actuel auprès du transporteur"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A66C44] ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser l'état</span>
            </button>
            <button
              onClick={handleWhatsAppContact}
              className="px-3.5 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#20bd5a] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Assistance Directe</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Search Console Card */}
      <div className="bg-white border border-[#EAE4DC] rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1918]">
            Référence de votre commande (Ex: DZ-2609-1024)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="DZ-2609-XXXX"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider text-[#1A1918] focus:outline-none focus:border-[#C5A880] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="px-6 py-3 bg-[#1A1918] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                  <span>Recherche en cours...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#C5A880]" />
                  <span>Rechercher le Colis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Selection Pills */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Accès Rapide :
          </span>

          {userOrders.length > 0 ? (
            userOrders.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => handleQuickSelect(o.id)}
                className={`px-3 py-1 rounded-lg font-mono text-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                  searchId === o.id && order?.id === o.id
                    ? 'bg-[#1A1918] text-white border-[#1A1918] font-bold shadow-2xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-[#DDD5CA] hover:border-stone-400'
                }`}
              >
                <span>#{o.id}</span>
                <span className="text-[10px] text-stone-400">({o.wilayaName})</span>
              </button>
            ))
          ) : (
            <>
              <span className="text-[11px] text-stone-400 italic mr-1">Commandes de démonstration 58 Wilayas :</span>
              <button
                type="button"
                onClick={() => handleQuickSelect('DZ-2609-1024')}
                className="px-2.5 py-1 rounded-lg font-mono text-xs bg-[#FAF8F5] border border-[#DDD5CA] text-stone-700 hover:border-stone-900 transition-colors"
              >
                DZ-2609-1024 (Alger)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('DZ-2609-1023')}
                className="px-2.5 py-1 rounded-lg font-mono text-xs bg-[#FAF8F5] border border-[#DDD5CA] text-stone-700 hover:border-stone-900 transition-colors"
              >
                DZ-2609-1023 (Oran)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('DZ-2609-1022')}
                className="px-2.5 py-1 rounded-lg font-mono text-xs bg-[#FAF8F5] border border-[#DDD5CA] text-stone-700 hover:border-stone-900 transition-colors"
              >
                DZ-2609-1022 (Constantine)
              </button>
            </>
          )}
        </div>

        {lastRefreshed && (
          <p className="text-[10px] text-stone-400 text-right">
            Dernière synchronisation serveur : {lastRefreshed.toLocaleTimeString('fr-FR')}
          </p>
        )}
      </div>

      {/* 3. Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-start gap-3 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Commande introuvable</p>
            <p className="text-xs text-rose-700">{error}</p>
            <p className="text-[11px] text-stone-500 pt-1">
              Astuce : Vos commandes ZAYA possèdent le préfixe <code className="font-bold">DZ-</code> suivi de l'année, mois et numéro (ex: DZ-2609-1024).
            </p>
          </div>
        </div>
      )}

      {/* 4. Active Order Tracking Results */}
      {order && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Status Header Card */}
          <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F7F2EA] border border-[#E8DFC8] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg sm:text-xl font-bold text-[#1A1918]">
                    Commande #{order.id}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#FAF8F5] border border-[#DDD5CA] text-[10px] font-bold text-stone-700 rounded-md">
                    Yalidine Express
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Enregistrée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">
                  Statut d'Acheminement Actuel
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1918] text-[#FAF8F5] text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {order.status === 'pending' && 'Enregistrée (Atelier ZAYA)'}
                    {order.status === 'confirmed' && 'Confirmée par l\'Atelier'}
                    {order.status === 'preparing' && 'En Confection & Préparation'}
                    {order.status === 'shipped' && 'Expédiée (Hub Yalidine National)'}
                    {order.status === 'out_for_delivery' && `En cours de livraison dans la Wilaya de ${order.wilayaName}`}
                    {order.status === 'delivered' && 'Colis Livré & Réglé'}
                    {order.status === 'cancelled' && 'Commande Annulée'}
                    {order.status === 'returned' && 'Colis Retourné'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar (Algeria 58 Wilayas 6-step flow) */}
            {order.status !== 'cancelled' && order.status !== 'returned' ? (
              <div className="py-3">
                {/* Desktop Horizontal Stepper */}
                <div className="hidden md:block">
                  <div className="relative flex items-center justify-between">
                    {/* Background line */}
                    <div className="absolute left-0 top-4 -translate-y-1/2 h-1 w-full bg-stone-200 -z-0 rounded-full" />
                    {/* Active progress line */}
                    <div
                      className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-[#1A1918] transition-all duration-700 -z-0 rounded-full"
                      style={{
                        width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`
                      }}
                    />

                    {steps.map((s, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={s.key} className="flex flex-col items-center text-center relative z-10 w-28">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-[#1A1918] text-[#C5A880] shadow-sm'
                                : 'bg-white border-2 border-stone-300 text-stone-400'
                            } ${isCurrent ? 'ring-4 ring-[#C5A880]/30 ring-offset-2' : ''}`}
                          >
                            {isCompleted ? <Check className="w-4 h-4 text-[#C5A880]" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] mt-2 font-bold leading-tight ${
                            isCurrent ? 'text-[#1A1918]' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                          }`}>
                            {language === 'ar' ? s.titleAr : s.titleFr}
                          </span>
                          <span className="text-[9px] text-stone-500 mt-0.5 line-clamp-2 px-1">
                            {language === 'ar' ? s.descAr : s.descFr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-4 pt-1">
                  {steps.map((s, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={s.key} className="flex items-start gap-3 relative">
                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                              idx < currentStepIdx ? 'bg-[#1A1918]' : 'bg-stone-200'
                            }`}
                          />
                        )}
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold z-10 ${
                            isCompleted
                              ? 'bg-[#1A1918] text-[#C5A880]'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-2 ring-[#C5A880]' : ''}`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5 text-[#C5A880]" /> : idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${
                            isCurrent ? 'text-[#1A1918]' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                          }`}>
                            {language === 'ar' ? s.titleAr : s.titleFr}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {language === 'ar' ? s.descAr : s.descFr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Cette commande a été annulée ou retournée. Contactez le service client pour plus d'informations.</span>
              </div>
            )}
          </div>

          {/* 5. 58 Wilayas Delivery Intelligence & Destination Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Logistics & Wilaya Dispatch (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Wilaya Dispatch Details */}
              <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A66C44]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      Destination & Modalités de Livraison (58 Wilayas)
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#FAF8F5] text-[#1A1918] text-[10px] font-bold border border-[#DDD5CA] rounded-md">
                    Wilaya {order.wilayaCode < 10 ? `0${order.wilayaCode}` : order.wilayaCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-stone-400">Destinataire</span>
                    <p className="font-bold text-[#1A1918] text-sm">{order.customerName}</p>
                    <p className="text-stone-600 font-mono text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#A66C44]" />
                      <span>{order.phone}</span>
                    </p>
                    {order.alternatePhone && (
                      <p className="text-stone-500 font-mono text-[10px]">
                        Alt: {order.alternatePhone}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-stone-400">Adresse de Dépôt</span>
                    <p className="font-bold text-[#1A1918]">
                      {order.commune}, Wilaya de {order.wilayaName}
                    </p>
                    <p className="text-stone-600 text-[11px]">{order.address}</p>
                  </div>
                </div>

                {/* Delivery Method & Courier Tip */}
                <div className="p-4 bg-white border border-[#EAE4DC] rounded-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {order.deliveryMethod === 'home' ? (
                        <Home className="w-4 h-4 text-[#A66C44]" />
                      ) : (
                        <Building2 className="w-4 h-4 text-stone-600" />
                      )}
                      <span className="font-bold text-[#1A1918]">
                        {order.deliveryMethod === 'home' ? 'Livraison à Domicile' : 'Bureau Yalidine (Stop Desk)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Délai moyen de transit : <strong>{orderWilaya?.deliveryDays || '24-48h'}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {order.deliveryMethod === 'home'
                      ? `Le livreur local Yalidine de la Wilaya de ${order.wilayaName} vous appellera sur votre mobile (${order.phone}) environ 30 minutes avant de se présenter à votre adresse.`
                      : `Votre colis sera mis à votre disposition à l'agence Yalidine Express de ${order.commune} (${order.wilayaName}). Munissez-vous d'une pièce d'identité pour le retrait.`}
                  </p>

                  {order.customerNotes && (
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900">
                      <span className="font-bold">Instructions coursier :</span> « {order.customerNotes} »
                    </div>
                  )}
                </div>

                {/* Transport Guarantee Badge */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl text-xs text-stone-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-[#1A1918]">Garantie d'Inspection ZAYA</p>
                    <p className="text-[10px] text-stone-500">
                      Vous avez le droit de vérifier l'intégrité de l'emballage de vos pièces avant de régler le montant au livreur.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Timeline Log (Audit Trail) */}
              {order.timeline && order.timeline.length > 0 && (
                <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <Calendar className="w-4 h-4 text-[#A66C44]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      Journal des Événements d'Acheminement
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {order.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-[#1A1918]">
                            {event.note || `Statut mis à jour : ${event.status}`}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                            {new Date(event.timestamp).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Box: Package Content & Financial Settlement (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Payment Settlement Card */}
              <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      Règlement & Facturation
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded">
                    {order.paymentMethod === 'edahabia' ? 'Edahabia' :
                     order.paymentMethod === 'cib' ? 'Carte CIB' :
                     order.paymentMethod === 'baridimob' ? 'BaridiMob' :
                     order.paymentMethod === 'bank_transfer' ? 'Virement' : 'COD Espèces'}
                  </span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Sous-total articles :</span>
                    <span className="font-mono font-medium">{formatDA(order.subtotal, language)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Remise promo ({order.discountCode || 'Promo'}) :</span>
                      <span className="font-mono font-bold">-{formatDA(order.discount, language)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-stone-600">
                    <span>Frais d'expédition ({order.wilayaName}) :</span>
                    <span className="font-mono font-medium">{formatDA(order.deliveryFee, language)}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm">
                    <span className="font-bold text-[#1A1918]">Total de la commande :</span>
                    <span className="font-mono font-bold text-base text-[#1A1918]">
                      {formatDA(order.total, language)}
                    </span>
                  </div>
                </div>

                {/* Payment Action Instructions */}
                {order.paymentMethod === 'COD' ? (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>Montant à régler au livreur</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Veuillez préparer la somme exacte de <strong>{formatDA(order.total, language)}</strong> en espèces lors de la présentation du livreur à votre porte.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Règlement électronique confirmé</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Cette commande est entièrement payée d'avance via BaridiMob / Carte CIB / Edahabia. Vous n'avez rien à régler au livreur.
                    </p>
                  </div>
                )}
              </div>

              {/* Items in Package */}
              <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#A66C44]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      Contenu du Colis ({order.items.reduce((s, i) => s + i.quantity, 0)} pièces)
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pb-3 border-b border-stone-100 last:border-b-0 last:pb-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80'}
                        alt={item.productName}
                        className="w-14 h-16 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-[#1A1918] truncate">{item.productName}</p>
                        <p className="text-stone-500 text-[11px]">
                          Taille : <strong>{item.size}</strong> • Couleur : <strong>{item.color}</strong>
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-stone-500 text-[10px]">Qté : {item.quantity}</span>
                          <span className="font-mono font-bold text-[#1A1918]">
                            {formatDA(item.total, language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concierge & Customer Assistance */}
              <div className="p-5 bg-gradient-to-br from-[#1A1918] to-stone-900 text-white rounded-2xl space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-[#C5A880]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Conciergerie ZAYA</span>
                </div>
                <h4 className="font-serif-luxury text-base font-bold text-white">
                  Besoin d'un renseignement sur votre livraison ?
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Notre équipe est à votre écoute pour modifier l'adresse, reprogrammer un passage ou vérifier la localisation exacte auprès du livreur.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex-1 py-2.5 px-3 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <a
                    href="tel:0550001122"
                    className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Appeler l'Atelier</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
