import { Routes } from '@angular/router';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/department-list/department-list.component').then(m => m.DepartmentListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/department-form/department-form.component').then(m => m.DepartmentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/department-detail/department-detail.component').then(m => m.DepartmentDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/department-form/department-form.component').then(m => m.DepartmentFormComponent)
  }
];
