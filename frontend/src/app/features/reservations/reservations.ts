import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Important for ngClass and date pipe
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation, ReservationZone } from '../../core/interfaces/reservation';

@Component({
  selector: 'app-reservations',
  standalone: true, // Ensuring standalone
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

  // Custom validator for future date/time and business hours
  dateTimeValidator(group: AbstractControl): ValidationErrors | null {
    const date = group.get('date')?.value;
    const time = group.get('time')?.value;

    if (!date || !time) return null;

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    // Reset seconds and milliseconds to allow reservation in the current minute
    now.setSeconds(0, 0);

    if (selectedDateTime < now) {
      return { pastDateTime: true };
    }

    // Validate business hours (12:00 - 22:00)
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 13 * 60; // 13:00
    const maxMinutes = 22 * 60; // 22:00

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return { outsideHours: true };
    }

    return null;
  }

  onSubmit() {
    if (this.reservationForm.valid) {
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

      this.reservationService.saveReservation(reservation);
      this.showSuccess.set(true);
      this.reservationForm.reset({ peopleCount: 2, zone: 'interior' });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => this.showSuccess.set(false), 5000);
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  get f() { return this.reservationForm.controls; }
}

