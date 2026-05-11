import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Cart } from './features/cart/cart';
import { Reservations } from './features/reservations/reservations';
import { Contact } from './features/contact/contact';

export const routes: Routes = [
  // Redirige la ruta raíz al menú principal
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  
  // Definición de las páginas de la aplicación
  { path: 'menu', component: Home },
  { path: 'carrito', component: Cart },
  { path: 'reservas', component: Reservations },
  { path: 'contacto', component: Contact },
  
  // Ruta comodín (Wildcard): Si el usuario escribe una URL que no existe, lo regresa al menú
  { path: '**', redirectTo: 'menu' }
];