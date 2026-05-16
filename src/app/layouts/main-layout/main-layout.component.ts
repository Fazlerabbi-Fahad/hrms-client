import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TopbarComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
      <app-topbar (menuToggle)="toggleSidebar()"></app-topbar>

      <div class="flex">
        <div class="hidden h-[calc(100vh-69px)] w-64 shrink-0 md:block lg:w-60">
          <app-sidebar></app-sidebar>
        </div>

        @if (isSidebarOpen()) {
          <button
            type="button"
            class="fixed inset-0 z-30 bg-black/40 md:hidden"
            (click)="closeSidebar()"
            aria-label="Close sidebar"
          ></button>

          <div class="fixed inset-y-0 left-0 z-40 w-72 md:hidden">
            <app-sidebar [showCloseButton]="true" (closeRequested)="closeSidebar()"></app-sidebar>
          </div>
        }

        <main class="min-h-[calc(100vh-69px)] flex-1 p-4 sm:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  protected readonly isSidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
