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
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  productId: string | null = null;
  product: ProductData = {} as ProductData;
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

  getProduct() {
    if (!this.apiUrl) return;
    console.log('Fetching products from API:', this.apiUrl);
    let fullUrl = this.apiUrl + (this.productId ? this.productId : '1');

    this.http.get<ProductData>(fullUrl).subscribe({
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

}
