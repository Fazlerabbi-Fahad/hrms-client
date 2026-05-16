import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  }
];
