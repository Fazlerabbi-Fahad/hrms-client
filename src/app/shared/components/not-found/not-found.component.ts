import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">404</p>
      <h2 class="text-3xl font-semibold text-gray-900">Page not found</h2>
      <a class="btn-primary" routerLink="/dashboard">Go to dashboard</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
