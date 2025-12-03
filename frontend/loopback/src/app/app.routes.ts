import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Products } from './pages/products/products';
import { Companies } from './pages/companies/companies';
import { Account } from './pages/account/account';
import { CompanyDashboard } from './pages/company-dashboard/company-dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProductFeedback } from './pages/product-feedback/product-feedback';
import { CreateAnnouncement } from './pages/create-announcement/create-announcement';
import { AddProduct } from './pages/add-product/add-product';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'products', component: Products },
  { path: 'companies', component: Companies },
  { path: 'company-dashboard', component: CompanyDashboard },
  { path: 'company', component: CompanyDashboard },
  { path: 'account', component: Account },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'feedback/:id', component: ProductFeedback },
  { path: 'create-announcement', component: CreateAnnouncement },
  { path: 'add-product', component: AddProduct },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
