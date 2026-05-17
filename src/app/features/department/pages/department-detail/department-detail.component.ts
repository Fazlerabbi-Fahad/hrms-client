import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-department-detail',
  imports: [RouterLink],
  templateUrl: './department-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentDetailComponent {
  private readonly departmentService = inject(DepartmentService);

  readonly id = input.required<string>();

  protected readonly department = signal<Department | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadDepartment();
  }

  private loadDepartment(): void {
    this.isLoading.set(true);

    this.departmentService
      .getDepartmentById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data?.items ?? [];
          const department = Array.isArray(items) ? items[0] : items;
          this.department.set(department ?? null);
        },
        error: () => {
          this.errorMessage.set('Failed to load department details.');
        },
      });
  }
}
