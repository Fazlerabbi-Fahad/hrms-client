import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary.model';
import { PaginatedData } from '../../../../core/models/api.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-salary-list',
  imports: [RouterLink, DatePipe, PaginatorComponent],
  templateUrl: './salary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalaryListComponent {
  private readonly salaryService = inject(SalaryService);

  protected readonly salaries = signal<Salary[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly totalCount = signal(0);
  private readonly router = inject(Router);
  constructor() {
    this.loadSalaries();
  }

  private loadSalaries(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    let params = {
      pageNumber: this.currentPage(),
      pageSize: 10,
    };

    this.salaryService
      .getSalaries(params)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Salary data loaded:', response);
          this.salaries.set(response.data?.items ?? []);
        },
        error: () => {
          this.errorMessage.set('Failed to load salaries. Please try again.');
        },
      });
  }

  protected deleteSalary(id: number): void {
    if (!confirm('Are you sure you want to delete this salary record?')) return;

    this.salaryService.deleteSalary(id).subscribe({
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
      s.employeeName.toLowerCase().includes(query),
    );
  });

  createSalary(): void {
    void this.router.navigate(['/salary/create']);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadSalaries();
  }
}
