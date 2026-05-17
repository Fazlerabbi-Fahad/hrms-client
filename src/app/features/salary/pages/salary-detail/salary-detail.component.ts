import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary.model';

@Component({
  selector: 'app-salary-detail',
  imports: [DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './salary-detail.component.html'
})
export class SalaryDetailComponent {
  private readonly salaryService = inject(SalaryService);

  readonly id = input.required<string>();

  protected readonly salary = signal<Salary | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadSalary();
  }

  private loadSalary(): void {
    this.isLoading.set(true);

    this.salaryService
      .getSalaryById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data?.items ?? [];
          const salary = Array.isArray(items) ? items[0] : items;
          this.salary.set(salary ?? null);
        },
        error: () => {
          this.errorMessage.set('Failed to load salary details.');
        }
      });
  }
}
