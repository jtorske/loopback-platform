import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Company {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  image_url: string | null;
  created_at: string;
}

type SortOption =
  | 'none'
  | 'name-asc'
  | 'name-desc'
  | 'id-asc'
  | 'id-desc'
  | 'created-newest'
  | 'created-oldest';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css'],
})
export class Companies implements OnInit {
  private readonly apiUrl = 'http://localhost:5000/companies';
  private http = inject(HttpClient);

  companies: Company[] = [];
  searchTerm = '';
  sortOption: SortOption = 'none';

  mobileFilterOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  openMobileFilter() {
    this.mobileFilterOpen = true;
  }

  closeMobileFilter() {
    this.mobileFilterOpen = false;
  }

  stopProp(event: Event) {
    event.stopPropagation();
  }

  private loadCompanies(): void {
    this.http.get<Company[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.companies = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Failed to load companies:', err);
      },
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  onSortChange(value: string): void {
    this.sortOption = value as SortOption;
  }

  get filteredCompanies(): Company[] {
    let result = [...this.companies];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((c) => {
        return (
          c.name.toLowerCase().includes(term) ||
          (c.description || '').toLowerCase().includes(term) ||
          (c.website || '').toLowerCase().includes(term)
        );
      });
    }

    switch (this.sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case 'id-asc':
        result.sort((a, b) => a.id - b.id);
        break;

      case 'id-desc':
        result.sort((a, b) => b.id - a.id);
        break;

      case 'created-newest':
        result.sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;

      case 'created-oldest':
        result.sort((a, b) => a.created_at.localeCompare(b.created_at));
        break;
    }

    return result;
  }
}
