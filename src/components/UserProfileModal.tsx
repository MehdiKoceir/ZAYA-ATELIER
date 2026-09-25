import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Crown,
  Sparkles,
  LogOut,
  Edit2,
  Check,
  Truck,
  Calendar,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { Language, Order } from '../types';
import { formatDA } from '../lib/i18n';
import { OrderInvoiceModal } from './dashboard/OrderInvoiceModal';

interface UserProfileModalProps {
  language: Language;
  onOpenTrackingForOrder?: (orderId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  language,
  onOpenTrackingForOrder
}) => {
  const {
    user,
    userOrders,
    isProfileModalOpen,
    closeProfileModal,
    logout,
    updateProfile
  } = useAuth();

  const isRtl = language === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editWilayaCode, setEditWilayaCode] = useState<number>(user?.wilayaCode || 16);
  const [editCommune, setEditCommune] = useState(user?.commune || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editDeliveryMethod, setEditDeliveryMethod] = useState<'home' | 'desk'>(
    user?.deliveryMethod || 'home'
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditWilayaCode(user.wilayaCode || 16);
      setEditCommune(user.commune || '');
      setEditAddress(user.address || '');
      setEditDeliveryMethod(user.deliveryMethod || 'home');
    }
  }, [user]);

  if (!isProfileModalOpen || !user) return null;

  const currentWilaya = ALGERIAN_WILAYAS.find(w => w.code === editWilayaCode) || ALGERIAN_WILAYAS[15];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const targetWilaya = ALGERIAN_WILAYAS.find(w => w.code === editWilayaCode);

    const res = await updateProfile({
      name: editName,
      phone: editPhone,
      wilayaCode: editWilayaCode,
      wilayaName: targetWilaya ? targetWilaya.name : user.wilayaName,
      commune: editCommune,
      address: editAddress,
      deliveryMethod: editDeliveryMethod
    });

    setSaving(false);
    if (res.success) {
      setFeedback(language === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Coordonnées mises à jour avec succès');
      setTimeout(() => {
        setIsEditing(false);
        setFeedback(null);
      }, 900);
    } else {
      setFeedback(res.error || 'Erreur lors de la mise à jour');
    }
  };

  const getTierColor = (tier?: string) => {
    if (tier === 'VIP Atelier') return 'bg-[#1C1917] text-[#E8D099] border border-[#C5A880]/60';
    if (tier === 'Privilège') return 'bg-[#2A2421] text-[#F3ECE1] border border-[#C5A880]/40';
    return 'bg-[#3D3730] text-[#E8E1D5] border border-[#7D7364]/40';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAF5EC] text-[#226B33]">Livrée</span>;
      case 'shipped':
      case 'out_for_delivery':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F0FE] text-[#1967D2]">Expédiée</span>;
      case 'preparing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF7E0] text-[#B06000]">En préparation</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FCE8E6] text-[#C5221F]">Annulée</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F1EFEA] text-[#5A5348]">En attente</span>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#141210]/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
    >
      <div
        className={`relative w-full max-w-2xl bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl shadow-2xl overflow-hidden my-8 ${
          isRtl ? 'rtl' : 'ltr'
        }`}
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C5A880] via-[#E6D5BC] to-[#A88860]" />

        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 right-4 z-10 p-2 text-[#7E7569] hover:text-[#1A1918] hover:bg-[#F2ECE4] rounded-full transition-colors"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="pt-6 pb-5 px-6 sm:px-8 bg-gradient-to-b from-[#F4EEE6] to-[#FAF8F5] border-b border-[#EAE4DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-full bg-[#1A1918] text-[#FAF8F5] flex items-center justify-center font-serif-luxury text-xl font-bold border-2 border-[#C5A880] shadow-sm">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1918]">
                    {user.name}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getTierColor(
                      user.loyaltyTier
                    )}`}
                  >
                    <Crown className="w-3 h-3 text-[#E5C158]" />
                    <span>{user.loyaltyTier || 'Membre'}</span>
                  </span>
                </div>
                <p className="text-xs text-[#7E7569] flex items-center gap-2 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                  <span>•</span>
                  <Phone className="w-3.5 h-3.5" />
                  <span>{user.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 bg-white hover:bg-[#F2EDE6] border border-[#DDD5CA] text-[#1A1918] rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{isEditing ? (language === 'ar' ? 'إلغاء' : 'Annuler') : (language === 'ar' ? 'تعديل بياناتي' : 'Modifier')}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 bg-[#FAF3F0] hover:bg-[#FCEBE8] border border-[#F2D1CC] text-[#A83220] rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Déconnexion'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[#EAE4DC]/80 text-center">
            <div className="p-2.5 bg-white/80 rounded-xl border border-[#EAE4DC]">
              <span className="text-[10px] uppercase font-semibold text-[#8A8175] block tracking-wider">
                {language === 'ar' ? 'إجمالي الطلبات' : 'Commandes'}
              </span>
              <span className="font-serif-luxury text-lg font-bold text-[#1A1918]">
                {user.ordersCount || userOrders.length || 0}
              </span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-[#EAE4DC]">
              <span className="text-[10px] uppercase font-semibold text-[#8A8175] block tracking-wider">
                {language === 'ar' ? 'المشتريات الإجمالية' : 'Dépenses'}
              </span>
              <span className="font-serif-luxury text-base font-bold text-[#1A1918]">
                {formatDA(user.totalSpent || 0, language)}
              </span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-[#EAE4DC]">
              <span className="text-[10px] uppercase font-semibold text-[#8A8175] block tracking-wider">
                {language === 'ar' ? 'الولاية الافتراضية' : 'Wilaya Défaut'}
              </span>
              <span className="text-xs font-bold text-[#1A1918] truncate block mt-0.5">
                {user.wilayaName || 'Alger (16)'}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className="mx-6 sm:mx-8 mt-4 p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534] font-medium animate-fadeIn">
            {feedback}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[58vh] overflow-y-auto">
          {/* If Editing Mode is Active */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-white p-4 rounded-xl border border-[#DDD5CA]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] pb-1 border-b border-[#EAE4DC]">
                {language === 'ar' ? 'تحديث معلومات التوصيل والتواصل' : 'Coordonnées de Livraison par Défaut'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A5348] mb-1">
                    {language === 'ar' ? 'الاسم واللقب' : 'Nom & Prénom'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A5348] mb-1">
                    {language === 'ar' ? 'الهاتف' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A5348] mb-1">
                    {language === 'ar' ? 'الولاية' : 'Wilaya'}
                  </label>
                  <select
                    value={editWilayaCode}
                    onChange={(e) => {
                      const code = Number(e.target.value);
                      setEditWilayaCode(code);
                      const w = ALGERIAN_WILAYAS.find(x => x.code === code);
                      if (w && w.communes.length > 0) setEditCommune(w.communes[0]);
                    }}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {String(w.code).padStart(2, '0')} - {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A5348] mb-1">
                    {language === 'ar' ? 'البلدية' : 'Commune'}
                  </label>
                  {currentWilaya.communes.length > 0 ? (
                    <select
                      value={editCommune}
                      onChange={(e) => setEditCommune(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                    >
                      {currentWilaya.communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editCommune}
                      onChange={(e) => setEditCommune(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A5348] mb-1">
                  {language === 'ar' ? 'العنوان التفصيلي' : 'Adresse Complète'}
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918]"
                  placeholder="Rue, Quartier, Bâtiment"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-xs font-medium text-[#7E7569] hover:text-[#1A1918]"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#1A1918] text-[#FAF8F5] rounded-xl text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? (
                    <span>Enregistrement...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Saved Address Card */
            <div className="bg-white p-4 rounded-xl border border-[#DDD5CA] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1918] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'عنوان التوصيل المعتمد' : 'Adresse de Livraison Enregistrée'}</span>
                </span>
                <span className="text-[11px] font-medium text-[#7E7569]">
                  {user.deliveryMethod === 'desk' ? 'Bureau Yalidine' : 'Domicile'}
                </span>
              </div>
              <p className="text-xs text-[#4A443D] leading-relaxed">
                {user.address ? `${user.address}, ` : ''}
                <span className="font-semibold">{user.commune || 'Centre-ville'}</span>, {user.wilayaName} ({String(user.wilayaCode).padStart(2, '0')})
              </p>
              <p className="text-[11px] text-[#8A8175] mt-1">
                {language === 'ar'
                  ? 'يتم تعبئة هذا العنوان تلقائياً عند طلبك لأي موديل بالدفع عند الاستلام.'
                  : 'Vos commandes COD sont automatiquement pré-remplies avec cette adresse.'}
              </p>
            </div>
          )}

          {/* User's Order History Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#C5A880]" />
                <span>{language === 'ar' ? 'سجل طلبياتي' : 'Historique de mes Commandes'}</span>
              </h3>
              <span className="text-xs text-[#7E7569]">
                {userOrders.length} {language === 'ar' ? 'طلب' : 'commande(s)'}
              </span>
            </div>

            {userOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-[#DDD5CA] text-center">
                <Truck className="w-8 h-8 text-[#C5A880] mx-auto mb-2 opacity-70" />
                <p className="text-xs font-medium text-[#4A443D]">
                  {language === 'ar' ? 'لا توجد لديك طلبات بعد' : 'Vous n’avez pas encore passé de commande.'}
                </p>
                <p className="text-[11px] text-[#8A8175] mt-1">
                  {language === 'ar'
                    ? 'اختر قطعتك المفضلة من التشكيلة وسنقوم بتوصيلها لباب بيتك مع الدفع عند الاستلام.'
                    : 'Explorez nos modèles et passez votre première commande avec paiement à la livraison.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-white rounded-xl border border-[#DDD5CA] hover:border-[#C5A880]/60 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1A1918] bg-[#F4EFEA] px-2 py-0.5 rounded">
                          {order.id}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <span className="text-[11px] text-[#8A8175]">
                        {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-y border-[#F4EFEA]">
                      <span className="text-[#6B6255]">
                        {order.items.length} {order.items.length > 1 ? 'articles' : 'article'} • {order.wilayaName}
                      </span>
                      <span className="font-serif-luxury font-bold text-[#1A1918]">
                        {formatDA(order.total, language)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px]">
                      <span className="text-[#8A8175] truncate max-w-[180px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInvoiceOrder(order as any)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Imprimer la facture (PDF)"
                        >
                          <Printer className="w-3 h-3 text-stone-600" />
                          <span>{language === 'ar' ? 'فاتورة' : 'Facture'}</span>
                        </button>

                        {onOpenTrackingForOrder && (
                          <button
                            type="button"
                            onClick={() => {
                              closeProfileModal();
                              onOpenTrackingForOrder(order.id);
                            }}
                            className="font-medium text-[#A66C44] hover:text-[#1A1918] flex items-center gap-1 transition-colors"
                          >
                            <span>{language === 'ar' ? 'تتبع الشحنة' : 'Suivre le colis'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F4EFEA] border-t border-[#EAE4DC] flex items-center justify-between text-xs text-[#7E7569]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Membre ZAYA Atelier Alger</span>
          </span>
          <button
            onClick={closeProfileModal}
            className="px-3.5 py-1.5 bg-[#1A1918] text-white rounded-lg hover:bg-black transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        language={language}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};
