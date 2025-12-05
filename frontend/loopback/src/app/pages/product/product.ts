import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface ProductData {
  id: string | number;
  name: string;
  company: string;
  price: string;
  category: string;
  image_url: string;
  company_id: number;
  created_at: string;
  description: string;
  sku: string;
}

interface Feedback {
  product_id: number;
  body: string;
  tag: string;
  user_id: number;
  company_id: number;
  feedback_type_id: number;
  title: string;
  status: string;
  parent_feedback_id?: number;
  created_at: string;
  id: number;
  upvotes?: number;
  downvotes?: number;
  score?: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  productId: string | null = null;

  apiUrl = 'http://localhost:5000/product-info/';

  feedbacks: Feedback[] = [];
  product: ProductData = {} as ProductData;
  // only sys admin see delete button
  canDeleteFeedback = false;
  myVotes: { [feedbackId: number]: 'up' | 'down' } = {};

  constructor(private route: ActivatedRoute, private router: Router) { }
  private http = inject(HttpClient);

  ngOnInit() {
    // if current user is sys admin
    this.refreshDeletePermission();
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log('Product ID:', this.productId);
    });
    this.getProduct();
  }

    private refreshDeletePermission(): void {
    try {
      // login.ts stores this as the user's role string
      const perms = localStorage.getItem('permissions');
      const userJson = localStorage.getItem('user');

      let role = (perms || '').toString().toLowerCase();

      // Fallback to user.role if needed
      if (!role && userJson) {
        const user = JSON.parse(userJson);
        role = (user?.role || '').toString().toLowerCase();
      }

      const adminRoles = ['system_admin', 'sysadmin'];
      this.canDeleteFeedback = !!role && adminRoles.some(r => role.includes(r));
    } catch (e) {
      console.error('Failed to read user role for delete permission', e);
      this.canDeleteFeedback = false;
    }
  }


  getProduct() {
    if (!this.apiUrl) return;
    let fullUrl = this.apiUrl + (this.productId ? this.productId : '1');
    console.log('Fetching product data from URL:', fullUrl);

    this.http.get<any>(fullUrl).subscribe({
      next: (data) => {
        console.log('Products data received:', data);
        console.log('Type of data:', typeof data);
        if (data) {
          this.product = {
            id: data.id,
            name: data.name,
            company: data.company,
            price: data.price,
            category: data.category,
            image_url: data.image_url,
            company_id: data.company_id,
            created_at: data.created_at,
            description: data.description,
            sku: data.sku
          }
          this.feedbacks = data.feedback || [];

          console.log('Product set to:', this.product);
          console.log('Feedbacks set to:', this.feedbacks);
        }
      },
      error: (err) => {
        console.error('Failed to load landing data:', err);
      },
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

  deleteFeedback(feedbackId: number): void {
    if (!feedbackId) return;
    if (!this.canDeleteFeedback) return;

    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    const url = `http://localhost:5000/feedback/${feedbackId}`;

    this.http.delete(url).subscribe({
      next: () => {
        // Remove from the local list so the UI updates immediately
        this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
        console.log('Feedback deleted:', feedbackId);
      },
      error: (err) => {
        console.error('Failed to delete feedback:', err);
        alert('Error deleting feedback. Please try again.');
      },
    });
  }


  giveFeedback(productID: any): void {
    this.router.navigate(['/feedback', productID]);
  }

    getScore(feedback: Feedback): number {
    const up = feedback.upvotes ?? 0;
    const down = feedback.downvotes ?? 0;
    // if backend sends score, prefer that:
    if (typeof feedback.score === 'number') {
      return feedback.score;
    }
    return up - down;
  }

    vote(feedback: Feedback, direction: 'up' | 'down'): void {
    if (!feedback || !feedback.id) return;

    const feedbackId = feedback.id;

    const current = this.myVotes[feedbackId] ?? null; // "up" | "down" | null
    let next: 'up' | 'down' | null;

    // If user clicks the same direction again, undo their vote
    if (current === direction) {
      next = null; // undo
    } else {
      // Either no vote yet, or switching directions
      next = direction;
    }

    const url = `http://localhost:5000/feedback/${feedbackId}/vote`;

    this.http.post<any>(url, {
      direction: next,   // "up", "down", or null
      previous: current, // "up", "down", or null
    }).subscribe({
      next: (updated) => {
        const idx = this.feedbacks.findIndex((f) => f.id === feedbackId);
        if (idx !== -1) {
          this.feedbacks[idx] = {
            ...this.feedbacks[idx],
            upvotes: updated.upvotes,
            downvotes: updated.downvotes,
            score: updated.score,
          };
        }

        // Update local vote state
        if (next) {
          this.myVotes[feedbackId] = next;
        } else {
          delete this.myVotes[feedbackId];
        }
      },
      error: (err) => {
        console.error('Failed to register vote', err);
        alert('Error voting on feedback. Please try again.');
      },
    });
  }

  viewOtherProducts(companyId: number): void {
    this.router.navigate(['/company'], {
      queryParams: { company_id: companyId },
    });
  }

}
