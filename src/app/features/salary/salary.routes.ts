import { Routes } from '@angular/router';

export const SALARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/salary-list/salary-list.component').then(m => m.SalaryListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/salary-form/salary-form.component').then(m => m.SalaryFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/salary-detail/salary-detail.component').then(m => m.SalaryDetailComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/salary-form/salary-form.component').then(m => m.SalaryFormComponent)
  }
];
