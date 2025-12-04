import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface User{
  company: number;
  created_at: string;
  email : string;
  id: number;
  is_active:boolean;
  role:string;
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
}


@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}
  private http = inject(HttpClient);

  user: User = {} as User;
  recentActivity: RecentActivity[] = [];
  suggestions = 0;
  bugReports = 0;
  praises = 0;

  ngOnInit() {
    const userData = localStorage.getItem('user');
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
        console.log('Recent activity fetched:', response);
        this.recentActivity = response.recent_activity || [];
      }
    });
  }

  editAccount() {
    console.log('Nah')
    console.log(localStorage)
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