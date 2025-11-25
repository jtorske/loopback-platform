import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Product {
  id: string | number;
  name: string;
  company: string;
  price: string;
  category: string;
  imageUrl: string;
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
  private readonly urlplaceholder = '';
  private readonly apiUrl = this.urlplaceholder;

  private http = inject(HttpClient);

  products: Product[] = [
    {
      id: '#0298891',
      name: 'Product Name',
      company: 'Company Name',
      price: '$950.99',
      category: 'Laptops',
      imageUrl: 'assets/placeholder.png',
    },
    {
      id: '#0298891',
      name: 'Product Name',
      company: 'Company Name',
      price: '$950.99',
      category: 'Laptops',
      imageUrl: 'assets/placeholder.png',
    },
    {
      id: '#0298891',
      name: 'Product Name',
      company: 'Company Name',
      price: '$950.99',
      category: 'Laptops',
      imageUrl: 'assets/placeholder.png',
    },
    {
      id: '#0298892',
      name: 'Another Product',
      company: 'Company Name',
      price: '$750.00',
      category: 'Laptops',
      imageUrl: 'assets/placeholder.png',
    },
    {
      id: '#0298893',
      name: 'Desktop Pro',
      company: 'Company Name',
      price: '$1250.00',
      category: 'Desktops',
      imageUrl: 'assets/placeholder.png',
    },
    {
      id: '#0298894',
      name: 'Tablet Max',
      company: 'Company Name',
      price: '$550.00',
      category: 'Tablets',
      imageUrl: 'assets/placeholder.png',
    },
  ];

  allCategories: string[] = [];

  searchTerm = '';
  selectedCategory = 'all';
  sortOption: SortOption = 'none';

  ngOnInit(): void {
    this.computeFilterOptions();
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

    this.http.get<ProductsApiResponse>(this.apiUrl).subscribe({
      next: (data) => {
        if (data.products?.length) {
          this.products = data.products.map((p) => ({
            ...p,
            imageUrl: p.imageUrl || 'assets/placeholder.png',
          }));
          this.computeFilterOptions();
        }
      },
      error: (err) => console.error('Failed to fetch products:', err),
    });
  }

  private computeFilterOptions(): void {
    const categories = new Set<string>();

    for (const p of this.products) {
      categories.add(p.category);
    }

    this.allCategories = Array.from(categories).sort();
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
}
