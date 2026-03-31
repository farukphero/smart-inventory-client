// lib/mockData.ts
import { Product, Category, Order, Activity, User, DashboardStats } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Admin&background=6366f1&color=fff'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: 'manager',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Manager&background=10b981&color=fff'
  }
]

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', color: '#6366f1', icon: '📱', productCount: 8 },
  { id: '2', name: 'Clothing', color: '#f59e0b', icon: '👕', productCount: 6 },
  { id: '3', name: 'Groceries', color: '#10b981', icon: '🍎', productCount: 12 },
  { id: '4', name: 'Furniture', color: '#ef4444', icon: '🪑', productCount: 4 },
  { id: '5', name: 'Books', color: '#8b5cf6', icon: '📚', productCount: 9 },
  { id: '6', name: 'Beauty', color: '#ec4899', icon: '💄', productCount: 5 }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    category: 'Electronics',
    categoryId: '1',
    price: 999,
    stockQuantity: 3,
    minStockThreshold: 5,
    status: 'Low Stock',
    sku: 'EL-IP14-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    category: 'Electronics',
    categoryId: '1',
    price: 899,
    stockQuantity: 2,
    minStockThreshold: 5,
    status: 'Low Stock',
    sku: 'EL-SG23-002',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    category: 'Electronics',
    categoryId: '1',
    price: 1999,
    stockQuantity: 0,
    minStockThreshold: 3,
    status: 'Out of Stock',
    sku: 'EL-MBP-003',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'Nike Air Max',
    category: 'Clothing',
    categoryId: '2',
    price: 120,
    stockQuantity: 25,
    minStockThreshold: 10,
    status: 'Active',
    sku: 'CL-NAM-004',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '5',
    name: 'Organic Apples',
    category: 'Groceries',
    categoryId: '3',
    price: 5.99,
    stockQuantity: 8,
    minStockThreshold: 15,
    status: 'Low Stock',
    sku: 'GR-OAP-005',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    categoryId: '1',
    price: 349,
    stockQuantity: 12,
    minStockThreshold: 5,
    status: 'Active',
    sku: 'EL-SON-006',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '7',
    name: 'Leather Sofa',
    category: 'Furniture',
    categoryId: '4',
    price: 899,
    stockQuantity: 2,
    minStockThreshold: 3,
    status: 'Low Stock',
    sku: 'FN-LSF-007',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '8',
    name: 'The Great Gatsby',
    category: 'Books',
    categoryId: '5',
    price: 14.99,
    stockQuantity: 50,
    minStockThreshold: 10,
    status: 'Active',
    sku: 'BK-GG-008',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '9',
    name: 'Lipstick Set',
    category: 'Beauty',
    categoryId: '6',
    price: 29.99,
    stockQuantity: 4,
    minStockThreshold: 8,
    status: 'Low Stock',
    sku: 'BT-LS-009',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '10',
    name: 'iPad Air',
    category: 'Electronics',
    categoryId: '1',
    price: 599,
    stockQuantity: 7,
    minStockThreshold: 4,
    status: 'Active',
    sku: 'EL-IPA-010',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  }
]

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    customerPhone: '+1 234 567 8901',
    items: [
      { productId: '1', productName: 'iPhone 14 Pro', quantity: 1, price: 999, total: 999 },
      { productId: '6', productName: 'Sony WH-1000XM5', quantity: 1, price: 349, total: 349 }
    ],
    totalPrice: 1348,
    status: 'Delivered',
    paymentStatus: 'Paid',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    customerPhone: '+1 234 567 8902',
    items: [
      { productId: '4', productName: 'Nike Air Max', quantity: 2, price: 120, total: 240 }
    ],
    totalPrice: 240,
    status: 'Shipped',
    paymentStatus: 'Paid',
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-17')
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'James Lee',
    customerEmail: 'james@example.com',
    customerPhone: '+1 234 567 8903',
    items: [
      { productId: '5', productName: 'Organic Apples', quantity: 3, price: 5.99, total: 17.97 },
      { productId: '2', productName: 'Samsung Galaxy S23', quantity: 1, price: 899, total: 899 }
    ],
    totalPrice: 916.97,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    createdAt: new Date('2024-03-17'),
    updatedAt: new Date('2024-03-17')
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Sophia Martinez',
    customerEmail: 'sophia@example.com',
    customerPhone: '+1 234 567 8904',
    items: [
      { productId: '7', productName: 'Leather Sofa', quantity: 1, price: 899, total: 899 }
    ],
    totalPrice: 899,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Oliver Chen',
    customerEmail: 'oliver@example.com',
    customerPhone: '+1 234 567 8905',
    items: [
      { productId: '8', productName: 'The Great Gatsby', quantity: 1, price: 14.99, total: 14.99 },
      { productId: '9', productName: 'Lipstick Set', quantity: 2, price: 29.99, total: 59.98 }
    ],
    totalPrice: 74.97,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-16')
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Isabella Garcia',
    customerEmail: 'isabella@example.com',
    customerPhone: '+1 234 567 8906',
    items: [
      { productId: '10', productName: 'iPad Air', quantity: 1, price: 599, total: 599 },
      { productId: '3', productName: 'MacBook Pro M3', quantity: 1, price: 1999, total: 1999 }
    ],
    totalPrice: 2598,
    status: 'Delivered',
    paymentStatus: 'Paid',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-13')
  }
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    action: 'Order Created',
    details: 'Order ORD-2024-003 created by John Admin',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-17T10:30:00')
  },
  {
    id: '2',
    action: 'Stock Updated',
    details: 'iPhone 14 Pro stock decreased to 3 units',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-17T09:15:00')
  },
  {
    id: '3',
    action: 'Product Added',
    details: 'New product "iPad Air" added to inventory',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-16T14:20:00')
  },
  {
    id: '4',
    action: 'Order Status Updated',
    details: 'Order ORD-2024-001 marked as Delivered',
    userId: '2',
    userName: 'Sarah Manager',
    createdAt: new Date('2024-03-16T11:45:00')
  },
  {
    id: '5',
    action: 'Low Stock Alert',
    details: 'iPhone 14 Pro added to restock queue (3 left)',
    userId: '2',
    userName: 'Sarah Manager',
    createdAt: new Date('2024-03-15T16:30:00')
  },
  {
    id: '6',
    action: 'Order Cancelled',
    details: 'Order ORD-2024-005 cancelled, stock restored',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-15T13:00:00')
  },
  {
    id: '7',
    action: 'Stock Alert',
    details: 'Samsung Galaxy S23 running low (2 left)',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-14T10:00:00')
  },
  {
    id: '8',
    action: 'Product Updated',
    details: 'Price updated for Sony WH-1000XM5',
    userId: '1',
    userName: 'John Admin',
    createdAt: new Date('2024-03-13T15:20:00')
  }
]

export const getDashboardStats = (): DashboardStats => {
  const totalRevenue = mockOrders.reduce((sum, order) =>
    order.status !== 'Cancelled' ? sum + order.totalPrice : sum, 0
  )

  const totalOrders = mockOrders.length
  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length
  const lowStockCount = mockProducts.filter(p => p.status === 'Low Stock').length
  const totalProducts = mockProducts.length

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    lowStockCount,
    pendingOrders,
    revenueChange: 12.5,
    ordersChange: 8.2
  }
}
