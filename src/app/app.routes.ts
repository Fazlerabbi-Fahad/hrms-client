import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../app/features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('../app/features/employees/employees.routes')
            .then(m => m.EMPLOYEE_ROUTES)
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('../app/features/payroll/payroll.routes')
            .then(m => m.PAYROLL_ROUTES)
      },
      {
        path: 'salary',
        loadChildren: () =>
          import('../app/features/salary/salary.routes')
            .then(m => m.SALARY_ROUTES)
      },
      {
        path: 'department',
        loadChildren: () =>
          import('../app/features/department/department.routes')
            .then(m => m.DEPARTMENT_ROUTES)
      },
      {
        path: 'designation',
        loadChildren: () =>
          import('../app/features/designation/designation.routes')
            .then(m => m.DESIGNATION_ROUTES)
      },
      {
        path: 'role',
        loadChildren: () =>
          import('../app/features/role/role.routes')
            .then(m => m.ROLE_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../app/features/reports/reports.routes')
            .then(m => m.REPORT_ROUTES)
      },
    ]
  },
  {
    path: '',
    loadComponent: () =>
      import('../app/layouts/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../app/features/auth/pages/login/login.component')
            .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../app/features/auth/pages/register/register.component')
            .then(m => m.RegisterComponent)
      },
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('../app/shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
