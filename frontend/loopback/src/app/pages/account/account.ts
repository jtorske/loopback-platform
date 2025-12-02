import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  // urlplaceholder for isaac
  // Please add data :)

  // Temp placeholders
  user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Administrator'
  };
  suggestions = 5;
  bugReports = 2;
  praises = 8;

  editAccount() {
    console.log('Nah')
    console.log(localStorage)
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
}