import { CartItem } from './cart-item';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  pickupTime: string; // HH:mm
  couponCode: string | null;
  createdAt: string; // ISO string
}
