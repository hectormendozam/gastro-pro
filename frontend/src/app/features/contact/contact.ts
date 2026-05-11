import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private fb = inject(FormBuilder);
  
  contactForm: FormGroup;
  showSuccess = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Here you would normally send the data to a backend
      console.log('Contact Form Data:', this.contactForm.value);
      
      this.showSuccess.set(true);
      this.contactForm.reset();

      // Hide alert after 5 seconds
      setTimeout(() => this.showSuccess.set(false), 5000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  
  get f() { return this.contactForm.controls; }
}

