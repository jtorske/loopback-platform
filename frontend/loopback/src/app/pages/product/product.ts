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


  constructor(private route: ActivatedRoute, private router: Router) { }
  private http = inject(HttpClient);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log('Product ID:', this.productId);
    });
    this.getProduct();
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

  giveFeedback(productID: any): void {
    this.router.navigate(['/feedback', productID]);
  }

  viewOtherProducts(companyId: number): void {
    this.router.navigate(['/company'], {
      queryParams: { company_id: companyId },
    });
  }

}
