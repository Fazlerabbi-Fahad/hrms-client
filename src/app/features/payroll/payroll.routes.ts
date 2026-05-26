import { Routes } from '@angular/router';

export const PAYROLL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/payroll-list/payroll-list.component')
        .then(m => m.PayrollListComponent),
  },
  {
    path: 'process',
    loadComponent: () =>
      import('./pages/payroll-form/payroll-form.component')
        .then(m => m.PayrollFormComponent),
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./pages/payroll-report/payroll-report.component')
        .then(m => m.PayrollReportComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/payroll-detail/payroll-detail.component')
        .then(m => m.PayrollDetailComponent),
  },
];
