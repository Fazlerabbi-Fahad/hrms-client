import { Routes } from '@angular/router';

export const SALARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/salary/salary.component').then(m => m.SalaryComponent)
  }
];
