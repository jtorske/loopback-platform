import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Products } from './pages/products/products';
import { Companies } from './pages/companies/companies';
import { Account } from './pages/account/account';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'products', component: Products },
  { path: 'companies', component: Companies },
  { path: 'account', component: Account },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
