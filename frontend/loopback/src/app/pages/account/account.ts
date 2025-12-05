import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  company: number;
  created_at: string;
  email: string;
  id: number;
  is_active: boolean;
  role: string;
  username: string;
}

interface RecentActivity {
  body: string;
  company_id: number;
  created_at: string;
  feedback_type_id: number;
  id: number;
  parent_feedback_id?: number;
  product_id: number;
  status: string;
  title: string;
  user_id: number;
  productName?: string;
  companyName?: string;
}

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  private http = inject(HttpClient);

  user: User = {} as User;
  recentActivity: RecentActivity[] = [];
  suggestions = 0;
  bugReports = 0;
  praises = 0;

  showEditModal = false;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (!userData) {
    this.router.navigate(['/login']);
    return;
  }
    if (userData) {
      this.user = JSON.parse(userData);
    }

    this.getFeedbackCounts();
    this.getRecentActivity();
  }

  private getFeedbackCounts() {
    let userId = this.user ? this.user.id : "";
    let url = `http://localhost:5000/user-feedback-counts/${userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('Feedback counts fetched:', response);
        this.suggestions = response.enhancement || 0;
        this.bugReports = response.bug || 0;
        this.praises = response.praises || 0;
      }
    });
  }

  private getRecentActivity() {
    let userId = this.user ? this.user.id : "";
    let url = `http://localhost:5000/get-recent-activity/${userId}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        const activities = response.recent_activity || [];
        activities.forEach((activity: RecentActivity) => {
          const productId = activity.product_id;
          const productUrl = `http://localhost:5000/product-info/${productId}`;
          this.http.get<any>(productUrl).subscribe({
            next: (productInfo) => {
              activity.productName = productInfo.name;
              activity.companyName = productInfo.company;
            }
          });
        });
        this.recentActivity = activities;
        console.log(this.recentActivity)
      }
    });
  }

  getFeedbackTypeName(typeId: number): string {
    switch (typeId) {
      case 1: return 'Praise';
      case 2: return 'Bug';
      case 3: return 'Enhancement';
      default: return 'Unknown';
    }
  }

  getFeedbackTypeImage(typeId: number): string {
    switch (typeId) {
      case 1: return 'assets/praises.svg';
      case 2: return 'assets/bugReports.svg';
      case 3: return 'assets/suggestions.svg';
      default: return 'assets/placeholder.png';
    }
  }

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
    fetch(`http://localhost:5000/users/update/${this.user.id}`, {
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
          this.user = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        this.closeEditModal();
      })
      .catch(error => {
        console.error('Error updating account:', error);
        this.closeEditModal();
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('companyId');
    this.router.navigate(['/']);
  }

  routeToProducts() {
    this.router.navigate(['/products']);
  }
}