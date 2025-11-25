import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Product {
  id: number | string;
  name: string;
  image_url: string;
}

interface BottomCardImageResponse {
  id: string;
  image_url: string;
}

interface LandingResponse {
  trendingProducts?: Product[];
  bottomCardImages?: BottomCardImageResponse[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing implements OnInit {
  private readonly apiUrl = "http://localhost:5000";
  private readonly urlpath = "/landing-data";

  private http = inject(HttpClient);

  trendingProducts: Product[] = [
    {
      id: 1,
      name: 'Placeholder Product 1',
      image_url: 'assets/placeholder.png',
    },
    {
      id: 2,
      name: 'Placeholder Product 2',
      image_url: 'assets/placeholder.png',
    },
    {
      id: 3,
      name: 'Placeholder Product 3',
      image_url: 'assets/placeholder.png',
    },
    {
      id: 4,
      name: 'Placeholder Product 4',
      image_url: 'assets/placeholder.png',
    },
  ];

  bottomCards = [
    {
      id: 'company-login',
      title: 'Company Login',
      route: '/company-login',
      image_url: 'assets/placeholder.png',
    },
    {
      id: 'browse-products',
      title: 'Browse Products',
      route: '/products',
      image_url: 'assets/placeholder.png',
    },
    {
      id: 'browse-companies',
      title: 'Browse Companies',
      route: '/companies',
      image_url: 'assets/placeholder.png',
    },
  ];

  ngOnInit(): void {
    this.loadLandingData();
  }

  private loadLandingData(): void {
    this.http.get<LandingResponse>(this.apiUrl + this.urlpath).subscribe({
      next: (data) => {
        if (data.trendingProducts?.length) {
          this.trendingProducts = data.trendingProducts;
        }

        if (data.bottomCardImages?.length) {
          for (const apiCard of data.bottomCardImages) {
            const localCard = this.bottomCards.find((c) => c.id === apiCard.id);
            if (localCard && apiCard.image_url) {
              localCard.image_url = apiCard.image_url;
            }
          }
        }
      },
      error: (err) => {
        console.error('Failed to load landing data:', err);
      },
    });
  }
}
