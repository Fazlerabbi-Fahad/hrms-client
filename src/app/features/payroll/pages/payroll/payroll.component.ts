import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payroll',
  template: `
    <section class="card">
      <h2 class="page-header">Payroll</h2>
      <p class="page-subheader">Payroll tools will be added here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollComponent {}
