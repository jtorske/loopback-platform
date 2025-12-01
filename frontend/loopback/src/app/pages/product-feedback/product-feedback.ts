import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface Product {
  id: string | number;
  name: string;
  company: string;
  price: string;
  category: string;
  image_url: string;
  company_id: number;
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
}


@Component({
  selector: 'app-product-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-feedback.html',
  styleUrl: './product-feedback.css',
})
export class ProductFeedback implements OnInit {
  productId: string | null = null;
  product: Product = {} as Product;
  apiUrl = 'http://localhost:5000/products/';

  constructor(private route: ActivatedRoute, private router: Router) {}
  private http = inject(HttpClient);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log('Product ID:', this.productId);
    });
    this.getProduct();
  }

  feedbackText = '';
  tags = ['Praise', 'Enhancement', 'Bug Fix'];
  selectedTag: string | null = 'Praise';

  selectTag(tag: string) {
    this.selectedTag = tag;
  }

  getProduct() {
    if (!this.apiUrl) return;
    console.log('Fetching products from API:', this.apiUrl);
    let fullUrl = this.apiUrl + (this.productId ? this.productId : '1');

    this.http.get<Product>(fullUrl).subscribe({
      next: (data) => {
        console.log('Products data received:', data);
        console.log('Type of data:', typeof data);
        if (data) {
          this.product = data;
        }
      },
      error: (err) => {
        console.error('Failed to load landing data:', err);
      },
    });

  }

  onSubmit() {
    if (!this.feedbackText.trim()) {
      alert('Please enter some feedback before submitting.');
      return;
    }

    // Later: send to backend API here
    console.log('Submitted feedback:', {
      productName: this.product.name,
      companyName: this.product.company,
      feedback: this.feedbackText,
      tag: this.selectedTag,
    });

    let user = localStorage.getItem('user');
    if (!user) {
      alert('You must be logged in to submit feedback.');
      this.router.navigate(['/login']);
      return;
    }

    let feedbackTypes: Record<string, number> = {
      'Praise': 1,
      'Bug Fix': 2,
      'Enhancement': 3
    }

    let feedback : Feedback = {
      product_id: this.productId ? +this.productId : 0,
      body: this.feedbackText,
      tag: this.selectedTag ? this.selectedTag : '',
      user_id: user ? JSON.parse(user).id : 0,
      company_id: this.product ? +this.product.company_id : 0,
      feedback_type_id: this.selectedTag ? feedbackTypes[this.selectedTag] : 1,
      title: 'Title',
      status: 'open'
    };





    console.log('Feedback to be sent to backend:', feedback);

    this.http.post('http://localhost:5000/feedback', feedback).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully:', response);
        alert('Thank you for your feedback!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to submit feedback:', err);
        alert('Error submitting feedback. Please try again.');
      },
    });
  }

  onCancel() {
    // navigate to home for now
    this.router.navigate(['/']);
  }
}
