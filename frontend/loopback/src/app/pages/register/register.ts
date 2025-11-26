import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // TODO: replace console.log with your real API call later
    console.log('Register form submitted:', this.registerData);
  }
}
