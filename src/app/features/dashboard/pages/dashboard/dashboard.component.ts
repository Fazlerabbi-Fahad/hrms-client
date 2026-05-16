import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <section class="card">
      <h2 class="page-header">Dashboard</h2>
      <p class="page-subheader">Overview metrics will live here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
