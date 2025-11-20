import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Products } from './pages/products/products';
import { Companies } from './pages/companies/companies';
import { Account } from './pages/account/account';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'products', component: Products },
  { path: 'companies', component: Companies },
  { path: 'account', component: Account },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
