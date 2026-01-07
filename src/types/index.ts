// src/types/index.ts

export interface User {
  id: number
  username: string
  email: string
  password?: string
  role?: string
}

export interface Notification {
  id: number
  message: string
  time: string
  read: boolean
  type: 'order' | 'stock' | 'report' | 'customer'
}

export interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_avatar?: string
  created_at: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  user_id: number
  payment_method: string
  payment_status: 'paid' | 'unpaid' | 'refunded'
  shipping_address: string
  items: any[]
}

export interface Product {
  id: number
  name: string
  stock: number
  price: number
  image_url?: string
  description: string
  category?: string
  category_id: number
  sizes: string[]
  is_featured: boolean
  discount_percent: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginData {
  username: string
  email: string
  password: string
}
