import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';

interface Company {
  id: string | number;
  name: string;
  location: string;
  productCount: number;
  category: string;
  image_url: string;
  product_image_url?: string;
}

type SortOption =
  | 'none'
  | 'name-asc'
  | 'name-desc'
  | 'products-asc'
  | 'products-desc'
  | 'id-asc'
  | 'id-desc';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css'],
})
export class Companies implements OnInit {
  allCategories: string[] = [];
  companies: any[] = [];
  apiUrl = 'http://localhost:5000/companies';

  searchTerm = '';
  selectedCategory = 'all';
  sortOption: SortOption = 'none';
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getCompanies();
  }
  mobileFilterOpen = false;

  openMobileFilter() {
    this.mobileFilterOpen = true;
  }

  closeMobileFilter() {
    this.mobileFilterOpen = false;
  }

  get filteredCompanies(): Company[] {
    let result = this.companies.filter((c) => {
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        const haystack =
          `${c.name} ${c.location} ${c.category} ${c.id} ${c.productCount}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (this.selectedCategory !== 'all' && c.category !== this.selectedCategory) {
        return false;
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

      case 'products-asc':
        result.sort((a, b) => a.productCount - b.productCount);
        break;
      case 'products-desc':
        result.sort((a, b) => b.productCount - a.productCount);
        break;
      case 'id-asc':
        result.sort((a, b) => String(a.id).localeCompare(String(b.id)));
        break;
      case 'id-desc':
        result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
    }
    console.log('Filtered companies:', result);
    return result;
  }

  private computeFilterOptions(): void {
    const set = new Set<string>();
    for (const c of this.companies) set.add(c.category);
    this.allCategories = Array.from(set).sort();
  }

  private getCompanies(): void {
    if (!this.apiUrl) return;
    console.log('Fetching products from API:', this.apiUrl);

    this.http.get<Company[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Products data received:', data);
        console.log('Type of data:', typeof data);
        if (data) {
          this.companies = Array.isArray(data) ? data : [];
        }
      },
      error: (err) => {
        console.error('Failed to load landing data:', err);
      },
    });
    this.computeFilterOptions();
  }

  onSearch(value: string) {
    this.searchTerm = value;
  }

  onCategoryChange(value: string) {
    this.selectedCategory = value;
  }

  onSortChange(value: string) {
    this.sortOption = value as SortOption;
  }
}
