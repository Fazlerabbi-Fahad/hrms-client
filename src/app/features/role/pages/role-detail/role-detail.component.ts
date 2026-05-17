import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-detail',
  imports: [RouterLink],
  templateUrl: './role-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleDetailComponent {
  private readonly roleService = inject(RoleService);

  readonly id = input.required<string>();

  protected readonly role = signal<Role | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadRole();
  }

  private loadRole(): void {
    this.isLoading.set(true);

    this.roleService
      .getRoleById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data?.items ?? [];
          const role = Array.isArray(items) ? items[0] : items;
          this.role.set(role ?? null);
        },
        error: () => {
          this.errorMessage.set('Failed to load role details.');
        },
      });
  }
}
