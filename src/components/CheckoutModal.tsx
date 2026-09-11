import React, { useState, useMemo, useEffect } from 'react';
import { X, CheckCircle, Truck, Phone, MapPin, User, ShieldCheck, MessageCircle, Copy, Check, ArrowRight, AlertCircle, Crown } from 'lucide-react';
import { CartItem, Order, Language, Wilaya } from '../types';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountCode?: string;
  discountAmount: number;
  onOrderSuccess: (order: Order) => void;
  language: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountCode,
  discountAmount,
  onOrderSuccess,
  language
}) => {
  const t = translations[language];
  const { user, openAuthModal } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState<number>(user?.wilayaCode || 16); // Default 16 - Alger
  const [commune, setCommune] = useState(user?.commune || 'Hydra');
  const [customCommune, setCustomCommune] = useState('');
  const [address, setAddress] = useState(user?.address || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'desk'>(user?.deliveryMethod || 'home');
  const [customerNotes, setCustomerNotes] = useState('');

  // Auto-fill when user signs in or changes
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.wilayaCode) setWilayaCode(user.wilayaCode);
      if (user.commune) setCommune(user.commune);
      if (user.address) setAddress(user.address);
      if (user.deliveryMethod) setDeliveryMethod(user.deliveryMethod);
    }
  }, [user]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Selected Wilaya & Delivery Fee calculation
  const selectedWilaya: Wilaya | undefined = useMemo(() => {
    return ALGERIAN_WILAYAS.find(w => w.code === Number(wilayaCode)) || ALGERIAN_WILAYAS[15]; // Alger fallback
  }, [wilayaCode]);

  const deliveryFee = useMemo(() => {
    if (!selectedWilaya) return 500;
    return deliveryMethod === 'desk' ? selectedWilaya.deskDeliveryFee : selectedWilaya.homeDeliveryFee;
  }, [selectedWilaya, deliveryMethod]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  // When wilaya changes, set default commune
  const handleWilayaChange = (code: number) => {
    setWilayaCode(code);
    const targetWilaya = ALGERIAN_WILAYAS.find(w => w.code === code);
    if (targetWilaya && targetWilaya.communes.length > 0) {
      setCommune(targetWilaya.communes[0]);
    } else {
      setCommune('');
    }
  };

  const validatePhone = (p: string) => {
    const clean = p.replace(/\s+/g, '');
    return /^(0)(5|6|7)[0-9]{8}$/.test(clean) || /^\+213(5|6|7)[0-9]{8}$/.test(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Veuillez entrer votre nom et prénom.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Veuillez entrer un numéro de téléphone algérien valide (ex: 0550 12 34 56 ou 0661...)');
      return;
    }

    const finalCommune = commune === '__OTHER__' ? customCommune.trim() : commune;
    if (!finalCommune) {
      setError('Veuillez spécifier votre commune.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setError('Veuillez renseigner votre adresse précise (Rue, Quartier, Bâtiment).');
      return;
    }

    if (items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        wilayaCode: Number(wilayaCode),
        commune: finalCommune,
        address: address.trim(),
        deliveryMethod,
        customerNotes: customerNotes.trim() || undefined,
        discountCode,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          color: i.color,
          size: i.size,
          quantity: i.quantity
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Une erreur est survenue lors de l’enregistrement de votre commande.');
      }

      setCreatedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyOrderRef = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!createdOrder) return;
    const itemsList = createdOrder.items.map(i => `• ${i.productName} (${i.color} - ${i.size}) x${i.quantity}`).join('\n');
    const msg = language === 'ar'
      ? `السلام عليكم أتيليه زايا،\nلقد قمت بطلب جديد عبر الموقع:\n- رقم الطلب: ${createdOrder.id}\n- الاسم: ${createdOrder.customerName}\n- الهاتف: ${createdOrder.phone}\n- الولاية: ${createdOrder.wilayaName} (${createdOrder.commune})\n- الطلبيات:\n${itemsList}\n- المبلغ الإجمالي للدفع عند الاستلام: ${formatDA(createdOrder.total, 'ar')}\nيرجى تأكيد إرسال الطلبية وشكراً!`
      : `Salam! Bonjour ZAYA Atelier,\nJe viens de passer la commande sur votre site:\n- Réf Commande: ${createdOrder.id}\n- Nom: ${createdOrder.customerName}\n- Tél: ${createdOrder.phone}\n- Wilaya: ${createdOrder.wilayaName} (${createdOrder.commune})\n- Articles:\n${itemsList}\n- Total à payer en espèces (COD): ${formatDA(createdOrder.total, 'fr')}\nMerci de me confirmer la préparation et l'expédition!`;

    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="relative w-full max-w-2xl bg-[#FAF8F5] shadow-2xl border border-[#E8E1D5] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 hover:bg-[#EFE9DF] rounded-full text-stone-600 hover:text-stone-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View */}
        {createdOrder ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1918]">
                {t.orderConfirmed}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                {t.orderHelpText}
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 bg-stone-100 border border-stone-300 max-w-sm mx-auto flex items-center justify-between">
              <div className="text-left">
                <div className="text-[11px] text-stone-500 uppercase tracking-wider">{t.orderRef}</div>
                <div className="font-mono text-base font-bold text-[#1A1918]">{createdOrder.id}</div>
              </div>
              <button
                onClick={handleCopyOrderRef}
                className="p-2 text-stone-600 hover:text-stone-950 transition-colors"
                title="Copier le code"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Details Summary */}
            <div className="bg-[#F3EFE9] p-4 text-left text-xs space-y-2 max-w-md mx-auto border border-[#E4DEC7]">
              <div className="flex justify-between">
                <span className="text-stone-600">Client:</span>
                <span className="font-semibold text-stone-900">{createdOrder.customerName} ({createdOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Destination:</span>
                <span className="font-semibold text-stone-900">{createdOrder.wilayaName} - {createdOrder.commune}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Mode:</span>
                <span className="font-semibold text-stone-900">
                  {createdOrder.deliveryMethod === 'home' ? 'À domicile' : 'Stop Desk Yalidine'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DFD7C2] text-sm font-bold text-[#1A1918]">
                <span>Total à régler en espèces (COD):</span>
                <span>{formatDA(createdOrder.total, language)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 max-w-md mx-auto">
              <button
                onClick={handleWhatsAppConfirm}
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.contactWhatsAppOrder}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-5 sm:p-8">
            <div className="border-b border-[#EAE3D6] pb-4 mb-5 text-left">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1918]">
                {t.checkoutTitle}
              </h2>
              <p className="text-xs text-[#7A7163] mt-1">
                {t.checkoutSubtitle}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Atelier Member Login Shortcut */}
            {user ? (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#F4EFEA] border border-[#DDD5CA] flex items-center justify-between text-xs text-[#1A1918]">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    {language === 'ar'
                      ? `مرحباً بكِ ${user.name} • تم استرجاع عنوان التوصيل تلقائياً`
                      : `Compte Privilège : ${user.name} • Adresse pré-remplie`}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#1A1918] text-[#FAF8F5]">
                  {user.loyaltyTier || 'Membre'}
                </span>
              </div>
            ) : (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE4DC] flex items-center justify-between text-xs text-[#6B6356]">
                <span>
                  {language === 'ar' ? 'هل لديك حساب في أتيليه زايا؟' : 'Déjà membre de l’Atelier ?'}
                </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-semibold text-[#1A1918] hover:text-[#A66C44] underline transition-colors"
                >
                  {language === 'ar' ? 'تسجيل الدخول للتعبئة الفورية' : 'Se connecter pour pré-remplir'}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    {t.fullName} *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-3.5 h-3.5 absolute left-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Sarah Benali"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    {t.phone} (Algérie) *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 absolute left-3 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05 / 06 / 07 ..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {t.alternatePhone}
                </label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="Numéro secondaire de secours"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Wilaya & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    {t.wilaya} (58 Wilayas) *
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => handleWilayaChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {String(w.code).padStart(2, '0')} - {w.name} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                    {t.commune} *
                  </label>
                  {selectedWilaya && selectedWilaya.communes.length > 0 ? (
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                    >
                      {selectedWilaya.communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__OTHER__">Autre commune...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      placeholder="Nom de votre commune"
                      className="w-full px-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                    />
                  )}
                </div>
              </div>

              {commune === '__OTHER__' && (
                <div>
                  <input
                    type="text"
                    required
                    value={customCommune}
                    onChange={(e) => setCustomCommune(e.target.value)}
                    placeholder="Précisez votre commune"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              )}

              {/* Delivery Method Selector (Home vs Desk) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1A1918]">
                  {t.deliveryMethod} :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('home')}
                    className={`p-2.5 border text-xs text-left flex flex-col justify-between transition-all ${
                      deliveryMethod === 'home'
                        ? 'border-[#1A1918] bg-[#EFE9DF] font-semibold text-[#1A1918]'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{t.homeDelivery}</span>
                      <span className="font-mono">{formatDA(selectedWilaya?.homeDeliveryFee || 500, language)}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1">Livreur à votre porte</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('desk')}
                    className={`p-2.5 border text-xs text-left flex flex-col justify-between transition-all ${
                      deliveryMethod === 'desk'
                        ? 'border-[#1A1918] bg-[#EFE9DF] font-semibold text-[#1A1918]'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{t.deskDelivery}</span>
                      <span className="font-mono">{formatDA(selectedWilaya?.deskDeliveryFee || 400, language)}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 mt-1">Point relais Yalidine Express</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1918] mb-1">
                  {t.address} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, N° Bâtiment, Porte, ou Point de repère connu..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {t.notes}
                </label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ex: Appeler avant de venir, livrer après 16h..."
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Pricing Summary Box */}
              <div className="bg-[#F3EFE9] p-3.5 border border-[#E6E0D2] space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Articles ({items.reduce((s, i) => s + i.quantity, 0)}) :</span>
                  <span className="font-semibold text-stone-800">{formatDA(subtotal, language)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Réduction ({discountCode}) :</span>
                    <span className="font-semibold">-{formatDA(discountAmount, language)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Livraison ({selectedWilaya?.name} - {deliveryMethod === 'home' ? 'Domicile' : 'Bureau'}) :</span>
                  <span className="font-semibold text-stone-800">{formatDA(deliveryFee, language)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DFD7C2] text-sm font-bold text-[#1A1918]">
                  <span>Total à payer à la livraison (COD) :</span>
                  <span>{formatDA(total, language)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-cod-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:translate-y-[-1px]"
              >
                {loading ? (
                  <span>Validation de la commande en cours...</span>
                ) : (
                  <>
                    <span>{t.confirmOrder}</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
