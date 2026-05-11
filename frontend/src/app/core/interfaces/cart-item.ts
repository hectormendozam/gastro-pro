import { Dish } from './dish';

export interface CartItem {
  dish: Dish;
  quantity: number;
  subtotal: number;
}
