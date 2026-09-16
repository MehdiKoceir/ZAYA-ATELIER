export type Language = 'fr' | 'ar' | 'en';

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number; // in DA
  salePrice?: number; // in DA
  images: string[];
  category: string;
  categoryFr: string;
  categoryAr: string;
  collection: string;
  collectionFr: string;
  collectionAr: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  material: string;
  materialAr: string;
  sku: string;
  stock: number; // sum of variant stocks
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
  createdAt: string;
}

export interface Wilaya {
  code: number;
  name: string;
  nameAr: string;
  zone: 'capital' | 'central' | 'east' | 'west' | 'south' | 'deep_south';
  homeDeliveryFee: number; // DA
  deskDeliveryFee: number; // DA (Stop desk / Yalidine / Bureau)
  deliveryDays: string;
  communes: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  color: string;
  colorHex?: string;
  size: string;
  quantity: number;
  unitPrice: number;
  price?: number;
  image: string;
  maxStock?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. DZ-2609-1024
  customerName: string;
  phone: string;
  alternatePhone?: string;
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  address: string;
  deliveryMethod: 'home' | 'desk';
  deliveryFee: number;
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
  status: OrderStatus;
  paymentMethod: 'COD' | 'baridimob' | 'bank_transfer' | 'edahabia' | 'cib';
  cardDetails?: {
    maskedNumber: string;
    cardHolder: string;
    cardType: 'edahabia' | 'cib';
    expiryDate: string;
  };
  paymentReference?: string;
  customerNotes?: string;
  internalNotes?: string;
  items: OrderItem[];
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

export interface CustomerCRM {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'new' | 'regular' | 'vip';
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 (%) or 1000 (DA)
  minOrder: number; // DA
  active: boolean;
  usageLimit?: number;
  usedCount: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  change: number; // e.g. -1 or +5
  newStock: number;
  reason: 'order' | 'restock' | 'adjustment' | 'return';
  referenceId?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  todaySales: number;
  totalRevenue: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
  lowStockItemsCount: number;
  averageOrderValue: number;
  topSizes: { size: string; count: number }[];
  topColors: { color: string; count: number }[];
  salesByWilaya: { wilaya: string; count: number; revenue: number }[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  address: string;
  deliveryMethod?: 'home' | 'desk';
  deliveryNotes?: string;
  role?: 'customer' | 'admin';
  loyaltyTier?: 'Membre' | 'Privilège' | 'VIP Atelier';
  ordersCount?: number;
  totalSpent?: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserAccount;
  orders?: Order[];
  error?: string;
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  wilayaCode: number;
  wilayaName?: string;
  commune: string;
  address: string;
  deliveryMethod?: 'home' | 'desk';
}

