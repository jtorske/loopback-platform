import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Product {
  id: number;
  company_id: number;
  company: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  price?: number | string | null;
  image_url?: string | null;
}

type SortOption = 'none' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  private readonly apiUrl = 'http://localhost:5000/products';
  private http = inject(HttpClient);

  products: Product[] = [];

  searchTerm = '';
  sortOption: SortOption = 'none';
  mobileFilterOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  get filteredProducts(): Product[] {
    let result = [...this.products];

    // SEARCH
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      result = result.filter((p) =>
        `${p.name} ${p.sku} ${p.company} ${p.price}`.toLowerCase().includes(t)
      );
    }

    switch (this.sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case 'none':
      default:
        break;
    }

    return result;
  }

  openMobileFilter() {
    this.mobileFilterOpen = true;
  }

  closeMobileFilter() {
    this.mobileFilterOpen = false;
  }

  private loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data: Product[]) => {
        this.products = Array.isArray(data) ? data : [];
      },
      error: (err: any) => {
        console.error('Failed to load products:', err);
      },
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  onSortChange(value: string): void {
    this.sortOption = value as SortOption;
  }

  goToCompany(companyId: number): void {
    this.router.navigate(['/company'], {
      queryParams: { company_id: companyId },
    });
  }

  goToProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  onReview(product: Product): void {
    this.router.navigate(['/feedback', product.id]);
  }
}
