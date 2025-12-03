import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';

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
export class Landing implements OnInit, AfterViewInit {
  private readonly apiUrl = 'http://localhost:5000';
  private readonly urlpath = '/landing-data';

  private http = inject(HttpClient);

  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  trendingProducts: Product[] = [
    { id: 1, name: 'Placeholder Product 1', image_url: 'assets/placeholder.png' },
    { id: 2, name: 'Placeholder Product 2', image_url: 'assets/placeholder.png' },
    { id: 3, name: 'Placeholder Product 3', image_url: 'assets/placeholder.png' },
    { id: 4, name: 'Placeholder Product 4', image_url: 'assets/placeholder.png' },
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

  ngAfterViewInit(): void {
    setTimeout(() => this.setInitialCarouselPosition(), 0);

    // Enable mouse-wheel horizontal scrolling
    this.carousel.nativeElement.addEventListener('wheel', (e: WheelEvent) => this.onWheel(e), {
      passive: false,
    });
  }

  // ---------------------------------------
  // INITIAL CENTERING FOR 4 SETS
  // ---------------------------------------
  private setInitialCarouselPosition(): void {
    const el = this.carousel?.nativeElement;
    if (!el) return;

    const card = el.querySelector('.loop-card') as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth + 16; // gap = 16
    const oneSetWidth = this.trendingProducts.length * cardWidth;

    // Start halfway through set #2 (perfectly centered)
    el.scrollLeft = oneSetWidth * 1.5;
  }

  // ---------------------------------------
  // INFINITE SCROLL LOGIC FOR 4 SETS
  // ---------------------------------------
  onScroll(): void {
    const el = this.carousel.nativeElement;
    const card = el.querySelector('.loop-card') as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth + 16;
    const setWidth = this.trendingProducts.length * cardWidth;
    const scroll = el.scrollLeft;

    // LEFT WRAP (scrolling backward)
    // When user goes too far left (< half a set from beginning)
    if (scroll < setWidth * 0.5) {
      this.temporarilyDisableSnap(el);
      el.scrollLeft = scroll + setWidth * 2; // jump forward two sets
      return;
    }

    // RIGHT WRAP (scrolling forward)
    // When user goes too far right (> 2.5 sets into track)
    if (scroll > setWidth * 2.5) {
      this.temporarilyDisableSnap(el);
      el.scrollLeft = scroll - setWidth * 2; // jump backward two sets
    }
  }

  private temporarilyDisableSnap(el: HTMLElement) {
    el.style.scrollSnapType = 'none';
    setTimeout(() => {
      el.style.scrollSnapType = 'x mandatory';
    }, 50);
  }

  // ---------------------------------------
  // DESKTOP MOUSE WHEEL SUPPORT
  // ---------------------------------------
  onWheel(event: WheelEvent) {
    const el = this.carousel.nativeElement;
    event.preventDefault(); // stop vertical scroll
    el.scrollLeft += event.deltaY; // convert wheel → horizontal
  }

  // ---------------------------------------
  // LOAD API PRODUCTS + BOTTOM IMAGES
  // ---------------------------------------
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
