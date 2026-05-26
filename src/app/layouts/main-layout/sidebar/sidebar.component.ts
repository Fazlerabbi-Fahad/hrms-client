import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { MenuService } from '../../../shared/services/menu.service';
import { Menu } from '../../../shared/model/menu.model';
import { finalize } from 'rxjs';
import { ApiResponse, PaginatedData } from '../../../core/models/api.model';

type NavItem = {
  label: string;
  icon: string;
  route: string;
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);

  readonly showCloseButton = input(false);
  readonly closeRequested = output<void>();

  // Define this inside sidebar component
 protected readonly navItems = signal<Menu[]>([]);

  constructor() {
    this.loadMenu();
  }

  protected logout(): void {
    this.closeRequested.emit();
    this.authService.logout();
  }

  protected onNavClick(): void {
    if (this.showCloseButton()) {
      this.closeRequested.emit();
    }
  }

private loadMenu(): void {
  this.menuService.getMenus().subscribe({
    next: (response: ApiResponse<Menu[]>) => {
      this.navItems.set(response.data ?? []);
    },
    error: (err) => {
      console.error('Failed to load menu:', err);
      this.navItems.set([]);
    },
  });
}
}
