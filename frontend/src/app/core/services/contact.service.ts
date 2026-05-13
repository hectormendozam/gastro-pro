import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para definir la estructura de los datos que enviará el formulario
export interface ContactData {
  nombre: string;
  correo: string;
  mensaje: string;
}

// Interfaz para tipar la respuesta esperada del backend
export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Asegúrate de usar el puerto configurado en el backend y docker-compose
  private apiUrl = 'http://localhost:3000/api/contact';

  constructor(private http: HttpClient) { }

  /**
   * Método para enviar el mensaje de contacto.
   * Retorna un Observable al que el componente del formulario deberá suscribirse.
   * @param contactData Los datos recopilados del formulario
   */
  sendMessage(contactData: ContactData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, contactData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejador centralizado de errores para peticiones HTTP
   * @param error Objeto HttpErrorResponse devuelto por el framework
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado. Intente nuevamente más tarde.';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      console.error('Error de cliente/red:', error.error.message);
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // El backend retornó un código de error (ej: 400, 500)
      console.error(`Backend retornó el código ${error.status}, el cuerpo era: `, error.error);
      
      // Si el backend incluye un mensaje amigable (definido en nuestra API REST)
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    // Retornar un observable con el mensaje de error para ser consumido en el frontend
    return throwError(() => new Error(errorMessage));
  }
}
