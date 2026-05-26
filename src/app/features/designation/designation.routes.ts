import { Routes } from '@angular/router';

export const DESIGNATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/designation-list/designation-list.component').then(m => m.DesignationListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/designation-form/designation-form.component').then(m => m.DesignationFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/designation-form/designation-form.component').then(m => m.DesignationFormComponent)
  }
];
