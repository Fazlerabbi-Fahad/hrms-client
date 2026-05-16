import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `
    <section class="card">
      <h2 class="page-header">Reports</h2>
      <p class="page-subheader">Report dashboards will be added here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {}
