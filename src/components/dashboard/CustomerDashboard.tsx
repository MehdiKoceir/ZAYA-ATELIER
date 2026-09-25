import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Language, Order, UserAccount } from '../../types';
import { AppRoute } from '../../lib/router';
import { useAuth } from '../../context/AuthContext';
import { ProductCard } from '../ProductCard';
import { formatDA, buildWhatsAppLink, BOUTIQUE_PHONE } from '../../lib/i18n';
import { ALGERIAN_WILAYAS } from '../../data/wilayas';
import { OrderTrackingView } from './OrderTrackingView';
import {
  Crown,
  ShoppingBag,
  Heart,
  Package,
  User,
  LogOut,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  ArrowUpDown,
  Phone,
  ShieldCheck,
  ChevronRight,
  Settings,
  X,
  Check,
  AlertCircle,
  Building2,
  Home,
  Zap,
  RotateCcw,
  Mail,
  FileText,
  CreditCard,
  Info,
  Printer
} from 'lucide-react';
import { OrderInvoiceModal } from './OrderInvoiceModal';

interface CustomerDashboardProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  products: Product[];
  language: Language;
  cart: CartItem[];
  wishlist: string[];
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant, qty: number) => void;
  onOpenAdmin?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentRoute,
  onNavigate,
  products,
  language,
  cart,
  wishlist,
  onOpenCart,
  onSelectProduct,
  onToggleWishlist,
  onAddToCart,
  onOpenAdmin,
}) => {
  const { user, userOrders, logout, updateProfile } = useAuth();

  // Active sub-tab based on route or internal state
  const activeTab: 'overview' | 'products' | 'orders' | 'tracking' | 'wishlist' | 'profile' =
    currentRoute === '/dashboard/products'
      ? 'products'
      : currentRoute === '/dashboard/orders'
      ? 'orders'
      : currentRoute === '/dashboard/tracking'
      ? 'tracking'
      : currentRoute === '/dashboard/wishlist'
      ? 'wishlist'
      : currentRoute === '/dashboard/profile'
      ? 'profile'
      : 'overview';

  // Tracking sub-tab selected order
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | undefined>(undefined);
  const [overviewTrackingInput, setOverviewTrackingInput] = useState<string>('');

  const handleTrackOrder = (orderId: string) => {
    setSelectedTrackingOrderId(orderId);
    onNavigate('/dashboard/tracking');
  };

  // Print Invoice Modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handlePrintInvoice = (order: Order) => {
    setSelectedInvoiceOrder(order);
  };

  // Catalog tab filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Profile Edit state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileWilaya, setProfileWilaya] = useState<number>(user?.wilayaCode || 16);
  const [profileCommune, setProfileCommune] = useState(user?.commune || 'Hydra');
  const [isCustomCommune, setIsCustomCommune] = useState(false);
  const [customCommuneText, setCustomCommuneText] = useState('');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileDeliveryMethod, setProfileDeliveryMethod] = useState<'home' | 'desk'>(
    user?.deliveryMethod || 'home'
  );
  const [profileDeliveryNotes, setProfileDeliveryNotes] = useState(user?.deliveryNotes || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Sync state whenever user account data updates
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      const wCode = user.wilayaCode || 16;
      setProfileWilaya(wCode);
      const wilayaData = ALGERIAN_WILAYAS.find(w => w.code === wCode);
      const userCommune = user.commune || 'Hydra';
      if (wilayaData && wilayaData.communes.includes(userCommune)) {
        setProfileCommune(userCommune);
        setIsCustomCommune(false);
        setCustomCommuneText('');
      } else {
        setProfileCommune('custom');
        setIsCustomCommune(true);
        setCustomCommuneText(userCommune);
      }
      setProfileAddress(user.address || '');
      setProfileDeliveryMethod(user.deliveryMethod || 'home');
      setProfileDeliveryNotes(user.deliveryNotes || '');
    }
  }, [user]);

  const categories = [
    { id: 'all', fr: 'Tous les Modèles', ar: 'جميع الموديلات' },
    { id: 'caftans', fr: 'Caftans & Soirée', ar: 'قفطان وسهرات' },
    { id: 'chemises', fr: 'Chemises en Lin', ar: 'قمصان الكتان' },
    { id: 'vestes', fr: 'Vestes & Blazers', ar: 'سترات وبليزر' },
    { id: 'pantalons', fr: 'Pantalons & Ensembles', ar: 'بناطيل وأطقم' },
    { id: 'robes', fr: 'Robes Fluides', ar: 'فساتين عصرية' },
    { id: 'accessoires', fr: 'Maroquinerie', ar: 'حقائب جلدية' }
  ];

  // Filter products for catalog
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.nameAr.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Orders display
  const displayOrders = userOrders && userOrders.length > 0 ? userOrders : [
    {
      id: 'ZY-2026-8812',
      customerName: user?.name || 'Sarah Benali',
      customerPhone: user?.phone || '0550 12 34 56',
      wilayaCode: user?.wilayaCode || 16,
      wilayaName: user?.wilayaName || 'Alger',
      commune: user?.commune || 'Hydra',
      address: user?.address || 'Résidence Les Pins, Sidi Yahia',
      deliveryMethod: 'home' as const,
      status: 'shipped' as const,
      total: 18400,
      deliveryFee: 500,
      items: [
        {
          productId: 'prod-001',
          variantId: 'var-001-38',
          productName: 'Robe Longue Satinée Drapée "Zine"',
          color: 'Vert Émeraude',
          size: '38',
          quantity: 1,
          unitPrice: 12900,
          image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop'
        },
        {
          productId: 'prod-002',
          variantId: 'var-002-40',
          productName: 'Chemise Oversize en Pur Lin',
          color: 'Blanc Craie',
          size: '40',
          quantity: 1,
          unitPrice: 5500,
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const activeWilaya = ALGERIAN_WILAYAS.find(w => w.code === profileWilaya) || ALGERIAN_WILAYAS[15];
  const effectiveCommune = isCustomCommune ? customCommuneText : profileCommune;

  // Readiness for Express Checkout
  const isNameValid = Boolean(profileName.trim());
  const isPhoneValid = Boolean(
    profilePhone.trim() &&
    /^(0)(5|6|7)[0-9]{8}$/.test(profilePhone.replace(/[\s\-\.\(\)]/g, '').replace(/^(\+213|00213)/, '0'))
  );
  const isWilayaValid = Boolean(profileWilaya);
  const isCommuneValid = Boolean(effectiveCommune.trim());
  const isAddressValid = Boolean(profileAddress.trim());
  const isMethodValid = Boolean(profileDeliveryMethod);

  const readinessScore = [
    isNameValid,
    isPhoneValid,
    isWilayaValid,
    isCommuneValid,
    isAddressValid,
    isMethodValid,
  ].filter(Boolean).length;

  const handleResetProfile = () => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      const wCode = user.wilayaCode || 16;
      setProfileWilaya(wCode);
      const wilayaData = ALGERIAN_WILAYAS.find(w => w.code === wCode);
      const userCommune = user.commune || 'Hydra';
      if (wilayaData && wilayaData.communes.includes(userCommune)) {
        setProfileCommune(userCommune);
        setIsCustomCommune(false);
        setCustomCommuneText('');
      } else {
        setProfileCommune('custom');
        setIsCustomCommune(true);
        setCustomCommuneText(userCommune);
      }
      setProfileAddress(user.address || '');
      setProfileDeliveryMethod(user.deliveryMethod || 'home');
      setProfileDeliveryNotes(user.deliveryNotes || '');
    }
    setProfileError(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);

    const selWilaya = ALGERIAN_WILAYAS.find(w => w.code === profileWilaya);
    const finalCommune = isCustomCommune ? customCommuneText.trim() : profileCommune.trim();

    if (!profileName.trim()) {
      setProfileError('Veuillez indiquer votre nom complet.');
      setProfileSaving(false);
      return;
    }

    if (!profilePhone.trim()) {
      setProfileError('Veuillez indiquer un numéro de téléphone pour la livraison.');
      setProfileSaving(false);
      return;
    }

    let cleanPhone = profilePhone.replace(/[\s\-\.\(\)]/g, '');
    if (cleanPhone.startsWith('+213')) cleanPhone = '0' + cleanPhone.slice(4);
    else if (cleanPhone.startsWith('00213')) cleanPhone = '0' + cleanPhone.slice(5);

    if (!/^(0)(5|6|7)[0-9]{8}$/.test(cleanPhone)) {
      setProfileError('Numéro de téléphone algérien invalide. Ex: 0550 12 34 56 ou 0661 22 33 44');
      setProfileSaving(false);
      return;
    }

    if (!finalCommune) {
      setProfileError('Veuillez renseigner votre commune de livraison.');
      setProfileSaving(false);
      return;
    }

    const res = await updateProfile({
      name: profileName.trim(),
      phone: cleanPhone,
      wilayaCode: profileWilaya,
      wilayaName: selWilaya?.name || 'Alger',
      commune: finalCommune,
      address: profileAddress.trim(),
      deliveryMethod: profileDeliveryMethod,
      deliveryNotes: profileDeliveryNotes.trim(),
    });

    setProfileSaving(false);

    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 4000);
    } else {
      setProfileError(res.error || 'Erreur lors de la mise à jour des paramètres');
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1918]">
      {/* Top Private Dashboard Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand and Badge */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('/')}
              className="cursor-pointer flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-[#1A1918]">
                  ZAYA
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-[#F4EFEA] border border-[#DDD5CA] text-[9px] font-semibold uppercase tracking-wider text-[#A66C44] rounded">
                  Salon Client Privilège
                </span>
              </div>
            </div>
          </div>

          {/* Quick Access to Public Boutique & Admin */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-black hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <span>Boutique Publique</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {user?.role === 'admin' && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-lg bg-[#1A1918] text-[#FAF8F5] hover:bg-black transition-colors flex items-center gap-1.5 font-medium shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Direction Atelier</span>
              </button>
            )}
          </div>

          {/* User Controls & Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('/dashboard/wishlist')}
              className="relative p-2 text-stone-600 hover:text-black transition-colors"
              title="Favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#A66C44] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-black transition-colors"
              title="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {(cart || []).length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1A1918] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {(cart || []).reduce((s, i) => s + (i.quantity || 0), 0)}
                </span>
              )}
            </button>

            {/* User Greeting & Logout */}
            <div className="flex items-center gap-2 sm:gap-3 pl-3 border-l border-stone-200">
              <button
                onClick={() => onNavigate('/dashboard/profile')}
                className="hidden sm:block text-right group cursor-pointer"
                title="Accéder aux paramètres du profil"
              >
                <p className="text-xs font-bold text-[#1A1918] leading-tight group-hover:text-[#A66C44] transition-colors">
                  {user?.name || 'Client ZAYA'}
                </p>
                <p className="text-[10px] text-[#A66C44] font-medium flex items-center justify-end gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{user?.loyaltyTier || 'Membre Privilège'}</span>
                </p>
              </button>

              <button
                onClick={() => onNavigate('/dashboard/profile')}
                className={`p-2 transition-colors rounded-lg cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#1A1918] text-white shadow-2xs'
                    : 'text-stone-500 hover:text-black hover:bg-stone-100'
                }`}
                title="Paramètres du Profil (Checkout Express)"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Sub-navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-stone-100">
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            Vue d'Ensemble
          </button>
          <button
            onClick={() => onNavigate('/dashboard/products')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            Catalogue Vestiaire
          </button>
          <button
            onClick={() => onNavigate('/dashboard/orders')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            Mes Commandes ({displayOrders.length})
          </button>
          <button
            onClick={() => onNavigate('/dashboard/tracking')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#A66C44]" />
            <span>Suivi 58 Wilayas</span>
          </button>
          <button
            onClick={() => onNavigate('/dashboard/wishlist')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            Mes Favoris ({wishlist.length})
          </button>
          <button
            onClick={() => onNavigate('/dashboard/profile')}
            className={`px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-black'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Paramètres du Profil</span>
            {readinessScore === 6 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Checkout Express 100% configuré" />
            )}
          </button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ========================================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* VIP Welcome Banner */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1A1918] to-[#2D2825] text-white shadow-xl overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-xs font-semibold uppercase tracking-widest">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Salon Privé • {user?.loyaltyTier || 'Membre Privilège'}</span>
                </div>
                <h1 className="font-serif-luxury text-2xl sm:text-4xl font-light">
                  Ravi de vous revoir, {user?.name?.split(' ')[0] || 'Chère Cliente'}.
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  Profitez de votre accès prioritaire aux pièces exclusives de l'Atelier. Vos commandes bénéficient de l'expédition rapide Yalidine et du règlement en espèces à la livraison.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('/dashboard/products')}
                    className="px-5 py-2.5 bg-[#FAF8F5] text-[#1A1918] rounded-lg text-xs uppercase tracking-wider font-bold hover:bg-[#EAE2D5] transition-all cursor-pointer shadow-xs"
                  >
                    Parcourir le Vestiaire
                  </button>
                  <button
                    onClick={() => onNavigate('/dashboard/tracking')}
                    className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-xs uppercase tracking-wider font-medium hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Suivi Colis (58 Wilayas)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-[#EAE4DC] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Commandes Actives</span>
                  <Package className="w-4 h-4 text-[#C5A880]" />
                </div>
                <p className="font-serif-luxury text-2xl font-bold text-[#1A1918]">
                  {displayOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </p>
                <p className="text-[10px] text-stone-500">Expédition 58 Wilayas</p>
              </div>

              <div className="p-5 bg-white border border-[#EAE4DC] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Articles Favoris</span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <p className="font-serif-luxury text-2xl font-bold text-[#1A1918]">
                  {wishlist.length}
                </p>
                <p className="text-[10px] text-stone-500">Pièces enregistrées</p>
              </div>

              <div className="p-5 bg-white border border-[#EAE4DC] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Panier en cours</span>
                  <ShoppingBag className="w-4 h-4 text-[#1A1918]" />
                </div>
                <p className="font-serif-luxury text-2xl font-bold text-[#1A1918]">
                  {(cart || []).reduce((s, i) => s + (i.quantity || 0), 0)}
                </p>
                <p className="text-[10px] text-stone-500">Prêt pour commande</p>
              </div>

              <div className="p-5 bg-white border border-[#EAE4DC] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] uppercase tracking-wider font-semibold">Privilèges</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-serif-luxury text-xl font-bold text-[#1A1918] truncate">
                  {user?.loyaltyTier || 'VIP Atelier'}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium">Paiement COD Garanti</p>
              </div>
            </div>

            {/* Recent Orders Tracker Card */}
            <div className="bg-white border border-[#EAE4DC] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#1A1918]">
                    Dernières Expéditions en Cours
                  </h3>
                  <p className="text-xs text-stone-500">
                    Suivi direct de vos livraisons avec Yalidine Express
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/dashboard/orders')}
                  className="text-xs font-semibold text-[#A66C44] hover:underline flex items-center gap-1"
                >
                  <span>Toutes mes commandes</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {displayOrders.slice(0, 1).map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1A1918]">
                        Ref: {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-full">
                        En cours d'expédition Yalidine
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Livraison à : <strong>{order.commune}, Wilaya de {order.wilayaName}</strong> ({order.address})
                    </p>
                    <p className="text-xs text-stone-500">
                      {order.paymentMethod === 'baridimob' ? 'Mode de paiement : BaridiMob / CCP' :
                       order.paymentMethod === 'bank_transfer' ? 'Mode de paiement : Virement Bancaire / Carte CIB' :
                       'Montant à régler en espèces au livreur : '}{' '}
                      <strong className="text-[#1A1918]">{formatDA(order.total, language)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintInvoice(order as Order)}
                      className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#DDD5CA] text-stone-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Imprimer ou enregistrer la facture d'achat en PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-600" />
                      <span>Facture</span>
                    </button>
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="px-3.5 py-2 bg-[#1A1918] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Suivi en Direct</span>
                    </button>
                    <button
                      onClick={() => {
                        const msg = `Salam ZAYA Atelier, je demande l'état de ma commande ${order.id}`;
                        window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                      }}
                      className="px-3.5 py-2 bg-[#25D366] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Concierge</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick 58 Wilayas Order Tracking Search Bar */}
            <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F7F2EA] border border-[#E8DFC8] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66C44] mb-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Suivi Colis Instantané • 58 Wilayas</span>
                  </div>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1918]">
                    Où se trouve votre colis ZAYA ?
                  </h3>
                  <p className="text-xs text-stone-600">
                    Saisissez votre référence de commande pour visualiser la progression en direct avec le hub Yalidine Express.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/dashboard/tracking')}
                  className="text-xs font-semibold text-[#A66C44] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Ouvrir la vue complète</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (overviewTrackingInput.trim()) {
                    handleTrackOrder(overviewTrackingInput.trim());
                  }
                }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={overviewTrackingInput}
                    onChange={(e) => setOverviewTrackingInput(e.target.value.toUpperCase())}
                    placeholder="Entrez votre N° de commande (ex: DZ-2609-1024)"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DDD5CA] rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!overviewTrackingInput.trim()}
                  className="px-5 py-2.5 bg-[#1A1918] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Suivre en Direct</span>
                </button>
              </form>
            </div>

            {/* Fast Checkout & Delivery Address Status Card */}
            <div className="bg-gradient-to-br from-white to-[#FAF6F0] border border-[#EAE4DC] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1A1918] text-[#C5A880] flex items-center justify-center shrink-0 shadow-2xs">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      Coordonnées & Checkout Express (1-Clic)
                    </h3>
                    {readinessScore === 6 ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Prêt pour commande instantanée</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{readinessScore}/6 critères renseignés</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                    Vos coordonnées par défaut (<strong>{user?.name || 'Nom non défini'}</strong>, {user?.phone || 'Téléphone non défini'} • {user?.commune || 'Commune'}, Wilaya {user?.wilayaName || 'Alger'} en {user?.deliveryMethod === 'desk' ? 'Bureau Stop Desk' : 'Livraison Domicile'}) sont synchronisées pour pré-remplir automatiquement le formulaire de commande sans aucune ressaisie.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/dashboard/profile')}
                className="px-4 py-2.5 bg-[#1A1918] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Paramètres du Profil</span>
              </button>
            </div>

            {/* Curated Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-xl font-bold text-[#1A1918]">
                  Recommandé pour vous
                </h3>
                <button
                  onClick={() => onNavigate('/dashboard/products')}
                  className="text-xs font-semibold text-[#A66C44] hover:underline"
                >
                  Voir toute la collection →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    onSelect={onSelectProduct}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickOrderWhatsApp={(p) => {
                      const msg = `Salam ZAYA Atelier, je souhaite commander: ${p.name}`;
                      window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CATALOG TAB */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-white border border-[#EAE4DC] p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par modèle, matière (lin, crêpe...), ou coupe..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9E9589] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-stone-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-500">Trier:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#FAF8F5] border border-[#DDD5CA] px-3 py-1.5 rounded-lg text-xs text-[#1A1918] font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap rounded-lg transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                        : 'bg-[#EFE9DF] text-[#524B43] hover:bg-[#E5DDD0]'
                    }`}
                  >
                    {language === 'ar' ? cat.ar : cat.fr}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {sortedProducts.length === 0 ? (
              <div className="py-16 text-center bg-white border border-[#EAE4DC] rounded-xl p-8 space-y-2">
                <p className="font-serif-luxury text-lg text-stone-800">
                  Aucun vêtement ne correspond à vos critères
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#1A1918] text-white text-xs uppercase font-semibold rounded-lg"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    onSelect={onSelectProduct}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickOrderWhatsApp={(p) => {
                      const msg = `Salam ZAYA Atelier, je souhaite commander: ${p.name}`;
                      window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ORDERS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-luxury text-2xl font-light text-[#1A1918]">
                Historique de vos Commandes
              </h2>
              <p className="text-xs text-stone-500">
                Paiement garanti en espèces à la livraison auprès du livreur Yalidine.
              </p>
            </div>

            <div className="space-y-4">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#EAE4DC] rounded-xl p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#1A1918]">
                        Commande #{order.id}
                      </span>
                      <p className="text-xs text-stone-500">
                        Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} • 58 Wilayas COD
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase rounded-full flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>En cours d'expédition Yalidine</span>
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-14 h-16 object-cover rounded-lg border border-stone-200"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-[#1A1918] truncate">{item.productName}</p>
                          <p className="text-stone-500">
                            Taille: {item.size} • Couleur: {item.color} • Qté: {item.quantity}
                          </p>
                          <p className="font-bold text-[#1A1918]">{formatDA(item.unitPrice, language)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Total */}
                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-stone-600 space-y-0.5">
                      <p className="font-medium text-black">Adresse de livraison :</p>
                      <p>{order.address}, {order.commune}, Wilaya {order.wilayaName}</p>
                      <p className="text-stone-500 font-mono text-[11px]">Contact : {order.customerPhone}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-stone-500">
                          {order.paymentMethod === 'baridimob' ? 'Total réglé (BaridiMob) :' :
                           order.paymentMethod === 'bank_transfer' ? 'Total réglé (Virement/Carte) :' :
                           'Total à payer au livreur :'}
                        </p>
                        <p className="font-serif-luxury text-xl font-bold text-[#1A1918]">
                          {formatDA(order.total, language)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrintInvoice(order as Order)}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Imprimer ou enregistrer la facture d'achat en PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-stone-700" />
                          <span>Imprimer Facture</span>
                        </button>
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="px-3.5 py-2 bg-[#1A1918] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Suivi en Direct</span>
                        </button>
                        <button
                          onClick={() => {
                            const msg = `Salam ZAYA Atelier, je demande des nouvelles de ma commande ${order.id}`;
                            window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                          }}
                          className="px-3 py-2 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:bg-[#20bd5a] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Contacter le Concierge"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3.5 TRACKING TAB (58 Wilayas Real-time Delivery Status) */}
        {/* ========================================================================= */}
        {activeTab === 'tracking' && (
          <OrderTrackingView
            initialOrderId={selectedTrackingOrderId}
            userOrders={displayOrders}
            language={language}
            onNavigate={onNavigate}
          />
        )}

        {/* ========================================================================= */}
        {/* 4. WISHLIST TAB */}
        {/* ========================================================================= */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-serif-luxury text-2xl font-light text-[#1A1918]">
                Mes Pièces Favorites ({wishlist.length})
              </h2>
              <p className="text-xs text-stone-500">
                Vos coups de cœur enregistrés pour finaliser votre commande plus tard.
              </p>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="py-16 text-center bg-white border border-[#EAE4DC] rounded-xl p-8 space-y-3">
                <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="font-serif-luxury text-lg text-stone-800">
                  Votre liste de favoris est vide
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Enregistrez vos créations préférées en cliquant sur l’icône cœur lors de vos visites.
                </p>
                <button
                  onClick={() => onNavigate('/dashboard/products')}
                  className="px-5 py-2.5 bg-[#1A1918] text-white text-xs uppercase font-semibold rounded-lg"
                >
                  Découvrir la collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlistedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    onSelect={onSelectProduct}
                    isWishlisted={true}
                    onToggleWishlist={onToggleWishlist}
                    onQuickOrderWhatsApp={(p) => {
                      const msg = `Salam ZAYA Atelier, je souhaite commander: ${p.name}`;
                      window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. PROFILE & SETTINGS TAB (Checkout Express & Default Delivery) */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4DC] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A66C44] mb-1">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configuration du Compte & Expédition 58 Wilayas</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1A1918]">
                  Paramètres du Profil
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  Mettez à jour vos coordonnées personnelles et votre adresse de livraison par défaut en Algérie pour un passage en caisse instantané (Checkout Express sans ressaisie).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetProfile}
                  className="px-3.5 py-2 bg-white border border-[#DDD5CA] text-stone-700 text-xs font-medium rounded-lg hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Restaurer les valeurs actuellement enregistrées"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Rétablir</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>

            {/* Express Checkout Readiness Status Card */}
            <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F6EFE6] border border-[#E8DFC8] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1918] text-[#C5A880] flex items-center justify-center shrink-0 shadow-2xs">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1A1918] flex items-center gap-2">
                      <span>État du Checkout Express 1-Clic</span>
                      {readinessScore === 6 ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>100% Prêt</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
                          {readinessScore}/6 critères
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-600">
                      {readinessScore === 6
                        ? 'Vos coordonnées complètes sont synchronisées. Tout article commandé pré-remplira automatiquement vos informations.'
                        : 'Complétez les champs ci-dessous pour accélérer votre prochain passage en caisse.'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#1A1918]">
                    Score de préparation : {Math.round((readinessScore / 6) * 100)}%
                  </span>
                  <div className="w-36 h-2 bg-stone-200 rounded-full overflow-hidden mt-1.5 ml-auto">
                    <div
                      className={`h-full transition-all duration-500 ${
                        readinessScore === 6 ? 'bg-emerald-500' : 'bg-[#C5A880]'
                      }`}
                      style={{ width: `${(readinessScore / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Criteria Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-stone-100">
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isNameValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isNameValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">1. Nom complet</span>
                </div>
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isPhoneValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isPhoneValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">2. Mobile Yalidine</span>
                </div>
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isWilayaValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isWilayaValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">3. Wilaya (58)</span>
                </div>
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isCommuneValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isCommuneValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">4. Commune</span>
                </div>
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isAddressValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isAddressValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">5. Adresse exacte</span>
                </div>
                <div className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${isMethodValid ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {isMethodValid ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">6. Mode réception</span>
                </div>
              </div>
            </div>

            {/* Notification Toasts */}
            {profileSaved && (
              <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs sm:text-sm rounded-xl flex items-center gap-3 shadow-xs animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">Paramètres mis à jour avec succès !</p>
                  <p className="text-xs text-emerald-700">
                    Vos futures commandes au panier pré-rempliront automatiquement votre nom, téléphone et adresse pour cette Wilaya.
                  </p>
                </div>
              </div>
            )}

            {profileError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-center gap-3 shadow-xs animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold">Erreur de validation</p>
                  <p className="text-xs text-rose-700">{profileError}</p>
                </div>
              </div>
            )}

            {/* 2-Column Responsive Layout: Form on Left, Live Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form (7 cols) */}
              <form onSubmit={handleProfileSubmit} className="lg:col-span-7 space-y-6">
                {/* Section 1: Identité & Contact */}
                <div className="bg-white border border-[#EAE4DC] p-6 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <User className="w-4 h-4 text-[#A66C44]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      1. Identité & Contact Client
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                        Nom & Prénom <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Ex: Sarah Benali"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">Utilisé sur l’étiquette de colisage Yalidine.</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                        Téléphone Mobile <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="tel"
                          required
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="Ex: 0550 12 34 56 ou 0661..."
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Numéro algérien (05, 06, 07) appelé avant la livraison.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                      Adresse Email (Identifiant du Compte)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full pl-10 pr-24 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Vérifié
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Adresse de Livraison par Défaut (58 Wilayas) */}
                <div className="bg-white border border-[#EAE4DC] p-6 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <MapPin className="w-4 h-4 text-[#A66C44]" />
                    <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                      2. Adresse de Livraison par Défaut (58 Wilayas)
                    </h3>
                  </div>

                  {/* Wilaya Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918]">
                        Wilaya de Destination (58 Wilayas) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-stone-500">Tarification Yalidine automatique</span>
                    </div>
                    <select
                      value={profileWilaya}
                      onChange={(e) => {
                        const code = Number(e.target.value);
                        setProfileWilaya(code);
                        const found = ALGERIAN_WILAYAS.find(w => w.code === code);
                        if (found && found.communes.length > 0) {
                          setProfileCommune(found.communes[0]);
                          setIsCustomCommune(false);
                          setCustomCommuneText('');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code < 10 ? `0${w.code}` : w.code} - {w.name} ({w.nameAr})
                        </option>
                      ))}
                    </select>

                    {/* Wilaya details pill */}
                    <div className="mt-2 p-2.5 bg-[#FAF8F5] border border-[#EAE4DC] rounded-lg flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#A66C44]" />
                        <span>Frais Domicile : <strong>{formatDA(activeWilaya.homeDeliveryFee, language)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Stop Desk : <strong>{formatDA(activeWilaya.deskDeliveryFee, language)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Délai moyen : <strong>{activeWilaya.deliveryDays}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Commune Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918]">
                        Commune ou Localité <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCommune(!isCustomCommune);
                          if (!isCustomCommune) {
                            setCustomCommuneText(profileCommune !== 'custom' ? profileCommune : '');
                          }
                        }}
                        className="text-[10px] text-[#A66C44] hover:underline font-medium"
                      >
                        {isCustomCommune ? 'Choisir dans la liste des communes' : '+ Saisir une autre commune...'}
                      </button>
                    </div>

                    {!isCustomCommune ? (
                      <select
                        value={profileCommune}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomCommune(true);
                            setCustomCommuneText('');
                          } else {
                            setProfileCommune(e.target.value);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                      >
                        {activeWilaya.communes.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__custom__">Autre commune non répertoriée...</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        value={customCommuneText}
                        onChange={(e) => setCustomCommuneText(e.target.value)}
                        placeholder="Précisez le nom de votre commune ou quartier..."
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                      />
                    )}
                  </div>

                  {/* Detailed Address */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                      Adresse Exacte (Rue, N° Villa / Bâtiment, Étage, Repère) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Ex: Résidence Les Roses, Villa 14, près de la clinique..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] resize-none"
                    />
                  </div>

                  {/* Delivery Mode Choice */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-2">
                      Mode de Réception par Défaut
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setProfileDeliveryMethod('home')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          profileDeliveryMethod === 'home'
                            ? 'border-[#1A1918] bg-[#FAF8F5] shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="profileDeliveryMethod"
                          checked={profileDeliveryMethod === 'home'}
                          onChange={() => setProfileDeliveryMethod('home')}
                          className="mt-0.5 text-[#1A1918]"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5 text-[#A66C44]" />
                            <span>Livraison à Domicile</span>
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Remise en main propre à votre porte ({formatDA(activeWilaya.homeDeliveryFee, language)})
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setProfileDeliveryMethod('desk')}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          profileDeliveryMethod === 'desk'
                            ? 'border-[#1A1918] bg-[#FAF8F5] shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="profileDeliveryMethod"
                          checked={profileDeliveryMethod === 'desk'}
                          onChange={() => setProfileDeliveryMethod('desk')}
                          className="mt-0.5 text-[#1A1918]"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#1A1918] flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-stone-500" />
                            <span>Bureau Yalidine (Stop Desk)</span>
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Retrait en agence Yalidine de Wilaya ({formatDA(activeWilaya.deskDeliveryFee, language)})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Courier Instructions */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1.5">
                      Instructions Particulières pour le Livreur (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={profileDeliveryNotes}
                      onChange={(e) => setProfileDeliveryNotes(e.target.value)}
                      placeholder="Ex: Appeler 30 minutes avant, sonner à l'interphone Benali..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Cette note sera reportée sur la feuille de route du coursier.
                    </p>
                  </div>
                </div>

                {/* Save Submit Button */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-3 bg-[#1A1918] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-[#C5A880]" />
                        <span>Enregistrer les Paramètres</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetProfile}
                    className="text-xs text-stone-500 hover:text-black font-semibold transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Annuler les modifications</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Live Checkout Simulator & Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white border border-[#EAE4DC] p-6 rounded-2xl shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#C5A880]" />
                      <h3 className="font-serif-luxury text-base font-bold text-[#1A1918]">
                        Aperçu du Checkout Express
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FAF8F5] text-stone-600 text-[10px] font-bold border border-[#EAE4DC] rounded-md">
                      Simulation en Direct
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    Voici exactement comment vos informations apparaîtront au panier pour un passage de commande sans saisie manuelle :
                  </p>

                  {/* Receipt Style Card */}
                  <div className="p-4 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl space-y-3 font-sans text-xs">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-stone-400">Destinataire</span>
                        <p className="font-bold text-[#1A1918]">
                          {profileName || <span className="text-stone-400 italic">Nom non configuré</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold uppercase text-stone-400">Téléphone Yalidine</span>
                        <p className="font-bold text-[#1A1918]">
                          {profilePhone || <span className="text-stone-400 italic">05 / 06 / 07...</span>}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 pb-2 border-b border-stone-200">
                      <span className="text-[10px] font-semibold uppercase text-stone-400">Destination</span>
                      <p className="font-semibold text-[#1A1918]">
                        {effectiveCommune || 'Commune'}, Wilaya de {activeWilaya.name} ({activeWilaya.code})
                      </p>
                      <p className="text-stone-600 text-[11px]">
                        {profileAddress || <span className="text-stone-400 italic">Adresse détaillée non saisie</span>}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-stone-200">
                      <span className="text-stone-500">Mode de livraison :</span>
                      <span className="font-bold text-[#1A1918] flex items-center gap-1">
                        {profileDeliveryMethod === 'home' ? (
                          <>
                            <Home className="w-3 h-3 text-[#A66C44]" />
                            <span>À Domicile</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3 h-3 text-stone-500" />
                            <span>Bureau Yalidine (Stop Desk)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-stone-200">
                      <span className="text-stone-500">Frais de port estimés :</span>
                      <span className="font-bold text-[#1A1918]">
                        {formatDA(
                          profileDeliveryMethod === 'home'
                            ? activeWilaya.homeDeliveryFee
                            : activeWilaya.deskDeliveryFee,
                          language
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-stone-200">
                      <span className="text-stone-500">Délais d'expédition :</span>
                      <span className="font-bold text-emerald-700">
                        {activeWilaya.deliveryDays}
                      </span>
                    </div>

                    {profileDeliveryNotes && (
                      <div className="text-[11px] pt-1">
                        <span className="text-[10px] font-semibold uppercase text-stone-400">Consigne livreur :</span>
                        <p className="text-stone-700 italic">« {profileDeliveryNotes} »</p>
                      </div>
                    )}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={onOpenCart}
                      className="w-full py-2.5 bg-[#1A1918] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Tester le Panier Express</span>
                    </button>
                    <p className="text-[10px] text-center text-stone-500">
                      Cliquez pour ouvrir le panier d’achat et vérifier que ces coordonnées se chargent automatiquement.
                    </p>
                  </div>
                </div>

                {/* Assurance and Delivery Guarantee */}
                <div className="p-4 bg-white border border-[#EAE4DC] rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#A66C44] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#1A1918]">Garantie Atelier ZAYA</p>
                    <p className="text-stone-500 text-[11px]">
                      Paiement en espèces à la livraison (COD) ou carte Edahabia / CIB après inspection du colis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable PDF Invoice Modal */}
      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        language={language}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
