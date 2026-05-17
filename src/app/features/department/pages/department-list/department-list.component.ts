import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-list',
  imports: [RouterLink],
  templateUrl: './department-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentListComponent {
  private readonly departmentService = inject(DepartmentService);

  protected readonly departments = signal<Department[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  constructor() {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.departmentService
      .getDepartments()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.departments.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load departments. Please try again.');
        },
      });
  }

  protected deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) return;

    this.departmentService.deleteDepartment({ id }).subscribe({
      next: () => {
        this.departments.update((list) => list.filter((d) => d.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete department.');
      },
    });
  }

  protected readonly filteredDepartments = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.departments();
    return this.departments().filter((d) =>
      d.departmentName.toLowerCase().includes(query)
    );
  });
}
