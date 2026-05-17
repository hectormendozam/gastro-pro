import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Dish, DishCategory } from '../interfaces/dish';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // Inyectamos HttpClient para hacer peticiones al backend
  private http = inject(HttpClient);
  // La URL de tu microservicio ms-menu
  private apiUrl = 'http://localhost:3003/api/menu';

  // Señal reactiva que iniciará vacía
  readonly dishes = signal<Dish[]>([]);

  // Función que hace la petición real a tu base de datos
  fetchDishes(categoria?: string): Observable<any> {
    const url = categoria ? `${this.apiUrl}?categoria=${categoria}` : this.apiUrl;
    
    return this.http.get<{success: boolean, data: any[]}>(url).pipe(
      tap(response => {
        if (response.success) {
          // Mapeamos los campos de español (Backend) a inglés (Frontend)
          const platillosMapeados: Dish[] = response.data.map(item => ({
            id: item._id, 
            name: item.nombre,
            description: item.descripcion,
            price: item.precio,
            image: item.imagen,
            category: this.formatCategory(item.categoria)
          }));
          // Actualizamos la señal con los datos reales
          this.dishes.set(platillosMapeados);
        }
      })
    );
  }

  getDishesByCategory(category: DishCategory): Dish[] {
    return this.dishes().filter((dish) => dish.category === category);
  }

  getAllDishes(): Dish[] {
    return this.dishes();
  }

  // Utilidad para asegurar que las categorías coincidan exactamente con la interfaz
  private formatCategory(cat: string): DishCategory {
    const map: { [key: string]: DishCategory } = {
      'entradas': 'Entradas',
      'platos fuertes': 'Platos Fuertes',
      'postres': 'Postres',
      'bebidas': 'Bebidas'
    };
    return map[cat.toLowerCase()] || 'Entradas';
  }
}