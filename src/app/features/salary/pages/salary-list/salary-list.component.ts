import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary.model';

@Component({
  selector: 'app-salary-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './salary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryListComponent {
  private readonly salaryService = inject(SalaryService);

  protected readonly salaries = signal<Salary[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  constructor() {
    this.loadSalaries();
  }

  private loadSalaries(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.salaryService
      .getSalaries()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.salaries.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load salaries. Please try again.');
        },
      });
  }

  protected deleteSalary(id: number): void {
    if (!confirm('Are you sure you want to delete this salary record?')) return;

    this.salaryService.deleteSalary({ id }).subscribe({
      next: () => {
        this.salaries.update((list) => list.filter((s) => s.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete salary record.');
      },
    });
  }

  protected readonly filteredSalaries = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.salaries();
    return this.salaries().filter((s) =>
      s.employeeName.toLowerCase().includes(query)
    );
  });
}
