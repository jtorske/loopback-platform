import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  showMyCompany = false;
  private storageHandler = (e: StorageEvent) => {
    if (e.key === 'user') this.refreshFromLocalStorage();
  };
  private userChangedHandler = () => this.refreshFromLocalStorage();

  ngOnInit(): void {
    this.refreshFromLocalStorage();
    window.addEventListener('storage', this.storageHandler as EventListener);
    window.addEventListener('user-changed', this.userChangedHandler as EventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageHandler as EventListener);
    window.removeEventListener('user-changed', this.userChangedHandler as EventListener);
  }

  refreshFromLocalStorage(): void {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        this.showMyCompany = false;
        return;
      }
      const user = JSON.parse(raw);
      // support multiple role name variants and roles array
      const allowed = ['employee', 'company_admin', 'system_admin', 'coadmin', 'sysadmin'];
      if (Array.isArray(user?.roles)) {
        const roles = user.roles.map((r: any) => String(r).toLowerCase());
        this.showMyCompany = roles.some((r: string) => allowed.includes(r));
      } else {
        const role = (user?.role || '').toString().toLowerCase();
        this.showMyCompany = allowed.includes(role);
      }
    } catch (e) {
      this.showMyCompany = false;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
