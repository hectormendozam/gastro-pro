import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart-item';
import { Order } from '../interfaces/order';

export interface CreateOrderInput {
  items: CartItem[];
  pickupTime: string;
  couponCode?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly STORAGE_KEY = 'gastropro_orders';
  private readonly ordersSignal = signal<Order[]>(this.loadOrders());

  readonly orders = this.ordersSignal.asReadonly();
  readonly orderCount = computed(() => this.ordersSignal().length);

  createOrder(input: CreateOrderInput): Order {
    const normalizedCoupon = input.couponCode?.trim().toUpperCase() || null;
    const subtotal = this.calculateSubtotal(input.items);
    const discount = this.calculateDiscount(subtotal, normalizedCoupon);
    const total = subtotal - discount;

    const order: Order = {
      id: crypto.randomUUID(),
      items: this.cloneItems(input.items),
      subtotal,
      discount,
      total,
      pickupTime: input.pickupTime,
      couponCode: normalizedCoupon,
      createdAt: new Date().toISOString(),
    };

    this.ordersSignal.update((orders) => [...orders, order]);
    this.persistOrders();

    return order;
  }

  validatePickupTime(time: string): string | null {
    if (!time) {
      return 'La hora de recogida es obligatoria.';
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return 'La hora de recogida no es válida.';
    }

    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 12 * 60;
    const maxMinutes = 22 * 60;

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return 'El horario de recogida es de 12:00 PM a 10:00 PM.';
    }

    return null;
  }

  buildReceipt(order: Order): string {
    let content = `GASTROPRO - ORDEN DE COMPRA\n`;
    content += `=====================================\n`;
    content += `Orden: ${order.id}\n`;
    content += `Fecha: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    content += `Hora de recogida: ${order.pickupTime}\n`;
    content += `-------------------------------------\n\n`;

    content += `DETALLE:\n`;
    order.items.forEach((item) => {
      content += `- ${item.dish.name} (x${item.quantity}) - $${item.subtotal.toFixed(2)}\n`;
    });

    content += `\n-------------------------------------\n`;
    content += `Subtotal: $${order.subtotal.toFixed(2)}\n`;
    if (order.discount > 0 && order.couponCode) {
      content += `Descuento (${order.couponCode}): -$${order.discount.toFixed(2)}\n`;
    }
    content += `TOTAL A PAGAR: $${order.total.toFixed(2)}\n`;
    content += `=====================================\n`;
    content += `¡Gracias por su preferencia!`;

    return content;
  }

  downloadReceipt(order: Order): void {
    const blob = new Blob([this.buildReceipt(order)], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `orden_${order.id}.txt`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  clearOrders(): void {
    this.ordersSignal.set([]);
    this.persistOrders();
  }

  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.subtotal, 0);
  }

  private calculateDiscount(subtotal: number, couponCode: string | null): number {
    if (couponCode === 'DESCUENTO10') {
      return subtotal * 0.1;
    }

    return 0;
  }

  private cloneItems(items: CartItem[]): CartItem[] {
    return items.map((item) => ({
      dish: { ...item.dish },
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));
  }

  private loadOrders(): Order[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as Order[];
    } catch {
      return [];
    }
  }

  private persistOrders(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ordersSignal()));
  }
}
