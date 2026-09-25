import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductVariant, CartItem, Language, Order } from './types';
import { useAppRouter, AppRoute } from './lib/router';
import { useAuth } from './context/AuthContext';
import { useSEO } from './hooks/useSEO';

// Public Components
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicHomePage } from './components/public/PublicHomePage';
import { PublicCollectionPage } from './components/public/PublicCollectionPage';
import { PublicAboutPage } from './components/public/PublicAboutPage';
import { PublicContactPage } from './components/public/PublicContactPage';
import { PublicFooter } from './components/public/PublicFooter';

// Auth Component
import { AuthPage } from './components/auth/AuthPage';

// Authenticated Customer Dashboard
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';

// Modals & Drawers
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { translations } from './lib/i18n';

export default function App() {
  const { currentRoute, queryParams, navigate, setQueryParam } = useAppRouter();
  const { user, token, loading: authLoading } = useAuth();

  // Language & Admin State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('zaya_lang') as Language) || 'fr';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [trackingInitialOrderId, setTrackingInitialOrderId] = useState<string>('');
  const [trackingInitialPhone, setTrackingInitialPhone] = useState<string>('');

  const handleOpenTracking = (orderId?: string, phone?: string) => {
    setTrackingInitialOrderId(orderId || '');
    setTrackingInitialPhone(phone || '');
    setIsTrackingOpen(true);
  };

  // Dynamic SEO management hook for all pages, collections, and products
  useSEO({
    route: currentRoute,
    category: currentRoute === '/collection' ? (queryParams.category || 'all') : undefined,
    product: selectedProduct,
    language,
  });

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zaya_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zaya_wishlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const cartCount = useMemo(() => {
    return (cart || []).reduce((s, i) => s + (i.quantity || 0), 0);
  }, [cart]);

  // Discount
  const [discountCode, setDiscountCode] = useState<string | undefined>(undefined);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

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

  // Load Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
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
  }, []);

  // Deep linking for products (?product=prod-xxx)
  useEffect(() => {
    if (queryParams.product && products.length > 0) {
      const found = products.find(p => p.id === queryParams.product || p.slug === queryParams.product);
      if (found && (!selectedProduct || selectedProduct.id !== found.id)) {
        setSelectedProduct(found);
      }
    } else if (!queryParams.product && selectedProduct) {
      setSelectedProduct(null);
    }
  }, [queryParams.product, products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setQueryParam('product', product.id, false);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setQueryParam('product', null, true);
  };

  // Protected Route Check
  useEffect(() => {
    if (!authLoading && currentRoute.startsWith('/dashboard') && !user) {
      // Unauthenticated visitor trying to access private dashboard
      setAuthPromptMessage("Veuillez vous connecter ou créer votre compte pour accéder à l'Espace Client.");
      navigate('/sign-in', true);
    }
  }, [currentRoute, user, authLoading, navigate]);

  // Cart Operations
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    if (!user) {
      setSelectedProduct(null);
      setAuthPromptMessage('Veuillez vous connecter ou créer votre compte pour ajouter des articles au panier et commander.');
      navigate('/sign-in');
      return;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.variantId === variant.id);
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
          image: product.images[0],
        };
        return [...prev, newItem];
      }
    });

    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleDirectCheckout = (product: Product, variant: ProductVariant, quantity: number) => {
    if (!user) {
      setSelectedProduct(null);
      setAuthPromptMessage('Veuillez vous connecter ou créer votre compte pour commander avec paiement à la livraison.');
      navigate('/sign-in');
      return;
    }
    handleAddToCart(product, variant, quantity);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleToggleWishlist = (product: Product) => {
    if (!user) {
      setSelectedProduct(null);
      setAuthPromptMessage('Veuillez vous connecter ou créer votre compte pour enregistrer des articles dans vos favoris.');
      navigate('/sign-in');
      return;
    }
    setWishlist((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const handleApplyDiscount = async (code: string): Promise<boolean> => {
    const subtotal = (cart || []).reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
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

  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    setDiscountCode(undefined);
    setDiscountAmount(0);
    fetchProducts();
  };

  // If Admin view is specifically toggled
  if (isAdmin) {
    return (
      <AdminDashboard
        language={language}
        onExitAdmin={() => setIsAdmin(false)}
        onProductUpdated={fetchProducts}
      />
    );
  }

  // =========================================================================
  // ROUTE RENDERING ENGINE
  // Flow: PUBLIC HOMEPAGE -> AUTHENTICATION -> CUSTOMER DASHBOARD
  // =========================================================================

  const renderRouteContent = () => {
    // 1. Authenticated Customer Dashboard (/dashboard, /dashboard/*)
    if (currentRoute.startsWith('/dashboard')) {
      if (!user && !token) {
        // While checking or unauthenticated, show clean transition
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#1A1918] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-wider text-stone-600">
              Vérification de l'accès à l'Espace Client...
            </p>
          </div>
        );
      }

      return (
        <CustomerDashboard
          currentRoute={currentRoute}
          onNavigate={navigate}
          products={products}
          language={language}
          cart={cart}
          wishlist={wishlist}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectProduct={handleSelectProduct}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onOpenAdmin={() => setIsAdmin(true)}
        />
      );
    }

    // 2. Authentication Pages (/sign-in, /sign-up)
    if (currentRoute === '/sign-in' || currentRoute === '/sign-up') {
      return (
        <AuthPage
          initialTab={currentRoute === '/sign-up' ? 'register' : 'login'}
          onNavigate={navigate}
          promptMessage={authPromptMessage}
        />
      );
    }

    // 3. Public Collection Page (/collection)
    if (currentRoute === '/collection') {
      return (
        <>
          <PublicNavbar
            currentRoute={currentRoute}
            onNavigate={navigate}
            language={language}
            onLanguageChange={setLanguage}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTracking={() => handleOpenTracking()}
          />
          <PublicCollectionPage
            products={products}
            language={language}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            currentCategory={queryParams.category || 'all'}
            onCategoryChange={(catId) => {
              setQueryParam('category', catId === 'all' ? null : catId, true);
            }}
          />
          <PublicFooter onNavigate={navigate} onOpenTracking={() => handleOpenTracking()} />
        </>
      );
    }

    // 4. Public About Page (/about)
    if (currentRoute === '/about') {
      return (
        <>
          <PublicNavbar
            currentRoute={currentRoute}
            onNavigate={navigate}
            language={language}
            onLanguageChange={setLanguage}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTracking={() => handleOpenTracking()}
          />
          <PublicAboutPage onNavigate={navigate} />
          <PublicFooter onNavigate={navigate} onOpenTracking={() => handleOpenTracking()} />
        </>
      );
    }

    // 5. Public Contact Page (/contact)
    if (currentRoute === '/contact') {
      return (
        <>
          <PublicNavbar
            currentRoute={currentRoute}
            onNavigate={navigate}
            language={language}
            onLanguageChange={setLanguage}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTracking={() => handleOpenTracking()}
          />
          <PublicContactPage onNavigate={navigate} />
          <PublicFooter onNavigate={navigate} onOpenTracking={() => handleOpenTracking()} />
        </>
      );
    }

    // 6. DEFAULT FIRST SCREEN: Public Homepage (/)
    // Must NEVER open directly on dashboard or clothing catalog grid!
    return (
      <>
        <PublicNavbar
          currentRoute="/"
          onNavigate={navigate}
          language={language}
          onLanguageChange={setLanguage}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTracking={() => handleOpenTracking()}
        />
        <PublicHomePage
          products={products}
          language={language}
          onNavigate={navigate}
          onSelectProduct={handleSelectProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenTracking={handleOpenTracking}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1918] font-sans antialiased selection:bg-[#C5A880]/30 selection:text-[#1A1918]">
      {/* Route View */}
      {renderRouteContent()}

      {/* Global Modals & Drawers */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          language={language}
          onClose={handleCloseProductModal}
          onAddToCart={handleAddToCart}
          onDirectCheckout={handleDirectCheckout}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
          onPromptAuth={() => {
            handleCloseProductModal();
            setAuthPromptMessage('Veuillez vous connecter pour publier votre avis certifié.');
            navigate('/sign-in');
          }}
          onReviewSubmitted={() => {
            fetchProducts();
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          if (!user) {
            setAuthPromptMessage('Veuillez vous connecter ou créer votre compte pour finaliser votre commande.');
            navigate('/sign-in');
            return;
          }
          setIsCheckoutOpen(true);
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          if (!user) {
            setAuthPromptMessage('Veuillez vous connecter ou créer votre compte pour finaliser votre commande.');
            navigate('/sign-in');
            return;
          }
          setIsCheckoutOpen(true);
        }}
        onApplyDiscount={handleApplyDiscount}
        language={language}
        discountAmount={discountAmount}
        discountCode={discountCode}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        items={cart}
        discountCode={discountCode}
        discountAmount={discountAmount}
        onApplyDiscount={handleApplyDiscount}
        onOrderSuccess={handleOrderSuccess}
        language={language}
        onNavigate={navigate}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        language={language}
        initialOrderId={trackingInitialOrderId}
        initialPhone={trackingInitialPhone}
      />
    </div>
  );
}
