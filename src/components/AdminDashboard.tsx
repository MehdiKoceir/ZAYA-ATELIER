import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Search, Filter, Plus,
  Edit2, Trash2, CheckCircle2, Truck, RefreshCw, MessageCircle, Phone, ArrowUpRight,
  Sparkles, Tag, ChevronDown, Clock, ShieldCheck, Check, X, AlertCircle
} from 'lucide-react';
import { Product, Order, OrderStatus, CustomerCRM, DiscountCode, StockMovement, Language, ProductVariant } from '../types';
import { formatDA, buildWhatsAppLink, BOUTIQUE_PHONE } from '../lib/i18n';
import { ALGERIAN_WILAYAS } from '../data/wilayas';

interface AdminDashboardProps {
  language: Language;
  onExitAdmin: () => void;
  onProductUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onExitAdmin, onProductUpdated }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'products' | 'customers' | 'discounts' | 'analytics'>('orders');

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerCRM[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Selected Order for drawer/modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Product Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(4500);
  const [newProdSalePrice, setNewProdSalePrice] = useState<number | undefined>(undefined);
  const [newProdCategory, setNewProdCategory] = useState('chemises');
  const [newProdCategoryFr, setNewProdCategoryFr] = useState('Chemises');
  const [newProdMaterial, setNewProdMaterial] = useState('100% Pur Lin');
  const [newProdDescFr, setNewProdDescFr] = useState('');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop');
  const [aiLoading, setAiLoading] = useState(false);

  // Variant generator state
  const [variantsList, setVariantsList] = useState<Array<{ color: string; colorHex: string; size: string; stock: number }>>([
    { color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'S', stock: 5 },
    { color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'M', stock: 5 },
    { color: 'Blanc Pur', colorHex: '#FFFFFF', size: 'L', stock: 3 },
    { color: 'Noir', colorHex: '#111111', size: 'M', stock: 4 }
  ]);

  // New Discount Form State
  const [newDiscCode, setNewDiscCode] = useState('');
  const [newDiscType, setNewDiscType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscValue, setNewDiscValue] = useState<number>(10);
  const [newDiscMinOrder, setNewDiscMinOrder] = useState<number>(5000);

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, custRes, discRes, movRes, analRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/discounts').then(r => r.json()),
        fetch('/api/inventory/movements').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
      ]);

      if (ordRes.success) setOrders(ordRes.orders);
      if (prodRes.success) setProducts(prodRes.products);
      if (custRes.success) setCustomers(custRes.customers);
      if (discRes.success) setDiscounts(discRes.discounts);
      if (movRes.success) setMovements(movRes.movements);
      if (analRes.success) setAnalytics(analRes.analytics);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
        if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
        fetchData(); // refresh stocks in case of cancellation
        onProductUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Adjust variant stock directly
  const handleAdjustStock = async (productId: string, variantId: string, change: number) => {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          change,
          reason: change > 0 ? 'restock' : 'adjustment',
          note: 'Ajustement rapide atelier'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        onProductUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Product Description Generator
  const handleGenerateAIDescription = async () => {
    if (!newProdName.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: newProdName,
          material: newProdMaterial,
          category: newProdCategoryFr
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewProdDescFr(data.descriptionFr);
        setNewProdDescAr(data.descriptionAr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || variantsList.length === 0) return;

    try {
      const uniqueColors = Array.from(new Set(variantsList.map(v => v.color))).map(c => {
        const found = variantsList.find(v => v.color === c);
        return { name: c, hex: found?.colorHex || '#111111' };
      });
      const uniqueSizes = Array.from(new Set(variantsList.map(v => v.size)));

      const payload = {
        name: newProdName,
        nameAr: newProdNameAr || newProdName,
        price: Number(newProdPrice),
        salePrice: newProdSalePrice ? Number(newProdSalePrice) : undefined,
        category: newProdCategory,
        categoryFr: newProdCategoryFr,
        material: newProdMaterial,
        description: newProdDescFr,
        descriptionAr: newProdDescAr,
        images: [newProdImage],
        colors: uniqueColors,
        sizes: uniqueSizes,
        variants: variantsList
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProduct(false);
        fetchData();
        onProductUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Promo code
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscCode.trim()) return;

    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newDiscCode,
          type: newDiscType,
          value: Number(newDiscValue),
          minOrder: Number(newDiscMinOrder)
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewDiscCode('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Confirmez-vous la suppression de ce produit ?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
      onProductUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderFilter === 'all' || o.status === orderFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchQuery = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.wilayaName.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1A1918] text-left">
      {/* Admin Top Navbar */}
      <div className="bg-[#1A1918] text-[#FAF8F5] border-b border-stone-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-xl font-bold tracking-widest text-[#FAF8F5]">
              ZAYA ATELIER
            </span>
            <span className="bg-[#C5A880] text-stone-950 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
              Espace Gérant
            </span>
          </div>
          <span className="hidden md:inline text-xs text-stone-400">
            Centrale de Commandes & Gestion des Stocks (Algérie)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition-colors"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-white text-stone-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Quitter vers la Boutique
          </button>
        </div>
      </div>

      {/* Metric Stats Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Ventes du Jour</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-stone-900 mt-1">
              {analytics ? formatDA(analytics.todaySales) : '0 DA'}
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Chiffre d’Affaires Total</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#8C6D47] mt-1">
              {analytics ? formatDA(analytics.totalRevenue) : '0 DA'}
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Commandes en Attente</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-amber-700">
                {analytics?.pendingOrdersCount || 0}
              </span>
              <span className="text-[11px] text-stone-400">à confirmer</span>
            </div>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Colis Livrés & Encaissés</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-700 mt-1">
              {analytics?.deliveredOrdersCount || 0}
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 border border-stone-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 uppercase tracking-wider">Alertes Stock Faible</div>
            <div className="flex items-center gap-1.5 text-red-600 font-bold font-mono text-lg sm:text-xl mt-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{analytics?.lowStockItemsCount || 0} variantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex border-b border-stone-300 overflow-x-auto gap-2 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'inventory'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Matrice des Stocks</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'products'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'customers'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CRM Clients ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'discounts'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Codes Promo</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-3 transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
              activeTab === 'analytics'
                ? 'border-[#1A1918] text-[#1A1918]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytiques Wilayas</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-stone-400" />
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 text-xs px-2.5 py-1.5 focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente (Pending)</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="preparing">En préparation</option>
                  <option value="shipped">Expédiée (Yalidine)</option>
                  <option value="out_for_delivery">En cours de livraison</option>
                  <option value="delivered">Livrée & Payée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="returned">Retournée</option>
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Rechercher par client, tél, wilaya, réf..."
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-stone-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-stone-600 border-b border-stone-200 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Réf & Date</th>
                    <th className="py-3 px-4">Cliente & Contact</th>
                    <th className="py-3 px-4">Destination (58 Wilayas)</th>
                    <th className="py-3 px-4">Articles</th>
                    <th className="py-3 px-4">Total COD</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-400">
                        Aucune commande ne correspond aux filtres sélectionnés.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const whatsappMsg = `Salam ${ord.customerName}, c'est ZAYA Atelier pour votre commande ${ord.id}. Nous vous contactons pour confirmation avant l'expédition.`;
                      const whatsappLink = buildWhatsAppLink(ord.phone, whatsappMsg);

                      return (
                        <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-stone-900">{ord.id}</div>
                            <div className="text-[10px] text-stone-500">
                              {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-900">{ord.customerName}</div>
                            <div className="font-mono text-stone-600 flex items-center gap-1">
                              <span>{ord.phone}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-900">
                              {ord.wilayaName} ({String(ord.wilayaCode).padStart(2, '0')})
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {ord.commune} • {ord.deliveryMethod === 'home' ? 'Domicile' : 'Bureau Desk'}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-stone-700">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="line-clamp-1">
                                  {it.quantity}x {it.productName} ({it.color} / {it.size})
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold font-mono text-stone-900">
                              {formatDA(ord.total)}
                            </span>
                            <div className="text-[10px] text-stone-500">Espèces au livreur</div>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className={`text-[11px] font-semibold px-2 py-1 border rounded-xs focus:outline-none ${
                                ord.status === 'pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                                ord.status === 'confirmed' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                                ord.status === 'preparing' ? 'bg-purple-50 text-purple-900 border-purple-300' :
                                ord.status === 'shipped' ? 'bg-indigo-50 text-indigo-900 border-indigo-300' :
                                ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                                'bg-stone-100 text-stone-700 border-stone-300'
                              }`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="preparing">En préparation</option>
                              <option value="shipped">Expédiée</option>
                              <option value="out_for_delivery">En livraison</option>
                              <option value="delivered">Livrée (Payée)</option>
                              <option value="cancelled">Annulée (Remet stock)</option>
                              <option value="returned">Retournée</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xs transition-colors"
                                title="Contacter cliente sur WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-2.5 py-1 bg-stone-900 text-white text-[11px] hover:bg-black transition-colors"
                              >
                                Fiche
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MATRIX */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury font-bold text-base text-stone-900">
                  Matrice des Stocks par Variante (Couleur × Taille)
                </h3>
                <p className="text-xs text-stone-500">
                  Ajustez les stocks en direct à la réception d'atelier ou pour corriger l'inventaire physique.
                </p>
              </div>
              <div className="text-xs text-stone-600 bg-amber-50 border border-amber-200 px-3 py-1.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Les commandes déduisent automatiquement le stock de la variante concernée.</span>
              </div>
            </div>

            {/* Products with variants grid */}
            <div className="grid grid-cols-1 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-stone-100 overflow-hidden shrink-0">
                        <img src={prod.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-serif-luxury font-bold text-sm text-stone-900">{prod.name}</h4>
                        <div className="text-xs text-stone-500">
                          {prod.categoryFr} • SKU: <span className="font-mono">{prod.sku}</span> • Prix: {formatDA(prod.salePrice ?? prod.price)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-stone-500">Stock Total Disponible</div>
                      <div className="font-mono text-base font-bold text-stone-900">{prod.stock} unités</div>
                    </div>
                  </div>

                  {/* Variants table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-50 text-stone-600 text-[11px] uppercase">
                        <tr>
                          <th className="py-2 px-3">Couleur</th>
                          <th className="py-2 px-3">Taille</th>
                          <th className="py-2 px-3">SKU Variante</th>
                          <th className="py-2 px-3">Stock Actuel</th>
                          <th className="py-2 px-3 text-right">Ajuster Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {prod.variants.map((v) => {
                          const isLow = v.stock <= 2 && v.stock > 0;
                          const isOut = v.stock === 0;

                          return (
                            <tr key={v.id} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3 flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: v.colorHex }} />
                                <span className="font-medium text-stone-900">{v.color}</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold">{v.size}</td>
                              <td className="py-2.5 px-3 font-mono text-stone-500">{v.sku}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 font-mono font-bold rounded-xs ${
                                  isOut ? 'bg-red-100 text-red-800' :
                                  isLow ? 'bg-amber-100 text-amber-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {v.stock}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => handleAdjustStock(prod.id, v.id, -1)}
                                    disabled={v.stock <= 0}
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 disabled:opacity-30 font-bold"
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() => handleAdjustStock(prod.id, v.id, 1)}
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 font-bold"
                                  >
                                    +1
                                  </button>
                                  <button
                                    onClick={() => handleAdjustStock(prod.id, v.id, 5)}
                                    className="px-2 py-0.5 bg-stone-900 text-white hover:bg-black font-semibold text-[10px]"
                                  >
                                    +5 Atelier
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Log */}
            <div className="bg-white p-5 border border-stone-200 shadow-2xs space-y-3">
              <h4 className="font-serif-luxury font-bold text-sm text-stone-900">
                Historique d’Audit des Mouvements de Stock
              </h4>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {movements.slice(0, 15).map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                    <div>
                      <span className="font-medium text-stone-900">{m.productName}</span>
                      <span className="text-stone-500 text-[11px] ml-1">({m.variantLabel})</span>
                      <span className="text-stone-400 text-[10px] ml-2">Réf: {m.referenceId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold ${m.change > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {m.change > 0 ? `+${m.change}` : m.change}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px]">Nouveau stock: {m.newStock}</span>
                      <span className="text-stone-400 text-[10px]">
                        {new Date(m.timestamp).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury font-bold text-base text-stone-900">
                  Catalogue Produits
                </h3>
                <p className="text-xs text-stone-500">
                  Gérez vos pièces, générez vos descriptions avec l'IA et modifiez les tarifs.
                </p>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-[#1A1918] hover:bg-black text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <span>Nouveau Produit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white border border-stone-200 p-4 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 bg-stone-950 text-[#FAF8F5] text-[10px] font-mono px-2 py-0.5">
                        Stock: {p.stock}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-stone-500">{p.categoryFr}</div>
                      <h4 className="font-serif-luxury font-bold text-sm text-stone-900 line-clamp-1">{p.name}</h4>
                      <div className="text-xs font-semibold text-[#1A1918] mt-0.5">
                        {formatDA(p.salePrice ?? p.price)}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs mt-3">
                    <span className="text-stone-500 font-mono text-[11px]">{p.variants.length} variantes</span>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-stone-200 shadow-2xs overflow-x-auto">
            <div className="p-4 border-b border-stone-200">
              <h3 className="font-serif-luxury font-bold text-base text-stone-900">
                Répertoire & CRM Clients (Boutique & WhatsApp)
              </h3>
              <p className="text-xs text-stone-500">
                Suivez vos fidèles clientes algériennes, leurs commandes cumulées et contactez-les en 1 clic.
              </p>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Wilaya & Commune</th>
                  <th className="py-3 px-4">Commandes</th>
                  <th className="py-3 px-4">Dépenses Cumulées (DA)</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => {
                  const wa = buildWhatsAppLink(c.phone, `Salam Mme ${c.name}, ZAYA Atelier a le plaisir de vous faire découvrir sa nouvelle capsule.`);
                  return (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{c.name}</div>
                        <div className="font-mono text-stone-500">{c.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-800 font-medium">
                        {c.wilaya} • {c.commune}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">{c.totalOrders}</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{formatDA(c.totalSpent)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                          c.status === 'vip' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          c.status === 'regular' ? 'bg-blue-100 text-blue-900' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={wa}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors rounded-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-white p-5 border border-stone-200 shadow-2xs space-y-4">
              <h3 className="font-serif-luxury font-bold text-base text-stone-900">
                Créer un Code Promo
              </h3>
              <form onSubmit={handleCreateDiscount} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Code Promo (ex: SAHRA15)</label>
                  <input
                    type="text"
                    required
                    value={newDiscCode}
                    onChange={(e) => setNewDiscCode(e.target.value.toUpperCase())}
                    placeholder="CODE PROMO"
                    className="w-full px-3 py-2 border border-stone-300 font-mono uppercase focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Type</label>
                    <select
                      value={newDiscType}
                      onChange={(e) => setNewDiscType(e.target.value as any)}
                      className="w-full px-2 py-2 border border-stone-300 focus:outline-none"
                    >
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant Fixe (DA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Valeur ({newDiscType === 'percentage' ? '%' : 'DA'})</label>
                    <input
                      type="number"
                      required
                      value={newDiscValue}
                      onChange={(e) => setNewDiscValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Commande Minimum (DA)</label>
                  <input
                    type="number"
                    value={newDiscMinOrder}
                    onChange={(e) => setNewDiscMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 font-mono focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1A1918] hover:bg-black text-[#FAF8F5] uppercase font-bold tracking-wider transition-colors"
                >
                  Enregistrer le Code
                </button>
              </form>
            </div>

            <div className="md:col-span-7 bg-white p-5 border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-serif-luxury font-bold text-base text-stone-900">
                Codes Promo Actifs
              </h3>
              <div className="space-y-2">
                {discounts.map((d) => (
                  <div key={d.id} className="p-3 bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-bold text-stone-900 text-sm flex items-center gap-2">
                        <span>{d.code}</span>
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans">
                          {d.type === 'percentage' ? `-${d.value}%` : `-${formatDA(d.value)}`}
                        </span>
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        Min. d'achat: {formatDA(d.minOrder)} • Utilisé {d.usedCount} fois
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sales by Wilaya */}
              <div className="bg-white p-5 border border-stone-200 shadow-2xs space-y-3">
                <h4 className="font-serif-luxury font-bold text-sm text-stone-900">
                  Top Ventes par Wilaya (Algérie)
                </h4>
                <div className="space-y-2 text-xs">
                  {analytics.salesByWilaya.map((w: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="font-medium text-stone-800">{w.wilaya}</span>
                      <div className="text-right font-mono">
                        <span className="font-bold text-stone-900">{formatDA(w.revenue)}</span>
                        <span className="text-stone-500 text-[10px] ml-1">({w.count} colis)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Sizes */}
              <div className="bg-white p-5 border border-stone-200 shadow-2xs space-y-3">
                <h4 className="font-serif-luxury font-bold text-sm text-stone-900">
                  Tailles les Plus Demandées
                </h4>
                <div className="space-y-2 text-xs">
                  {analytics.topSizes.map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="font-mono font-bold text-stone-800">{s.size}</span>
                      <span className="font-mono text-stone-600">{s.count} pièces vendues</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Colors */}
              <div className="bg-white p-5 border border-stone-200 shadow-2xs space-y-3">
                <h4 className="font-serif-luxury font-bold text-sm text-stone-900">
                  Couleurs Tendance
                </h4>
                <div className="space-y-2 text-xs">
                  {analytics.topColors.map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="font-medium text-stone-800">{c.color}</span>
                      <span className="font-mono text-stone-600">{c.count} pièces</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] shadow-2xl border border-stone-300 p-6 space-y-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] uppercase font-mono text-stone-500">Bordereau Commande</span>
              <h3 className="font-serif-luxury font-bold text-xl text-stone-900">{selectedOrder.id}</h3>
              <div className="text-xs text-stone-500">
                Passée le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>

            <div className="text-xs space-y-2 bg-white p-3 border border-stone-200">
              <div className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</div>
              <div>Tél: <span className="font-mono font-bold text-stone-800">{selectedOrder.phone}</span></div>
              {selectedOrder.alternatePhone && <div>Tél 2: <span className="font-mono">{selectedOrder.alternatePhone}</span></div>}
              <div>Wilaya: <strong>{selectedOrder.wilayaName} ({selectedOrder.wilayaCode})</strong> - {selectedOrder.commune}</div>
              <div>Adresse: {selectedOrder.address}</div>
              <div>Mode: <strong>{selectedOrder.deliveryMethod === 'home' ? 'À Domicile' : 'Bureau Desk Yalidine'}</strong></div>
              {selectedOrder.customerNotes && (
                <div className="p-2 bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                  Notes cliente: {selectedOrder.customerNotes}
                </div>
              )}
            </div>

            {/* Articles */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">Articles :</span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-stone-100">
                  <span>{it.quantity}x {it.productName} ({it.color} - {it.size})</span>
                  <span className="font-mono font-bold">{formatDA(it.total)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-bold text-sm text-stone-900">
                <span>Total à encaisser au livreur (COD) :</span>
                <span>{formatDA(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <a
                href={buildWhatsAppLink(selectedOrder.phone, `Salam ${selectedOrder.customerName}, confirmation de votre commande ZAYA ${selectedOrder.id}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-stone-200 text-stone-800 text-xs font-semibold uppercase"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] shadow-2xl border border-stone-300 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProduct(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-serif-luxury font-bold text-xl text-stone-900">
                Ajouter une Nouvelle Pièce au Catalogue
              </h3>
              <p className="text-xs text-stone-500">
                Configurez les variantes et utilisez Gemini AI pour rédiger votre descriptif luxueux.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nom du Vêtement (FR) *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Ex: Caftan Soirée Crêpe de Soie"
                    className="w-full px-3 py-2 border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nom en Arabe (AR)</label>
                  <input
                    type="text"
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    placeholder="قفطان سهرة راقي"
                    className="w-full px-3 py-2 border border-stone-300 bg-white font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Prix de Vente (DA) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Prix Soldé (optionnel)</label>
                  <input
                    type="number"
                    value={newProdSalePrice || ''}
                    onChange={(e) => setNewProdSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-stone-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Catégorie</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => {
                      setNewProdCategory(e.target.value);
                      if (e.target.value === 'chemises') setNewProdCategoryFr('Chemises');
                      if (e.target.value === 'caftans') setNewProdCategoryFr('Caftans');
                      if (e.target.value === 'vestes') setNewProdCategoryFr('Vestes');
                    }}
                    className="w-full px-2 py-2 border border-stone-300 bg-white"
                  >
                    <option value="chemises">Chemises</option>
                    <option value="caftans">Caftans & Soirée</option>
                    <option value="vestes">Vestes & Blazers</option>
                    <option value="accessoires">Maroquinerie</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Matière & Tissu</label>
                <input
                  type="text"
                  value={newProdMaterial}
                  onChange={(e) => setNewProdMaterial(e.target.value)}
                  placeholder="Ex: 100% Lin pur d'Europe, Crêpe Georgette..."
                  className="w-full px-3 py-2 border border-stone-300 bg-white"
                />
              </div>

              {/* AI Description Generator Button */}
              <div className="p-3 bg-[#EFE9DF] border border-[#DDD3C4] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    <span>Rédaction Automatique Assistée par Gemini AI</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAIDescription}
                    disabled={aiLoading || !newProdName.trim()}
                    className="px-3 py-1 bg-[#1A1918] hover:bg-black text-white text-[11px] font-semibold uppercase disabled:opacity-50 flex items-center gap-1"
                  >
                    {aiLoading ? 'Génération...' : 'Générer la description'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <textarea
                    rows={3}
                    value={newProdDescFr}
                    onChange={(e) => setNewProdDescFr(e.target.value)}
                    placeholder="Description en français..."
                    className="w-full p-2 border border-stone-300 bg-white text-xs"
                  />
                  <textarea
                    rows={3}
                    value={newProdDescAr}
                    onChange={(e) => setNewProdDescAr(e.target.value)}
                    placeholder="الوصف باللغة العربية..."
                    className="w-full p-2 border border-stone-300 bg-white text-xs font-arabic"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold mb-1">URL Photo Principale</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 bg-white text-xs"
                />
              </div>

              {/* Variants Builder Preview */}
              <div className="space-y-2 border-t border-stone-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                    Variantes Initiales (Couleurs & Tailles)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {variantsList.map((v, i) => (
                    <div key={i} className="p-2 bg-white border border-stone-300 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-900">{v.color}</div>
                        <div className="text-stone-500 font-mono">Taille: {v.size}</div>
                      </div>
                      <span className="font-mono font-bold bg-stone-100 px-1.5 py-0.5">{v.stock} pcs</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1A1918] hover:bg-black text-[#FAF8F5] uppercase font-bold tracking-wider"
                >
                  Ajouter au Catalogue
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-3 bg-stone-200 text-stone-800 uppercase font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
