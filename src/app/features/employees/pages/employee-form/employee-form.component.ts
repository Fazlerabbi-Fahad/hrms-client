import { DepartmentService } from './../../../department/services/department.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { EmployeeRequestModel } from '../../../../core/models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { DesignationService } from '../../../designation/services/designation.service';
import { ApiResponse, PaginatedData } from '../../../../core/models/api.model';


@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl:'./employee-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly designationService = inject(DesignationService);
  private readonly employmentStatusService = inject(EmploymentStatusService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly departmentOptions = signal<any[]>([]);
  protected readonly designationOptions = signal<any[]>([]);
  protected readonly employmentStatusOptions = signal<any[]>([]);

  readonly id = input<string>();
  protected readonly isEditMode = computed(() => !!this.id());

  protected readonly employeeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: [''],
    phoneNumber: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    joiningDate: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    designationId: ['', [Validators.required]],
    employmentStatusId: ['', [Validators.required]],
  });

  constructor() {
    this.loadDepartments();
    this.loadDesignations();
    this.loadEmploymentStatuses();

    if (this.id()) {
      this.loadEmployee();
    }
  }


  private loadEmployee(): void {
    this.employeeService.getEmployeeById(Number(this.id())).subscribe({
      next: (response) => {
        const e = response.data;
        this.employeeForm.patchValue({
          name: e.name,
          email: e.email,
          phoneNumber: e.phoneNumber,
          dateOfBirth: e.dateOfBirth?.split('T')[0],
          joiningDate: e.joiningDate?.split('T')[0],
          departmentId: String(e.departmentId),
          designationId: String(e.designationId),
          employmentStatusId: String(e.employmentStatusId),
        });
      },
      error: () => {
        this.errorMessage.set('Failed to load employee details.');
      }
    });
  }

  protected onSubmit(): void {
    this.errorMessage.set('');
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.errorMessage.set('Unable to identify current user. Please login again.');
      return;
    }

    const formValue = this.employeeForm.getRawValue();
    const payload: EmployeeRequestModel = {
      name: formValue.name,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      joiningDate: formValue.joiningDate,
      departmentId: Number(formValue.departmentId),
      designationId: Number(formValue.designationId),
      employmentStatusId: Number(formValue.employmentStatusId),
      userId,
    };

    this.isSubmitting.set(true);

    const request$ = this.isEditMode()
      ? this.employeeService.updateEmployee(Number(this.id()), payload)
      : this.employeeService.createEmployee(payload);

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/employees']);
        },
        error: () => {
          this.errorMessage.set(
            this.isEditMode()
              ? 'Failed to update employee.'
              : 'Failed to create employee.'
          );
        },
      });
  }

 private loadDepartments(): void {
  this.departmentService.getDepartments().subscribe({
    next: (response) => {
      this.departmentOptions.set(response.data.items);
    },
    error: () => {
      this.errorMessage.set('Failed to load departments.');
    },
  });
}

private loadDesignations(): void {
  this.designationService.getDesignations().subscribe({
    next: (response) => {
      this.designationOptions.set(response.data.items);
    },
    error: () => {
      this.errorMessage.set('Failed to load designations.');
    },
  });
}

private loadEmploymentStatuses(): void {
  this.employmentStatusService.getEmploymentStatuses().subscribe({
    next: (response) => {
      this.employmentStatusOptions.set(response.data.items);
    },
    error: () => {
      this.errorMessage.set('Failed to load employment statuses.');
    },
  });
}
}
