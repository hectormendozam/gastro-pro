import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
  // Inyección de dependencias moderna de Angular
  private http = inject(HttpClient);

  // URL conectada al contenedor expuesto en tu docker-compose
  private readonly API_URL = 'http://localhost:3001/api/orders';

  private readonly STORAGE_KEY = 'gastropro_orders';
  private readonly ordersSignal = signal<Order[]>(this.loadOrders());

  readonly orders = this.ordersSignal.asReadonly();
  readonly orderCount = computed(() => this.ordersSignal().length);

  /**
   * Obtiene el historial persistido desde la base de datos a través del microservicio.
   */
  fetchOrders(): Observable<{success: boolean, count: number, data: Order[]}> {
    return this.http.get<{success: boolean, count: number, data: Order[]}>(this.API_URL).pipe(
      tap((response) => {
        if (response.success) {
          this.ordersSignal.set(response.data);
        }
      })
    );
  }

  /**
   * Mapea el carrito al contrato de datos del backend y delega la creación.
   */
  createOrder(input: CreateOrderInput): Observable<{success: boolean, data: Order, message: string}> {
    const normalizedCoupon = input.couponCode?.trim().toUpperCase() || null;
    const payload = {
      items: input.items.map(item => ({
        dishId: item.dish.id,
        name: item.dish.name,
        price: item.dish.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      pickupTime: input.pickupTime,
      couponCode: normalizedCoupon
    };

    return this.http.post<{success: boolean, data: Order, message: string}>(this.API_URL, payload).pipe(
      // Usamos tap para interceptar la respuesta exitosa y actualizar la señal reactiva
      tap((response) => {
        if (response.success) {
          this.ordersSignal.update((orders) => [response.data, ...orders]);
        }
      })
    );
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

  // Se ajusta la interfaz temporalmente a 'any' o puedes modificar tu interface 'Order'
  // para que coincida con lo que escupe Mongoose (usando orderNumber en lugar de id).
  buildReceipt(order: any): string {
    let content = `GASTROPRO - ORDEN DE COMPRA\n`;
    content += `=====================================\n`;
    content += `Orden: ${order.orderNumber || order.id}\n`;
    content += `Fecha: ${new Date(order.createdAt).toLocaleDateString()}\n`;
    content += `Hora de recogida: ${order.pickupTime}\n`;
    content += `-------------------------------------\n\n`;

    content += `DETALLE:\n`;
    order.items.forEach((item: any) => {
      // El backend ahora devuelve { name, quantity, subtotal } plano, sin el anidamiento de 'dish'
      const itemName = item.name || (item.dish && item.dish.name);
      content += `- ${itemName} (x${item.quantity}) - $${item.subtotal.toFixed(2)}\n`;
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

  downloadReceipt(order: any): void {
    const blob = new Blob([this.buildReceipt(order)], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `orden_${order.orderNumber || order.id}.txt`;
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
