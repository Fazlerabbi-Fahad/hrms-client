import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-salary',
  template: `
    <section class="card">
      <h2 class="page-header">Salary</h2>
      <p class="page-subheader">Salary configuration will live here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryComponent {}
