import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {}
