import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('companyId');
    window.location.href = '/';
  }
}
