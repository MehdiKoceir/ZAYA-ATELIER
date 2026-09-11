import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Language, Order } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AISupportModal } from './components/AISupportModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { BrandStory } from './components/BrandStory';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { translations, buildWhatsAppLink, BOUTIQUE_PHONE } from './lib/i18n';
import { MessageCircle, Sparkles, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

export default function App() {
  // Locale & Admin State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('zaya_lang') as Language) || 'fr';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Catalog & Filter State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // Cart & Wishlist persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zaya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zaya_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Discount
  const [discountCode, setDiscountCode] = useState<string | undefined>(undefined);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const t = translations[language];

  // Save Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('zaya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zaya_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('zaya_lang', language);
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedCollection !== 'all') params.append('collection', selectedCollection);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('sort', sortBy);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCollection, searchQuery, sortBy]);

  // Add to Cart
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.variantId === variant.id);
      if (existingIdx > -1) {
        const nextCart = [...prev];
        const newQty = Math.min(variant.stock, nextCart[existingIdx].quantity + quantity);
        nextCart[existingIdx] = { ...nextCart[existingIdx], quantity: newQty };
        return nextCart;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          color: variant.color,
          size: variant.size,
          quantity: Math.min(variant.stock, quantity),
          unitPrice: product.salePrice ?? product.price,
          image: product.images[0]
        };
        return [...prev, newItem];
      }
    });

    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  // Direct checkout
  const handleDirectCheckout = (product: Product, variant: ProductVariant, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    setIsCheckoutOpen(true);
  };

  // Update Cart Qty
  const handleUpdateCartQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(variantId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.variantId === variantId ? { ...item, quantity: qty } : item))
    );
  };

  // Remove Cart Item
  const handleRemoveCartItem = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev =>
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
  };

  // Validate Discount Code
  const handleApplyDiscount = async (code: string): Promise<boolean> => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountCode(data.code);
        setDiscountAmount(data.discountAmount);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Order Success Handler
  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    setDiscountCode(undefined);
    setDiscountAmount(0);
    fetchProducts(); // refresh live stock
  };

  const categories = [
    { id: 'all', fr: 'Tous les Modèles', ar: 'جميع الموديلات' },
    { id: 'caftans', fr: 'Caftans & Soirée', ar: 'قفطان وسهرات' },
    { id: 'chemises', fr: 'Chemises en Lin', ar: 'قمصان الكتان' },
    { id: 'vestes', fr: 'Vestes & Blazers', ar: 'سترات وبليزر' },
    { id: 'pantalons', fr: 'Pantalons & Ensembles', ar: 'بناطيل وأطقم' },
    { id: 'robes', fr: 'Robes Fluides', ar: 'فساتين عصرية' },
    { id: 'accessoires', fr: 'Maroquinerie', ar: 'حقائب جلدية' }
  ];

  // If Admin view is enabled, render Boutique Owner Dashboard
  if (isAdmin) {
    return (
      <AdminDashboard
        language={language}
        onExitAdmin={() => setIsAdmin(false)}
        onProductUpdated={fetchProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1918] font-sans antialiased selection:bg-[#C5A880] selection:text-black">
      {/* Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          // Filter to wishlisted
          setSearchQuery('');
          setSelectedCategory('all');
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Section */}
      <Hero
        language={language}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Catalog & Filter Section */}
      <section id="catalog-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Category Pills */}
        <div className="flex items-center justify-between gap-4 pb-6 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#EFE9DF] text-[#524B43] hover:bg-[#E5DDD0]'
                }`}
              >
                {language === 'ar' ? cat.ar : cat.fr}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs text-stone-600 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs text-[#1A1918] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="price_asc">{t.sortPriceAsc}</option>
              <option value="price_desc">{t.sortPriceDesc}</option>
            </select>
          </div>
        </div>

        {/* Search status */}
        {searchQuery && (
          <div className="text-xs text-stone-500 mb-4 flex items-center justify-between">
            <span>Résultats pour « {searchQuery} » ({products.length} modèles)</span>
            <button
              onClick={() => setSearchQuery('')}
              className="underline text-stone-800 hover:text-black"
            >
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-stone-50 border border-stone-200">
            <p className="font-serif-luxury text-lg font-bold text-stone-800">
              Aucun modèle ne correspond à vos critères
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Essayez une autre catégorie ou posez une question à notre Conseillère de Style IA.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-[#1A1918] text-white text-xs uppercase font-semibold tracking-wider"
            >
              Voir toute la collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onSelect={(p) => setSelectedProduct(p)}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickOrderWhatsApp={(p) => {
                  const msg = `Salam ZAYA Atelier, je souhaite commander: ${p.name}`;
                  window.open(buildWhatsAppLink(BOUTIQUE_PHONE, msg), '_blank');
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Brand Storytelling */}
      <BrandStory language={language} />

      {/* Instagram Community Section */}
      <InstagramSection
        language={language}
        onSelectProduct={(p) => setSelectedProduct(p)}
        products={products}
      />

      {/* Reassurance Guarantee Footer Banner */}
      <div className="bg-[#FAF8F5] border-t border-[#EAE3D6] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-white border border-stone-200 shadow-2xs">
            <div className="font-serif-luxury font-bold text-stone-900 text-sm">{t.guarantee1Title}</div>
            <div className="text-xs text-stone-600 mt-1">{t.guarantee1Desc}</div>
          </div>
          <div className="p-4 bg-white border border-stone-200 shadow-2xs">
            <div className="font-serif-luxury font-bold text-stone-900 text-sm">{t.guarantee2Title}</div>
            <div className="text-xs text-stone-600 mt-1">{t.guarantee2Desc}</div>
          </div>
          <div className="p-4 bg-white border border-stone-200 shadow-2xs">
            <div className="font-serif-luxury font-bold text-stone-900 text-sm">{t.guarantee3Title}</div>
            <div className="text-xs text-stone-600 mt-1">{t.guarantee3Desc}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        language={language}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAIAssistant={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdmin(true)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Floating Action Buttons (WhatsApp & AI Concierge) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5">
        {/* AI Support Button */}
        <button
          onClick={() => setIsSupportOpen(true)}
          className="w-12 h-12 rounded-full bg-[#1A1918] hover:bg-black text-[#FAF8F5] shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-[#C5A880]/40 group"
          title="Assistance Clientèle IA"
        >
          <Sparkles className="w-5 h-5 text-[#E6C697] group-hover:rotate-12 transition-transform" />
        </button>

        {/* WhatsApp Direct */}
        <a
          href={buildWhatsAppLink(BOUTIQUE_PHONE, 'Salam ZAYA Atelier! Je vous contacte depuis la boutique.')}
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
          title="WhatsApp Boutique"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          language={language}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onDirectCheckout={handleDirectCheckout}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        language={language}
        discountCode={discountCode}
        discountAmount={discountAmount}
        onApplyDiscount={handleApplyDiscount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountCode={discountCode}
        discountAmount={discountAmount}
        onOrderSuccess={handleOrderSuccess}
        language={language}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
      />

      <AISupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        language={language}
      />

      {/* Switchable Modern Auth Modal (Sign In / Sign Up) */}
      <AuthModal language={language} />

      {/* Client Profile / VIP Orders Modal */}
      <UserProfileModal
        language={language}
        onOpenTrackingForOrder={(orderId) => {
          setIsTrackingOpen(true);
        }}
      />
    </div>
  );
}
