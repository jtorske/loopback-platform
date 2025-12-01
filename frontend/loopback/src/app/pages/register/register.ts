import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.http.post<any>('http://localhost:5000/signup', {
      username: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password,
    }).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        alert('Signup failed: ' + (error.error.error || 'Unknown error'));
      }
    });
  }
}
