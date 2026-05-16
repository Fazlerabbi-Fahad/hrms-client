import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-employee-detail',
  template: `
    <section class="card">
      <h2 class="page-header">Employee Details</h2>
      <p class="page-subheader">Employee detail view will be shown here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailComponent {}
