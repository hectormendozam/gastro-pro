import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  
  contactForm: FormGroup;
  showSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      
      // Mapeo de campos del formulario (inglés) a los del backend (español)
      const payload = {
        nombre: formData.name,
        correo: formData.email,
        mensaje: formData.message
      };

      this.contactService.sendMessage(payload).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.showSuccess.set(true);
          this.errorMessage.set(null);
          this.contactForm.reset();
          setTimeout(() => this.showSuccess.set(false), 5000);
        },
        error: (err) => {
          console.error('Error al enviar mensaje:', err);
          this.errorMessage.set(err.message || 'Error al conectar con el servidor');
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  
  get f() { return this.contactForm.controls; }
}

