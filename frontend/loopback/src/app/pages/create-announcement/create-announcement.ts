import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-create-announcement',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './create-announcement.html',
    styleUrls: ['./create-announcement.css'],
})
export class CreateAnnouncement {
    title = '';
    body = '';
    apiUrl = 'http://localhost:5000/announcement';

    private http = inject(HttpClient);

    constructor(private router: Router) { }

    onSubmit() {
        if (!this.title.trim()) {
            alert('Please enter a title for the announcement.');
            return;
        }
        if (!this.body.trim()) {
            alert('Please enter the announcement body.');
            return;
        }

        const user = localStorage.getItem('user');
        if (!user) {
            alert('You must be logged in to create an announcement.');
            this.router.navigate(['/login']);
            return;
        }

        const parsed = JSON.parse(user);
        const payload: any = {
            title: this.title,
            body: this.body,
            publisher_id: parsed?.id || null,
            company_id: parsed?.company_id || Number(localStorage.getItem('companyId')) || 0,
            published_at: new Date().toISOString(),
        };

        console.log('Sending announcement payload', payload);

        this.http.post(this.apiUrl, payload).subscribe({
            next: (res: any) => {
                alert('Announcement created');
                this.router.navigate(['/company-dashboard']);
            },
            error: (err: any) => {
                console.error('Failed to create announcement', err);
                alert('Failed to create announcement. Please try again later.');
            }
        });
    }

    onCancel() {
        this.router.navigate(['/company-dashboard']);
    }
}
