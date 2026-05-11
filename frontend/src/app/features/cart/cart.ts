import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);

  pickupTime = signal<string>('');
  couponInput = signal<string>('');
  pickupTimeError = signal<string | null>(null);

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
    const time = this.pickupTime();
    if (!time) {
      this.pickupTimeError.set('La hora de recogida es obligatoria.');
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 12 * 60; // 12:00
    const maxMinutes = 22 * 60; // 22:00

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      this.pickupTimeError.set('El horario de recogida es de 12:00 PM a 10:00 PM.');
      return false;
    }

    this.pickupTimeError.set(null);
    return true;
  }

  confirmOrder() {
    if (this.cartService.items().length === 0) return;
    
    if (!this.validatePickupTime()) {
      return;
    }

    this.generateOrderFile();
  }

  private generateOrderFile() {
    const items = this.cartService.items();
    const subtotal = this.cartService.subtotal();
    const discount = this.cartService.discount();
    const total = this.cartService.total();
    const time = this.pickupTime();
    const coupon = this.cartService.getAppliedCoupon()();

    let content = `GASTROPRO - ORDEN DE COMPRA\n`;
    content += `=====================================\n`;
    content += `Fecha: ${new Date().toLocaleDateString()}\n`;
    content += `Hora de recogida: ${time}\n`;
    content += `-------------------------------------\n\n`;
    
    content += `DETALLE:\n`;
    items.forEach(item => {
      content += `- ${item.dish.name} (x${item.quantity}) - $${item.subtotal.toFixed(2)}\n`;
    });

    content += `\n-------------------------------------\n`;
    content += `Subtotal: $${subtotal.toFixed(2)}\n`;
    if (discount > 0) {
      content += `Descuento (${coupon}): -$${discount.toFixed(2)}\n`;
    }
    content += `TOTAL A PAGAR: $${total.toFixed(2)}\n`;
    content += `=====================================\n`;
    content += `¡Gracias por su preferencia!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orden_${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    // Opcional: Limpiar carrito después de descargar
    if (confirm('¿Desea limpiar el carrito después de descargar la orden?')) {
      this.cartService.clearCart();
      this.pickupTime.set('');
      this.removeCoupon();
    }
  }
}

