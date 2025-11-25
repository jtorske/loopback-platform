import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Products } from './pages/products/products';
import { Companies } from './pages/companies/companies';
import { Account } from './pages/account/account';
import { CompanyDashboard } from './pages/company-dashboard/company-dashboard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'products', component: Products },
  { path: 'companies', component: Companies },
  { path: 'company-dashboard', component: CompanyDashboard },
  { path: 'account', component: Account },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
