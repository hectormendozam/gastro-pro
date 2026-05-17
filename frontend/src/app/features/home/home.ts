import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { Dish, DishCategory } from '../../core/interfaces/dish';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, CommonModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit { // Agregamos implements OnInit
  private menuService = inject(MenuService);
  cartService = inject(CartService); 

  categories: DishCategory[] = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];
  selectedCategory = signal<DishCategory | 'Todos'>('Todos');

  // Esta función se ejecuta automáticamente al abrir la pantalla
  ngOnInit() {
    this.menuService.fetchDishes().subscribe({
      error: (err) => console.error('Error cargando el menú', err)
    });
  }

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