import { Injectable, signal, computed } from '@angular/core';
import { Dish, DishCategory } from '../interfaces/dish';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private dishesMock: Dish[] = [
    {
      id: 1,
      name: 'Guacamole Tradicional',
      description: 'Aguacate fresco, pico de gallo y totopos caseros.',
      price: 120,
      image: 'assets/img/guacamole.jpg',
      category: 'Entradas',
    },
    {
      id: 2,
      name: 'Queso Fundido',
      description: 'Mezcla de quesos con chorizo o champiñones, servido con tortillas de harina.',
      price: 140,
      image: 'assets/img/queso-fundido.jpg',
      category: 'Entradas',
    },
    {
      id: 3,
      name: 'Tacos al Pastor',
      description: 'Orden de 5 tacos con piña, cilantro y cebolla.',
      price: 160,
      image: 'assets/img/tacos-pastor.jpg',
      category: 'Platos Fuertes',
    },
    {
      id: 4,
      name: 'Enchiladas Suizas',
      description: 'Rellenas de pollo, bañadas en salsa verde cremosa y gratinadas.',
      price: 180,
      image: 'assets/img/enchiladas.jpg',
      category: 'Platos Fuertes',
    },
    {
      id: 5,
      name: 'Flan Napolitano',
      description: 'Clásico flan casero con caramelo.',
      price: 80,
      image: 'assets/img/flan.jpg',
      category: 'Postres',
    },
    {
      id: 6,
      name: 'Churros con Chocolate',
      description: 'Churros crujientes espolvoreados con azúcar y canela.',
      price: 90,
      image: 'assets/img/churros.jpg',
      category: 'Postres',
    },
    {
      id: 7,
      name: 'Margarita Clásica',
      description: 'Tequila, licor de naranja y jugo de limón fresco.',
      price: 110,
      image: 'assets/img/margarita.jpg',
      category: 'Bebidas',
    },
    {
      id: 8,
      name: 'Agua de Horchata',
      description: 'Bebida refrescante de arroz con canela y vainilla.',
      price: 45,
      image: 'assets/img/horchata.jpg',
      category: 'Bebidas',
    },
  ];

  // Exponemos los platillos como una señal de solo lectura (aunque sea estático por ahora)
  readonly dishes = signal<Dish[]>(this.dishesMock);

  getDishesByCategory(category: DishCategory): Dish[] {
    return this.dishes().filter((dish) => dish.category === category);
  }

  getAllDishes(): Dish[] {
    return this.dishes();
  }
}
