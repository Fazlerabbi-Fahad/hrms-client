import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ApiResponse } from '../../../../core/models/api.model';

@Component({
  selector: 'app-employee-detail',
  imports: [DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent {
  private readonly employeeService = inject(EmployeeService);

  readonly id = input.required<string>();

  protected readonly employee = signal<Employee | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadEmployee();
  }

  private loadEmployee(): void {
    this.isLoading.set(true);

    this.employeeService
      .getEmployeeById(Number(this.id()))
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: ApiResponse<Employee>) => {
          this.employee.set(response.data);
        },
        error: () => {
          this.errorMessage.set('Failed to load employee details.');
        }
      });
  }
}
