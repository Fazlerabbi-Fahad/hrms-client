import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <section class="card">
      <h2 class="page-header">Settings</h2>
      <p class="page-subheader">Application settings will appear here.</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}
