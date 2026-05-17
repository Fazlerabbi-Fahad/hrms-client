import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmploymentStatusService } from '../../services/employment-status.service';
import { EmploymentStatus } from '../../model/employment-status.model';

@Component({
  selector: 'app-employment-status-detail',
  imports: [RouterLink],
  templateUrl: './employment-status-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploymentStatusDetailComponent {
  private readonly employmentStatusService = inject(EmploymentStatusService);

  readonly id = input.required<string>();

  protected readonly employmentStatus = signal<EmploymentStatus | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadEmploymentStatus();
  }

  private loadEmploymentStatus(): void {
    this.isLoading.set(true);

    this.employmentStatusService
      .getEmploymentStatusById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data?.items ?? [];
          const status = Array.isArray(items) ? items[0] : items;
          this.employmentStatus.set(status ?? null);
        },
        error: () => {
          this.errorMessage.set('Failed to load employment status details.');
        },
      });
  }
}
