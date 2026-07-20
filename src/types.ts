export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Dress' | 'Dive' | 'Chronograph';
  price: number;
  description: string;
  movementType: 'Automatic' | 'Quartz' | 'Manual';
  caseMaterial: string;
  strapMaterial: string;
  waterResistance: string;
  warrantyPeriod: string;
  stockCount: number;
  images: string[];
  featured?: boolean;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  savedAddresses: Address[];
  isAdmin?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId?: string; // empty for guest checkout
  guestEmail?: string;
  items: {
    productId: string;
    productName: string;
    productBrand: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: Address;
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
