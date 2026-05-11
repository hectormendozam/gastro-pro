import { CartItem } from './cart-item';

export interface Order {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  pickupTime: string; // HH:mm
  date: string; // ISO string
}
