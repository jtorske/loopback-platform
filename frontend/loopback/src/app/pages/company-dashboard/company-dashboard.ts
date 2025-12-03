import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-company-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './company-dashboard.html',
    styleUrls: ['./company-dashboard.css'],
})
export class CompanyDashboard implements OnInit {

    // placeholder state
    companyName = 'Example Company';
    companyId = 1;
    industry = 'Technology';
    productCount = 15;
    announcements: Array<{ id: number; title: string; body: string; published_at?: string; publisher?: string }> = [];
    products = [
        { name: 'Product 1', description: 'Description 1' },
        { name: 'Product 2', description: 'Description 2' },
        { name: 'Product 3', description: 'Description 3' },
        { name: 'Product 4', description: 'Description 4' },
        { name: 'Product 5', description: 'Description 5' },
    ];

    visibleCount = 3;
    currIndex = 0;

    popularFeedbackType = 'Praise';
    averageSentiment = 100;

    // placeholder data for user context (local storage for now)
    userPerms: string | null = null;
    isCompanyMember = false;
    isCompanyAdmin = false;
    user: any = null;
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
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
        // Prefer `company_id` from URL query params if present (e.g. /company?company_id=42)
        this.route.queryParams.subscribe(params => {
            const qid = params['company_id'];
            if (qid) {
                this.companyId = Number(qid);
                localStorage.setItem('companyId', String(this.companyId));
                this.isCompanyMember = false;
                this.updateVisibleCount();
                this.loadDashboard();
                return;
            }

            // No explicit company in URL — fall back to user context
            this.readUserContext();
            this.updateVisibleCount();
            this.loadDashboard();
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(_: UIEvent) {
        this.updateVisibleCount();
    }

    private updateVisibleCount(): void {
        const w = window.innerWidth;
        let vc = 3;
        if (w >= 1200) vc = 3;
        else if (w >= 600) vc = 2;
        else vc = 1;

        if (vc !== this.visibleCount) {
            this.visibleCount = vc;
            // ensure current index is valid for new visible count
            const maxStart = Math.max(0, this.products.length - this.visibleCount);
            if (this.currIndex > maxStart) this.currIndex = maxStart;
        }
    }

    private loadDashboard(): void {
        // get company dashboard data from backend
        this.http.get<any>('http://localhost:5000/company', {
            params: { company_id: this.companyId },
        }).subscribe({
            next: (res: any) => {
                console.log('Fetched company dashboard data', res);
                this.companyName = res.name || this.companyName;
                this.industry = (res.description && res.website)
                    ? `${res.description} | ${res.website}`
                    : (res.description || res.website || this.industry);
                // fetch announcements asynchronously (getAnnouncements sets `this.announcements`)
                this.getAnnouncements(this.companyId);
                console.log('Announcements:', this.announcements);
                this.updateProducts(this.companyId)
                this.updateCompanyMetrics(this.companyId);
            },
            error: (err: any) => {
                console.error('Failed to fetch company dashboard data', err);
            }
        });
    }

    private updateCompanyMetrics(companyId: number): void {
        this.http.get<any>('http://localhost:5000/feedback', {
            params: { company_id: companyId },
        }).subscribe({
            next: (res: any) => {
                console.log('Fetched feedback data for company metrics', res);
                const items = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
                const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

                for (const it of items) {
                    const id = Number(it?.feedback_type_id ?? it?.feedback_type ?? NaN);
                    if (!Number.isNaN(id) && (id === 1 || id === 2 || id === 3)) {
                        counts[id]++;
                    }
                }

                const maxCount = Math.max(counts[1], counts[2], counts[3]);
                if (maxCount === 0) {
                    // no feedback found — keep default
                    this.popularFeedbackType = 'Praise';
                } else {
                    const winner = [1, 2, 3].find(k => counts[k] === maxCount) || 1;
                    this.popularFeedbackType = winner === 1 ? 'Praise' : winner === 2 ? 'Bug' : 'Enhancement';
                }
            },
            error: (err: any) => {
                console.error('Failed to fetch feedback data for company metrics', err);
            }
        });
    }

    private updateProducts(companyId: number): void {
        this.http.get<any>('http://localhost:5000/companies/products', {
            params: { company_id: companyId },
        }).subscribe({
            next: (res: any) => {
                console.log('Fetched products for company', res);
                this.productCount = Array.isArray(res) ? res.length : 0;
                this.products = Array.isArray(res) ? res.map((p: any) => ({
                    name: p.name,
                    description: p.description,
                })) : [];
                // recalc visible count / clamp index now that products changed
                this.updateVisibleCount();
            },
            error: (err: any) => {
                console.error('Failed to fetch products for company', err);
            }
        });
    }

    private getAnnouncements(companyId: number): void {
        let url = `http://localhost:5000/company/announcements/${companyId}`;
        this.http.get<any[]>(url).subscribe({
            next: (res: any[]) => {
                console.log('Fetched announcements for company', res);
                this.announcements = Array.isArray(res) ? res.map((ann: any) => ({
                    id: ann.id,
                    title: ann.title,
                    body: ann.body,
                    published_at: ann.published_at,
                    publisher: ann.publisher,
                })) : [];
            },
            error: (err: any) => {
                console.error('Failed to fetch announcement data', err);
                this.announcements = [];
            }
        });
    }

    private readUserContext(): void {
        this.userPerms = localStorage.getItem('permissions');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.isCompanyAdmin = false;

        if (this.userPerms) {
            this.isCompanyAdmin = this.userPerms.includes('company_admin');
        }

        const userId = this.user?.id;
        if (!userId) {
            // fallback to permission string
            if (!this.userPerms) {
                this.isCompanyMember = false;
                return;
            }
            this.isCompanyMember = this.userPerms.includes('system_admin') || this.userPerms.includes('company_admin') || this.userPerms.includes('employee');
            return;
        }

        this.http.get<any>('http://localhost:5000/users/employee', {
            params: { user_id: userId },
        }).subscribe({
            next: (res: any) => {
                console.log('Fetched company for user', res);
                if (res && res.company_id) {
                    const prev = this.companyId;
                    this.companyId = res.company_id;
                    console.log('User company_id:', this.companyId);
                    this.isCompanyMember = true;
                    localStorage.setItem('companyId', String(this.companyId));
                    // refresh dashboard if company changed
                    if (this.companyId !== prev) {
                        this.loadDashboard();
                    }
                } else {
                    // check sysadmin role
                    this.isCompanyMember = (String(this.userPerms || this.user?.role || '').toLowerCase().includes('system_admin'));
                }
            },
            error: (err: any) => {
                console.error('Failed to fetch company for user', err);
                this.isCompanyMember = false;
            }
        });
    }

}
