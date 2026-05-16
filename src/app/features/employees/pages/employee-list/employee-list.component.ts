import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ApiResponse, PaginatedData } from '../../../../core/models/api.model';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './employee-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

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
        next: (data: ApiResponse<PaginatedData<Employee[]>>) => {
          this.employees.set(data.data?.items ?? []);
          console.log('Employee data loaded:', data.data);
        },
        error: () => {
          this.errorMessage.set('Failed to load employee data. Please try again.');
        },
      });
  }
}
