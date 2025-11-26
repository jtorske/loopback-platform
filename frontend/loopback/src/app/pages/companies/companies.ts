import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface CompanyTopProduct {
  name: string;
  imageUrl: string;
}

interface Company {
  id: string | number;
  name: string;
  location: string;
  productCount: number;
  category: string;
  imageUrl: string;
  topProduct: CompanyTopProduct;
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
  imports: [CommonModule],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css'],
})
export class Companies implements OnInit {
  companies: Company[] = [
    {
      id: '#81546',
      name: 'Company Name',
      location: 'Calgary, AB',
      productCount: 32,
      category: 'Electronics',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
    {
      id: '#81546',
      name: 'Company Name',
      location: 'Calgary, AB',
      productCount: 32,
      category: 'Electronics',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
    {
      id: '#81546',
      name: 'Company Name',
      location: 'Calgary, AB',
      productCount: 32,
      category: 'Electronics',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
    {
      id: '#81547',
      name: 'Another Company',
      location: 'Calgary, AB',
      productCount: 12,
      category: 'Electronics',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
    {
      id: '#81548',
      name: 'Third Company',
      location: 'Edmonton, AB',
      productCount: 45,
      category: 'Hardware',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
    {
      id: '#81549',
      name: 'Fourth Company',
      location: 'Vancouver, BC',
      productCount: 7,
      category: 'Software',
      imageUrl: 'assets/placeholder.png',
      topProduct: { name: 'Product Name', imageUrl: 'assets/placeholder.png' },
    },
  ];

  allCategories: string[] = [];

  searchTerm = '';
  selectedCategory = 'all';
  sortOption: SortOption = 'none';

  ngOnInit(): void {
    this.computeFilterOptions();
  }

  get filteredCompanies(): Company[] {
    let result = this.companies.filter((c) => {
      if (this.selectedCategory !== 'all' && c.category !== this.selectedCategory) return false;

      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        const haystack =
          `${c.name} ${c.location} ${c.category} ${c.id} ${c.productCount}`.toLowerCase();
        if (!haystack.includes(term)) return false;
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

    return result;
  }

  private computeFilterOptions(): void {
    const set = new Set<string>();
    for (const c of this.companies) set.add(c.category);
    this.allCategories = Array.from(set).sort();
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
