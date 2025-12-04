import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {

  accountInfo: any;

  constructor() {
    if (!localStorage['user']) {
      window.location.href = '/login';
    }

    
    console.log(localStorage);
    console.log(localStorage.getItem('user'))
    const userRaw = localStorage.getItem('user');
    console.log()

    this.accountInfo = {
      name: userRaw ? (JSON.parse(userRaw).username) : '',
      email: userRaw ? (JSON.parse(userRaw).email) : '',
      role: userRaw ? (JSON.parse(userRaw).role) : ''
    }
  }
  // urlplaceholder for isaac
  // Please add data :)

  // Temp placeholders
  suggestions = 5;
  bugReports = 2;
  praises = 8;

  editAccount() {
    console.log('Nah')
    console.log(localStorage['user'])
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('companyId');
    window.location.href = '/';
  }
}