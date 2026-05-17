import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ApiResponse, PaginatedData } from '../../../../core/models/api.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, DatePipe, PaginatorComponent],
  templateUrl: './employee-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly searchQuery = signal('');

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.employeeService
      .getEmployees()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: ApiResponse<PaginatedData<Employee>>) => {
          this.employees.set(data.data?.items ?? []);
          console.log('Employee data loaded:', data.data);
        },
        error: () => {
          this.errorMessage.set('Failed to load employee data. Please try again.');
        },
      });
  }

  protected deleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees.update((list: Employee[]) => list.filter(e => e.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete employee.');
      }
    });
  }

  protected readonly filteredEmployees = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.employees();
    return this.employees().filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.email.toLowerCase().includes(query) ||
      e.phoneNumber.toLowerCase().includes(query) ||
      e.departmentName.toLowerCase().includes(query)||
      e.designationName.toLowerCase().includes(query)||
      e.employmentStatusName.toLowerCase().includes(query)
    );
  });
}
