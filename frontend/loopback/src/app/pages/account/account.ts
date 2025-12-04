import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    FormsModule
  ],
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
      id: userRaw ? (JSON.parse(userRaw).id) : 0,
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

  showEditModal = false;

  editAccount() {
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveAccountDetails(updatedInfo: any) {
    // Save logic here (e.g., update localStorage, send to backend, etc.)
    // this.accountInfo = { ...this.accountInfo, ...updatedInfo };
    // console.log(updatedInfo);
    const payload = {
      name: updatedInfo.name,
      email: updatedInfo.email
    };

    // Call the PATCH endpoint
    // http://localhost:5000/company
    fetch(`http://localhost:5000/users/update/${this.accountInfo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        // Update local state with response
        if (data.user) {
          this.accountInfo = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        this.closeEditModal();
      })
      .catch(error => {
        console.error('Error updating account:', error);
        this.closeEditModal();
      });
    // this.closeEditModal();
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('companyId');
    window.location.href = '/';
  }
}