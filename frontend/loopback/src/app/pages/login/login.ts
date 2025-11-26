import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
    password: '',
  };

  onSubmit() {
    // TODO: replace console.log with your real API call later
    console.log('Login form submitted:', this.loginData);
  }
}
