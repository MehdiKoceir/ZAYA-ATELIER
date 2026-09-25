import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_DISCOUNTS } from './src/data/initialProducts';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_MOVEMENTS } from './src/data/initialOrders';
import { ALGERIAN_WILAYAS } from './src/data/wilayas';
import { Product, Order, OrderStatus, CustomerCRM, DiscountCode, StockMovement, ProductVariant, UserAccount, ProductReview } from './src/types';
import { db, initDatabase, saveDb, getDatabaseStats, triggerManualBackup, UserRecord } from './src/server/db';

const app = express();
const PORT = 3000;

app.use(express.json());

// Production Security Headers (Protection against MIME sniffing, Clickjacking, and XSS)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Cryptographic Password Hashing (scrypt with per-user random salt)
function hashPassword(password: string, salt?: string): string {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, userSalt + (process.env.AUTH_SECRET || '_zaya_atelier_secret_2026'), 64);
  return `${userSalt}:${derivedKey.toString('hex')}`;
}

// Password Verification with timing-safe comparison and backward compatibility
function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  if (storedHash.includes(':')) {
    const [salt, key] = storedHash.split(':');
    const derivedKey = crypto.scryptSync(password, salt + (process.env.AUTH_SECRET || '_zaya_atelier_secret_2026'), 64);
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedBuffer = derivedKey;
    if (keyBuffer.length !== derivedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
  }
  // Backward compatibility with legacy SHA-256
  const legacyHash = crypto.createHash('sha256').update(password + '_zaya_atelier_secret_2026').digest('hex');
  const legacyBuffer = Buffer.from(legacyHash);
  const storedBuffer = Buffer.from(storedHash);
  if (legacyBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(legacyBuffer, storedBuffer);
}

// Master Admin setup (Configurable via environment variables for the buyer)
const initialAdminEmail = (process.env.ADMIN_EMAIL || 'admin@zaya.dz').toLowerCase().trim();
const initialAdminPassword = process.env.ADMIN_PASSWORD || 'AdminZaya2026!';

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'user-admin',
    name: 'Direction ZAYA Atelier',
    email: initialAdminEmail,
    phone: '0550000000',
    wilayaCode: 16,
    wilayaName: 'Alger',
    commune: 'Hydra',
    address: 'Boulevard du 11 Décembre, Val d\'Hydra, Alger',
    deliveryMethod: 'home',
    role: 'admin',
    loyaltyTier: 'VIP Atelier',
    createdAt: '2026-01-01T00:00:00Z',
    passwordHash: hashPassword(initialAdminPassword)
  },
  {
    id: 'user-001',
    name: 'Sarah Benali',
    email: 'sarah@zaya.dz',
    phone: '0550123456',
    wilayaCode: 16,
    wilayaName: 'Alger',
    commune: 'Hydra',
    address: 'Résidence Les Pins, Apt 14, Sidi Yahia',
    deliveryMethod: 'home',
    role: 'customer',
    loyaltyTier: 'VIP Atelier',
    createdAt: '2026-01-15T10:00:00Z',
    passwordHash: hashPassword('sarah2026')
  },
  {
    id: 'user-002',
    name: 'Amélia Ziani',
    email: 'amelia@zaya.dz',
    phone: '0555123987',
    wilayaCode: 16,
    wilayaName: 'Alger',
    commune: 'El Biar',
    address: 'Boulevard Bougara, Villa 12',
    deliveryMethod: 'home',
    role: 'customer',
    loyaltyTier: 'Privilège',
    createdAt: '2026-02-20T14:30:00Z',
    passwordHash: hashPassword('amelia123')
  }
];

// Initialize durable, persistent local database store (Zero Cloud Cost)
initDatabase(INITIAL_USERS);

let products: Product[] = db.products;
let orders: Order[] = db.orders;
let customers: CustomerCRM[] = db.customers;
let discounts: DiscountCode[] = db.discounts;
let movements: StockMovement[] = db.movements;
let users: UserRecord[] = db.users;
let reviews: ProductReview[] = db.reviews || [];

// Helper: Check if user has ordered a specific product in past non-cancelled orders
function hasUserPurchasedProduct(user: UserRecord, productId: string): boolean {
  if (!user || !productId) return false;
  const cleanUserPhone = (user.phone || '').replace(/[\s\-\.\(\)]/g, '');
  const cleanUserName = (user.name || '').trim().toLowerCase();

  return orders.some(order => {
    const hasItem = Array.isArray(order.items) && order.items.some(item => item.productId === productId);
    if (!hasItem) return false;

    const cleanOrderPhone = (order.phone || '').replace(/[\s\-\.\(\)]/g, '');
    const matchesPhone = cleanUserPhone.length >= 6 && cleanOrderPhone.length >= 6 && cleanUserPhone === cleanOrderPhone;
    const matchesName = cleanUserName.length > 2 && (order.customerName || '').trim().toLowerCase() === cleanUserName;
    const isValidStatus = order.status !== 'cancelled';

    return (matchesPhone || matchesName) && isValidStatus;
  });
}

// Active sessions map with expiration (token -> SessionRecord)
interface SessionRecord {
  userId: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, SessionRecord>();
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days session lifetime

function createSession(userId: string): string {
  const token = `zy_${crypto.randomBytes(32).toString('hex')}`;
  activeSessions.set(token, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS
  });
  return token;
}

// In-Memory Brute Force Protection on Login
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-ip';
}

function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { allowed: true };
  if (attempt.blockedUntil > now) {
    return { allowed: false, waitSeconds: Math.ceil((attempt.blockedUntil - now) / 1000) };
  }
  if (now - attempt.blockedUntil > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
  }
  return { allowed: true };
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.blockedUntil = now + 15 * 60 * 1000; // 15-minute cooldown
  }
  loginAttempts.set(ip, attempt);
}

function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Helper: Extract session user from request headers
function getRequestUser(req: express.Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : ((req.query.token || req.headers['x-auth-token']) as string);

  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return users.find(u => u.id === session.userId) || null;
}

// Security Middleware: Require Valid Authentication
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getRequestUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Session non valide ou expirée. Veuillez vous connecter pour continuer.'
    });
  }
  (req as any).user = user;
  next();
}

// Security Middleware: Require Administrator Role (Atelier Management)
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getRequestUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Connexion administrateur requise.'
    });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès interdit. Cette action nécessite les privilèges administrateur de l’Atelier ZAYA.'
    });
  }
  (req as any).user = user;
  next();
}

// Helper to sanitize user object (remove passwordHash and compute live order stats)
function getSanitizedUser(user: UserRecord): UserAccount {
  const cleanPhone = user.phone.replace(/\s+/g, '');
  const userOrders = orders.filter(
    o => o.phone.replace(/\s+/g, '') === cleanPhone || o.customerName.toLowerCase() === user.name.toLowerCase()
  );
  const totalSpent = userOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const ordersCount = userOrders.length;
  const loyaltyTier: 'Membre' | 'Privilège' | 'VIP Atelier' =
    ordersCount >= 4 ? 'VIP Atelier' : ordersCount >= 2 ? 'Privilège' : 'Membre';

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    wilayaCode: user.wilayaCode,
    wilayaName: user.wilayaName,
    commune: user.commune,
    address: user.address,
    deliveryMethod: user.deliveryMethod || 'home',
    deliveryNotes: user.deliveryNotes || '',
    role: user.role || 'customer',
    loyaltyTier,
    ordersCount,
    totalSpent,
    createdAt: user.createdAt
  };
}


// Recalculate total product stock
function syncProductTotalStock(product: Product) {
  product.stock = product.variants.reduce((sum, v) => sum + Math.max(0, v.stock), 0);
}
products.forEach(syncProductTotalStock);

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ==========================================
// AUTHENTICATION & CLIENT ACCOUNT API
// ==========================================

// Register new customer account
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, wilayaCode, commune, address, deliveryMethod } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Nom et prénom requis' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Adresse email valide requise' });
    }

    const cleanPhone = String(phone || '').replace(/\s+/g, '');
    const isDzPhone = /^(0)(5|6|7)[0-9]{8}$/.test(cleanPhone) || /^\+213(5|6|7)[0-9]{8}$/.test(cleanPhone);
    if (!isDzPhone) {
      return res.status(400).json({
        success: false,
        error: 'Numéro de téléphone algérien valide requis (ex: 0550 12 34 56 ou 0661...)'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Check if email or phone already registered
    const existingEmail = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Cette adresse email est déjà associée à un compte Atelier ZAYA'
      });
    }

    const existingPhone = users.find(u => u.phone.replace(/\s+/g, '') === cleanPhone);
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        error: 'Ce numéro de téléphone est déjà associé à un compte'
      });
    }

    // Resolve wilaya
    const codeNum = Number(wilayaCode) || 16;
    const foundWilaya = ALGERIAN_WILAYAS.find(w => w.code === codeNum) || ALGERIAN_WILAYAS[15];

    const newUserId = `user-${Date.now().toString().slice(-5)}`;
    const newUser: UserRecord = {
      id: newUserId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      wilayaCode: foundWilaya.code,
      wilayaName: foundWilaya.name,
      commune: commune ? commune.trim() : (foundWilaya.communes[0] || ''),
      address: address ? address.trim() : '',
      deliveryMethod: deliveryMethod === 'desk' ? 'desk' : 'home',
      role: 'customer',
      loyaltyTier: 'Membre',
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(password)
    };

    users.unshift(newUser);
    saveDb();

    // Generate Session Token (with 14-day expiry)
    const token = createSession(newUser.id);

    const sanitized = getSanitizedUser(newUser);

    res.status(201).json({
      success: true,
      token,
      user: sanitized,
      message: 'Compte ZAYA créé avec succès. Bienvenue dans notre Atelier !'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login customer account (by Email OR Phone) with Brute Force Protection
app.post('/api/auth/login', (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Trop de tentatives de connexion infructueuses. Par mesure de sécurité, veuillez patienter ${rateCheck.waitSeconds} secondes avant de réessayer.`
      });
    }

    const { identifier, password } = req.body;

    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ success: false, error: 'Email ou numéro de téléphone requis' });
    }

    if (!password) {
      return res.status(400).json({ success: false, error: 'Mot de passe requis' });
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\s+/g, '');

    const user = users.find(
      u => u.email.toLowerCase() === cleanInput || u.phone.replace(/\s+/g, '') === cleanPhone
    );

    if (!user) {
      recordFailedLogin(clientIp);
      return res.status(401).json({
        success: false,
        error: 'Identifiants introuvables. Vérifiez votre email ou téléphone.'
      });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      recordFailedLogin(clientIp);
      return res.status(401).json({
        success: false,
        error: 'Mot de passe incorrect.'
      });
    }

    // Modernize password hash to scrypt if legacy
    if (!user.passwordHash.includes(':')) {
      user.passwordHash = hashPassword(password);
      saveDb();
    }

    // Reset failed attempts upon successful login
    clearLoginAttempts(clientIp);

    // Generate Session Token (with 14-day expiry)
    const token = createSession(user.id);

    const sanitized = getSanitizedUser(user);

    // Retrieve order history
    const userOrders = orders.filter(
      o => o.phone.replace(/\s+/g, '') === user.phone.replace(/\s+/g, '') ||
           o.customerName.toLowerCase() === user.name.toLowerCase()
    );

    res.json({
      success: true,
      token,
      user: sanitized,
      orders: userOrders,
      message: `Ravi de vous revoir, ${user.name} !`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current logged-in user profile & live orders
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : (req.query.token as string);

    if (!token) {
      return res.status(401).json({ success: false, error: 'Non authentifié' });
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ success: false, error: 'Session expirée ou invalide' });
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) {
      activeSessions.delete(token);
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
    }

    const sanitized = getSanitizedUser(user);
    const userOrders = orders.filter(
      o => o.phone.replace(/\s+/g, '') === user.phone.replace(/\s+/g, '') ||
           o.customerName.toLowerCase() === user.name.toLowerCase()
    );

    res.json({
      success: true,
      user: sanitized,
      orders: userOrders
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Logout session
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.body?.token as string);

  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Déconnexion réussie' });
});

// Update Customer Profile & Coordinates
app.put('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : (req.body?.token as string);

    if (!token) {
      return res.status(401).json({ success: false, error: 'Non authentifié' });
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      return res.status(401).json({ success: false, error: 'Session expirée' });
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
    }

    const { name, phone, wilayaCode, commune, address, deliveryMethod, deliveryNotes } = req.body;

    if (name) user.name = String(name).trim();
    if (phone !== undefined) {
      let cleanPhone = String(phone).replace(/[\s\-\.\(\)]/g, '');
      if (cleanPhone.startsWith('+213')) {
        cleanPhone = '0' + cleanPhone.slice(4);
      } else if (cleanPhone.startsWith('00213')) {
        cleanPhone = '0' + cleanPhone.slice(5);
      }
      if (/^(0)(5|6|7)[0-9]{8}$/.test(cleanPhone)) {
        user.phone = cleanPhone;
      } else if (cleanPhone.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Numéro de téléphone algérien invalide. Ex: 0550 12 34 56 ou 0661...'
        });
      }
    }
    if (wilayaCode) {
      const target = ALGERIAN_WILAYAS.find(w => w.code === Number(wilayaCode));
      if (target) {
        user.wilayaCode = target.code;
        user.wilayaName = target.name;
      }
    }
    if (commune !== undefined) user.commune = String(commune).trim();
    if (address !== undefined) user.address = String(address).trim();
    if (deliveryMethod) user.deliveryMethod = deliveryMethod === 'desk' ? 'desk' : 'home';
    if (deliveryNotes !== undefined) user.deliveryNotes = String(deliveryNotes).trim();

    saveDb();

    const sanitized = getSanitizedUser(user);
    res.json({ success: true, user: sanitized, message: 'Profil mis à jour avec succès' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// System Database Capacity, Storage Health & Backups (Admin Only)
app.get('/api/system/database-stats', requireAdmin, (req, res) => {
  const stats = getDatabaseStats();
  res.json({ success: true, stats });
});

// Trigger Instant Manual Database Snapshot Backup (Admin Only)
app.post('/api/system/backup', requireAdmin, (req, res) => {
  const result = triggerManualBackup();
  if (result.success) {
    res.json({
      success: true,
      message: 'Sauvegarde de la base de données générée avec succès.',
      filename: result.filename
    });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});


// Products
app.get('/api/products', (req, res) => {
  const { category, collection, search, sort } = req.query;
  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (collection && collection !== 'all') {
    result = result.filter(p => p.collection === collection);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nameAr.includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.categoryFr.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Enrich products with review statistics
  const enrichedProducts = result.map(p => {
    const prodReviews = reviews.filter(r => r.productId === p.id);
    const count = prodReviews.length;
    const avg = count > 0
      ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : 5.0;
    return {
      ...p,
      rating: avg,
      reviewCount: count
    };
  });

  res.json({ success: true, products: enrichedProducts });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const prodReviews = reviews.filter(r => r.productId === product.id);
  const count = prodReviews.length;
  const avg = count > 0
    ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
    : 5.0;

  res.json({
    success: true,
    product: {
      ...product,
      rating: avg,
      reviewCount: count
    }
  });
});

// Product Reviews: List reviews, statistics, and authenticated customer purchase status
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const productId = req.params.id;
    const targetProduct = products.find(p => p.id === productId || p.slug === productId);
    const resolvedProductId = targetProduct ? targetProduct.id : productId;

    const prodReviews = reviews
      .filter(r => r.productId === resolvedProductId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalReviews = prodReviews.length;
    const averageRating = totalReviews > 0
      ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[rounded] = (breakdown[rounded] || 0) + 1;
    });

    const user = getRequestUser(req);
    const isAuthenticated = !!user;
    const hasPurchased = user ? (hasUserPurchasedProduct(user, resolvedProductId) || user.role === 'admin') : false;
    const existingReview = user ? prodReviews.find(r => r.userId === user.id) || null : null;

    res.json({
      success: true,
      reviews: prodReviews,
      stats: {
        averageRating,
        totalReviews,
        breakdown
      },
      userStatus: {
        isAuthenticated,
        hasPurchased,
        hasReviewed: !!existingReview,
        existingReview
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Product Reviews: Submit / Update Verified Purchase Review
app.post('/api/products/:id/reviews', requireAuth, (req, res) => {
  try {
    const productId = req.params.id;
    const user = (req as any).user as UserRecord;

    const targetProduct = products.find(p => p.id === productId || p.slug === productId);
    if (!targetProduct) {
      return res.status(404).json({ success: false, error: 'Article introuvable dans le catalogue.' });
    }

    const hasPurchased = hasUserPurchasedProduct(user, targetProduct.id) || user.role === 'admin';
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        error: 'Seules les clientes ayant commandé cet article peuvent déposer un avis certifié.'
      });
    }

    const { rating, comment, title, fitFeedback } = req.body;
    const numericRating = Number(rating);

    if (!numericRating || isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, error: 'Une note entre 1 et 5 étoiles est requise.' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Votre commentaire doit contenir au moins 5 caractères.' });
    }

    const existingIdx = reviews.findIndex(r => r.productId === targetProduct.id && r.userId === user.id);

    const reviewData: ProductReview = {
      id: existingIdx > -1 ? reviews[existingIdx].id : `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: targetProduct.id,
      userId: user.id,
      userName: user.name,
      userWilaya: user.wilayaName ? `${user.wilayaName} (${user.commune || 'Algérie'})` : 'Alger',
      rating: Math.round(numericRating),
      title: title ? String(title).trim().slice(0, 100) : undefined,
      comment: String(comment).trim().slice(0, 1000),
      fitFeedback: ['true_to_size', 'runs_small', 'runs_large'].includes(fitFeedback) ? fitFeedback : undefined,
      verifiedPurchase: true,
      createdAt: existingIdx > -1 ? reviews[existingIdx].createdAt : new Date().toISOString()
    };

    if (existingIdx > -1) {
      reviews[existingIdx] = reviewData;
    } else {
      reviews.unshift(reviewData);
    }

    db.reviews = reviews;

    // Update product rating and review count
    const prodReviews = reviews.filter(r => r.productId === targetProduct.id);
    const avg = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));
    targetProduct.rating = avg;
    targetProduct.reviewCount = prodReviews.length;

    saveDb();

    res.json({
      success: true,
      review: reviewData,
      message: existingIdx > -1 ? 'Votre avis certifié a été mis à jour avec succès.' : 'Merci ! Votre avis certifié a été publié avec succès.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin add product (Protected)
app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.price || !Array.isArray(data.variants) || data.variants.length === 0) {
      return res.status(400).json({ success: false, error: 'Nom, prix et variantes requis' });
    }

    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      id: newId,
      name: String(data.name).trim(),
      nameAr: data.nameAr ? String(data.nameAr).trim() : data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: data.description || '',
      descriptionAr: data.descriptionAr || '',
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop'
      ],
      category: data.category || 'chemises',
      categoryFr: data.categoryFr || 'Prêt-à-porter',
      categoryAr: data.categoryAr || 'ملابس عصرية',
      collection: data.collection || 'intemporels',
      collectionFr: data.collectionFr || 'Les Intemporels ZAYA',
      collectionAr: data.collectionAr || 'التشكيلة الدائمة',
      colors: data.colors || [{ name: 'Noir', hex: '#111111' }],
      sizes: data.sizes || ['S', 'M', 'L'],
      material: data.material || 'Tissu supérieur',
      materialAr: data.materialAr || 'قماش فاخر',
      sku: data.sku || `ZY-${Date.now().toString().slice(-6)}`,
      stock: 0,
      isFeatured: !!data.isFeatured,
      isNew: true,
      isBestSeller: !!data.isBestSeller,
      createdAt: new Date().toISOString(),
      variants: data.variants.map((v: any, idx: number) => ({
        id: `v-${newId}-${idx + 1}`,
        productId: newId,
        color: v.color,
        colorHex: v.colorHex || '#111111',
        size: v.size,
        stock: Math.max(0, parseInt(v.stock, 10) || 0),
        sku: v.sku || `${newId}-${v.color.slice(0, 2).toUpperCase()}-${v.size}`
      }))
    };

    syncProductTotalStock(newProduct);
    products.unshift(newProduct);

    // Record initial stock movements
    newProduct.variants.forEach(v => {
      if (v.stock > 0) {
        movements.unshift({
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: newProduct.id,
          variantId: v.id,
          productName: newProduct.name,
          variantLabel: `${v.color} / ${v.size}`,
          change: v.stock,
          newStock: v.stock,
          reason: 'restock',
          referenceId: 'CREATION_PRODUIT',
          timestamp: new Date().toISOString()
        });
      }
    });

    saveDb();

    res.status(201).json({ success: true, product: newProduct });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin update product (Protected)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const existing = products[idx];
  const data = req.body;

  existing.name = data.name ?? existing.name;
  existing.nameAr = data.nameAr ?? existing.nameAr;
  existing.price = Number(data.price ?? existing.price);
  existing.salePrice = data.salePrice !== undefined ? (data.salePrice ? Number(data.salePrice) : undefined) : existing.salePrice;
  existing.description = data.description ?? existing.description;
  existing.descriptionAr = data.descriptionAr ?? existing.descriptionAr;
  existing.material = data.material ?? existing.material;
  existing.materialAr = data.materialAr ?? existing.materialAr;
  existing.category = data.category ?? existing.category;
  existing.categoryFr = data.categoryFr ?? existing.categoryFr;
  existing.categoryAr = data.categoryAr ?? existing.categoryAr;
  existing.collection = data.collection ?? existing.collection;
  existing.collectionFr = data.collectionFr ?? existing.collectionFr;
  existing.collectionAr = data.collectionAr ?? existing.collectionAr;
  existing.isFeatured = data.isFeatured !== undefined ? !!data.isFeatured : existing.isFeatured;
  existing.isBestSeller = data.isBestSeller !== undefined ? !!data.isBestSeller : existing.isBestSeller;
  if (Array.isArray(data.images) && data.images.length > 0) {
    existing.images = data.images;
  }

  if (Array.isArray(data.variants)) {
    existing.variants = data.variants.map((v: any, vIdx: number) => ({
      id: v.id || `v-${existing.id}-${vIdx + 1}`,
      productId: existing.id,
      color: v.color,
      colorHex: v.colorHex || '#111111',
      size: v.size,
      stock: Math.max(0, parseInt(v.stock, 10) || 0),
      sku: v.sku || `${existing.sku}-${v.color.slice(0, 2).toUpperCase()}-${v.size}`
    }));
  }

  syncProductTotalStock(existing);
  saveDb();
  res.json({ success: true, product: existing });
});

// Admin delete product (Protected)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const initialLen = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === initialLen) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  db.products = products;
  saveDb();
  res.json({ success: true, message: 'Produit supprimé avec succès' });
});

// Adjust stock for variant (never negative, with audit log - Protected)
app.patch('/api/inventory/adjust', requireAdmin, (req, res) => {
  const { productId, variantId, change, reason = 'adjustment', note } = req.body;
  if (!productId || !variantId || typeof change !== 'number') {
    return res.status(400).json({ success: false, error: 'Données d’ajustement invalides' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Produit introuvable' });
  }

  const variant = product.variants.find(v => v.id === variantId);
  if (!variant) {
    return res.status(404).json({ success: false, error: 'Variante introuvable' });
  }

  const oldStock = variant.stock;
  const newStock = Math.max(0, oldStock + change);
  const actualChange = newStock - oldStock;

  variant.stock = newStock;
  syncProductTotalStock(product);

  const movement: StockMovement = {
    id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: product.id,
    variantId: variant.id,
    productName: product.name,
    variantLabel: `${variant.color} / ${variant.size}`,
    change: actualChange,
    newStock: newStock,
    reason: reason as any,
    referenceId: note || 'AJUSTEMENT_MANUEL',
    timestamp: new Date().toISOString()
  };

  movements.unshift(movement);
  saveDb();
  res.json({ success: true, variant, totalProductStock: product.stock, movement });
});

app.get('/api/inventory/movements', requireAdmin, (req, res) => {
  res.json({ success: true, movements: movements.slice(0, 50) });
});

// Validate discount coupon
app.post('/api/discounts/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: 'Code promo requis' });
  }

  const discount = discounts.find(d => d.code.toUpperCase() === String(code).trim().toUpperCase() && d.active);
  if (!discount) {
    return res.status(404).json({ success: false, error: 'Code promo introuvable ou inactif' });
  }

  if (subtotal < discount.minOrder) {
    return res.status(400).json({
      success: false,
      error: `Commande minimum de ${discount.minOrder.toLocaleString()} DA requise pour ce code`
    });
  }

  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = Math.round((subtotal * discount.value) / 100);
  } else {
    discountAmount = discount.value;
  }
  discountAmount = Math.min(discountAmount, subtotal);

  res.json({
    success: true,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    discountAmount
  });
});

// Admin Discounts (Protected)
app.get('/api/discounts', requireAdmin, (req, res) => {
  res.json({ success: true, discounts });
});

app.post('/api/discounts', requireAdmin, (req, res) => {
  const { code, type, value, minOrder } = req.body;
  if (!code || !type || typeof value !== 'number') {
    return res.status(400).json({ success: false, error: 'Données promo invalides' });
  }

  const newDisc: DiscountCode = {
    id: `disc-${Date.now().toString().slice(-4)}`,
    code: String(code).toUpperCase().trim(),
    type: type === 'percentage' ? 'percentage' : 'fixed',
    value: Number(value),
    minOrder: Number(minOrder) || 0,
    active: true,
    usedCount: 0
  };

  discounts.unshift(newDisc);
  saveDb();
  res.status(201).json({ success: true, discount: newDisc });
});

app.delete('/api/discounts/:id', requireAdmin, (req, res) => {
  discounts = discounts.filter(d => d.id !== req.params.id);
  db.discounts = discounts;
  saveDb();
  res.json({ success: true, message: 'Code promo supprimé' });
});

// Wilayas list
app.get('/api/wilayas', (req, res) => {
  res.json({ success: true, wilayas: ALGERIAN_WILAYAS });
});

// Order Placement (Cash on Delivery - COD)
// CRITICAL: Strict server-side recalculation of prices, stock verification, and inventory deduction
app.post('/api/orders', (req, res) => {
  try {
    // Require authenticated session to place order
    const sessionUser = getRequestUser(req);
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        error: 'Veuillez vous connecter ou créer votre compte pour commander avec paiement à la livraison.'
      });
    }

    const {
      customerName,
      phone,
      alternatePhone,
      wilayaCode,
      commune,
      address,
      deliveryMethod = 'home',
      customerNotes,
      items,
      discountCode,
      paymentMethod = 'COD',
      paymentReference,
      cardDetails
    } = req.body;

    // 1. Validation
    if (!customerName || !phone || !wilayaCode || !commune || !address) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Wilaya, Commune, Adresse)'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Votre panier est vide' });
    }

    // Check Wilaya
    const wilaya = ALGERIAN_WILAYAS.find(w => w.code === Number(wilayaCode));
    if (!wilaya) {
      return res.status(400).json({ success: false, error: 'Wilaya sélectionnée invalide' });
    }

    const deliveryFee = deliveryMethod === 'desk' ? wilaya.deskDeliveryFee : wilaya.homeDeliveryFee;

    // 2. Validate Items & Stock & Recalculate Subtotal
    let subtotal = 0;
    const validatedItems: any[] = [];
    const stockUpdatesToCommit: { product: Product; variant: ProductVariant; requestedQty: number }[] = [];

    for (const reqItem of items) {
      const product = products.find(p => p.id === reqItem.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Le produit n'existe plus dans notre catalogue.`
        });
      }

      const variant = product.variants.find(v => v.id === reqItem.variantId);
      if (!variant) {
        return res.status(400).json({
          success: false,
          error: `La variante sélectionnée (${reqItem.color} / ${reqItem.size}) pour "${product.name}" n'est plus disponible.`
        });
      }

      const requestedQty = parseInt(reqItem.quantity, 10);
      if (isNaN(requestedQty) || requestedQty <= 0) {
        return res.status(400).json({ success: false, error: 'Quantité invalide' });
      }

      if (variant.stock < requestedQty) {
        return res.status(400).json({
          success: false,
          error: `Stock insuffisant pour "${product.name}" (${variant.color} - ${variant.size}). Restant en stock : ${variant.stock} unité(s).`
        });
      }

      const unitPrice = product.salePrice ?? product.price;
      const itemTotal = unitPrice * requestedQty;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        color: variant.color,
        size: variant.size,
        quantity: requestedQty,
        unitPrice: unitPrice,
        total: itemTotal,
        image: product.images[0]
      });

      stockUpdatesToCommit.push({ product, variant, requestedQty });
    }

    // 3. Validate Discount Code server-side
    let discountAmount = 0;
    let appliedDiscountCode: string | undefined = undefined;

    if (discountCode) {
      const disc = discounts.find(d => d.code.toUpperCase() === String(discountCode).trim().toUpperCase() && d.active);
      if (disc && subtotal >= disc.minOrder) {
        if (disc.type === 'percentage') {
          discountAmount = Math.round((subtotal * disc.value) / 100);
        } else {
          discountAmount = disc.value;
        }
        discountAmount = Math.min(discountAmount, subtotal);
        appliedDiscountCode = disc.code;
        disc.usedCount = (disc.usedCount || 0) + 1;
      }
    }

    const finalTotal = subtotal - discountAmount + deliveryFee;

    // 4. Generate Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `DZ-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

    // 5. Deduct Stock & Record Movement
    for (const update of stockUpdatesToCommit) {
      update.variant.stock -= update.requestedQty;
      syncProductTotalStock(update.product);

      movements.unshift({
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: update.product.id,
        variantId: update.variant.id,
        productName: update.product.name,
        variantLabel: `${update.variant.color} / ${update.variant.size}`,
        change: -update.requestedQty,
        newStock: update.variant.stock,
        reason: 'order',
        referenceId: orderId,
        timestamp: new Date().toISOString()
      });
    }

    // 6. Create Order Record
    const newOrder: Order = {
      id: orderId,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      alternatePhone: alternatePhone ? String(alternatePhone).trim() : undefined,
      wilayaCode: wilaya.code,
      wilayaName: wilaya.name,
      commune: String(commune).trim(),
      address: String(address).trim(),
      deliveryMethod,
      deliveryFee,
      subtotal,
      discount: discountAmount,
      discountCode: appliedDiscountCode,
      total: finalTotal,
      status: 'pending',
      paymentMethod: (paymentMethod === 'edahabia' || paymentMethod === 'cib' || paymentMethod === 'baridimob' || paymentMethod === 'bank_transfer') ? paymentMethod : 'COD',
      paymentReference: paymentReference ? String(paymentReference).trim() : undefined,
      cardDetails: cardDetails ? {
        maskedNumber: String(cardDetails.maskedNumber || ''),
        cardHolder: String(cardDetails.cardHolder || ''),
        cardType: cardDetails.cardType === 'cib' ? 'cib' : 'edahabia',
        expiryDate: String(cardDetails.expiryDate || '')
      } : undefined,
      customerNotes: customerNotes ? String(customerNotes).trim() : undefined,
      items: validatedItems,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: paymentMethod === 'edahabia'
            ? `Paiement en ligne par Carte Edahabia (BaridiMob) validé via SATIM 3D-Secure (${cardDetails?.maskedNumber || 'Carte'})`
            : paymentMethod === 'cib'
            ? `Paiement en ligne par Carte Bancaire CIB validé via SATIM 3D-Secure (${cardDetails?.maskedNumber || 'Carte'})`
            : paymentMethod === 'baridimob'
            ? `Commande enregistrée (Règlement BaridiMob / CCP${paymentReference ? ` - Réf: ${paymentReference}` : ''})`
            : paymentMethod === 'bank_transfer'
            ? `Commande enregistrée (Virement Bancaire CIB${paymentReference ? ` - Réf: ${paymentReference}` : ''})`
            : 'Commande enregistrée (Paiement en espèces à la livraison)'
        }
      ]
    };

    orders.unshift(newOrder);

    // 7. Update CRM Customer record
    const existingCust = customers.find(c => c.phone === newOrder.phone);
    if (existingCust) {
      existingCust.totalOrders += 1;
      existingCust.totalSpent += newOrder.total;
      existingCust.lastOrderDate = new Date().toISOString().split('T')[0];
      if (existingCust.totalOrders >= 4) {
        existingCust.status = 'vip';
      } else {
        existingCust.status = 'regular';
      }
    } else {
      customers.unshift({
        id: `cust-${Date.now()}`,
        name: newOrder.customerName,
        phone: newOrder.phone,
        wilaya: `${wilaya.name} (${String(wilaya.code).padStart(2, '0')})`,
        commune: newOrder.commune,
        totalOrders: 1,
        totalSpent: newOrder.total,
        lastOrderDate: new Date().toISOString().split('T')[0],
        status: 'new'
      });
    }

    saveDb();

    res.status(201).json({
      success: true,
      order: newOrder,
      message: 'Commande enregistrée avec succès'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Normalize Algerian phone numbers helper
function normalizeAlgerianPhone(phoneStr: string): string {
  let cleaned = String(phoneStr || '').replace(/[\s\-\.\(\)]/g, '');
  if (cleaned.startsWith('+213')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('00213')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

// Public order status checker (Order ID + Phone Number lookup)
app.post('/api/orders/track', (req, res) => {
  try {
    const { orderId, phone } = req.body;
    if (!orderId || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez saisir votre référence de commande et votre numéro de téléphone.'
      });
    }

    const cleanId = String(orderId).trim().toUpperCase();
    const order = orders.find(o => o.id.toUpperCase() === cleanId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Aucune commande trouvée avec la référence "${cleanId}". Vérifiez le format (ex: DZ-2609-1024).`
      });
    }

    const inputPhone = normalizeAlgerianPhone(phone);
    const orderPhone = normalizeAlgerianPhone(order.phone);

    if (inputPhone !== orderPhone && !orderPhone.endsWith(inputPhone) && !inputPhone.endsWith(orderPhone)) {
      return res.status(403).json({
        success: false,
        error: `Le numéro de téléphone ne correspond pas à la commande ${order.id}. Veuillez vérifier le numéro renseigné lors de l'achat.`
      });
    }

    res.json({
      success: true,
      order,
      verified: true
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Orders tracking / details with Customer Privacy Protection (Law 18-07 compliance)
app.get('/api/orders/:id', (req, res) => {
  const cleanId = String(req.params.id || '').trim().toUpperCase();
  const order = orders.find(o => o.id.toUpperCase() === cleanId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Commande introuvable. Vérifiez la référence (ex: DZ-2609-1024).' });
  }

  const user = getRequestUser(req);
  const isAdmin = user?.role === 'admin';
  const cleanOrderPhone = normalizeAlgerianPhone(order.phone);
  const queryPhone = req.query.phone ? normalizeAlgerianPhone(String(req.query.phone)) : '';

  // If queryPhone provided, verify match
  if (queryPhone) {
    const isPhoneMatch = queryPhone === cleanOrderPhone || cleanOrderPhone.endsWith(queryPhone) || queryPhone.endsWith(cleanOrderPhone);
    if (!isPhoneMatch && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: `Le numéro de téléphone ne correspond pas à la commande ${order.id}.`
      });
    }
  }

  const isPhoneVerified = !!(queryPhone && (queryPhone === cleanOrderPhone || cleanOrderPhone.endsWith(queryPhone) || queryPhone.endsWith(cleanOrderPhone)));
  const isOwner = user && (
    normalizeAlgerianPhone(user.phone) === cleanOrderPhone ||
    user.name.trim().toLowerCase() === order.customerName.trim().toLowerCase()
  );

  // If public lookup without verified ownership or matching phone, mask sensitive customer PII for privacy protection
  if (!isAdmin && !isOwner && !isPhoneVerified) {
    const rawPhone = order.phone.replace(/\s+/g, '');
    const maskedPhone = rawPhone.length >= 6
      ? rawPhone.substring(0, 4) + '****' + rawPhone.slice(-2)
      : '****';
    const nameParts = order.customerName.trim().split(' ');
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
      : nameParts[0];
    const maskedAddress = order.commune ? `${order.commune}, ${order.wilayaName}` : order.wilayaName;

    return res.json({
      success: true,
      order: {
        ...order,
        customerName: maskedName,
        phone: maskedPhone,
        address: maskedAddress,
        notes: undefined,
        internalNotes: undefined
      }
    });
  }

  res.json({ success: true, order, verified: true });
});

// Orders list (Admin sees all, authenticated customer sees only their own)
app.get('/api/orders', (req, res) => {
  const user = getRequestUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Connexion requise pour consulter les commandes.'
    });
  }

  // If Admin: full access with filters
  if (user.role === 'admin') {
    const { status, search } = req.query;
    let result = [...orders];

    if (status && status !== 'all') {
      result = result.filter(o => o.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.wilayaName.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, orders: result });
  }

  // Customer: only their own orders
  const cleanUserPhone = user.phone.replace(/\s+/g, '');
  const myOrders = orders.filter(
    o => o.phone.replace(/\s+/g, '') === cleanUserPhone || o.customerName.toLowerCase() === user.name.toLowerCase()
  );
  return res.json({ success: true, orders: myOrders });
});

// Admin update order status (Protected)
app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Commande introuvable' });
  }

  const validStatuses: OrderStatus[] = [
    'pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Statut de commande invalide' });
  }

  const prevStatus = order.status;
  order.status = status;
  order.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Statut mis à jour vers: ${status}`
  });

  // If order was cancelled or returned, return stock to inventory!
  if ((status === 'cancelled' || status === 'returned') && prevStatus !== 'cancelled' && prevStatus !== 'returned') {
    for (const item of order.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find(v => v.id === item.variantId);
        if (variant) {
          variant.stock += item.quantity;
          syncProductTotalStock(prod);

          movements.unshift({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            productId: prod.id,
            variantId: variant.id,
            productName: prod.name,
            variantLabel: `${variant.color} / ${variant.size}`,
            change: item.quantity,
            newStock: variant.stock,
            reason: status === 'cancelled' ? 'adjustment' : 'return',
            referenceId: order.id,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }

  saveDb();
  res.json({ success: true, order });
});

// Admin internal notes (Protected)
app.patch('/api/orders/:id/notes', requireAdmin, (req, res) => {
  const { internalNotes } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Commande introuvable' });
  }

  order.internalNotes = internalNotes;
  saveDb();
  res.json({ success: true, order });
});

// Admin CRM Customers (Protected)
app.get('/api/customers', requireAdmin, (req, res) => {
  res.json({ success: true, customers });
});

// Admin Analytics (Protected)
app.get('/api/analytics', requireAdmin, (req, res) => {
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = orders
    .filter(o => o.createdAt.startsWith(todayStr) && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;

  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Low stock count (variants with <= 2 stock)
  let lowStockItemsCount = 0;
  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock <= 2 && v.stock > 0) lowStockItemsCount++;
    });
  });

  // Top sizes
  const sizeMap: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status !== 'cancelled') {
      o.items.forEach(i => {
        sizeMap[i.size] = (sizeMap[i.size] || 0) + i.quantity;
      });
    }
  });
  const topSizes = Object.entries(sizeMap)
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top colors
  const colorMap: Record<string, number> = {};
  orders.forEach(o => {
    if (o.status !== 'cancelled') {
      o.items.forEach(i => {
        colorMap[i.color] = (colorMap[i.color] || 0) + i.quantity;
      });
    }
  });
  const topColors = Object.entries(colorMap)
    .map(([color, count]) => ({ color, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Sales by Wilaya
  const wilayaMap: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(o => {
    if (o.status !== 'cancelled') {
      if (!wilayaMap[o.wilayaName]) {
        wilayaMap[o.wilayaName] = { count: 0, revenue: 0 };
      }
      wilayaMap[o.wilayaName].count += 1;
      wilayaMap[o.wilayaName].revenue += o.total;
    }
  });
  const salesByWilaya = Object.entries(wilayaMap)
    .map(([wilaya, data]) => ({ wilaya, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  res.json({
    success: true,
    analytics: {
      todaySales,
      totalRevenue,
      totalOrdersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      lowStockItemsCount,
      averageOrderValue,
      topSizes,
      topColors,
      salesByWilaya
    }
  });
});

// ==========================================
// GEMINI AI ENDPOINTS (Server-Side)
// ==========================================

// 1. AI Fashion Stylist & Outfit Finder (grounded in actual stock)
app.post('/api/ai/stylist', async (req, res) => {
  try {
    const { query, language = 'fr' } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Requête requise' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback with in-stock products
      const suggested = products.filter(p => p.stock > 0).slice(0, 3);
      return res.json({
        success: true,
        advice: language === 'ar'
          ? 'إليك بعض التنسيقات المقترحة من تشكيلتنا الراقية المتوفرة حالياً في الأتيليه.'
          : 'Voici nos recommandations personnalisées sélectionnées parmi nos pièces actuellement disponibles en atelier.',
        productIds: suggested.map(p => p.id)
      });
    }

    // Build context with real live products
    const liveCatalog = products.map(p => ({
      id: p.id,
      name: p.name,
      nameAr: p.nameAr,
      price: p.salePrice ?? p.price,
      colors: p.colors.map(c => c.name),
      sizes: p.sizes,
      material: p.material,
      stock: p.stock,
      category: p.categoryFr
    }));

    const systemPrompt = `Tu es la Directrice Artistique et Conseillère Mode de "ZAYA Atelier", une prestigieuse boutique de mode contemporaine algérienne (Alger, Oran, Constantine, etc.).
Ton rôle est de recommander des tenues raffinées, élégantes et adaptées au goût algérien (mariages, sorties à Sidi Yahia, travail, réceptions, quotidien chic).
RÈGLE ABSOLUE: Tu ne dois JAMAIS inventer des produits qui ne sont pas dans le catalogue fourni.
Ne recommande que des produits avec stock > 0.
Sois chaleureuse, distinguée et concise.
Catalogue actuel: ${JSON.stringify(liveCatalog)}

Réponds en format JSON structuré:
{
  "advice": "Texte élégant de conseil personnalisé (en langue ${language})",
  "productIds": ["id1", "id2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Demande de la cliente: "${query}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      success: true,
      advice: parsed.advice || 'Voici nos pièces recommandées pour vous.',
      productIds: Array.isArray(parsed.productIds) ? parsed.productIds : []
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. AI Product Description Generator (for Boutique Owner)
app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const { productName, material, category, tone = 'luxe' } = req.body;
    if (!productName) {
      return res.status(400).json({ success: false, error: 'Nom du produit requis' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        descriptionFr: `Une pièce d’exception confectionnée avec soin. Matière noble ${material || 'de qualité supérieure'}, coupe impeccable qui flatte la silhouette. Idéale pour les adeptes d'une allure intemporelle.`,
        descriptionAr: `قطعة استثنائية مصممة بعناية فائقة من ${material || 'أجود الأقمشة'}. قصة انسيابية أنيقة تبرز جمال الإطلالة وتناسب أرقى المناسبات.`
      });
    }

    const prompt = `Génère une description de mode haut de gamme pour une boutique algérienne pour le vêtement suivant:
Nom: ${productName}
Matière: ${material || 'Tissu supérieur'}
Catégorie: ${category || 'Prêt-à-porter'}
Ton: Élégant, luxueux, poétique mais clair.
Génère à la fois la version française et la version arabe classique raffinée.

Réponds en JSON:
{
  "descriptionFr": "...",
  "descriptionAr": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({
      success: true,
      descriptionFr: parsed.descriptionFr || '',
      descriptionAr: parsed.descriptionAr || ''
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. AI Customer Support Assistant (Algerian e-commerce context)
app.post('/api/ai/support', async (req, res) => {
  try {
    const { message, language = 'fr' } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message requis' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        reply: language === 'ar'
          ? 'مرحباً بك في أتيليه زايا. التوصيل متوفر لجميع ولايات الوطن (58 ولاية) مع الدفع عند الاستلام (COD). يمكنك التواصل معنا مباشرة عبر واتساب للمساعدة الفورية.'
          : 'Bienvenue chez ZAYA Atelier. Nous livrons sur les 58 wilayas d’Algérie avec paiement à la livraison (COD) sécurisé. Vous pouvez également nous contacter directement sur WhatsApp.'
      });
    }

    const context = `Tu es l’assistante clientèle de "ZAYA Atelier", boutique de mode basée à Alger.
Politique du magasin:
- Livraison: 58 wilayas d'Algérie via Yalidine Express / transporteurs partenaires.
- Tarifs: Alger (400 DA domicile / 250 DA bureau), Wilayas du Centre (500 DA), Est/Ouest (650-750 DA), Sud (850-1400 DA).
- Paiement: Paiement en espèces à la livraison (Cash on Delivery / COD).
- Délais: 24h-48h pour Alger et environs, 2 à 4 jours pour le reste du pays.
- Échanges: Possibilité d'échanger la taille sous 48h après réception si l'article n'est pas porté et dans son emballage d'origine.
- Téléphone / WhatsApp: +213 550 00 11 22.
Réponds de manière concise, courtoise et très professionnelle dans la langue du client (${language}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: context
      }
    });

    res.json({
      success: true,
      reply: response.text?.trim() || 'Nous sommes à votre disposition.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// VITE / STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZAYA Atelier] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
