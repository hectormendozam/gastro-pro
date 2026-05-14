import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
    localStorage.clear();
  });

  it('should validate pickup time within restaurant hours', () => {
    expect(service.validatePickupTime('11:30')).toContain('12:00 PM');
    expect(service.validatePickupTime('12:30')).toBeNull();
    expect(service.validatePickupTime('22:30')).toContain('12:00 PM');
  });

  it('should create and persist an order', () => {
    const order = service.createOrder({
      items: [
        {
          dish: {
            id: 1,
            name: 'Tacos al Pastor',
            description: 'Orden de tacos',
            price: 160,
            image: 'assets/img/tacos-pastor.jpg',
            category: 'Platos Fuertes',
          },
          quantity: 2,
          subtotal: 320,
        },
      ],
      pickupTime: '13:15',
      couponCode: 'descuento10',
    });

    expect(order.id).toBeTruthy();
    expect(order.discount).toBe(32);
    expect(order.total).toBe(288);
    expect(service.orders().length).toBe(1);
  });
});
