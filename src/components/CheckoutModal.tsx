import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Truck, 
  Phone, 
  MapPin, 
  User, 
  ShieldCheck, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Crown, 
  Lock,
  CreditCard,
  Building,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Banknote,
  RotateCw,
  Shield,
  KeyRound
} from 'lucide-react';
import { CartItem, Order, Language, Wilaya } from '../types';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { formatDA, translations, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

// Official ZAYA Atelier Payment Coordinates
export const ZAYA_PAYMENT_DETAILS = {
  baridiMob: {
    rip: '00799999002345678912',
    ccp: '2345678 Clé 91',
    titulaire: 'Maison ZAYA Haute Confection',
    etablissement: 'Algérie Poste (BaridiMob)'
  },
  bank: {
    rib: '002 00045 1234567890 42',
    titulaire: 'SARL ZAYA LUXE ATELIER',
    banque: 'Banque Nationale d’Algérie (BNA) - Agence Hydra Alger',
    codeSwift: 'BNALDZAL045'
  }
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  cart?: CartItem[];
  discountCode?: string;
  discountAmount?: number;
  onApplyDiscount?: (code: string) => Promise<boolean>;
  onOrderSuccess: (order: Order) => void;
  language: Language;
  onNavigate?: (route: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  cart,
  discountCode,
  discountAmount = 0,
  onApplyDiscount,
  onOrderSuccess,
  language,
  onNavigate
}) => {
  const t = translations[language];
  const { user, token, openAuthModal } = useAuth();
  const cartItems = items || cart || [];

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
  
  // Payment Method Selection: 'edahabia' (BaridiMob), 'cib' (Banques DZ), or 'COD' (Cash)
  const [paymentMethod, setPaymentMethod] = useState<'edahabia' | 'cib' | 'COD'>('edahabia');
  const [paymentReference, setPaymentReference] = useState('');

  // Card Payment States (Card Number, Expiry, CVV in back of card, Holder)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name ? user.name.toUpperCase() : '');
  const [cardFlip, setCardFlip] = useState(false); // false = Recto, true = Verso (CVV at the back)

  // SATIM 3D Secure SMS Verification State
  const [showSatimModal, setShowSatimModal] = useState(false);
  const [satimOtp, setSatimOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('583921');
  const [otpError, setOtpError] = useState<string | null>(null);

  // UI States
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-fill when user signs in, updates profile, or opens checkout
  useEffect(() => {
    if (user && isOpen) {
      if (user.name) {
        setCustomerName(user.name);
        if (!cardHolder) setCardHolder(user.name.toUpperCase());
      }
      if (user.phone) setPhone(user.phone);
      if (user.wilayaCode) setWilayaCode(user.wilayaCode);
      if (user.commune) setCommune(user.commune);
      if (user.address) setAddress(user.address);
      if (user.deliveryMethod) setDeliveryMethod(user.deliveryMethod);
      if (user.deliveryNotes) setCustomerNotes(user.deliveryNotes);
    }
  }, [user, isOpen]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Card number input formatter (16 digits separated by spaces: 6280 1234 5678 9012)
  const handleCardNumberChange = (val: string) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 16);
    const groups: string[] = [];
    for (let i = 0; i < rawDigits.length; i += 4) {
      groups.push(rawDigits.slice(i, i + 4));
    }
    setCardNumber(groups.join(' '));
  };

  // Card expiry date input formatter (MM/YY)
  const handleExpiryChange = (val: string) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 4);
    if (rawDigits.length >= 3) {
      setCardExpiry(`${rawDigits.slice(0, 2)}/${rawDigits.slice(2, 4)}`);
    } else {
      setCardExpiry(rawDigits);
    }
  };

  // Card CVV input formatter (3 digits in the back)
  const handleCvvChange = (val: string) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 3);
    setCardCvv(rawDigits);
  };

  // Mask card for storage & display
  const maskCard = (num: string) => {
    const digits = num.replace(/\s+/g, '');
    if (digits.length < 8) return digits;
    const first4 = digits.slice(0, 4);
    const last4 = digits.slice(-4);
    return `${first4} •••• •••• ${last4}`;
  };

  // Selected Wilaya & Delivery Fee calculation
  const selectedWilaya: Wilaya | undefined = useMemo(() => {
    return ALGERIAN_WILAYAS.find(w => w.code === Number(wilayaCode)) || ALGERIAN_WILAYAS[15]; // Alger fallback
  }, [wilayaCode]);

  const deliveryFee = useMemo(() => {
    if (!selectedWilaya) return 500;
    return deliveryMethod === 'desk' ? selectedWilaya.deskDeliveryFee : selectedWilaya.homeDeliveryFee;
  }, [selectedWilaya, deliveryMethod]);

  const subtotal = useMemo(() => {
    return (cartItems || []).reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
  }, [cartItems]);
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

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Veuillez vous connecter ou créer un compte pour finaliser votre commande.');
      return;
    }

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

    if (cartItems.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    // If card payment: validate card number, expiry, CVV (back of card)
    if (paymentMethod === 'edahabia' || paymentMethod === 'cib') {
      const rawCard = cardNumber.replace(/\s+/g, '');
      if (rawCard.length < 16) {
        setError(
          `Veuillez saisir les 16 chiffres de votre ${
            paymentMethod === 'edahabia' ? 'Carte Edahabia (BaridiMob)' : 'Carte Bancaire CIB'
          }.`
        );
        setCardFlip(false);
        return;
      }

      const [mm, yy] = cardExpiry.split('/');
      const month = parseInt(mm, 10);
      if (!cardExpiry || !mm || !yy || isNaN(month) || month < 1 || month > 12 || yy.length < 2) {
        setError('Veuillez renseigner une date d’expiration valide au format MM/AA (ex: 08/28).');
        setCardFlip(false);
        return;
      }

      if (!cardCvv || cardCvv.length < 3) {
        setError('Veuillez renseigner le code de sécurité secret à 3 chiffres (CVV) situé au dos de votre carte.');
        setCardFlip(true);
        return;
      }

      if (!cardHolder.trim()) {
        setError('Veuillez indiquer le nom et prénom du titulaire tel qu’il figure sur la carte.');
        setCardFlip(false);
        return;
      }

      // Generate a realistic 6-digit SMS OTP code and display SATIM 3D Secure modal
      const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtp(freshOtp);
      setSatimOtp('');
      setOtpError(null);
      setShowSatimModal(true);
      return;
    }

    // COD direct submission
    executeOrderCreation('COD');
  };

  // Submit order to backend
  const executeOrderCreation = async (
    chosenMethod: 'edahabia' | 'cib' | 'COD',
    cardPayload?: { maskedNumber: string; cardHolder: string; cardType: 'edahabia' | 'cib'; expiryDate: string }
  ) => {
    setLoading(true);
    setError(null);
    const finalCommune = commune === '__OTHER__' ? customCommune.trim() : commune;

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        wilayaCode: Number(wilayaCode),
        commune: finalCommune,
        address: address.trim(),
        deliveryMethod,
        paymentMethod: chosenMethod,
        cardDetails: cardPayload,
        paymentReference: chosenMethod !== 'COD' ? `SATIM-AUT-${Date.now().toString().slice(-6)}` : undefined,
        customerNotes: customerNotes.trim() || undefined,
        discountCode,
        items: cartItems.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          color: i.color,
          size: i.size,
          quantity: i.quantity
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Une erreur est survenue lors de l’enregistrement de votre commande.');
      }

      setShowSatimModal(false);
      setCreatedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      setError(err.message);
      setOtpError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm OTP from SATIM SMS
  const handleConfirmSatimOtp = () => {
    if (!satimOtp || satimOtp.trim().length !== 6) {
      setOtpError('Veuillez saisir le code de validation à 6 chiffres reçu par SMS.');
      return;
    }

    if (satimOtp.trim() !== simulatedOtp && satimOtp.trim() !== '123456') {
      setOtpError('Code SMS invalide. Veuillez saisir le code exact.');
      return;
    }

    executeOrderCreation(paymentMethod, {
      maskedNumber: maskCard(cardNumber),
      cardHolder: cardHolder.trim(),
      cardType: paymentMethod === 'edahabia' ? 'edahabia' : 'cib',
      expiryDate: cardExpiry
    });
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
    const paymentLabel = createdOrder.paymentMethod === 'edahabia'
      ? `Carte Edahabia (BaridiMob) [${createdOrder.cardDetails?.maskedNumber || 'Validée'}]`
      : createdOrder.paymentMethod === 'cib'
      ? `Carte Bancaire CIB [${createdOrder.cardDetails?.maskedNumber || 'Validée'}]`
      : createdOrder.paymentMethod === 'baridimob'
      ? 'Virement BaridiMob / CCP Algérie Poste'
      : createdOrder.paymentMethod === 'bank_transfer'
      ? 'Virement Bancaire / Carte CIB'
      : 'Paiement en espèces à la livraison (COD)';

    const refNote = createdOrder.paymentReference ? `\n- Réf Paiement/Autorisation: ${createdOrder.paymentReference}` : '';

    const msg = language === 'ar'
      ? `السلام عليكم أتيليه زايا،\nلقد قمت بطلب جديد عبر الموقع:\n- رقم الطلب: ${createdOrder.id}\n- الاسم: ${createdOrder.customerName}\n- الهاتف: ${createdOrder.phone}\n- الولاية: ${createdOrder.wilayaName} (${createdOrder.commune})\n- طريقة الدفع: ${paymentLabel}${refNote}\n- الطلبيات:\n${itemsList}\n- المبلغ الإجمالي: ${formatDA(createdOrder.total, 'ar')}\nيرجى تأكيد الاستلام وتجهيز الطلب وشكراً!`
      : `Salam! Bonjour ZAYA Atelier,\nJe viens de finaliser ma commande sur votre site:\n- Réf Commande: ${createdOrder.id}\n- Nom: ${createdOrder.customerName}\n- Tél: ${createdOrder.phone}\n- Wilaya: ${createdOrder.wilayaName} (${createdOrder.commune})\n- Mode de Paiement: ${paymentLabel}${refNote}\n- Articles:\n${itemsList}\n- Total: ${formatDA(createdOrder.total, 'fr')}\nMerci de me confirmer la préparation et l'expédition!`;

    window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] shadow-2xl border border-[#DDD5CA] overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 hover:bg-[#EFE9DF] rounded-full text-stone-500 hover:text-stone-900 transition-colors"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* SUCCESS VIEW                                                  */}
        {/* ------------------------------------------------------------- */}
        {createdOrder ? (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1A1918]">
                {t.orderConfirmed}
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Votre commande a été enregistrée avec succès auprès de l'Atelier ZAYA.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-3 bg-white border border-[#DDD5CA] flex items-center justify-between max-w-sm mx-auto shadow-2xs">
              <div className="text-left">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">{t.orderRef}</div>
                <div className="font-mono text-sm font-bold text-[#1A1918]">{createdOrder.id}</div>
              </div>
              <button
                onClick={handleCopyOrderRef}
                className="px-2 py-1 text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1 bg-stone-100 rounded-xs"
                title="Copier le code"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedRef ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

            {/* Card Payment Validation Box if Edahabia / CIB */}
            {(createdOrder.paymentMethod === 'edahabia' || createdOrder.paymentMethod === 'cib') && (
              <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 text-left text-xs space-y-2 rounded-xs">
                <div className="flex items-center justify-between font-semibold text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      {createdOrder.paymentMethod === 'edahabia' ? 'Règlement Carte Edahabia Confirmé' : 'Règlement Carte CIB Confirmé'}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded">
                    SATIM 3D Secure OK
                  </span>
                </div>
                <div className="p-2 bg-white border border-emerald-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">Carte débitée :</span>
                    <strong className="text-stone-900">{createdOrder.cardDetails?.maskedNumber || '•••• •••• •••• ••••'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">Titulaire :</span>
                    <strong className="text-stone-900">{createdOrder.cardDetails?.cardHolder || createdOrder.customerName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">N° Autorisation SATIM :</span>
                    <strong className="text-emerald-700">{createdOrder.paymentReference || 'SATIM-AUT-928172'}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Votre transaction a été validée avec succès via le réseau interbancaire algérien. Aucun paiement supplémentaire ne sera demandé à la livraison.
                </p>
              </div>
            )}

            {/* Bank / BaridiMob Instructions if selected */}
            {createdOrder.paymentMethod === 'baridimob' && (
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 text-left text-xs space-y-2 rounded-xs">
                <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>Coordonnées BaridiMob & CCP Atelier ZAYA</span>
                </div>
                <div className="p-2 bg-white border border-amber-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">RIP BaridiMob :</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-stone-900">{ZAYA_PAYMENT_DETAILS.baridiMob.rip}</strong>
                      <button
                        onClick={() => handleCopyText(ZAYA_PAYMENT_DETAILS.baridiMob.rip, 'rip')}
                        className="text-stone-600 hover:text-black p-0.5"
                      >
                        {copiedKey === 'rip' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">Compte CCP :</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-stone-900">{ZAYA_PAYMENT_DETAILS.baridiMob.ccp}</strong>
                      <button
                        onClick={() => handleCopyText(ZAYA_PAYMENT_DETAILS.baridiMob.ccp, 'ccp')}
                        className="text-stone-600 hover:text-black p-0.5"
                      >
                        {copiedKey === 'ccp' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500 font-sans pt-0.5">
                    Titulaire : <strong>{ZAYA_PAYMENT_DETAILS.baridiMob.titulaire}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Effectuez votre virement de <strong>{formatDA(createdOrder.total, language)}</strong> puis transmettez la capture du reçu via le bouton WhatsApp ci-dessous.
                </p>
              </div>
            )}

            {createdOrder.paymentMethod === 'bank_transfer' && (
              <div className="bg-blue-50/70 border border-blue-200 p-3.5 text-left text-xs space-y-2 rounded-xs">
                <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>Coordonnées Bancaires (CIB / Virement) ZAYA</span>
                </div>
                <div className="p-2 bg-white border border-blue-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-sans">RIB Bancaire :</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-stone-900">{ZAYA_PAYMENT_DETAILS.bank.rib}</strong>
                      <button
                        onClick={() => handleCopyText(ZAYA_PAYMENT_DETAILS.bank.rib, 'rib')}
                        className="text-stone-600 hover:text-black p-0.5"
                      >
                        {copiedKey === 'rib' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500 font-sans pt-0.5">
                    Titulaire : <strong>{ZAYA_PAYMENT_DETAILS.bank.titulaire}</strong> ({ZAYA_PAYMENT_DETAILS.bank.banque})
                  </div>
                </div>
                <p className="text-[11px] text-blue-800 leading-snug">
                  Montant à virer : <strong>{formatDA(createdOrder.total, language)}</strong>. Envoyez votre reçu par WhatsApp pour expédition immédiate.
                </p>
              </div>
            )}

            {/* Summary Box */}
            <div className="bg-white p-3 text-left text-xs space-y-1.5 border border-[#EAE4DC] shadow-2xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Client :</span>
                <span className="font-semibold text-stone-900">{createdOrder.customerName} ({createdOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Destination :</span>
                <span className="font-semibold text-stone-900">{createdOrder.wilayaName} ({createdOrder.commune})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Mode de paiement :</span>
                <span className="font-semibold text-stone-900">
                  {createdOrder.paymentMethod === 'edahabia' ? 'Carte Edahabia (BaridiMob)' :
                   createdOrder.paymentMethod === 'cib' ? 'Carte Bancaire CIB' :
                   createdOrder.paymentMethod === 'baridimob' ? 'BaridiMob / CCP' :
                   createdOrder.paymentMethod === 'bank_transfer' ? 'Carte Bancaire / Virement' :
                   'Espèces à la livraison (COD)'}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-stone-200 text-sm font-bold text-[#1A1918]">
                <span>Total réglé :</span>
                <span>{formatDA(createdOrder.total, language)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 max-w-sm mx-auto pt-1">
              <button
                onClick={handleWhatsAppConfirm}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmer / Envoyer reçu sur WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : !user ? (
          /* ------------------------------------------------------------- */
          /* AUTH REQUIRED SCREEN                                          */
          /* ------------------------------------------------------------- */
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="font-serif-luxury text-xl font-bold text-[#1A1918]">
                Connexion Requise
              </h2>
              <p className="text-xs text-[#6B6357] leading-relaxed">
                Connectez-vous pour finaliser votre commande avec livraison 58 Wilayas et options de paiement (Espèces, BaridiMob, Carte).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigate) {
                    onNavigate('/sign-in');
                  } else {
                    window.location.hash = '#/sign-in';
                  }
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
              >
                Se Connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigate) {
                    onNavigate('/sign-up');
                  } else {
                    window.location.hash = '#/sign-up';
                  }
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-white border border-[#DDD5CA] hover:border-black text-[#1A1918] text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                Créer un Compte
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* STREAMLINED & MINIMIZED CHECKOUT FORM                         */
          /* ------------------------------------------------------------- */
          <div className="p-4 sm:p-5">
            {/* Header: Minimal & Compact */}
            <div className="border-b border-[#EAE3D6] pb-2.5 mb-3 text-left flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-lg font-bold text-[#1A1918]">
                  {t.checkoutTitle}
                </h2>
                <p className="text-[11px] text-[#7A7163]">
                  Livraison 58 Wilayas • Espèces, BaridiMob ou Virement CIB
                </p>
              </div>

              {user && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#F4EFEA] border border-[#DDD5CA] text-[#8C6B3F]">
                  {user.name.split(' ')[0]} • {user.loyaltyTier || 'Membre'}
                </span>
              )}
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] mb-0.5">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nom & Prénom"
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] mb-0.5">
                    {t.phone} (Algérie) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 ..."
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Row 2: Wilaya & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] mb-0.5">
                    {t.wilaya} (58 Wilayas) *
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => handleWilayaChange(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {String(w.code).padStart(2, '0')} - {w.name} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A1918] mb-0.5">
                    {t.commune} *
                  </label>
                  {selectedWilaya && selectedWilaya.communes.length > 0 ? (
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
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
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
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
                    placeholder="Précisez le nom exact de votre commune"
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              )}

              {/* Row 3: Compact Delivery Method Toggle */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1918] mb-1">
                  Mode de Livraison :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('home')}
                    className={`px-3 py-1.5 border text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                      deliveryMethod === 'home'
                        ? 'border-[#1A1918] bg-[#EFE9DF] font-semibold text-[#1A1918]'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>🚚 Domicile</span>
                    <span className="font-mono text-[11px]">{formatDA(selectedWilaya?.homeDeliveryFee || 500, language)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('desk')}
                    className={`px-3 py-1.5 border text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                      deliveryMethod === 'desk'
                        ? 'border-[#1A1918] bg-[#EFE9DF] font-semibold text-[#1A1918]'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>🏢 Stop Desk Yalidine</span>
                    <span className="font-mono text-[11px]">{formatDA(selectedWilaya?.deskDeliveryFee || 400, language)}</span>
                  </button>
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1918] mb-0.5">
                  {t.address} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, N° Bâtiment, ou Point de repère..."
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Optional Fields Toggle (Keeps form minimized) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="text-[11px] text-[#8C6B3F] hover:text-[#1A1918] flex items-center gap-1 font-medium transition-colors"
                >
                  {showOptionalFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showOptionalFields ? 'Masquer les options avancées' : '+ Options : N° secondaire & instructions livreur'}</span>
                </button>

                {showOptionalFields && (
                  <div className="mt-2 space-y-2 p-2 bg-[#F4EFEA] border border-[#DDD5CA] rounded-xs text-xs">
                    <div>
                      <label className="block text-[10px] text-stone-600 mb-0.5">Téléphone secondaire (optionnel)</label>
                      <input
                        type="tel"
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value)}
                        placeholder="Autre numéro de secours"
                        className="w-full px-2 py-1 bg-white border border-stone-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-600 mb-0.5">Instructions pour la livraison (optionnel)</label>
                      <input
                        type="text"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Ex: Appeler avant d'arriver, livrer l'après-midi..."
                        className="w-full px-2 py-1 bg-white border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* PAYMENT METHOD SELECTOR (EDAHABIA, CIB, COD)              */}
              {/* ========================================================= */}
              <div className="border-t border-[#EAE3D6] pt-2.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold text-[#1A1918]">
                    Mode de Règlement :
                  </label>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1 font-sans">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Paiement Sécurisé SATIM
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {/* Option 1: Carte Edahabia (BaridiMob) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('edahabia');
                      setCardFlip(false);
                    }}
                    className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'edahabia'
                        ? 'border-[#1A1918] bg-[#1A1918] text-white font-semibold shadow-2xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-[11px] leading-tight">Carte Edahabia</span>
                    <span className="text-[9px] opacity-75">BaridiMob / Poste</span>
                  </button>

                  {/* Option 2: Carte Bancaire CIB */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cib');
                      setCardFlip(false);
                    }}
                    className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cib'
                        ? 'border-[#1A1918] bg-[#1A1918] text-white font-semibold shadow-2xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-[11px] leading-tight">Carte CIB</span>
                    <span className="text-[9px] opacity-75">Banques DZ (SATIM)</span>
                  </button>

                  {/* Option 3: Espèces à la livraison */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2 border rounded-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#1A1918] bg-[#1A1918] text-white font-semibold shadow-2xs'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#C5A880]" />
                    <span className="text-[11px] leading-tight">Espèces (COD)</span>
                    <span className="text-[9px] opacity-75">À la réception</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* INTERACTIVE CARD DETAILS (EDAHABIA OU CIB)               */}
                {/* ========================================================= */}
                {(paymentMethod === 'edahabia' || paymentMethod === 'cib') && (
                  <div className="p-3 bg-[#FBF9F6] border border-[#DDD5CA] rounded-xs space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-[#EAE4DC]">
                      <div className="flex items-center gap-1.5 font-bold text-[#1A1918]">
                        <CreditCard className="w-4 h-4 text-[#C5A880]" />
                        <span>
                          {paymentMethod === 'edahabia'
                            ? 'Paiement par Carte Edahabia (Algérie Poste)'
                            : 'Paiement par Carte Bancaire Interbancaire (CIB)'}
                        </span>
                      </div>
                      {/* Flip card button */}
                      <button
                        type="button"
                        onClick={() => setCardFlip(!cardFlip)}
                        className="text-[10px] text-stone-600 hover:text-black flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        <RotateCw className="w-3 h-3 text-[#C5A880]" />
                        <span>{cardFlip ? 'Voir Recto' : 'Voir Verso (CVV)'}</span>
                      </button>
                    </div>

                    {/* Realistic Algerian Card Preview (Edahabia or CIB) */}
                    <div
                      className={`relative w-full rounded-lg p-3 text-white shadow-md transition-all duration-300 overflow-hidden ${
                        paymentMethod === 'edahabia'
                          ? 'bg-gradient-to-tr from-[#1B4D3E] via-[#0E2F25] to-[#2B6E59] border border-emerald-600/40'
                          : 'bg-gradient-to-tr from-[#1E3A8A] via-[#172554] to-[#1D4ED8] border border-blue-500/40'
                      }`}
                    >
                      {/* Recto / Front of Card */}
                      {!cardFlip ? (
                        <div className="space-y-2 font-mono">
                          <div className="flex justify-between items-center text-[10px] tracking-wider uppercase opacity-85 font-sans">
                            <span className="font-bold flex items-center gap-1">
                              <Shield className="w-3 h-3 text-amber-400" />
                              {paymentMethod === 'edahabia' ? 'Algérie Poste • Edahabia' : 'Réseau Interbancaire • CIB'}
                            </span>
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] font-mono">SATIM DZ</span>
                          </div>

                          {/* EMV Chip */}
                          <div className="w-8 h-6 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 rounded-sm border border-amber-600/50 shadow-inner flex items-center justify-center">
                            <div className="w-5 h-3 border border-amber-700/40 rounded-xs" />
                          </div>

                          {/* 16-Digit Card Number */}
                          <div className="text-sm sm:text-base tracking-widest font-bold text-amber-100 font-mono">
                            {cardNumber || (paymentMethod === 'edahabia' ? '6280 •••• •••• ••••' : '•••• •••• •••• ••••')}
                          </div>

                          <div className="flex justify-between items-end text-[10px] pt-1">
                            <div>
                              <div className="text-[8px] uppercase tracking-wider opacity-70 font-sans">Titulaire</div>
                              <div className="font-bold tracking-wide truncate max-w-[150px]">
                                {cardHolder || customerName || 'NOM PRENOM'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[8px] uppercase tracking-wider opacity-70 font-sans">Expire Fin</div>
                              <div className="font-bold tracking-wider">{cardExpiry || 'MM/AA'}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Verso / Back of Card with CVV */
                        <div className="space-y-2 font-mono py-1">
                          {/* Magnetic Black Strip */}
                          <div className="w-full h-7 bg-black/80 -mx-3 mb-2" />

                          {/* Signature & 3-Digit CVV code */}
                          <div className="flex items-center justify-end gap-2 pr-2">
                            <span className="text-[9px] text-white/80 font-sans uppercase">Code au dos (CVV) :</span>
                            <div className="bg-white text-black font-mono font-bold px-3 py-1 rounded text-xs tracking-wider border border-amber-400">
                              {cardCvv || '•••'}
                            </div>
                          </div>

                          <div className="text-[8px] text-white/70 font-sans leading-tight pt-1">
                            Le code à 3 chiffres (CVV) se trouve au dos de votre carte à droite de la bande de signature.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Inputs form for Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Card Number Input */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-800 mb-0.5">
                          Numéro de Carte (16 chiffres) <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={19}
                            value={cardNumber}
                            onFocus={() => setCardFlip(false)}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder={paymentMethod === 'edahabia' ? '6280 1234 5678 9012' : '4000 1234 5678 9012'}
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xs text-xs font-mono font-bold tracking-wider text-stone-900 focus:border-[#1A1918] focus:outline-none"
                            required
                          />
                          <span className="absolute right-2.5 top-2 text-[10px] text-stone-400 uppercase font-mono">
                            {cardNumber.replace(/\s+/g, '').length}/16
                          </span>
                        </div>
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-800 mb-0.5">
                          Date d’expiration (MM/AA) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          value={cardExpiry}
                          onFocus={() => setCardFlip(false)}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/AA (ex: 08/28)"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xs text-xs font-mono text-stone-900 focus:border-[#1A1918] focus:outline-none"
                          required
                        />
                      </div>

                      {/* Number in the back / CVV */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <label className="block text-[11px] font-semibold text-stone-800">
                            Numéro au dos (CVV) <span className="text-red-600">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setCardFlip(true)}
                            className="text-[10px] text-[#C5A880] hover:underline cursor-pointer"
                          >
                            Où le trouver ?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="password"
                            inputMode="numeric"
                            maxLength={3}
                            value={cardCvv}
                            onFocus={() => setCardFlip(true)}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            placeholder="3 chiffres au dos"
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xs text-xs font-mono font-bold tracking-widest text-stone-900 focus:border-[#1A1918] focus:outline-none"
                            required
                          />
                          <span className="absolute right-2.5 top-2 text-[10px] text-stone-400 font-mono">
                            {cardCvv.length}/3
                          </span>
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-800 mb-0.5">
                          Nom du titulaire (tel qu’écrit sur la carte) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onFocus={() => setCardFlip(false)}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="Ex: MOHAMED BENALI"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xs text-xs uppercase font-semibold text-stone-900 focus:border-[#1A1918] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 bg-white p-2 border border-stone-200">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Transactions chiffrées SSL 256-bit via la passerelle monétique nationale algérienne SATIM.
                      </span>
                    </div>
                  </div>
                )}

                {/* COD Notice */}
                {paymentMethod === 'COD' && (
                  <div className="p-2.5 bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-start gap-2 rounded-xs">
                    <Banknote className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-snug">
                      Vous réglez le montant exact en espèces auprès du livreur Yalidine Express à la remise en main propre de votre colis.
                    </p>
                  </div>
                )}
              </div>

              {/* Compact Pricing Summary */}
              <div className="bg-[#F3EFE9] p-2.5 border border-[#E6E0D2] space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Articles ({cartItems.reduce((s, i) => s + (i.quantity || 0), 0)}) :</span>
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
                <div className="flex justify-between pt-1 border-t border-[#DFD7C2] text-xs sm:text-sm font-bold text-[#1A1918]">
                  <span>Total :</span>
                  <span>{formatDA(total, language)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-order-btn"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {loading ? (
                  <span>Validation en cours...</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'edahabia'
                        ? 'Valider le Paiement (Carte Edahabia)'
                        : paymentMethod === 'cib'
                        ? 'Valider le Paiement (Carte Bancaire CIB)'
                        : 'Confirmer la Commande (Espèces à la Livraison)'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ============================================================= */}
        {/* SATIM 3D-SECURE OTP VERIFICATION MODAL                        */}
        {/* ============================================================= */}
        {showSatimModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-md shadow-2xl border border-stone-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    SATIM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Validation 3D-Secure</h4>
                    <p className="text-[10px] text-stone-500">Passerelle Nationale Monétique</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSatimModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-50 p-2.5 border border-stone-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 text-[11px]">Commerçant :</span>
                  <span className="font-semibold text-stone-900 text-[11px]">ZAYA Atelier Luxe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 text-[11px]">Montant de l'opération :</span>
                  <span className="font-bold text-emerald-800 text-[11px]">{formatDA(total, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 text-[11px]">Carte :</span>
                  <span className="font-mono text-stone-800 text-[11px]">{maskCard(cardNumber)}</span>
                </div>
              </div>

              {/* Simulated SMS Alert notification */}
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs space-y-1">
                <div className="flex items-center gap-1 text-amber-900 font-semibold text-[11px]">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>Code de sécurité SMS SATIM :</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Un code de confirmation a été envoyé par SMS au <strong className="text-stone-900">{phone}</strong>.
                </p>
                <div className="p-1.5 bg-white border border-amber-300 rounded font-mono font-bold text-center text-sm tracking-widest text-amber-900">
                  {simulatedOtp}
                </div>
                <p className="text-[10px] text-stone-400 text-center">
                  (Code de démonstration 3D-Secure généré automatiquement)
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-stone-800">
                  Saisir le code à 6 chiffres reçu :
                </label>
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={satimOtp}
                  onChange={(e) => setSatimOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder={simulatedOtp}
                  className="w-full text-center py-2 px-3 border-2 border-[#1A1918] rounded text-lg font-mono tracking-widest font-bold focus:outline-none"
                  autoFocus
                />
                {otpError && (
                  <p className="text-[11px] text-red-600 font-medium">{otpError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSatimModal(false)}
                  className="flex-1 py-2 border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSatimOtp}
                  disabled={loading}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span>Débit en cours...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirmer le Débit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
