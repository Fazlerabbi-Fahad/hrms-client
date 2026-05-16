import { Routes } from '@angular/router';

export const PAYROLL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/payroll/payroll.component').then(m => m.PayrollComponent)
  }
];
