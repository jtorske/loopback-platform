import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Product {
  id: string | number;
  name: string;
  company: string;
  price: string;
  category: string;
  image_url: string;
}

interface ProductsApiResponse {
  products?: Product[];
}

type SortOption =
  | 'none'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'id-asc'
  | 'id-desc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  private readonly url = 'http://localhost:5000';
  private readonly apiUrl = this.url + '/products';

  private http = inject(HttpClient);

  products: Product[] = [];

  allCategories: string[] = [];

  searchTerm = '';
  selectedCategory = 'all';
  sortOption: SortOption = 'none';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  get filteredProducts(): Product[] {
    let result = this.products.filter((p) => {
      if (this.selectedCategory !== 'all' && p.category !== this.selectedCategory) {
        return false;
      }

      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        const haystack = `${p.name} ${p.company} ${p.category} ${p.id} ${p.price}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });

    result = [...result];

    switch (this.sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => this.parsePrice(a.price) - this.parsePrice(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => this.parsePrice(b.price) - this.parsePrice(a.price));
        break;
      case 'id-asc':
        result.sort((a, b) => String(a.id).localeCompare(String(b.id)));
        break;
      case 'id-desc':
        result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
      case 'none':
      default:
        break;
    }

    return result;
  }

  private loadProducts(): void {
    if (!this.apiUrl) return;
    console.log('Fetching products from API:', this.apiUrl);

    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Products data received:', data);
        console.log('Type of data:', typeof data);
        if (data) {
          this.products = Array.isArray(data) ? data : [];
        }
        this.computeFilterOptions();
      },
      error: (err) => {
        console.error('Failed to load landing data:', err);
      },
    });
  }

    private computeFilterOptions(): void {
    const categories = new Set<string>();

    for (const p of this.products) {
      categories.add(p.category);
    }

    this.allCategories = Array.from(categories).sort();
    console.log('Available categories:', this.allCategories);
  }

  private parsePrice(price: string): number {
    const numeric = price.replace(/[^0-9.]/g, '');
    return Number(numeric) || 0;
  }

  // handlers for template
  onSearch(value: string): void {
    this.searchTerm = value;
  }

  onCategoryChange(value: string): void {
    this.selectedCategory = value;
  }

  onSortChange(value: string): void {
    this.sortOption = value as SortOption;
  }

  onReview(product: Product): void {
    this.router.navigate(['/feedback', product.id]);
  }
}
