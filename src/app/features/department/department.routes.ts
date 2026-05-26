import { Routes } from '@angular/router';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/department-list/department-list.component').then(m => m.DepartmentListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/department-form/department-form.component').then(m => m.DepartmentFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/department-form/department-form.component').then(m => m.DepartmentFormComponent)
  }
];
