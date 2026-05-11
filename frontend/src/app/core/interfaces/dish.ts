export type DishCategory = 'Entradas' | 'Platos Fuertes' | 'Postres' | 'Bebidas';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: DishCategory;
}
