import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DepartmentService } from '../../services/department.service';
import {
  Department,
  DepartmentApiResponse,
} from '../../models/department.model';
import { ApiResponse, PaginatedData } from '../../../../core/models/api.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-department-list',
  imports: [RouterLink,PaginatorComponent],
  templateUrl: './department-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentListComponent {
  private readonly departmentService = inject(DepartmentService);

  protected readonly departments = signal<Department[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly searchQuery = signal('');

  private readonly router = inject(Router);

  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(0);
  protected readonly totalCount = signal(0);

  constructor() {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    let params = {
      pageNumber: this.currentPage(),
      pageSize: 10,
    };
    this.departmentService
      .getDepartments(params)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: ApiResponse<PaginatedData<Department>>) => {
          this.departments.set(response.data?.items ?? []);
          this.totalPages.set(response.data?.totalPages ?? 0);
          this.totalCount.set(response.data?.totalCount ?? 0);
          this.currentPage.set(response.data?.pageNumber ?? 1);
        },
        error: () => {
          this.errorMessage.set(
            'Failed to load departments. Please try again.',
          );
        },
      });
  }

  protected deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.loadDepartments();
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
      d.departmentName.toLowerCase().includes(query),
    );
  });

  createDepartment(): void {
    void this.router.navigate(['/department/create']);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadDepartments();
  }
}
