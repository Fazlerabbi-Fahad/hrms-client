import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/employee-form/employee-form.component')
        .then(m => m.EmployeeFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/employee-form/employee-form.component')
        .then(m => m.EmployeeFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/employee-detail/employee-detail.component')
        .then(m => m.EmployeeDetailComponent),
  },

];
