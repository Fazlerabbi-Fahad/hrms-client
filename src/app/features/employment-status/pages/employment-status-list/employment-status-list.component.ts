import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmploymentStatusService } from '../../services/employment-status.service';
import { EmploymentStatus } from '../../model/employment-status.model';

@Component({
  selector: 'app-employment-status-list',
  imports: [RouterLink],
  templateUrl: './employment-status-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploymentStatusListComponent {
  private readonly employmentStatusService = inject(EmploymentStatusService);

  protected readonly employmentStatuses = signal<EmploymentStatus[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  constructor() {
    this.loadEmploymentStatuses();
  }

  private loadEmploymentStatuses(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.employmentStatusService
      .getEmploymentStatuses()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.employmentStatuses.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load employment statuses. Please try again.');
        },
      });
  }

  protected deleteEmploymentStatus(id: number): void {
    if (!confirm('Are you sure you want to delete this employment status?')) return;

    this.employmentStatusService.deleteEmploymentStatus({ id }).subscribe({
      next: () => {
        this.employmentStatuses.update((list) => list.filter((e) => e.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete employment status.');
      },
    });
  }

  protected readonly filteredEmploymentStatuses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.employmentStatuses();
    return this.employmentStatuses().filter((e) =>
      e.statusName.toLowerCase().includes(query)
    );
  });
}
