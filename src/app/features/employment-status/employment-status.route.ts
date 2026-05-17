import { Routes } from '@angular/router';

export const EMPLOYMENT_STATUS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/employment-status-list/employment-status-list.component').then(m => m.EmploymentStatusListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/employment-status-form/employment-status-form.component').then(m => m.EmploymentStatusFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/employment-status-detail/employment-status-detail.component').then(m => m.EmploymentStatusDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/employment-status-form/employment-status-form.component').then(m => m.EmploymentStatusFormComponent)
  }
];
