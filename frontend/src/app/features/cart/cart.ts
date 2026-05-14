import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/interfaces/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  private orderService = inject(OrderService);

  pickupTime = signal<string>('');
  couponInput = signal<string>('');
  pickupTimeError = signal<string | null>(null);
  lastOrder = signal<Order | null>(null);

  updateQuantity(dishId: number, quantity: number) {
    this.cartService.updateQuantity(dishId, quantity);
  }

  applyCoupon() {
    const code = this.couponInput().trim();
    if (code) {
      if (code.toUpperCase() === 'DESCUENTO10') {
        this.cartService.applyCoupon(code.toUpperCase());
        this.couponInput.set(''); 
      } else {
        alert('El cupón ingresado no es válido.');
      }
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
  }

  validatePickupTime(): boolean {
    const error = this.orderService.validatePickupTime(this.pickupTime());
    this.pickupTimeError.set(error);
    return !error;
  }

  confirmOrder() {
    if (this.cartService.items().length === 0) return;
    
    if (!this.validatePickupTime()) {
      return;
    }

    const order = this.orderService.createOrder({
      items: this.cartService.items(),
      pickupTime: this.pickupTime(),
      couponCode: this.cartService.appliedCoupon(),
    });

    this.orderService.downloadReceipt(order);
    this.lastOrder.set(order);
    this.cartService.clearCart();
    this.pickupTime.set('');
    this.removeCoupon();
  }
}
