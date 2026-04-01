// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  productCount: number;
}

export interface Product {
  id: string;
  productName: string;
  category: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: 'Active' | 'Out of Stock' | 'Low Stock';
  sku: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  action: string;
  details: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  revenueChange: number;
  ordersChange: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type FormValues = {
  fullName?: string;
  email: string;
  password: string;
};
