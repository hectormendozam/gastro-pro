export type ReservationZone = 'interior' | 'terraza' | 'barra';

export interface Reservation {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  peopleCount: number;
  date: string;
  time: string;
  zone: ReservationZone;
  createdAt?: string;
}
