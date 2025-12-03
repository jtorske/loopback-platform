import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-product.html',
    styleUrls: ['./add-product.css'],
})
export class AddProduct {
    sku = '';
    name = '';
    description = '';
    price: number | null = null;
    image_url = '';

    apiUrl = 'http://localhost:5000/product';
    private http = inject(HttpClient);

    constructor(private router: Router) { }

    onSubmit() {
        if (!this.name.trim()) {
            alert('Please enter a product name.');
            return;
        }
        if (!this.sku.trim()) {
            alert('Please enter a SKU.');
            return;
        }
        if (!this.description.trim()) {
            alert('Please enter a description.');
            return;
        }
        if (this.price === null || isNaN(this.price)) {
            alert('Please enter a valid price.');
            return;
        }

        const userRaw = localStorage.getItem('user');
        const companyId = userRaw ? (JSON.parse(userRaw).company_id || Number(localStorage.getItem('companyId')) || 0) : Number(localStorage.getItem('companyId')) || 0;

        const payload: any = {
            company_id: companyId,
            sku: this.sku,
            name: this.name,
            description: this.description,
            price: this.price,
            image_url: this.image_url,
        };

        console.log('Creating product', payload);

        this.http.post(this.apiUrl, payload).subscribe({
            next: (res: any) => {
                alert('Product created');
                this.router.navigate(['/company-dashboard']);
            },
            error: (err: any) => {
                console.error('Failed to create product', err);
                alert('Failed to create product.');
            }
        });
    }

    onCancel() {
        this.router.navigate(['/company-dashboard']);
    }
}
