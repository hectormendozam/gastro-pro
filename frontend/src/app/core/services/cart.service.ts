import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../interfaces/cart-item';
import { Dish } from '../interfaces/dish';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private couponCode = signal<string | null>(null);

  // Computados
  readonly items = this.cartItems.asReadonly();
  
  readonly subtotal = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.subtotal, 0)
  );

  readonly discount = computed(() => {
    const code = this.couponCode();
    if (code && code.toUpperCase() === 'DESCUENTO10') {
      return this.subtotal() * 0.10;
    }
    return 0;
  });

  readonly total = computed(() => this.subtotal() - this.discount());

  addToCart(dish: Dish) {
    this.cartItems.update((items) => {
      const existingItem = items.find((item) => item.dish.id === dish.id);
      if (existingItem) {
        // Si ya existe, incrementamos cantidad
        return items.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.dish.price }
            : item
        );
      } else {
        // Si no existe, agregamos nuevo item
        return [...items, { dish, quantity: 1, subtotal: dish.price }];
      }
    });
  }

  removeFromCart(dishId: number) {
    this.cartItems.update((items) => items.filter((item) => item.dish.id !== dishId));
  }

  updateQuantity(dishId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(dishId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) =>
        item.dish.id === dishId
          ? { ...item, quantity, subtotal: quantity * item.dish.price }
          : item
      )
    );
  }

  applyCoupon(code: string) {
    this.couponCode.set(code);
  }

  removeCoupon() {
    this.couponCode.set(null);
  }
  
  getAppliedCoupon() {
    return this.couponCode;
  }

  clearCart() {
    this.cartItems.set([]);
    this.couponCode.set(null);
  }
}
