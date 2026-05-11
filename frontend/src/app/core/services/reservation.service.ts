import { Injectable } from '@angular/core';
import { Reservation } from '../interfaces/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly STORAGE_KEY = 'restaurant_reservations';

  constructor() {}

  saveReservation(reservation: Reservation): void {
    const currentReservations = this.getReservations();
    // Simulamos un ID único simple
    const newReservation = {
      ...reservation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    currentReservations.push(newReservation);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentReservations));
  }

  getReservations(): Reservation[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
