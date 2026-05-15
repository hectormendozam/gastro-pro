import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../interfaces/reservation';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Reservation;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3002/api/reservations';

  saveReservation(reservation: Reservation): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, reservation);
  }

  getReservations(): Observable<{ success: boolean; count: number; data: Reservation[] }> {
    return this.http.get<{ success: boolean; count: number; data: Reservation[] }>(this.apiUrl);
  }
}
