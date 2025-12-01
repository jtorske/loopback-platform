import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // standalone component (no NgModule)
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<any>('http://localhost:5000/login', {
      username: this.loginData.email,
      email: this.loginData.email,
      password: this.loginData.password,
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed: ' + (error.error.error || 'Unknown error'));
      }
    });
  }
}
