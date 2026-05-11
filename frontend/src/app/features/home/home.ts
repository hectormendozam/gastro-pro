import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Import CommonModule for general functionalities if needed, and CurrencyPipe
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { Dish, DishCategory } from '../../core/interfaces/dish';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, CommonModule], // Ensure CommonModule is imported for @for
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  private menuService = inject(MenuService);
  cartService = inject(CartService); // Made public for potential template usage if needed

  categories: DishCategory[] = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];
  selectedCategory = signal<DishCategory | 'Todos'>('Todos');

  filteredDishes = computed(() => {
    const category = this.selectedCategory();
    if (category === 'Todos') {
      return this.menuService.getAllDishes();
    }
    return this.menuService.getDishesByCategory(category);
  });

  setCategory(category: DishCategory | 'Todos') {
    this.selectedCategory.set(category);
  }

  addToCart(dish: Dish) {
    this.cartService.addToCart(dish);
  }
}

