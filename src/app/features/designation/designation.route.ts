import { Routes } from '@angular/router';

export const DESIGNATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/designation-list/designation-list.component').then(m => m.DesignationListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/designation-form/designation-form.component').then(m => m.DesignationFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/designation-detail/designation-detail.component').then(m => m.DesignationDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/designation-form/designation-form.component').then(m => m.DesignationFormComponent)
  }
];
