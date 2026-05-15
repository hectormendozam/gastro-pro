import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation, ReservationZone } from '../../core/interfaces/reservation';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
})
export class Reservations {
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);

  reservationForm: FormGroup;
  zones: ReservationZone[] = ['interior', 'terraza', 'barra'];
  showSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor() {
    this.reservationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      peopleCount: [2, [Validators.required, Validators.min(1), Validators.max(6)]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      zone: ['interior', [Validators.required]],
    }, { validators: this.dateTimeValidator });
  }

  dateTimeValidator(group: AbstractControl): ValidationErrors | null {
    const date = group.get('date')?.value;
    const time = group.get('time')?.value;

    if (!date || !time) return null;

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    now.setSeconds(0, 0);

    if (selectedDateTime < now) {
      return { pastDateTime: true };
    }

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 13 * 60;
    const maxMinutes = 22 * 60;

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return { outsideHours: true };
    }

    return null;
  }

  onSubmit() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.reservationForm.value;
    const reservation: Reservation = {
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      peopleCount: formValue.peopleCount,
      date: formValue.date,
      time: formValue.time,
      zone: formValue.zone,
    };

    this.reservationService.saveReservation(reservation).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccess.set(true);
        this.reservationForm.reset({ peopleCount: 2, zone: 'interior' });
        setTimeout(() => this.showSuccess.set(false), 5000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || 'Ocurrió un error al guardar la reservación. Intenta de nuevo.';
        this.errorMessage.set(msg);
        setTimeout(() => this.errorMessage.set(null), 6000);
      },
    });
  }

  get f() { return this.reservationForm.controls; }
}
