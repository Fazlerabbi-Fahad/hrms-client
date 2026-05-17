import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-list',
  imports: [RouterLink],
  templateUrl: './role-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {
  private readonly roleService = inject(RoleService);

  protected readonly roles = signal<Role[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  constructor() {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.roleService
      .getRoles()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.roles.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load roles. Please try again.');
        },
      });
  }

  protected deleteRole(id: number): void {
    if (!confirm('Are you sure you want to delete this role?')) return;

    this.roleService.deleteRole({ id }).subscribe({
      next: () => {
        this.roles.update((list) => list.filter((r) => r.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete role.');
      },
    });
  }

  protected readonly filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.roles();
    return this.roles().filter((r) =>
      r.roleName.toLowerCase().includes(query)
    );
  });
}
