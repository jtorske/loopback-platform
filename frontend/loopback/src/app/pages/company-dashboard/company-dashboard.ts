import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-company-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './company-dashboard.html',
    styleUrls: ['./company-dashboard.css'],
})
export class CompanyDashboard implements OnInit {

    // placeholder state
    companyName = 'Example Company';
    industry = 'Technology';
    productCount = 15;
    announcements: Array<{ id: number; title: string; body: string; published_at?: string }> = [];
    products = [
        { name: 'Product 1', description: 'Description 1' },
        { name: 'Product 2', description: 'Description 2' },
        { name: 'Product 3', description: 'Description 3' },
        { name: 'Product 4', description: 'Description 4' },
        { name: 'Product 5', description: 'Description 5' },
    ];

    visibleCount = 3;
    currIndex = 0;

    get visibleProducts() {
        return this.products.slice(
            this.currIndex,
            this.currIndex + this.visibleCount
        );
    }

    nextSlide() {
        console.log('nextSlide clicked, currIndex=', this.currIndex);
        if (this.currIndex + this.visibleCount < this.products.length) {
            this.currIndex++;
            console.log('nextSlide moved to', this.currIndex);
        }
    }

    prevSlide() {
        console.log('prevSlide clicked, currIndex=', this.currIndex);
        if (this.currIndex > 0) {
            this.currIndex--;
            console.log('prevSlide moved to', this.currIndex);
        }
    }

    ngOnInit(): void {
        this.loadDashboard();
    }

    private loadDashboard(): void {
        // TODO: replace with real API endpoint for data retrieval
        const url = '/api/company/dashboard';
    }
}
